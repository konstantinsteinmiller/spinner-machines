import type { Machine } from '@/types/stage'

// Shared authoring helpers for stage*.ts files. The leading underscore
// keeps this out of the `./stage*.ts` glob in stages/index.ts, so only
// the real stage modules get registered as loadable stages.

/**
 * Creates a fresh id-factory per stage. Call `const id = mkId()` at the
 * top of a stage module, then use `id()` wherever you need a unique
 * machine id. Each stage gets its own counter so ids don't bleed across
 * files and machine arrays stay readable.
 */
export const mkId = () => {
  let n = 0
  return () => ++n
}

export type IdFn = () => number

export const wall = (
  id: IdFn, x: number, y: number, w: number, h: number,
  material: 'wood' | 'stone' | 'metal' = 'wood', rot = 0
): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot, meta: { material }
})

export const m = (
  id: IdFn, type: Machine['type'],
  x: number, y: number, w: number, h: number, rot = 0
): Machine => ({ id: id(), type, x, y, w, h, rot })

/** Four outer stage walls. Every stage should start with these. */
export const boundary = (id: IdFn, width: number, height: number): Machine[] => [
  wall(id, width / 2, 20, width, 40, 'stone'),
  wall(id, width / 2, height - 20, width, 40, 'stone'),
  wall(id, 20, height / 2, 40, height, 'stone'),
  wall(id, width - 20, height / 2, 40, height, 'stone')
]

/** Rectangle of walls around (cx,cy) with given half-width/height and a gap on one side. */
export const box = (
  id: IdFn, cx: number, cy: number, hw: number, hh: number,
  gap: 'top' | 'bottom' | 'left' | 'right' | 'none' = 'none',
  material: 'wood' | 'stone' | 'metal' = 'metal', thick = 20
): Machine[] => {
  const out: Machine[] = []
  if (gap !== 'top') out.push(wall(id, cx, cy - hh, hw * 2, thick, material))
  if (gap !== 'bottom') out.push(wall(id, cx, cy + hh, hw * 2, thick, material))
  if (gap !== 'left') out.push(wall(id, cx - hw, cy, thick, hh * 2, material))
  if (gap !== 'right') out.push(wall(id, cx + hw, cy, thick, hh * 2, material))
  return out
}

/** Link helper — stamps {link: key} into a machine's meta for gear/plate wiring. */
export const linked = (mm: Machine, key: string): Machine => {
  mm.meta = { ...(mm.meta ?? {}), link: key }
  return mm
}

/** Short boss with sane defaults so stages read cleanly. */
export const boss = (
  id: IdFn, x: number, y: number, hp: number, modelId: string, size = 160
): Machine => ({
  id: id(), type: 'boss', x, y, w: size, h: size, rot: 0, hp, maxHp: hp, modelId
})

export const goal = (id: IdFn, x: number, y: number, size = 120): Machine => ({
  id: id(), type: 'goal', x, y, w: size, h: size, rot: 0
})

/** Gear system that has HP (destroyable) and can drive a link. */
export const gear = (
  id: IdFn, x: number, y: number, link?: string, hp = 80, size = 100
): Machine => {
  const g: Machine = {
    id: id(), type: 'gearSystem', x, y, w: size, h: size, rot: 0, hp, maxHp: hp
  }
  if (link) g.meta = { link }
  return g
}

export const plate = (
  id: IdFn, x: number, y: number, link: string, w = 80, h = 60
): Machine => ({
  id: id(), type: 'pressurePlate', x, y, w, h, rot: 0, meta: { link }
})

/** Grid of identical machines — great for glass thickets and generator fields. */
export const grid = (
  id: IdFn, type: Machine['type'],
  x0: number, y0: number, cols: number, rows: number,
  stepX: number, stepY: number, w: number, h: number
): Machine[] => {
  const out: Machine[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push(m(id, type, x0 + c * stepX, y0 + r * stepY, w, h))
    }
  }
  return out
}
