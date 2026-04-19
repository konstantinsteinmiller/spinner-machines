import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal, grid } from './_helpers'

// ── Stage 38: "Scatter Plates" ────────────────────────────────────────
// Four plates each clear a different region of glass tubes scattered
// across the stage — together a huge score-dense carpet. The boss
// arena is always reachable, so the plates are an optional detour but
// essentially required for 3 stars.
const W = 2800, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage38',
  name: 'Scatter Plates',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'piranha',
  machines: [
    ...boundary(id, W, H),

    // Four glass fields, each tied to a dedicated plate key.
    ...grid(id, 'destroyableGlassTube', 400, 200, 4, 3, 140, 140, 40, 120)
      .map((g) => {
        g.meta = { link: 'sA' }
        return g
      }),
    ...grid(id, 'destroyableGlassTube', W - 800, 200, 4, 3, 140, 140, 40, 120)
      .map((g) => {
        g.meta = { link: 'sB' }
        return g
      }),
    ...grid(id, 'destroyableGlassTube', 400, H - 600, 4, 3, 140, 140, 40, 120)
      .map((g) => {
        g.meta = { link: 'sC' }
        return g
      }),
    ...grid(id, 'destroyableGlassTube', W - 800, H - 600, 4, 3, 140, 140, 40, 120)
      .map((g) => {
        g.meta = { link: 'sD' }
        return g
      }),

    // Plates — each in the opposite quadrant from its glass field.
    plate(id, W - 300, H - 300, 'sA'),
    plate(id, 300, H - 300, 'sB'),
    plate(id, W - 300, 300, 'sC'),
    plate(id, 300, 300, 'sD'),

    // Central boss — reachable but surrounded by bounce walls.
    wall(id, W / 2, 600, 20, 240, 'stone'),
    wall(id, W / 2, H - 600, 20, 240, 'stone'),
    wall(id, W / 2 - 180, H / 2, 20, 240, 'stone'),
    wall(id, W / 2 + 180, H / 2, 20, 240, 'stone'),

    // Gravity well at centre pulls wandering spinners in.
    { id: id(), type: 'gravityWell', x: W / 2, y: H / 2, w: 100, h: 100, rot: 0 },

    boss(id, W / 2, H / 2, 85, 'piranha', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
