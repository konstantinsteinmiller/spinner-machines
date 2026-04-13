import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'

const PUSH = 0.35
const MIN_RETURN_SPEED = 3

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  const dirX = Math.cos(m.rot)
  const dirY = Math.sin(m.rot)
  const speed = Math.hypot(sp.vx, sp.vy)
  if (speed < MIN_RETURN_SPEED) {
    sp.vx = dirX * MIN_RETURN_SPEED
    sp.vy = dirY * MIN_RETURN_SPEED
  } else {
    sp.vx += dirX * PUSH
    sp.vy += dirY * PUSH
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  drawRotRect(ctx, m, '#334155', '#94a3b8')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  const offset = (now * 0.05) % 20
  for (let x = -m.w / 2 + offset; x < m.w / 2; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, -m.h / 2 + 4)
    ctx.lineTo(x + 8, m.h / 2 - 4)
    ctx.stroke()
  }
  ctx.restore()
}

const mod: MachineModule = {
  type: 'conveyorBelt',
  label: 'Conveyor Belt',
  defaultSize: { w: 180, h: 50 },
  color: '#94a3b8',
  tick,
  render
}
export default mod
