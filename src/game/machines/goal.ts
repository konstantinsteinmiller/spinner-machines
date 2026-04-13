import type { MachineModule, StageCtx } from './base'
import type { Machine } from '@/types/stage'

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  const d = Math.hypot(sp.x - m.x, sp.y - m.y)
  if (d < m.w / 2 + sp.r) ctx.onGoal()
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  const r = m.w / 2
  ctx.save()
  ctx.translate(m.x, m.y)
  const pulse = 0.6 + 0.4 * Math.sin(now * 0.005)
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r)
  grad.addColorStop(0, `rgba(34,197,94,${pulse})`)
  grad.addColorStop(1, 'rgba(34,197,94,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

const mod: MachineModule = {
  type: 'goal',
  label: 'Goal',
  defaultSize: { w: 90, h: 90 },
  color: '#22c55e',
  tick,
  render
}
export default mod
