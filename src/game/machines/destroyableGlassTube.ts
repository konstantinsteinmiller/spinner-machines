import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'

const SCORE = 40

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  m.destroyed = true
  ctx.destroyMachine(m)
  ctx.addScore(SCORE)
  // Slight slowdown to feel the crunch.
  sp.vx *= 0.92
  sp.vy *= 0.92
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, _now: number) => {
  drawRotRect(ctx, m, 'rgba(56,189,248,0.35)', '#38bdf8')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 1
  for (let i = -m.w / 2 + 6; i < m.w / 2; i += 12) {
    ctx.beginPath()
    ctx.moveTo(i, -m.h / 2 + 2)
    ctx.lineTo(i + 4, m.h / 2 - 2)
    ctx.stroke()
  }
  ctx.restore()
}

const mod: MachineModule = {
  type: 'destroyableGlassTube',
  label: 'Glass Tube',
  defaultSize: { w: 100, h: 40 },
  color: '#38bdf8',
  tick,
  render
}
export default mod
