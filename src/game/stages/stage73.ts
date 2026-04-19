import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 73: "Multi-Well" ────────────────────────────────────────────
// A 3×3 grid of gravity wells creates a chaotic attractor field. Each
// well nudges the spinner toward its neighbors. Glass tubes in the
// pockets between wells get picked off as the spinner oscillates.
const W = 2400, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage73',
  name: 'Multi-Well',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // 3×3 gravity well grid.
    ...Array.from({ length: 3 }, (_, r) =>
      Array.from({ length: 3 }, (_, c) => ({
        id: id(), type: 'gravityWell' as const,
        x: 700 + c * 500, y: 400 + r * 500, w: 90, h: 90, rot: 0
      }))
    ).flat(),

    // Glass tubes in the pockets (between wells).
    ...Array.from({ length: 2 }, (_, r) =>
      Array.from({ length: 2 }, (_, c) => [
        {
          id: id(), type: 'destroyableGlassTube' as const,
          x: 950 + c * 500, y: 650 + r * 500, w: 40, h: 120, rot: 0
        },
        {
          id: id(), type: 'destroyableGlassTube' as const,
          x: 950 + c * 500, y: 650 + r * 500 - 80, w: 120, h: 40, rot: 0
        }
      ]).flat()
    ).flat(),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 68, 'phoenix', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
