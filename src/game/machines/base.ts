import type { Machine, Spinner } from '@/types/stage'

export interface StageCtx {
  now: number
  dt: number
  addScore: (n: number) => void
  destroyMachine: (m: Machine) => void
  machines: Machine[]
  spinner: Spinner
  onBossDead: () => void
  onGoal: () => void
}

export interface MachineModule {
  type: string
  label: string
  defaultSize: { w: number; h: number }
  color: string
  /** Interaction tick — called each physics step while the machine exists. */
  tick: (m: Machine, ctx: StageCtx) => void
  /** Placeholder render. */
  render: (ctx: CanvasRenderingContext2D, m: Machine, now: number) => void
}

// ─── Geometry helpers ──────────────────────────────────────────────────────

export const aabbContainsPoint = (m: Machine, x: number, y: number): boolean => {
  // rotated AABB check
  const cx = m.x
  const cy = m.y
  const c = Math.cos(-m.rot)
  const s = Math.sin(-m.rot)
  const lx = (x - cx) * c - (y - cy) * s
  const ly = (x - cx) * s + (y - cy) * c
  return Math.abs(lx) <= m.w / 2 && Math.abs(ly) <= m.h / 2
}

export const circleAabbOverlap = (m: Machine, px: number, py: number, pr: number): boolean => {
  const c = Math.cos(-m.rot)
  const s = Math.sin(-m.rot)
  const lx = (px - m.x) * c - (py - m.y) * s
  const ly = (px - m.x) * s + (py - m.y) * c
  const qx = Math.max(-m.w / 2, Math.min(m.w / 2, lx))
  const qy = Math.max(-m.h / 2, Math.min(m.h / 2, ly))
  const dx = lx - qx
  const dy = ly - qy
  return dx * dx + dy * dy <= pr * pr
}

export const drawRotRect = (
  ctx: CanvasRenderingContext2D,
  m: Machine,
  fill: string,
  stroke: string
) => {
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 3
  ctx.fillRect(-m.w / 2, -m.h / 2, m.w, m.h)
  ctx.strokeRect(-m.w / 2, -m.h / 2, m.w, m.h)
  ctx.restore()
}
