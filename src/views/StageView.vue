<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import useStageGame from '@/use/useStageGame'
import useSpinnerConfig from '@/use/useSpinnerConfig'
import { MACHINE_REGISTRY } from '@/game/machines'
import { modelImgPath, getSelectedSkin } from '@/use/useModels'
import stage1 from '@/game/stages/stage1'
import FReward from '@/components/atoms/FReward.vue'
import CoinBadge from '@/components/organisms/CoinBadge.vue'
import IconCoin from '@/components/icons/IconCoin.vue'
import SkinShopModal from '@/components/organisms/SkinShopModal.vue'
import { spawnCoinExplosion } from '@/use/useCoinExplosion'
import useMeteorShower from '@/use/useMeteorShower'

const {
  currentStage, phase, score, launches, stars, countdownValue,
  spinner, loadStage, beginStage, launch, startLoop, stopLoop
} = useStageGame()
const { coins } = useSpinnerConfig()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const coinBadgeRef = ref<{ rootEl: HTMLElement | null } | null>(null)
const rewardCoinRef = ref<HTMLElement | null>(null)
const showReward = ref(false)
const showSkinShop = ref(false)

const meteor = useMeteorShower()

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

  // Aim arrow
  if (phase.value === 'aiming' && ptr.value.mode === 'aim') {
    const wp = screenToWorld(ptr.value.curX, ptr.value.curY)
    const dx = sp.x - wp.x
    const dy = sp.y - wp.y
    const len = Math.hypot(dx, dy)
    const maxLen = 220
    const clamped = Math.min(len, maxLen)
    const nx = dx / (len || 1)
    const ny = dy / (len || 1)
    ctx.save()
    ctx.strokeStyle = 'rgba(250,204,21,0.9)'
    ctx.lineWidth = 6
    ctx.setLineDash([12, 8])
    ctx.beginPath()
    ctx.moveTo(sp.x, sp.y)
    ctx.lineTo(sp.x + nx * clamped * 1.2, sp.y + ny * clamped * 1.2)
    ctx.stroke()
    ctx.setLineDash([])
    // Spring compression indicator
    const t = clamped / maxLen
    ctx.fillStyle = `hsl(${60 - t * 60}, 95%, 55%)`
    ctx.beginPath()
    ctx.arc(sp.x + nx * clamped * 1.2, sp.y + ny * clamped * 1.2, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
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
  if (p === 'complete') {
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
})

const rewardCoins = computed(() => stars.value === 3 ? 200 : stars.value === 2 ? 100 : 50)
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

    //- Top-left: skin shop
    div.absolute.flex.gap-2(
      class="top-2 left-2 z-20"
      :style="{ top: 'calc(0.5rem + env(safe-area-inset-top, 0px))', left: 'calc(0.5rem + env(safe-area-inset-left, 0px))' }"
    )
      button.rounded-full.bg-black.px-3.py-2.font-black.text-white.game-text.border-2.border-yellow-400(
        class="text-xs sm:text-sm"
        @click="showSkinShop = true"
      ) SKINS
      button.rounded-full.bg-black.px-3.py-2.font-black.text-white.game-text.border-2.border-sky-400(
        class="text-xs sm:text-sm"
        @click="$router.push('/editor')"
      ) EDITOR

    //- Top-right: score + coin badge
    div.absolute.flex.flex-col.items-end.gap-2(
      class="top-2 right-2 z-20"
      :style="{ top: 'calc(0.5rem + env(safe-area-inset-top, 0px))', right: 'calc(0.5rem + env(safe-area-inset-right, 0px))' }"
    )
      CoinBadge(ref="coinBadgeRef")
      div.score-badge.rounded-full.font-black.game-text.flex.items-center.gap-2.px-3.py-1(
        class="text-sm sm:text-base"
      )
        span.text-white SCORE
        span.text-yellow-300 {{ score }}
      div.score-badge.rounded-full.font-black.game-text.flex.items-center.gap-2.px-3.py-1(
        class="text-xs sm:text-sm"
      )
        span.text-white LAUNCHES
        span.text-red-300 {{ launches }}

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

    //- Reward overlay
    FReward(
      v-model="showReward"
      :show-continue="true"
      @continue="onContinue"
    )
      template(#ribbon)
        span.text-white.font-black.uppercase.italic.game-text(class="sm:text-2xl") Stage Complete
      div.flex.flex-col.items-center.gap-4
        div.flex.gap-2
          span.text-5xl(v-for="n in 3" :key="n" :class="n <= stars ? 'text-yellow-300' : 'text-slate-700'") ★
        div.font-black.uppercase.game-text.text-green-400(class="text-2xl sm:text-4xl")
          | Score {{ score }}
        div.flex.items-center.gap-3(ref="rewardCoinRef")
          IconCoin(class="w-8 h-8 text-yellow-300")
          span.text-yellow-400.font-black.game-text(class="text-2xl sm:text-4xl") +{{ rewardCoins }}

    //- Skin shop
    SkinShopModal(
      :is-open="showSkinShop"
      @close="showSkinShop = false"
    )
</template>

<style scoped lang="sass">
.score-badge
  background: linear-gradient(135deg, #50aaff 0%, #2266ff 50%, #1b3e95 100%)
  border: 2px solid #fcd34d
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6), 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.4)

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
