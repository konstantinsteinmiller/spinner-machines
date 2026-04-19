import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 66: "Rail Network Plus" ─────────────────────────────────────
// Dense criss-crossing rail grid — like a subway map. Every intersection
// has a generator as a node; lighting a generator lights its linked
// rails' glass barriers in a chain fashion through the network.
const W = 3000, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage66',
  name: 'Rail Network Plus',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 750, 1300],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Horizontal rails at 3 y-levels.
    { id: id(), type: 'magneticRail', x: W / 2, y: 500, w: 2200, h: 30, rot: 0 },
    { id: id(), type: 'magneticRail', x: W / 2, y: H / 2, w: 2200, h: 30, rot: 0 },
    { id: id(), type: 'magneticRail', x: W / 2, y: H - 500, w: 2200, h: 30, rot: 0 },

    // Vertical rails at 3 x-levels.
    { id: id(), type: 'magneticRail', x: 800, y: H / 2, w: 30, h: 1200, rot: 0 },
    { id: id(), type: 'magneticRail', x: W / 2, y: H / 2, w: 30, h: 1200, rot: 0 },
    { id: id(), type: 'magneticRail', x: W - 800, y: H / 2, w: 30, h: 1200, rot: 0 },

    // Generators at 9 intersection nodes.
    ...[[800, 500], [W / 2, 500], [W - 800, 500],
      [800, H / 2], [W / 2, H / 2], [W - 800, H / 2],
      [800, H - 500], [W / 2, H - 500], [W - 800, H - 500]].map(([x, y]) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x, y, w: 80, h: 80, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 75, 'wolf-demon', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
