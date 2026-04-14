<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import useStageGame from '@/use/useStageGame'
import useSpinnerConfig from '@/use/useSpinnerConfig'
import { MACHINE_REGISTRY } from '@/game/machines'
import { modelImgPath, getSelectedSkin } from '@/use/useModels'
import stage1 from '@/game/stages/stage1'
import FReward from '@/components/atoms/FReward.vue'
import FModal from '@/components/molecules/FModal.vue'
import StarGem from '@/components/atoms/StarGem.vue'
import CoinBadge from '@/components/organisms/CoinBadge.vue'
import IconCoin from '@/components/icons/IconCoin.vue'
import SkinShopModal from '@/components/organisms/SkinShopModal.vue'
import OptionsModal from '@/components/organisms/OptionsModal.vue'
import AchievementsModal from '@/components/organisms/AchievementsModal.vue'
import useAchievements from '@/use/useAchievements'
import { spawnCoinExplosion } from '@/use/useCoinExplosion'
import useMeteorShower from '@/use/useMeteorShower'
import { useHint } from '@/use/useHint'
import FIconButton from '@/components/atoms/FIconButton.vue'
import FMuteButton from '@/components/atoms/FMuteButton.vue'
import StageBadge from '@/components/StageBadge.vue'
import { prependBaseUrl } from '@/utils/function'
import { STAGES } from '@/game/stages'
import { useMusic } from '@/use/useSound'
import useCheats, { cheatStageRewardSignal } from '@/use/useCheats'
import useStageLeaderboard from '@/use/useStageLeaderboard'

const { initMusic, startBattleMusic, stopBattleMusic } = useMusic()
initMusic()

useCheats()

const {
  recordHighscore: recordLbHighscore,
  fetchDailyIfDue: fetchLbDaily,
  flushIfDirty: flushLb,
  installUnloadFlush: installLbUnload,
  topForStage: lbTopForStage,
  myRankForStage: lbMyRankForStage,
  playerId: myPlayerId
} = useStageLeaderboard()
installLbUnload()
void fetchLbDaily().then(() => refreshLbRows())

const lbRows = ref<{
  top: { rank: number; id: string; name: string; score: number; isMe: boolean }[];
  mine: { rank: number; id: string; name: string; score: number; isMe: boolean } | null
}>({ top: [], mine: null })
const isNewHighscore = ref(false)

function refreshLbRows() {
  lbRows.value = lbTopForStage(currentStage.value.id)
}

watch(() => cheatStageRewardSignal.value.nonce, (n) => {
  if (n === 0) return
  const forced = cheatStageRewardSignal.value.stars
  stars.value = forced
  score.value = [0, 1200, 5600, 12400][forced] ?? 0
  lastCoinsAwarded.value = [0, 50, 100, 200][forced] ?? 0
  isNewHighscore.value = recordLbHighscore(currentStage.value.id, score.value)
  refreshLbRows()
  showReward.value = true
})

const {
  currentStage, phase, score, launches, stars, countdownValue,
  spinner, bossKilled, loadStage, beginStage, launch, startLoop, stopLoop,
  getBestStars, bestStars, lastCoinsAwarded
} = useStageGame()
const { coins } = useSpinnerConfig()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const coinBadgeRef = ref<{ rootEl: HTMLElement | null } | null>(null)
const rewardCoinRef = ref<HTMLElement | null>(null)
const showReward = ref(false)
const showSkinShop = ref(false)
const showStagePicker = ref(false)
const showOptions = ref(false)
const showAchievements = ref(false)

const {
  recordStageFinish: recordAchievementsFinish,
  unseenCount: achUnseenCount,
  markAllSeen: markAchievementsSeen
} = useAchievements()

function openAchievements() {
  showAchievements.value = true
  markAchievementsSeen()
}

function pickStage(s: typeof STAGES[number]) {
  loadStage(s)
  fitInitialCamera()
  showStagePicker.value = false
}

const meteor = useMeteorShower()
const { showHint, startHintTimer, clearHint } = useHint(2500)

const MAX_PULL = 220

// Camera
const cam = ref({ x: 0, y: 0, zoom: 1 })

// Pointer state
type PtrMode = 'none' | 'pan' | 'aim'
const ptr = ref<{
  mode: PtrMode;
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  camStartX: number;
  camStartY: number
}>({
  mode: 'none', startX: 0, startY: 0, curX: 0, curY: 0, camStartX: 0, camStartY: 0
})

// Spinner image cache
const spinnerImg = new Image()
spinnerImg.src = modelImgPath(getSelectedSkin('star'))

// ─── Init ──────────────────────────────────────────────────────────────

function fitInitialCamera() {
  const c = canvasEl.value
  if (!c) return
  const w = c.clientWidth
  const h = c.clientHeight
  const stage = currentStage.value
  const zx = w / stage.width
  const zy = h / stage.height
  cam.value.zoom = Math.max(0.4, Math.min(1.5, Math.min(zx, zy) * 1.4))
  // Center on spawn
  cam.value.x = spinner.value.x - w / 2 / cam.value.zoom
  cam.value.y = spinner.value.y - h / 2 / cam.value.zoom
}

function resizeCanvas() {
  const c = canvasEl.value
  if (!c) return
  const dpr = window.devicePixelRatio || 1
  const rect = c.getBoundingClientRect()
  c.width = Math.floor(rect.width * dpr)
  c.height = Math.floor(rect.height * dpr)
}

// ─── Aim indicator (chaos-arena style) ────────────────────────────────

function renderDragIndicator(ctx: CanvasRenderingContext2D) {
  const sp = spinner.value
  const wp = screenToWorld(ptr.value.curX, ptr.value.curY)
  const pullDx = wp.x - sp.x
  const pullDy = wp.y - sp.y
  const pullMag = Math.hypot(pullDx, pullDy)
  const inCancelZone = pullMag < sp.r

  ctx.save()
  // Cancel zone circle
  const cancelAlpha = inCancelZone ? 0.6 : 0.2
  ctx.strokeStyle = `rgba(255, 80, 80, ${cancelAlpha})`
  ctx.lineWidth = inCancelZone ? 2.5 : 1.5
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  if (inCancelZone) {
    const s = sp.r * 0.35
    ctx.strokeStyle = 'rgba(255, 80, 80, 0.8)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(sp.x - s, sp.y - s)
    ctx.lineTo(sp.x + s, sp.y + s)
    ctx.moveTo(sp.x + s, sp.y - s)
    ctx.lineTo(sp.x - s, sp.y + s)
    ctx.stroke()
  }
  ctx.restore()

  if (pullMag < 3) return

  const ratio = Math.min(1, pullMag / MAX_PULL)

  ctx.save()
  // Pull line (dashed) — blade center to pointer
  ctx.strokeStyle = 'rgba(255,170,0,0.5)'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.lineTo(wp.x, wp.y)
  ctx.stroke()
  ctx.setLineDash([])

  // Launch arrow (opposite of pull)
  const nx = -pullDx / pullMag
  const ny = -pullDy / pullMag
  const arrowLen = 30 + 50 * ratio
  const endX = sp.x + nx * arrowLen
  const endY = sp.y + ny * arrowLen

  const r = Math.floor(255 * ratio)
  const g = Math.floor(255 * (1 - ratio * 0.6))
  ctx.strokeStyle = `rgb(${r}, ${g}, 0)`
  ctx.fillStyle = `rgb(${r}, ${g}, 0)`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  const headSize = 8
  const angle = Math.atan2(ny, nx)
  const tipX = endX + nx * headSize
  const tipY = endY + ny * headSize
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - Math.cos(angle - 0.4) * headSize, tipY - Math.sin(angle - 0.4) * headSize)
  ctx.lineTo(tipX - Math.cos(angle + 0.4) * headSize, tipY - Math.sin(angle + 0.4) * headSize)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

function renderHintAnimation(ctx: CanvasRenderingContext2D) {
  const sp = spinner.value
  const cycleDuration = 2000
  const t = (Date.now() % cycleDuration) / cycleDuration

  const pullDir = Math.PI * 0.75 // down-left
  const maxPull = 60
  let pullDist: number
  let alpha: number
  let showArrow = true

  if (t < 0.5) {
    pullDist = (t / 0.5) * maxPull
    alpha = 0.5
  } else if (t < 0.8) {
    pullDist = maxPull
    alpha = 0.5 + 0.2 * Math.sin((t - 0.5) / 0.3 * Math.PI)
  } else {
    pullDist = maxPull * (1 - (t - 0.8) / 0.2)
    alpha = 0.5 * (1 - (t - 0.8) / 0.2)
    if (alpha < 0.05) showArrow = false
  }
  if (!showArrow) return

  const pullX = sp.x + Math.cos(pullDir) * pullDist
  const pullY = sp.y + Math.sin(pullDir) * pullDist
  const launchNx = -Math.cos(pullDir)
  const launchNy = -Math.sin(pullDir)
  const ratio = pullDist / maxPull
  const arrowLen = 30 + 50 * ratio

  ctx.save()
  ctx.globalAlpha = alpha

  ctx.strokeStyle = 'rgba(255,170,0,0.7)'
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.lineTo(pullX, pullY)
  ctx.stroke()
  ctx.setLineDash([])

  // Phantom finger circle at pull point
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.beginPath()
  ctx.arc(pullX, pullY, 8, 0, Math.PI * 2)
  ctx.fill()

  // Launch arrow
  const endX = sp.x + launchNx * arrowLen
  const endY = sp.y + launchNy * arrowLen
  const r = Math.floor(255 * ratio)
  const g = Math.floor(255 * (1 - ratio * 0.6))
  ctx.strokeStyle = `rgb(${r}, ${g}, 0)`
  ctx.fillStyle = `rgb(${r}, ${g}, 0)`
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(sp.x, sp.y)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  const headSize = 8
  const angle = Math.atan2(launchNy, launchNx)
  const tipX = endX + launchNx * headSize
  const tipY = endY + launchNy * headSize
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - Math.cos(angle - 0.4) * headSize, tipY - Math.sin(angle - 0.4) * headSize)
  ctx.lineTo(tipX - Math.cos(angle + 0.4) * headSize, tipY - Math.sin(angle + 0.4) * headSize)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

// ─── Rendering ─────────────────────────────────────────────────────────

function render(now: number) {
  const c = canvasEl.value
  if (!c) return
  const ctx = c.getContext('2d')!
  const dpr = window.devicePixelRatio || 1
  ctx.save()
  ctx.scale(dpr, dpr)
  const w = c.clientWidth
  const h = c.clientHeight
  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#0b1220')
  grad.addColorStop(1, '#1e293b')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  ctx.translate(-cam.value.x * cam.value.zoom, -cam.value.y * cam.value.zoom)
  ctx.scale(cam.value.zoom, cam.value.zoom)

  // Stage border
  const stage = currentStage.value
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 4
  ctx.strokeRect(0, 0, stage.width, stage.height)

  // Grid
  ctx.strokeStyle = 'rgba(148,163,184,0.08)'
  ctx.lineWidth = 1
  for (let x = 0; x < stage.width; x += 80) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, stage.height)
    ctx.stroke()
  }
  for (let y = 0; y < stage.height; y += 80) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(stage.width, y)
    ctx.stroke()
  }

  // Machines
  for (const m of stage.machines) {
    if (m.destroyed) continue
    const mod = MACHINE_REGISTRY[m.type]
    if (mod) mod.render(ctx, m, now)
  }

  // Spinner
  const sp = spinner.value
  ctx.save()
  ctx.translate(sp.x, sp.y)
  ctx.rotate(sp.rotation)
  if (spinnerImg.complete && spinnerImg.naturalWidth > 0) {
    ctx.drawImage(spinnerImg, -sp.r, -sp.r, sp.r * 2, sp.r * 2)
  } else {
    ctx.fillStyle = '#e2e8f0'
    ctx.beginPath()
    ctx.arc(0, 0, sp.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 3
    ctx.stroke()
  }
  ctx.restore()

  // Aim indicator (chaos-arena style): dashed pull line to pointer +
  // launch arrow opposite, color-coded by spring compression.
  if (phase.value === 'aiming' && ptr.value.mode === 'aim') {
    renderDragIndicator(ctx)
  }

  // Idle hint: loops pull-hold-release after 2.5s of inactivity in aim mode.
  if (phase.value === 'aiming' && ptr.value.mode !== 'aim' && showHint.value) {
    renderHintAnimation(ctx)
  }

  // End world transform.
  ctx.restore()

  // Meteor shower — drawn in screen space, anchored to the spinner's screen
  // position, with the original chaos-arena tuning (no scaling), so it
  // frames the blade exactly like the arena's intro.
  if (meteor.isActive()) {
    meteor.update()
    const sx = (spinner.value.x - cam.value.x) * cam.value.zoom
    const sy = (spinner.value.y - cam.value.y) * cam.value.zoom
    ctx.save()
    ctx.translate(sx, sy)
    meteor.render(ctx)
    ctx.restore()
  }

  ctx.restore()
}

// ─── Coordinates ───────────────────────────────────────────────────────

function screenToWorld(sx: number, sy: number) {
  const c = canvasEl.value!
  const rect = c.getBoundingClientRect()
  const lx = sx - rect.left
  const ly = sy - rect.top
  return {
    x: cam.value.x + lx / cam.value.zoom,
    y: cam.value.y + ly / cam.value.zoom
  }
}

// ─── Input ─────────────────────────────────────────────────────────────

function onPointerDown(e: PointerEvent) {
  const c = canvasEl.value
  if (!c) return
  clearHint()
  c.setPointerCapture(e.pointerId)
  const wp = screenToWorld(e.clientX, e.clientY)
  const sp = spinner.value
  const dx = wp.x - sp.x
  const dy = wp.y - sp.y
  const dist = Math.hypot(dx, dy)
  if (phase.value === 'aiming' && dist < 120) {
    ptr.value = {
      mode: 'aim',
      startX: e.clientX, startY: e.clientY,
      curX: e.clientX, curY: e.clientY,
      camStartX: 0, camStartY: 0
    }
  } else {
    ptr.value = {
      mode: 'pan',
      startX: e.clientX, startY: e.clientY,
      curX: e.clientX, curY: e.clientY,
      camStartX: cam.value.x, camStartY: cam.value.y
    }
  }
}

function onPointerMove(e: PointerEvent) {
  if (ptr.value.mode === 'none') return
  ptr.value.curX = e.clientX
  ptr.value.curY = e.clientY
  if (ptr.value.mode === 'pan') {
    const dx = (e.clientX - ptr.value.startX) / cam.value.zoom
    const dy = (e.clientY - ptr.value.startY) / cam.value.zoom
    cam.value.x = ptr.value.camStartX - dx
    cam.value.y = ptr.value.camStartY - dy
  }
}

function onPointerUp(_e: PointerEvent) {
  if (ptr.value.mode === 'aim') {
    const wp = screenToWorld(ptr.value.curX, ptr.value.curY)
    const sp = spinner.value
    const dx = sp.x - wp.x
    const dy = sp.y - wp.y
    const len = Math.hypot(dx, dy)
    launch(dx, dy, len)
  }
  ptr.value.mode = 'none'
  if (phase.value === 'aiming') startHintTimer()
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.1 : 0.9
  const before = screenToWorld(e.clientX, e.clientY)
  cam.value.zoom = Math.max(0.3, Math.min(2.5, cam.value.zoom * factor))
  const after = screenToWorld(e.clientX, e.clientY)
  cam.value.x += before.x - after.x
  cam.value.y += before.y - after.y
}

// ─── Camera follow ─────────────────────────────────────────────────────

function updateCameraFollow() {
  const c = canvasEl.value
  if (!c) return
  if (ptr.value.mode === 'pan') return // respect active manual pan
  const w = c.clientWidth
  const h = c.clientHeight
  const sp = spinner.value
  // Target places the spinner in the view center, in world coords.
  const targetX = sp.x - w / 2 / cam.value.zoom
  const targetY = sp.y - h / 2 / cam.value.zoom
  // Smooth follow while the blade is in motion; gentle recenter otherwise.
  const lerp = phase.value === 'launched' ? 0.09 : 0.04
  // Dead-zone: only pull hard when the spinner strays beyond this margin.
  const marginX = (w / cam.value.zoom) * 0.3
  const marginY = (h / cam.value.zoom) * 0.3
  const centerX = cam.value.x + w / 2 / cam.value.zoom
  const centerY = cam.value.y + h / 2 / cam.value.zoom
  const dx = sp.x - centerX
  const dy = sp.y - centerY
  const outside = Math.abs(dx) > marginX || Math.abs(dy) > marginY
  const k = phase.value === 'launched' ? lerp : outside ? 0.1 : 0
  if (k > 0) {
    cam.value.x += (targetX - cam.value.x) * k
    cam.value.y += (targetY - cam.value.y) * k
  }
}

// ─── Render loop ───────────────────────────────────────────────────────

let raf: number | null = null

function frame(ts: number) {
  updateCameraFollow()
  render(ts)
  raf = requestAnimationFrame(frame)
}

// ─── Lifecycle ─────────────────────────────────────────────────────────

function onTapToStart() {
  // Same parameters as chaos-arena's warm burst — the effect is rendered
  // in screen space below, so it matches the arena framing exactly.
  meteor.spawn(80, 50, 65)
  beginStage()
}

watch(phase, (p) => {
  if (p === 'aiming') startHintTimer()
  else clearHint()
  if (p === 'countdown' || p === 'aiming' || p === 'launched') {
    startBattleMusic()
  }
  if (p === 'complete' || p === 'tap_to_start') {
    stopBattleMusic()
  }
  if (p === 'complete') {
    // Leaderboard: record the score for this stage (only applied if higher)
    // and refresh the top-5 rows shown on the reward screen.
    isNewHighscore.value = recordLbHighscore(currentStage.value.id, score.value)
    refreshLbRows()
    // Achievements — pass bestStars so range-based checks have full state.
    recordAchievementsFinish({
      stageId: currentStage.value.id,
      finalScore: score.value,
      stars: stars.value,
      launches: launches.value,
      bossKilled: bossKilled.value,
      bestStars: bestStars.value
    })
    showReward.value = true
    nextTick(() => {
      if (rewardCoinRef.value && coinBadgeRef.value?.rootEl) {
        spawnCoinExplosion({
          sourceEl: rewardCoinRef.value,
          targetEl: coinBadgeRef.value.rootEl
        })
      }
    })
  }
})

function onContinue() {
  showReward.value = false
  loadStage(stage1)
  fitInitialCamera()
}

function onReplay() {
  showReward.value = false
  loadStage(currentStage.value)
  fitInitialCamera()
}

function onNextStage() {
  showReward.value = false
  const idx = STAGES.findIndex((s) => s.id === currentStage.value.id)
  const next = STAGES[idx + 1] ?? STAGES[0]!
  loadStage(next)
  fitInitialCamera()
}

function onOpenStagePicker() {
  showReward.value = false
  showStagePicker.value = true
}

onMounted(() => {
  loadStage(stage1)
  spinnerImg.src = modelImgPath(getSelectedSkin('star'))
  resizeCanvas()
  fitInitialCamera()
  startLoop()
  raf = requestAnimationFrame(frame)
  window.addEventListener('resize', () => {
    resizeCanvas()
    fitInitialCamera()
  })
})
onUnmounted(() => {
  stopLoop()
  if (raf !== null) cancelAnimationFrame(raf)
  stopBattleMusic()
})

const rewardCoins = computed(() => lastCoinsAwarded.value)

const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || (navigator.maxTouchPoints ?? 0) > 0)

const launchesTierClass = computed(() => {
  const n = launches.value
  if (n <= 4) return 'score-badge--tier-good'
  if (n <= 10) return 'score-badge--tier-mid'
  return 'score-badge--tier-bad'
})
</script>

<template lang="pug">
  div.relative.w-full.h-full.overflow-hidden(
    style="background:#0b1220"
  )
    canvas.absolute.inset-0.w-full.h-full.touch-none(
      ref="canvasEl"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel.passive.prevent="onWheel"
    )

    //- Top-left corner: stage badge
    div.absolute.z-20(
      class="top-2 left-2"
      :style="{ top: 'calc(0.5rem + env(safe-area-inset-top, 0px))', left: 'calc(0.5rem + env(safe-area-inset-left, 0px))' }"
    )
      StageBadge(
        :stage-id="currentStage.id"
        :name="currentStage.name"
      )

    //- Top-center: camera control hint (click-drag / scroll)
    div.camera-hint.absolute.z-20.pointer-events-none.flex.flex-col.items-center(
      class="gap-0.5 left-1/2 -translate-x-1/2"
      :style="{ top: 'calc(0.5rem + env(safe-area-inset-top, 0px))' }"
    )
      span.game-text(class="text-[10px] sm:text-xs")
        | {{ isTouchDevice ? 'Tap and drag to move the screen' : 'Click and drag to move the screen' }}
      span.game-text(v-if="!isTouchDevice" class="text-[10px] sm:text-xs")
        | Scroll to zoom in/out

    //- Bottom-right: skins + leaderboard (stages) buttons, safe-area aware
    div.fixed.flex.flex-col.items-end.gap-2.pointer-events-auto(
      class="z-40"
      @pointerdown.stop
      @click.stop
      :style="{\
        bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',\
        right: 'calc(0.5rem + env(safe-area-inset-right, 0px))'\
      }"
    )
      FIconButton(
        type="secondary"
        size="md"
        :img-src="prependBaseUrl('images/icons/team_128x128.webp')"
        @click="showSkinShop = true"
      )
      FIconButton(
        type="primary"
        size="md"
        :img-src="prependBaseUrl('images/icons/trophy_128x128.webp')"
        @click="showStagePicker = true"
      )
      //- Achievements button — aquamarine crest with new-item counter badge
      div.ach-btn-wrap
        div.relative.inline-block
          button.ach-btn(
            @click="openAchievements"
            aria-label="Achievements"
          )
            span.ach-btn__shadow
            span.ach-btn__body
              svg(viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round")
                path(d="M12 2 L18 5 V11 Q18 16 12 21 Q6 16 6 11 V5 Z")
                polyline(points="9 11 11 13 15 9")
          span.ach-btn__badge(v-if="achUnseenCount > 0") {{ achUnseenCount }}

    //- Top-right: score + coin badge
    div.absolute.flex.flex-col.items-end.gap-2(
      class="top-2 right-2 z-20"
      :style="{ top: 'calc(0.5rem + env(safe-area-inset-top, 0px))', right: 'calc(0.5rem + env(safe-area-inset-right, 0px))' }"
    )
      CoinBadge(ref="coinBadgeRef")
      div.score-badge.score-badge--score.rounded-full.font-black.game-text.flex.items-center.gap-2.px-3.py-1(
        class="text-sm sm:text-base"
      )
        span.text-white SCORE
        span.text-yellow-300 {{ score }}
      div.score-badge.rounded-full.font-black.game-text.flex.items-center.gap-2.px-3.py-1(
        class="text-xs sm:text-sm"
        :class="launchesTierClass"
      )
        span.text-white LAUNCHES
        span.text-white {{ launches }}

    //- Tap-to-start overlay
    div.absolute.inset-0.flex.items-center.justify-center.z-30.pointer-events-auto.cursor-pointer(
      v-if="phase === 'tap_to_start'"
      @click="onTapToStart"
    )
      div.text-center
        div.text-white.font-black.uppercase.tracking-wider.animate-pulse.game-text(
          class="text-3xl sm:text-5xl mb-2"
        ) TAP TO START
        div.text-white.italic.game-text.opacity-60(class="text-sm sm:text-lg")
          | Drag from the spinner to launch

    //- Countdown
    div.absolute.inset-0.flex.items-center.justify-center.z-30.pointer-events-none(
      v-else-if="phase === 'countdown' && countdownValue"
    )
      div.countdown-number.font-black.game-text.text-white(
        :key="countdownValue"
        class="text-7xl sm:text-9xl"
      ) {{ countdownValue }}

    //- Aim hint
    div.absolute.left-0.right-0.text-center.pointer-events-none.z-10(
      v-else-if="phase === 'aiming'"
      :style="{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }"
    )
      div.text-white.italic.game-text.opacity-60(class="text-xs sm:text-sm")
        | Drag from the spinner to compress the spring, release to launch

    //- Reward overlay — Level Cleared screen
    FReward(
      v-model="showReward"
      :show-continue="false"
    )
      template(#ribbon)
        span.text-white.font-black.uppercase.italic.game-text(class="sm:text-2xl") Level Cleared!
      div.level-cleared.flex.flex-col.items-center.justify-center(
        class="gap-6 sm:gap-8 pointer-events-auto"
        @click.stop
      )
        //- Interlocked 3-star cluster — center star in the back-center,
        //- left/right stars forward and lower, tucked under the middle's
        //- side points. Shared warm aura + ruby detail at the base junctions.
        div.stars-cluster
          //- Shared gold aura behind the whole cluster
          div.stars-cluster__aura(v-if="stars >= 1")
          //- Z-order: center drawn first (back), then side stars (front)
          div.star-slot.star-slot--mid(:class="{ 'is-lit': stars >= 2 }")
            star-gem(:lit="stars >= 2" gid="mid")
          div.star-slot.star-slot--left(:class="{ 'is-lit': stars >= 1 }")
            star-gem(:lit="stars >= 1" gid="lft")
          div.star-slot.star-slot--right(:class="{ 'is-lit': stars >= 3 }")
            star-gem(:lit="stars >= 3" gid="rgt")

        //- Score
        div.flex.flex-col.items-center.gap-1
          div.score-number.game-text(class="text-5xl sm:text-7xl") {{ score }}
          div.text-white.font-black.game-text.uppercase.tracking-widest(
            v-if="rewardCoins > 0"
            class="text-xs sm:text-sm"
          )
            | New High Score!

        //- Coin reward
        div.flex.items-center.gap-3(ref="rewardCoinRef" v-if="rewardCoins > 0")
          IconCoin(class="w-8 h-8 text-yellow-300")
          span.text-yellow-400.font-black.game-text(class="text-2xl sm:text-4xl") +{{ rewardCoins }}
        div.text-slate-300.italic.game-text.text-sm(v-else)
          | No new reward — beat your best rating to earn more coins.

        //- Mini leaderboard — only shown when there are any ranked rows
        div.lb-panel(v-if="lbRows.top.length > 0")
          div.lb-panel__frame
            div.lb-panel__title.game-text
              span.lb-panel__title-accent ★
              span.mx-2 Leaderboard
              span.lb-panel__title-accent ★
            div.lb-rows
              div.lb-row(
                v-for="row in lbRows.top"
                :key="row.id"
                :class="{ 'lb-row--me': row.isMe, 'lb-row--top1': row.rank === 1 }"
              )
                span.lb-rank {{ row.rank }}
                span.lb-name.game-text {{ row.name }}
                span.lb-score.game-text {{ row.score }}
              template(v-if="lbRows.mine")
                div.lb-sep …
                div.lb-row.lb-row--me(:key="'mine'")
                  span.lb-rank {{ lbRows.mine.rank }}
                  span.lb-name.game-text {{ lbRows.mine.name }}
                  span.lb-score.game-text {{ lbRows.mine.score }}
            div.lb-new-hint.game-text(v-if="isNewHighscore")
              | ★ New Personal Best ★

        //- Three circular footer buttons: list → replay → next
        div.footer-buttons.flex.items-center.justify-center(class="gap-5 sm:gap-7 mt-2")
          button.fbtn(@click="onOpenStagePicker" aria-label="Stages")
            svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round")
              line(x1="8" y1="6" x2="20" y2="6")
              line(x1="8" y1="12" x2="20" y2="12")
              line(x1="8" y1="18" x2="20" y2="18")
              circle(cx="4" cy="6" r="1.2" fill="currentColor")
              circle(cx="4" cy="12" r="1.2" fill="currentColor")
              circle(cx="4" cy="18" r="1.2" fill="currentColor")
          button.fbtn.fbtn--big(@click="onReplay" aria-label="Replay")
            svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round")
              path(d="M20 12a8 8 0 1 1-2.34-5.66")
              polyline(points="20 4 20 10 14 10")
          button.fbtn(@click="onNextStage" aria-label="Next Level")
            svg(viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round")
              polyline(points="7 5 14 12 7 19")
              polyline(points="13 5 20 12 13 19")

    //- Bottom-left: mute button → settings (editor) button
    div.fixed.flex.flex-col.items-start.gap-1.pointer-events-auto(
      class="z-40"
      @pointerdown.stop
      @click.stop
      :style="{ bottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))', left: 'calc(0.5rem + env(safe-area-inset-left, 0px))' }"
    )
      FMuteButton
      FIconButton(
        type="secondary"
        size="md"
        :img-src="prependBaseUrl('images/icons/gears_128x128.webp')"
        @click="showOptions = true"
      )
      FIconButton(
        type="secondary"
        size="md"
        :img-src="prependBaseUrl('images/icons/level-editor_128x128.svg')"
        @click="$router.push('/editor')"
      )

    //- Skin shop
    SkinShopModal(
      :is-open="showSkinShop"
      @close="showSkinShop = false"
    )

    //- Options / Settings
    OptionsModal(
      :is-open="showOptions"
      @close="showOptions = false"
    )

    //- Achievements
    AchievementsModal(
      :is-open="showAchievements"
      @close="showAchievements = false"
    )

    //- Stage picker
    FModal(
      :model-value="showStagePicker"
      @update:model-value="showStagePicker = $event"
      title="Stages"
    )
      div.text-slate-300.italic.game-text.text-xs.mb-3
        | Replay any stage to improve your rating — you only earn the difference in coins.
      div.grid.grid-cols-2.gap-2.overflow-y-auto(class="sm:grid-cols-3 max-h-[60vh] p-1")
        button.relative.rounded-lg.border-2.border-yellow-400.bg-slate-800.p-3.text-left.cursor-pointer(
          v-for="s in STAGES"
          :key="s.id"
          class="hover:bg-slate-700 active:scale-95 transition-transform"
          @click="pickStage(s)"
        )
          //- Per-stage rank badge (top-right of card)
          template(v-if="lbMyRankForStage(s.id)")
            div.stage-rank-badge.game-text(
              :class="{ 'stage-rank-badge--top1': lbMyRankForStage(s.id).rank === 1 }"
            )
              span.stage-rank-badge__hash #
              span.stage-rank-badge__num {{ lbMyRankForStage(s.id).rank }}
              span.stage-rank-badge__total /{{ lbMyRankForStage(s.id).total }}
          div.text-yellow-300.game-text.font-black.text-xs.uppercase {{ s.id }}
          div.text-white.game-text.font-black.text-sm {{ s.name }}
          div.flex.my-1(class="gap-0.5")
            span.text-lg(
              v-for="n in 3"
              :key="n"
              :class="n <= getBestStars(s.id) ? 'text-yellow-300' : 'text-slate-600'"
            ) ★
          div.text-slate-400.game-text.text-xs {{ s.width }}×{{ s.height }}
</template>

<style scoped lang="sass">
.score-badge
  border: 2px solid #fcd34d
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.4)


.score-badge--score
  background: linear-gradient(135deg, #7a5cff 0%, #4324c9 50%, #1e0f6e 100%)

.score-badge--tier-good
  background: linear-gradient(135deg, #86efac 0%, #16a34a 50%, #064e20 100%)
  border-color: #bbf7d0

.score-badge--tier-mid
  background: linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #7a3b00 100%)
  border-color: #fcd34d

.score-badge--tier-bad
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 50%, #450505 100%)
  border-color: #fca5a5

// ─── Level Cleared screen ──────────────────────────────────────────────
.level-cleared
  max-width: 90vw

// ─── 3-star interlocking cluster ───────────────────────────────────────
.stars-cluster
  position: relative
  width: 17rem
  height: 10rem

  @media (min-width: 640px)
    width: 22rem
    height: 13rem

.stars-cluster__aura
  position: absolute
  inset: 0
  pointer-events: none
  background: radial-gradient(ellipse at 50% 58%, rgba(253, 224, 71, 0.5) 0%, rgba(245, 158, 11, 0.32) 30%, rgba(120, 53, 15, 0.18) 55%, rgba(0, 0, 0, 0) 75%)
  filter: blur(10px)
  animation: stars-aura-pulse 2.4s ease-in-out infinite alternate

@keyframes stars-aura-pulse
  from
    opacity: 0.72
    transform: scale(1)
  to
    opacity: 1
    transform: scale(1.06)

.star-slot
  position: absolute
  display: flex
  align-items: center
  justify-content: center
  transform-origin: center

  //- Center star — largest, back apex of the cluster
  &--mid
    width: 10rem
    height: 10rem
    top: 0
    left: 50%
    transform: translateX(-50%)
    z-index: 1

    @media (min-width: 640px)
      width: 13rem
      height: 13rem

  //- Left star — smaller, forward, tucked under the middle's side point
  &--left
    width: 7rem
    height: 7rem
    top: 30%
    left: 50%
    transform: translate(-128%, 0) rotate(-4deg)
    z-index: 2

    @media (min-width: 640px)
      width: 9rem
      height: 9rem
      transform: translate(-130%, 0) rotate(-4deg)

  //- Right star — mirrored
  &--right
    width: 7rem
    height: 7rem
    top: 30%
    left: 50%
    transform: translate(28%, 0) rotate(4deg)
    z-index: 2

    @media (min-width: 640px)
      width: 9rem
      height: 9rem
      transform: translate(30%, 0) rotate(4deg)


  &.is-lit :deep(.star-gem)
    animation: star-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) backwards

  &.is-lit.star-slot--left :deep(.star-gem)
    animation-delay: 0.05s

  &.is-lit.star-slot--right :deep(.star-gem)
    animation-delay: 0.2s

  &.is-lit.star-slot--mid :deep(.star-gem)
    animation-delay: 0.35s

@keyframes star-pop
  0%
    transform: scale(0.2) rotate(-30deg)
    opacity: 0
  60%
    opacity: 1
  100%
    transform: scale(1) rotate(0deg)
    opacity: 1

// .star-gem styling lives in StarGem.vue (scoped to the child component)

.score-number
  color: #fff
  font-weight: 900
  letter-spacing: 0.02em
  text-shadow: 4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 18px rgba(255, 213, 74, 0.45)

// ─── Footer circular buttons ───────────────────────────────────────────
.footer-buttons
  .fbtn
    position: relative
    width: 3.25rem
    height: 3.25rem
    border-radius: 9999px
    border: 3px solid #3b1a00
    background: radial-gradient(circle at 35% 30%, #fff08a 0%, #ffcd00 40%, #f59e0b 80%, #b45309 100%)
    color: #fff
    display: inline-flex
    align-items: center
    justify-content: center
    cursor: pointer
    box-shadow: 0 4px 0 #3b1a00, 0 6px 12px rgba(0, 0, 0, 0.55), inset 0 2px 2px rgba(255, 255, 255, 0.6), inset 0 -3px 4px rgba(0, 0, 0, 0.25)
    transition: transform 0.08s ease, box-shadow 0.08s ease
    -webkit-tap-highlight-color: transparent

    @media (min-width: 640px)
      width: 4rem
      height: 4rem

    &:hover
      filter: brightness(1.08)

    &:active
      transform: translateY(3px)
      box-shadow: 0 1px 0 #3b1a00, 0 2px 6px rgba(0, 0, 0, 0.55), inset 0 2px 2px rgba(255, 255, 255, 0.6), inset 0 -3px 4px rgba(0, 0, 0, 0.25)

    svg
      width: 55%
      height: 55%
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.4))

  .fbtn--big
    width: 4rem
    height: 4rem

    @media (min-width: 640px)
      width: 5rem
      height: 5rem

// ─── Achievements button (aquamarine crest) ────────────────────────────
// Sized to match FIconButton size="md": scale-80 on mobile, scale-100 on sm+.
.ach-btn-wrap
  display: inline-block
  transform: scale(0.8)
  transform-origin: center
  line-height: 0

  @media (min-width: 640px)
    transform: scale(1)

.ach-btn
  position: relative
  display: inline-block
  padding: 0
  background: transparent
  border: 0
  cursor: pointer
  -webkit-tap-highlight-color: transparent
  transition: filter 0.08s ease

  &:hover
    filter: brightness(1.08)

  &:active .ach-btn__body
    transform: translateY(2px)

.ach-btn__shadow
  position: absolute
  inset: 0
  transform: translateY(4px)
  border-radius: 0.5rem
  background: #0e5a52
  z-index: 0

.ach-btn__body
  position: relative
  display: inline-flex
  align-items: center
  justify-content: center
  padding: 0.5rem
  border-radius: 0.5rem
  border: 2px solid #083344
  background: linear-gradient(180deg, #7dffe1 0%, #22d3ee 45%, #0891b2 100%)
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.55), inset 0 -3px 0 rgba(0, 0, 0, 0.22), 0 0 10px rgba(45, 212, 191, 0.35)
  z-index: 1

  // Match FIconButton size="md" — h-7 w-7 image in object-contain
  svg
    display: block
    width: 1.75rem
    height: 1.75rem
    object-fit: contain
    filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.5))

.ach-btn__badge
  position: absolute
  top: -0.3rem
  right: -0.35rem
  min-width: 1.1rem
  height: 1.1rem
  padding: 0 0.25rem
  border-radius: 9999px
  background: linear-gradient(180deg, #fb7185 0%, #dc2626 100%)
  color: #fff
  font-family: inherit
  font-weight: 900
  font-size: 0.68rem
  line-height: 1.1rem
  text-align: center
  border: 2px solid #3b0000
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5), 0 0 8px rgba(252, 165, 165, 0.6)
  text-shadow: 1px 1px 0 #000
  z-index: 2
  animation: ach-badge-pulse 1.1s ease-in-out infinite alternate

@keyframes ach-badge-pulse
  from
    transform: scale(1)
  to
    transform: scale(1.12)

// ─── Stage card rank badge ─────────────────────────────────────────────
.stage-rank-badge
  position: absolute
  top: -0.4rem
  right: -0.4rem
  display: inline-flex
  align-items: baseline
  gap: 0.1rem
  padding: 0.15rem 0.45rem
  border-radius: 9999px
  background: linear-gradient(180deg, #1e3a8a 0%, #0f1d48 100%)
  border: 2px solid #60a5fa
  color: #bfdbfe
  font-weight: 900
  font-size: 0.7rem
  line-height: 1
  letter-spacing: 0.02em
  box-shadow: 0 2px 0 #0f1a30, 0 0 8px rgba(96, 165, 250, 0.4)
  text-shadow: 1px 1px 0 #000

  &__hash
    color: #60a5fa
    font-size: 0.6rem

  &__num
    color: #fff

  &__total
    color: #64748b
    font-size: 0.55rem
    margin-left: 0.05rem

  &--top1
    background: linear-gradient(180deg, #b45309 0%, #7a3b00 100%)
    border-color: #fcd34d
    box-shadow: 0 2px 0 #3b1a00, 0 0 10px rgba(252, 211, 77, 0.6)

    .stage-rank-badge__hash
      color: #fde047

    .stage-rank-badge__num
      color: #fff9c4

    .stage-rank-badge__total
      color: #fcd34d

// ─── Camera control hint (top center) ─────────────────────────────────
.camera-hint
  color: rgba(255, 255, 255, 0.72)
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.85), -1px -1px 0 rgba(0, 0, 0, 0.85), 1px -1px 0 rgba(0, 0, 0, 0.85), -1px 1px 0 rgba(0, 0, 0, 0.85)
  font-weight: 900
  text-transform: uppercase
  letter-spacing: 0.06em
  white-space: nowrap

// ─── Mini leaderboard (reward screen) ──────────────────────────────────
.lb-panel
  width: min(90vw, 340px)
  margin-top: 0.25rem

.lb-panel__frame
  position: relative
  padding: 0.75rem 0.75rem 0.85rem
  border-radius: 0.75rem
  background: linear-gradient(180deg, rgba(14, 22, 45, 0.95) 0%, rgba(7, 11, 25, 0.95) 100%)
  border: 3px solid #fcd34d
  box-shadow: 0 0 0 2px #0f1a30, 0 0 18px rgba(252, 211, 77, 0.35), inset 0 2px 0 rgba(255, 255, 255, 0.12), inset 0 -3px 0 rgba(0, 0, 0, 0.35)

  &::before, &::after
    content: ''
    position: absolute
    width: 14px
    height: 14px
    border: 3px solid #fcd34d
    background: #0b1220
    border-radius: 3px
    transform: rotate(45deg)

  &::before
    top: -9px
    left: 14px

  &::after
    top: -9px
    right: 14px

.lb-panel__title
  text-align: center
  color: #fff
  font-weight: 900
  text-transform: uppercase
  letter-spacing: 0.08em
  font-size: 0.9rem
  margin-bottom: 0.5rem
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000

.lb-panel__title-accent
  color: #fcd34d
  display: inline-block

.lb-rows
  display: flex
  flex-direction: column
  gap: 0.25rem

.lb-row
  display: grid
  grid-template-columns: 2.25rem 1fr auto
  align-items: center
  gap: 0.5rem
  padding: 0.3rem 0.55rem
  border-radius: 0.5rem
  background: linear-gradient(180deg, rgba(30, 41, 82, 0.85) 0%, rgba(15, 22, 45, 0.85) 100%)
  border: 2px solid rgba(96, 165, 250, 0.55)
  font-weight: 900
  line-height: 1
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000

.lb-rank
  color: #60a5fa
  font-size: 0.85rem
  text-align: center
  font-weight: 900

.lb-name
  color: #ffffff
  font-size: 0.85rem
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.lb-score
  color: #facc15
  font-size: 0.85rem
  text-align: right

.lb-row--top1
  border-color: #fde047
  background: linear-gradient(180deg, rgba(120, 80, 0, 0.9) 0%, rgba(60, 35, 0, 0.9) 100%)
  box-shadow: 0 0 10px rgba(253, 224, 71, 0.45)

  .lb-rank
    color: #fde047

  .lb-score
    color: #fff9c4

.lb-row--me
  border-color: #22c55e
  background: linear-gradient(180deg, rgba(6, 78, 59, 0.9) 0%, rgba(5, 46, 22, 0.9) 100%)
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5)

  .lb-rank
    color: #bbf7d0

  .lb-name
    color: #d1fae5

  .lb-score
    color: #86efac

.lb-sep
  text-align: center
  color: #94a3b8
  font-weight: 900
  letter-spacing: 0.3em
  padding: 0.1rem 0

.lb-new-hint
  margin-top: 0.5rem
  text-align: center
  color: #fde047
  font-weight: 900
  text-transform: uppercase
  letter-spacing: 0.12em
  font-size: 0.75rem
  text-shadow: 2px 2px 0 #000, 0 0 8px rgba(253, 224, 71, 0.7)
  animation: lb-pulse 1.1s ease-in-out infinite alternate

@keyframes lb-pulse
  from
    transform: scale(1)
    opacity: 0.85
  to
    transform: scale(1.05)
    opacity: 1

.countdown-number
  text-shadow: 4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000
  animation: countdown-pop 375ms ease-out forwards

@keyframes countdown-pop
  0%
    transform: scale(0.3)
    opacity: 0
  40%
    transform: scale(1.15)
    opacity: 1
  100%
    transform: scale(1)
    opacity: 1
</style>
