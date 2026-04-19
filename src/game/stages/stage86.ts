import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 86: "Cross Fire" ────────────────────────────────────────────
// Two generator corridors cross in the middle, with glass tubes at the
// intersection. Hit the intersection and all 4 corridors chain at once.
const W = 2800, H = 2200
const id = mkId()

const stage: Stage = {
  id: 'stage86',
  name: 'Cross Fire',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 900, 1500],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // Horizontal generator line.
    ...Array.from({ length: 12 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 160, y: H / 2, w: 80, h: 80, rot: 0
    })),

    // Vertical generator line.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: W / 2, y: 300 + i * 160, w: 80, h: 80, rot: 0
    })),

    // Glass tubes at the 4 quadrants.
    ...Array.from({ length: 16 }, (_, i) => {
      const row = Math.floor(i / 4)
      const col = i % 4
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: 700 + col * 400 + (row < 2 ? 0 : 600),
        y: 400 + row * 400,
        w: 40, h: 120, rot: 0
      }
    }),

    // Guide walls between corridors.
    wall(id, 600, 500, 20, 300, 'wood'),
    wall(id, W - 600, H - 500, 20, 300, 'wood'),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 75, 'fire', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
