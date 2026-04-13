import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'

const SCORE = 100
const CHAIN_SCORE = 50
const BLAST_RADIUS = 160

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  // Bounce spinner away a bit from blast.
  const dx = sp.x - m.x
  const dy = sp.y - m.y
  const d = Math.hypot(dx, dy) || 1
  sp.vx += (dx / d) * 10
  sp.vy += (dy / d) * 10
  explode(m, ctx, SCORE)
}

const explode = (m: Machine, ctx: StageCtx, score: number) => {
  if (m.destroyed) return
  m.destroyed = true
  ctx.destroyMachine(m)
  ctx.addScore(score)
  // Chain reaction: destroy neighbors in blast radius.
  for (const other of ctx.machines) {
    if (other === m || other.destroyed) continue
    const dd = Math.hypot(other.x - m.x, other.y - m.y)
    if (dd < BLAST_RADIUS) {
      if (other.type === 'overloadedGenerator') {
        explode(other, ctx, CHAIN_SCORE)
      } else if (other.type === 'destroyableGlassTube' || other.type === 'wall') {
        other.destroyed = true
        ctx.destroyMachine(other)
        ctx.addScore(CHAIN_SCORE)
      }
    }
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  const pulse = 0.6 + 0.4 * Math.sin(now * 0.008)
  drawRotRect(ctx, m, '#450a0a', '#f97316')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.fillStyle = `rgba(249,115,22,${pulse})`
  ctx.beginPath()
  ctx.arc(0, 0, Math.min(m.w, m.h) / 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

const mod: MachineModule = {
  type: 'overloadedGenerator',
  label: 'Overloaded Generator',
  defaultSize: { w: 80, h: 80 },
  color: '#f97316',
  tick,
  render
}
export default mod
