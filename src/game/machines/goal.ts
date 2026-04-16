import type { MachineModule, StageCtx } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'

// Speed under which the spinner counts as "at rest" on the exit gate.
// Matches STOP_SPEED in useStageGame so the transition feels consistent.
const REST_SPEED = 0.35

// Graceful pull zone — if the spinner is approaching the gate at low
// velocity, gently steer it toward the center so near-misses still
// land. Strong enough to catch a drifting spinner, weak enough that a
// fast bounce or deliberate trajectory isn't hijacked.
const PULL_RADIUS = 1.8 // multiplier on gate radius
const PULL_STRENGTH = 0.12 // acceleration per tick toward center
const PULL_MAX_SPEED = 4 // ignore spinners faster than this
const PULL_MIN_SPEED = 0.2 // ignore nearly stationary spinners (just bouncing)

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  const r = m.w / 2
  const dx = sp.x - m.x
  const dy = sp.y - m.y
  const d = Math.hypot(dx, dy)
  const spd = Math.hypot(sp.vx, sp.vy)
  const inside = d < r + sp.r
  const atRest = spd < REST_SPEED

  // Graceful pull: nudge spinner toward gate center when approaching slowly.
  if (!inside && d < r * PULL_RADIUS && spd > PULL_MIN_SPEED && spd < PULL_MAX_SPEED && d > 1) {
    const pull = PULL_STRENGTH * (1 - d / (r * PULL_RADIUS))
    sp.vx -= (dx / d) * pull
    sp.vy -= (dy / d) * pull
  }

  // Heavy friction inside the gate — the spinner decelerates fast so it
  // settles without overshooting. 0.88 per tick ≈ halves speed every ~5
  // ticks, much stronger than the global stage friction (0.991).
  if (inside) {
    sp.vx *= 0.88
    sp.vy *= 0.88
  }

  if (inside && atRest) ctx.onGoal()
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  const r = m.w / 2

  // ── Art mode: draw the composed exit-gate sprite with a pulsing halo ──
  if (machineArtEnabled.value) {
    const img = getMachineImage(MACHINE_ART.exitGate)
    if (img) {
      ctx.save()
      ctx.translate(m.x, m.y)

      // Wide outer bloom — pulsing, far beyond the gate silhouette so the
      // exit point visibly pops off the stage background.
      const pulse = 0.65 + 0.35 * Math.sin(now * 0.005)
      const outerR = r * 2.1
      const outerGrad = ctx.createRadialGradient(0, 0, r * 0.6, 0, 0, outerR)
      outerGrad.addColorStop(0, `rgba(74,222,128,${0.6 * pulse})`)
      outerGrad.addColorStop(0.55, `rgba(34,197,94,${0.28 * pulse})`)
      outerGrad.addColorStop(1, 'rgba(34,197,94,0)')
      ctx.fillStyle = outerGrad
      ctx.beginPath()
      ctx.arc(0, 0, outerR, 0, Math.PI * 2)
      ctx.fill()

      // Tight inner halo hugging the gate's circumference.
      const innerGrad = ctx.createRadialGradient(0, 0, r * 0.45, 0, 0, r * 1.15)
      innerGrad.addColorStop(0, `rgba(187,247,208,${0.85 * pulse})`)
      innerGrad.addColorStop(0.6, `rgba(34,197,94,${0.6 * pulse})`)
      innerGrad.addColorStop(1, 'rgba(34,197,94,0)')
      ctx.fillStyle = innerGrad
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2)
      ctx.fill()

      // Draw the gate sprite with a matching canvas shadowBlur so the
      // whole silhouette itself glows (not just the backdrop).
      ctx.shadowColor = `rgba(74,222,128,${0.85 * pulse})`
      ctx.shadowBlur = 26 + Math.sin(now * 0.005) * 6
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      const size = m.w
      ctx.drawImage(img, -size / 2, -size / 2, size, size)
      ctx.restore()
      return
    }
  }

  ctx.save()
  ctx.translate(m.x, m.y)

  // Pulsing green aura — signals "stop here".
  const pulse = 0.6 + 0.4 * Math.sin(now * 0.005)
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  grad.addColorStop(0, `rgba(34,197,94,${pulse})`)
  grad.addColorStop(1, 'rgba(34,197,94,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()

  // Outer ring
  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2)
  ctx.stroke()

  // Rotating dashed "landing pad" ring
  ctx.save()
  ctx.rotate(now * 0.001)
  ctx.setLineDash([8, 6])
  ctx.strokeStyle = '#bbf7d0'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Central bullseye dot
  ctx.fillStyle = '#bbf7d0'
  ctx.beginPath()
  ctx.arc(0, 0, Math.max(3, r * 0.12), 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

const mod: MachineModule = {
  type: 'goal',
  label: 'Exit Gate',
  defaultSize: { w: 120, h: 120 },
  color: '#22c55e',
  tick,
  render
}
export default mod
