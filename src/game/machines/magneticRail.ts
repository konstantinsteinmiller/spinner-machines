import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'

const RAIL_SPEED = 16

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  const inside = circleAabbOverlap(m, sp.x, sp.y, sp.r)
  if (!inside) {
    if (sp.railId === m.id) sp.railId = null
    m.triggered = false
    return
  }
  // Lock the spinner along the rail direction.
  const dirX = Math.cos(m.rot)
  const dirY = Math.sin(m.rot)
  sp.vx = dirX * RAIL_SPEED
  sp.vy = dirY * RAIL_SPEED
  // Snap to rail centerline (project onto axis perp).
  const relX = sp.x - m.x
  const relY = sp.y - m.y
  const t = relX * dirX + relY * dirY
  sp.x = m.x + dirX * t
  sp.y = m.y + dirY * t
  if (!m.triggered) {
    m.triggered = true
    sp.railId = m.id
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  drawRotRect(ctx, m, '#0f172a', '#60a5fa')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  // Rail stripes
  ctx.strokeStyle = '#60a5fa'
  ctx.lineWidth = 2
  for (let i = -m.w / 2 + 10; i < m.w / 2; i += 15) {
    const shift = ((now * 0.3 + i) % m.w) - m.w / 2
    ctx.beginPath()
    ctx.moveTo(shift, -m.h / 2 + 4)
    ctx.lineTo(shift + 10, m.h / 2 - 4)
    ctx.stroke()
  }
  ctx.restore()
}

const mod: MachineModule = {
  type: 'magneticRail',
  label: 'Magnetic Rail',
  defaultSize: { w: 240, h: 50 },
  color: '#60a5fa',
  tick,
  render
}
export default mod
