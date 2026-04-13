import { ref, computed, shallowRef } from 'vue'
import type { Stage, Machine, Spinner, StagePhase } from '@/types/stage'
import { MACHINE_REGISTRY } from '@/game/machines'
import type { StageCtx } from '@/game/machines/base'
import stage1 from '@/game/stages/stage1'
import { getSelectedSkin } from '@/use/useModels'
import useSpinnerConfig from '@/use/useSpinnerConfig'

const FRICTION = 0.991
const FRICTION_LOW = 0.93
const STOP_SPEED = 0.35
const SPRING_K = 0.22
const MAX_COMPRESS = 220
const MIN_LAUNCH_SPEED = 6
// Reference max speed — cruise velocity the spring-arm can reach at full
// compression. Below 20% of this the blade gets an aggressive friction
// so it settles quickly instead of drifting forever.
const MAX_SPEED = SPRING_K * MAX_COMPRESS
const SLOW_THRESHOLD = MAX_SPEED * 0.2
// Anti-lockup: if the blade barely moves for this long while "launched"
// (e.g. trapped between a conveyor belt and a wall), force it to rest so
// the player can re-launch. Also an absolute cap on launch duration.
const STUCK_CHECK_INTERVAL_MS = 600
const STUCK_MIN_DISPLACEMENT = 35
const MAX_LAUNCH_DURATION_MS = 14000

let launchStartTs = 0
let stuckCheckTs = 0
let stuckLastX = 0
let stuckLastY = 0

const currentStage = shallowRef<Stage>(cloneStage(stage1))
const phase = ref<StagePhase>('tap_to_start')
const score = ref(0)
const launches = ref(0)
const stars = ref(0)
const countdownValue = ref<string | null>(null)
const bossKilled = ref(false)

const spinner = ref<Spinner>({
  x: currentStage.value.spawn.x,
  y: currentStage.value.spawn.y,
  vx: 0,
  vy: 0,
  r: 22,
  rotation: 0,
  rotationSpeed: 0,
  frozenUntil: 0,
  modelId: 'blades',
  railId: null,
  railProgress: 0
})

function cloneStage(s: Stage): Stage {
  return JSON.parse(JSON.stringify(s))
}

function resetSpinner() {
  const s = currentStage.value
  spinner.value = {
    x: s.spawn.x,
    y: s.spawn.y,
    vx: 0,
    vy: 0,
    r: 22,
    rotation: 0,
    rotationSpeed: 0,
    frozenUntil: 0,
    modelId: getSelectedSkin('star'),
    railId: null,
    railProgress: 0
  }
}

function loadStage(s: Stage) {
  currentStage.value = cloneStage(s)
  score.value = 0
  launches.value = 0
  stars.value = 0
  bossKilled.value = false
  phase.value = 'tap_to_start'
  resetSpinner()
}

function beginCountdown(onDone: () => void) {
  phase.value = 'countdown'
  const steps = ['3', '2', '1', 'GO']
  let i = 0
  countdownValue.value = steps[0]!
  const tick = () => {
    i++
    if (i >= steps.length) {
      countdownValue.value = null
      onDone()
      return
    }
    countdownValue.value = steps[i]!
    setTimeout(tick, 650)
  }
  setTimeout(tick, 650)
}

// ─── Physics ───────────────────────────────────────────────────────────────

const currentSpeed = () => Math.hypot(spinner.value.vx, spinner.value.vy)
const isMoving = computed(() => currentSpeed() > STOP_SPEED)

function bounceAabb(sp: Spinner, m: Machine) {
  // Rotation-aware: transform the circle into the wall's local frame,
  // resolve there, then rotate the correction back into world space.
  const cos = Math.cos(-m.rot)
  const sin = Math.sin(-m.rot)
  const lx = (sp.x - m.x) * cos - (sp.y - m.y) * sin
  const ly = (sp.x - m.x) * sin + (sp.y - m.y) * cos
  const hw = m.w / 2
  const hh = m.h / 2
  const cxL = Math.max(-hw, Math.min(hw, lx))
  const cyL = Math.max(-hh, Math.min(hh, ly))
  const ddxL = lx - cxL
  const ddyL = ly - cyL
  const distSq = ddxL * ddxL + ddyL * ddyL
  if (distSq > sp.r * sp.r) return false
  const dist = Math.sqrt(distSq) || 0.0001
  const nxL = ddxL / dist
  const nyL = ddyL / dist
  const overlap = sp.r - dist
  // Rotate local normal back to world frame.
  const c2 = Math.cos(m.rot)
  const s2 = Math.sin(m.rot)
  const nx = nxL * c2 - nyL * s2
  const ny = nxL * s2 + nyL * c2
  sp.x += nx * overlap
  sp.y += ny * overlap
  const vn = sp.vx * nx + sp.vy * ny
  if (vn < 0) {
    sp.vx -= 2 * vn * nx
    sp.vy -= 2 * vn * ny
    // Walls don't accelerate — slight damp so walls aren't a free speed source.
    sp.vx *= 0.92
    sp.vy *= 0.92
  }
  return true
}

// Maximum world-unit displacement per substep. Must be smaller than half
// the thinnest wall / machine to prevent tunneling at high speed. Walls in
// stage 1 are ~20 units thick, so 8 is safe.
const MAX_SUBSTEP_DIST = 8

function step(dt: number) {
  const sp = spinner.value
  const stage = currentStage.value
  const now = performance.now()

  // Friction is a per-frame decay — apply once, then substep the motion.
  const speedNow = currentSpeed()
  const friction = speedNow < SLOW_THRESHOLD ? FRICTION_LOW : FRICTION
  sp.vx *= friction
  sp.vy *= friction
  sp.rotation += currentSpeed() * 0.04

  const ctx: StageCtx = {
    now,
    dt,
    addScore: (n) => {
      score.value += n
    },
    destroyMachine: (_m) => { /* mark only — kept in array for rendering fade */
    },
    machines: stage.machines,
    spinner: sp,
    onBossDead: () => {
      if (bossKilled.value) return
      bossKilled.value = true
      score.value += stage.bossKillBonus
    },
    onGoal: () => {
      if (phase.value === 'complete') return
      finishStage()
    }
  }

  const speed = Math.hypot(sp.vx, sp.vy)
  const substeps = Math.max(1, Math.ceil(speed / MAX_SUBSTEP_DIST))
  const invN = 1 / substeps
  for (let i = 0; i < substeps; i++) {
    sp.x += sp.vx * invN
    sp.y += sp.vy * invN

    // Stage bounds clamp per substep so outer bounds can't be tunneled.
    if (sp.x < sp.r) {
      sp.x = sp.r
      sp.vx = Math.abs(sp.vx) * 0.85
    }
    if (sp.y < sp.r) {
      sp.y = sp.r
      sp.vy = Math.abs(sp.vy) * 0.85
    }
    if (sp.x > stage.width - sp.r) {
      sp.x = stage.width - sp.r
      sp.vx = -Math.abs(sp.vx) * 0.85
    }
    if (sp.y > stage.height - sp.r) {
      sp.y = stage.height - sp.r
      sp.vy = -Math.abs(sp.vy) * 0.85
    }

    // Walls resolve each substep so fast-moving blades can't skip them.
    for (const m of stage.machines) {
      if (m.destroyed) continue
      if (m.type === 'wall') bounceAabb(sp, m)
    }
    // Interactive machines tick each substep so rails / boosters / goal
    // triggers at high speed still register.
    for (const m of stage.machines) {
      if (m.destroyed) continue
      if (m.type === 'wall') continue
      const mod = MACHINE_REGISTRY[m.type]
      if (mod) mod.tick(m, ctx)
    }
  }

  // Launched → aiming transition when at rest
  if (phase.value === 'launched') {
    if (currentSpeed() < STOP_SPEED) {
      settleToAiming()
    } else if (now - launchStartTs > MAX_LAUNCH_DURATION_MS) {
      // Hard timeout — never let a launch run forever.
      settleToAiming()
    } else if (now - stuckCheckTs > STUCK_CHECK_INTERVAL_MS) {
      const dx = sp.x - stuckLastX
      const dy = sp.y - stuckLastY
      if (Math.hypot(dx, dy) < STUCK_MIN_DISPLACEMENT) {
        // Moving but going nowhere (conveyor-wall lockup, etc.) — settle.
        settleToAiming()
      } else {
        stuckCheckTs = now
        stuckLastX = sp.x
        stuckLastY = sp.y
      }
    }
  }
}

function settleToAiming() {
  const sp = spinner.value
  sp.vx = 0
  sp.vy = 0
  phase.value = 'aiming'
}

let rafId: number | null = null
let lastTs = 0

function loop(ts: number) {
  const dt = lastTs ? (ts - lastTs) : 16
  lastTs = ts
  if (phase.value === 'launched' || phase.value === 'aiming') {
    step(dt)
  }
  rafId = requestAnimationFrame(loop)
}

function startLoop() {
  if (rafId !== null) return
  lastTs = 0
  rafId = requestAnimationFrame(loop)
}

function stopLoop() {
  if (rafId !== null) cancelAnimationFrame(rafId)
  rafId = null
}

// ─── Launching ────────────────────────────────────────────────────────────

function launch(dirX: number, dirY: number, compression: number) {
  if (phase.value !== 'aiming') return
  const c = Math.min(MAX_COMPRESS, Math.max(0, compression))
  const force = SPRING_K * c
  if (force < MIN_LAUNCH_SPEED) return
  const len = Math.hypot(dirX, dirY) || 1
  const sp = spinner.value
  sp.vx = (dirX / len) * force
  sp.vy = (dirY / len) * force
  launches.value++
  phase.value = 'launched'
  const now = performance.now()
  launchStartTs = now
  stuckCheckTs = now
  stuckLastX = sp.x
  stuckLastY = sp.y
}

function beginStage() {
  beginCountdown(() => {
    phase.value = 'aiming'
  })
}

function finishStage() {
  const stage = currentStage.value
  const penalty = launches.value * stage.launchPenalty
  const final = Math.max(0, score.value - penalty)
  score.value = final
  const th = stage.starThresholds
  let s = 1
  if (final >= th[1]) s = 2
  if (final >= th[2]) s = 3
  stars.value = s
  phase.value = 'complete'
  // Award coins based on stars.
  const coins = s === 3 ? 200 : s === 2 ? 100 : 50
  const { addCoins } = useSpinnerConfig()
  addCoins(coins)
}

function useStageGame() {
  return {
    currentStage,
    phase,
    score,
    launches,
    stars,
    countdownValue,
    spinner,
    bossKilled,
    isMoving,
    loadStage,
    beginStage,
    launch,
    startLoop,
    stopLoop,
    resetSpinner
  }
}

export default useStageGame
