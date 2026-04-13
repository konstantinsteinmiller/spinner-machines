import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'

const SCORE = 15

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  if (m.triggered) return
  m.triggered = true
  ctx.addScore(SCORE)
  // Activates linked machines: destroys any wall with the same meta.link
  const link = m.meta?.link
  if (link) {
    for (const other of ctx.machines) {
      if (other.meta?.link === link && other !== m && other.type === 'wall') {
        other.destroyed = true
      }
    }
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, _now: number) => {
  drawRotRect(ctx, m, m.triggered ? '#065f46' : '#78350f', '#fbbf24')
}

const mod: MachineModule = {
  type: 'pressurePlate',
  label: 'Pressure Plate',
  defaultSize: { w: 80, h: 20 },
  color: '#fbbf24',
  tick,
  render
}
export default mod
