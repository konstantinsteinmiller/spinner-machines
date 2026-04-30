import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, plate, linked } from './_helpers'

// ── Stage 84: "Pressure Cooker" ───────────────────────────────────────
// Sixteen pressure plates — most of them are decoys. Only 4 actually
// unlock anything; the rest do nothing. The player has to figure out
// which plates matter from context (the walls they unlock are visible).
const W = 3000, H = 2200
const id = mkId()

const realKeys: [string, string, string, string] = ['realA', 'realB', 'realC', 'realD']

const stage: Stage = {
  id: 'stage84',
  name: 'Pressure Cooker',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 750, 1300],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // 4 walls blocking glass caches.
    ...realKeys.map((k, i) =>
      linked(
        {
          id: id(),
          type: 'wall',
          x: 1800 + (i % 2) * 400,
          y: 500 + Math.floor(i / 2) * 1100,
          w: 300,
          h: 30,
          rot: 0,
          meta: { material: 'stone' }
        },
        k
      )
    ),

    // Glass caches behind each wall.
    ...realKeys.flatMap((_, i) =>
      Array.from({ length: 6 }, (_, j) => ({
        id: id(), type: 'destroyableGlassTube' as const,
        x: 1680 + (i % 2) * 400 + j * 50,
        y: 580 + Math.floor(i / 2) * 1100,
        w: 40, h: 120, rot: 0
      }))
    ),

    // 4 real plates.
    plate(id, 600, 400, realKeys[0], 100, 70),
    plate(id, 900, 800, realKeys[1], 100, 70),
    plate(id, 600, 1400, realKeys[2], 100, 70),
    plate(id, 900, H - 400, realKeys[3], 100, 70),

    // 12 decoy plates (empty link key).
    ...Array.from({ length: 12 }, (_, i) => ({
      id: id(), type: 'pressurePlate' as const,
      x: 400 + (i % 4) * 200, y: 500 + Math.floor(i / 4) * 500,
      w: 90, h: 70, rot: 0, meta: { link: `decoy${i}` }
    })),

    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, W - 400, H / 2, 78, 'castle', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
