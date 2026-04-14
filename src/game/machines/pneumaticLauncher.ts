import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'

const LAUNCH_SPEED = 22

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) {
    m.triggered = false
    return
  }
  if (m.triggered) return
  m.triggered = true
  const dirX = Math.cos(m.rot)
  const dirY = Math.sin(m.rot)
  sp.vx = dirX * LAUNCH_SPEED
  sp.vy = dirY * LAUNCH_SPEED
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  drawRotRect(ctx, m, '#14532d', '#22c55e')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  const w = m.w / 2
  const h = m.h / 2
  ctx.moveTo(w, 0)
  ctx.lineTo(w - 18, -h + 6)
  ctx.lineTo(w - 18, h - 6)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

const mod: MachineModule = {
  type: 'pneumaticLauncher',
  label: 'Pneumatic Launcher',
  defaultSize: { w: 90, h: 60 },
  color: '#22c55e',
  tick,
  render
}
export default mod
