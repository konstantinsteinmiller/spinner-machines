import { ref, computed, shallowRef } from 'vue'
import type { Stage, Machine, Spinner, StagePhase } from '@/types/stage'
import { MACHINE_REGISTRY } from '@/game/machines'
import type { StageCtx } from '@/game/machines/base'
import stage1 from '@/game/stages/stage1'
import { getSelectedSkin } from '@/use/useModels'
import useSpinnerConfig from '@/use/useSpinnerConfig'
import { clearExplosions } from '@/game/vfx'
import { clearSpinnerVfx } from '@/game/spinnerVfx'

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
const lastCoinsAwarded = ref(0)

// ─── Per-stage best stars (persisted) ─────────────────────────────────
const STAGE_STARS_KEY = 'bm_stage_stars'
const bestStars = ref<Record<string, number>>(loadBestStars())

function loadBestStars(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STAGE_STARS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveBestStars() {
  try {
    localStorage.setItem(STAGE_STARS_KEY, JSON.stringify(bestStars.value))
  } catch { /* ignore */
  }
}

function getBestStars(stageId: string): number {
  return bestStars.value[stageId] ?? 0
}

const COINS_FOR_STARS = [0, 50, 100, 200] as const

function coinsForStars(n: number): number {
  return COINS_FOR_STARS[n] ?? 0
}

const spinner = ref<Spinner>({
  x: currentStage.value.spawn.x,
  y: currentStage.value.spawn.y,
  vx: 0,
  vy: 0,
  r: 35,
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
    r: 35,
    rotation: 0,
    rotationSpeed: 0,
    frozenUntil: 0,
    modelId: getSelectedSkin('star'),
    railId: null,
    railProgress: 0
  }
}

function loadStage(s: Stage) {
  const cloned = cloneStage(s)
  // Restarting a stage hands us back the same currentStage reference the
  // player just dirtied (destroyed walls, exploded generators, shattered
  // glass tubes, triggered plates, …). Reset all transient machine state
  // so the level starts clean regardless of what happened last run.
  for (const m of cloned.machines) {
    m.destroyed = false
    m.destroyedAt = undefined
    m.triggered = false
    m.cooldownUntil = undefined
    if (m.maxHp !== undefined) {
      // Refill HP for walls / bosses back to their cached max.
      m.hp = m.maxHp
    } else if (m.type === 'wall') {
      // Pristine wall — let wallMaxHp() rehydrate on the first hit.
      m.hp = undefined
    }
  }
  currentStage.value = cloned
  score.value = 0
  launches.value = 0
  stars.value = 0
  bossKilled.value = false
  phase.value = 'tap_to_start'
  resetSpinner()
  // Drop any in-flight explosion VFX from the previous run so reloading
  // a stage never leaves phantom booms hanging over the fresh layout.
  clearExplosions()
  clearSpinnerVfx()
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

// Damage a wall absorbs before it shatters. Scales with area so thick /
// long walls are noticeably tougher to break than a tiny segment, and with
// material: wood = base, stone = 3×, metal = 9×.
export function wallMaterialMultiplier(material?: string): number {
  if (material === 'metal') return 9
  if (material === 'stone') return 3
  return 1
}

export function wallMaxHp(m: Machine): number {
  const base = Math.max(1, Math.round((m.w * m.h * 3) / 400))
  return base * wallMaterialMultiplier(m.meta?.material)
}

function bounceAabb(sp: Spinner, m: Machine): number {
  // Rotation-aware: transform the circle into the wall's local frame,
  // resolve there, then rotate the correction back into world space.
  // Returns the impact speed (0 if no collision) so the caller can apply
  // damage to destroyable walls.
  const cos = Math.cos(-m.rot)
  const sin = Math.sin(-m.rot)
  const lx = (sp.x - m.x) * cos - (sp.y - m.y) * sin
  const ly = (sp.x - m.x) * sin + (sp.y - m.y) * cos
  const hw = m.w / 2
  const hh = m.h / 2

  let nxL: number
  let nyL: number
  let overlap: number

  const inside = Math.abs(lx) <= hw && Math.abs(ly) <= hh
  if (inside) {
    // Circle center penetrated the box — push out along the shallowest
    // axis. Without this branch a fast blade can land inside a wall,
    // register zero correction and slip straight through on the next step.
    const dxL = hw - Math.abs(lx)
    const dyL = hh - Math.abs(ly)
    if (dxL < dyL) {
      nxL = lx >= 0 ? 1 : -1
      nyL = 0
      overlap = dxL + sp.r
    } else {
      nxL = 0
      nyL = ly >= 0 ? 1 : -1
      overlap = dyL + sp.r
    }
  } else {
    const cxL = Math.max(-hw, Math.min(hw, lx))
    const cyL = Math.max(-hh, Math.min(hh, ly))
    const ddxL = lx - cxL
    const ddyL = ly - cyL
    const distSq = ddxL * ddxL + ddyL * ddyL
    if (distSq > sp.r * sp.r) return 0
    const dist = Math.sqrt(distSq) || 0.0001
    nxL = ddxL / dist
    nyL = ddyL / dist
    overlap = sp.r - dist
  }

  // Rotate local normal back to world frame.
  const c2 = Math.cos(m.rot)
  const s2 = Math.sin(m.rot)
  const nx = nxL * c2 - nyL * s2
  const ny = nxL * s2 + nyL * c2
  sp.x += nx * overlap
  sp.y += ny * overlap
  const vn = sp.vx * nx + sp.vy * ny
  let impact = 0
  if (vn < 0) {
    impact = -vn
    sp.vx -= 2 * vn * nx
    sp.vy -= 2 * vn * ny
    // Walls don't accelerate — slight damp so walls aren't a free speed source.
    sp.vx *= 0.92
    sp.vy *= 0.92
  }
  return impact
}

// Maximum world-unit displacement per substep. Must stay well below
// (sp.r + wall_half_thickness) so fast blades can't slip through a wall
// between substeps. Thinnest walls are ~20 thick (half = 10); with a
// 22-unit radius the safe ceiling is ~32. We use 4 for a big margin.
const MAX_SUBSTEP_DIST = 4
// Damage per unit of impact speed applied to destroyable walls.
const WALL_DAMAGE_PER_SPEED = 1.2

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
      score.value += stage.bossKillBonus * 2
    },
    onGoal: () => {
      if (phase.value === 'complete') return
      finishStage()
    }
  }

  const speed = Math.hypot(sp.vx, sp.vy)
  const substeps = Math.max(1, Math.ceil(speed / MAX_SUBSTEP_DIST))
  const invN = 1 / substeps
  const isTeleporter = sp.modelId === 'teleporter'
  for (let i = 0; i < substeps; i++) {
    sp.x += sp.vx * invN
    sp.y += sp.vy * invN

    if (isTeleporter) {
      // Teleporter skin phases through the outer stage bounds — wrap to
      // the opposite edge so launching too hard flings you across the
      // map. Very strong, but unpredictable.
      if (sp.x < -sp.r) sp.x = stage.width + sp.r
      else if (sp.x > stage.width + sp.r) sp.x = -sp.r
      if (sp.y < -sp.r) sp.y = stage.height + sp.r
      else if (sp.y > stage.height + sp.r) sp.y = -sp.r
    } else {
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
    }

    // Walls resolve each substep so fast-moving blades can't skip them.
    // Teleporter skin skips wall resolution entirely — it phases through.
    if (!isTeleporter) {
      for (const m of stage.machines) {
        if (m.destroyed) continue
        if (m.type !== 'wall') continue
        const impact = bounceAabb(sp, m)
        if (impact <= 0) continue
        if (m.maxHp === undefined) m.maxHp = wallMaxHp(m)
        if (m.hp === undefined) m.hp = m.maxHp
        m.hp -= impact * WALL_DAMAGE_PER_SPEED
        if (m.hp <= 0) {
          m.destroyed = true
          score.value += Math.max(5, Math.round(m.maxHp / 2))
        }
      }
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

// ─── Thunderstorm aura damage ─────────────────────────────────────────
// Applies a pulse of damage to destructible machines within range every
// THUNDER_PULSE_MS. Bosses are explicitly immune so they stay the real
// challenge. Called from the main loop while the spinner is in flight.
const THUNDER_RADIUS = 140
const THUNDER_PULSE_MS = 260
const THUNDER_WALL_DMG = 2
let lastThunderPulse = 0

function tickThunderstormDamage(now: number) {
  const sp = spinner.value
  if (sp.modelId !== 'thunderstorm') return
  if (now - lastThunderPulse < THUNDER_PULSE_MS) return
  lastThunderPulse = now
  const stage = currentStage.value
  const R2 = THUNDER_RADIUS * THUNDER_RADIUS
  for (const m of stage.machines) {
    if (m.destroyed) continue
    if (m.type === 'boss') continue // bosses are immune per design
    if (m.type === 'spawn' || m.type === 'goal') continue
    const dx = m.x - sp.x
    const dy = m.y - sp.y
    if (dx * dx + dy * dy > R2) continue
    if (m.type === 'wall') {
      if (m.maxHp === undefined) m.maxHp = wallMaxHp(m)
      if (m.hp === undefined) m.hp = m.maxHp
      m.hp -= THUNDER_WALL_DMG
      if (m.hp <= 0) {
        m.destroyed = true
        score.value += Math.max(5, Math.round(m.maxHp / 2))
      }
    } else if (m.type === 'destroyableGlassTube') {
      m.destroyed = true
      score.value += 20
    } else if (m.type === 'overloadedGenerator') {
      // Trigger the generator's explosion path by marking it destroyed;
      // its own machine module will detect and spawn the VFX / cascade.
      m.destroyed = true
      m.destroyedAt = now
      score.value += 30
    } else if (m.type === 'pressurePlate') {
      if (!m.triggered) m.triggered = true
    }
  }
}

let rafId: number | null = null
let lastTs = 0

function loop(ts: number) {
  const dt = lastTs ? (ts - lastTs) : 16
  lastTs = ts
  if (phase.value === 'launched' || phase.value === 'aiming') {
    step(dt)
    if (phase.value === 'launched') tickThunderstormDamage(ts)
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
  // Coins are granted as the DELTA vs the stage's previous best, so replays
  // only pay the difference when the player improves their rating.
  const prevBest = getBestStars(stage.id)
  const earned = Math.max(0, coinsForStars(s) - coinsForStars(prevBest))
  lastCoinsAwarded.value = earned
  if (s > prevBest) {
    bestStars.value[stage.id] = s
    saveBestStars()
  }
  if (earned > 0) {
    const { addCoins } = useSpinnerConfig()
    addCoins(earned)
  }
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
    resetSpinner,
    bestStars,
    getBestStars,
    lastCoinsAwarded
  }
}

export default useStageGame
