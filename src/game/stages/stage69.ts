import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 69: "Rail Boss Approach" ────────────────────────────────────
// A rising series of rails forms a sloped corridor into the boss pit.
// Hit a rail, get carried upward, transfer to next rail with a booster
// push. The path itself is the puzzle — miss the transfer and fall into
// a lower pit of generators.
const W = 3000, H = 2200
const id = mkId()

const stage: Stage = {
  id: 'stage69',
  name: 'Rail Boss Approach',
  width: W, height: H,
  spawn: { x: 200, y: H - 200 },
  goal: { x: W - 220, y: 300 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Rising rails.
    { id: id(), type: 'magneticRail', x: 700, y: H - 400, w: 900, h: 30, rot: -Math.PI / 8 },
    { id: id(), type: 'magneticRail', x: 1500, y: H - 900, w: 900, h: 30, rot: -Math.PI / 8 },
    { id: id(), type: 'magneticRail', x: 2300, y: H - 1400, w: 900, h: 30, rot: -Math.PI / 8 },

    // Boosters at rail transitions.
    { id: id(), type: 'centrifugalBooster', x: 1100, y: H - 600, w: 110, h: 90, rot: -Math.PI / 4 },
    { id: id(), type: 'centrifugalBooster', x: 1900, y: H - 1100, w: 110, h: 90, rot: -Math.PI / 4 },

    // Lower pit of generators — fall and they cascade for bonus.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 700 + i * 200, y: H - 120, w: 80, h: 80, rot: 0
    })),

    boss(id, W - 500, 400, 75, 'demon', 150),
    goal(id, W - 220, 300)
  ]
}

export default stage
