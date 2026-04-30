import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, linked, plate } from './_helpers'

// ── Stage 74: "Black Hole" ────────────────────────────────────────────
// The central gravity well is initially fenced behind a metal cage.
// Plates at the four cardinal points, each linked to one cage wall —
// step on all four and the cage crumbles, unleashing the well's full
// pull on the arena.
const W = 2600, H = 2200
const id = mkId()
const cx = W / 2, cy = H / 2

const cageThick = 30
const cageR = 180
const cageKeys: [string, string, string, string] = ['cageN', 'cageE', 'cageS', 'cageW']

const stage: Stage = {
  id: 'stage74',
  name: 'Black Hole',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // The well itself.
    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 160, h: 160, rot: 0 },

    // Cage: 4 metal walls.
    linked({
      id: id(),
      type: 'wall',
      x: cx,
      y: cy - cageR,
      w: cageR * 2,
      h: cageThick,
      rot: 0,
      meta: { material: 'metal' }
    }, cageKeys[0]),
    linked({
      id: id(),
      type: 'wall',
      x: cx + cageR,
      y: cy,
      w: cageThick,
      h: cageR * 2,
      rot: 0,
      meta: { material: 'metal' }
    }, cageKeys[1]),
    linked({
      id: id(),
      type: 'wall',
      x: cx,
      y: cy + cageR,
      w: cageR * 2,
      h: cageThick,
      rot: 0,
      meta: { material: 'metal' }
    }, cageKeys[2]),
    linked({
      id: id(),
      type: 'wall',
      x: cx - cageR,
      y: cy,
      w: cageThick,
      h: cageR * 2,
      rot: 0,
      meta: { material: 'metal' }
    }, cageKeys[3]),

    // 4 plates, one per cage wall, placed at the arena perimeter.
    plate(id, cx, 280, cageKeys[0], 140, 70),
    plate(id, W - 280, cy, cageKeys[1], 70, 140),
    plate(id, cx, H - 280, cageKeys[2], 140, 70),
    plate(id, 280, cy, cageKeys[3], 70, 140),

    // Glass tubes scattered near the outer ring.
    ...Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 750, y: cy + Math.sin(a) * 750,
        w: 40, h: 120, rot: a
      }
    }),

    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, cx, cy, 75, 'demon', 130),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
