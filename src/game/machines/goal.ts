import type { MachineModule, StageCtx } from './base'
import type { Machine } from '@/types/stage'

// Speed under which the spinner counts as "at rest" on the exit gate.
// Matches STOP_SPEED in useStageGame so the transition feels consistent.
const REST_SPEED = 0.35

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  const r = m.w / 2
  const d = Math.hypot(sp.x - m.x, sp.y - m.y)
  const inside = d < r + sp.r
  const atRest = Math.hypot(sp.vx, sp.vy) < REST_SPEED
  if (inside && atRest) ctx.onGoal()
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  const r = m.w / 2
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
