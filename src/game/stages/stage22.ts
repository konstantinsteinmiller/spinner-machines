import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, plate, boss, goal, grid } from './_helpers'

// ── Stage 22: "Twin Gearworks" ────────────────────────────────────────
// Two independent gear groups gate the top and bottom half of the
// corridor. The spinner has to bounce to both gears to collapse both
// gates; skipping one leaves its gate standing and blocks the boss.
// Pressure plates in each half provide a secondary score-path that
// shatters a glass curtain for extra points.
const W = 2400, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage22',
  name: 'Twin Gearworks',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 50,
  bossKillBonus: 300,
  bossModelId: 'tornado',
  machines: [
    ...boundary(id, W, H),

    // Mid wall splits the stage into two lanes up to the gear chokes.
    wall(id, 1200, H / 2, 20, 800, 'stone'),

    // Top-lane gate (long wall) — rotates on gear A.
    linked(wall(id, 1500, 400, 20, 500, 'metal'), 'gA'),
    gear(id, 900, 350, 'gA'),

    // Bottom-lane gate + gear B.
    linked(wall(id, 1500, H - 400, 20, 500, 'metal'), 'gB'),
    gear(id, 900, H - 350, 'gB'),

    // Glass curtain rewards — plate-shattered extra loot.
    ...grid(id, 'destroyableGlassTube', 500, 220, 5, 1, 80, 0, 40, 120).map((g) => {
      g.meta = { link: 'pTop' }
      return g
    }),
    ...grid(id, 'destroyableGlassTube', 500, H - 340, 5, 1, 80, 0, 40, 120).map((g) => {
      g.meta = { link: 'pBot' }
      return g
    }),
    plate(id, 700, H / 2 - 80, 'pTop'),
    plate(id, 700, H / 2 + 80, 'pBot'),

    // Booster pair spins the spinner toward both halves.
    { id: id(), type: 'centrifugalBooster', x: 400, y: 400, w: 120, h: 100, rot: 0 },
    { id: id(), type: 'centrifugalBooster', x: 400, y: H - 400, w: 120, h: 100, rot: 0 },

    boss(id, 1900, H / 2, 60, 'tornado', 180),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
