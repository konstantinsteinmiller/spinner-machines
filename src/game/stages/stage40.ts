import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal, grid } from './_helpers'

// ── Stage 40: "Master Key" ────────────────────────────────────────────
// One plate — one shared link — eighteen targets. Every cage wall,
// every generator guard, and every boss barrier in the stage is wired
// to the same plate. Hitting it is a one-shot arena reset: plates can
// be deceptively powerful when every destructible subscribes to the
// same bus.
const W = 2600, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage40',
  name: 'Master Key',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 380,
  bossModelId: 'dark',
  machines: [
    ...boundary(id, W, H),

    // Everything that can be plate-destroyed shares link 'mk'.
    // Boss cage (4 walls).
    linked(wall(id, 1700, 500, 500, 30, 'metal'), 'mk'),
    linked(wall(id, 1700, H - 500, 500, 30, 'metal'), 'mk'),
    linked(wall(id, 1450, H / 2, 30, 700, 'metal'), 'mk'),
    linked(wall(id, 1950, H / 2, 30, 700, 'metal'), 'mk'),

    // Two generator clusters behind their own metal grille.
    ...Array.from({ length: 4 }, (_, i) =>
      linked({
        id: id(), type: 'overloadedGenerator' as const,
        x: 500, y: 400 + i * 220, w: 80, h: 80, rot: 0
      }, 'mk')
    ),
    ...Array.from({ length: 4 }, (_, i) =>
      linked({
        id: id(), type: 'overloadedGenerator' as const,
        x: 900, y: 400 + i * 220, w: 80, h: 80, rot: 0
      }, 'mk')
    ),
    linked(wall(id, 700, 300, 500, 30, 'metal'), 'mk'),
    linked(wall(id, 700, H - 300, 500, 30, 'metal'), 'mk'),

    // Glass thicket wired too — on master-plate press it all shatters.
    ...grid(id, 'destroyableGlassTube', 1500, 300, 3, 5, 100, 160, 40, 120)
      .map((g) => {
        g.meta = { link: 'mk' }
        return g
      }),

    // Plate is right by the spawn, on the floor — deliberate quick grab
    // that triggers the mass-wipe.
    plate(id, 400, H - 200, 'mk', 120, 100),

    // Gravity well between spawn and plate gently guides the spinner.
    { id: id(), type: 'gravityWell', x: 300, y: H - 400, w: 80, h: 80, rot: 0 },

    boss(id, 1700, H / 2, 90, 'dark', 180),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
