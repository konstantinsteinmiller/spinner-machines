import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 49: "Minefield" ─────────────────────────────────────────────
// Pseudo-random generator scatter. The pattern is deterministic (built
// from a seed formula) so every attempt sees the same layout — but the
// gaps between mines let a nimble spinner thread through without
// detonating any, rewarding cautious pathing over blast strategies.
const W = 2800, H = 2000
const id = mkId()

// Hand-tuned positions for a "scattered" feel. 20 generators, no two
// within blast radius of each other so no cascades.
const positions: [number, number][] = [
  [560, 380], [820, 260], [1100, 520], [1380, 340],
  [1680, 500], [1980, 300], [2260, 460], [640, 680],
  [960, 820], [1260, 660], [1540, 900], [1840, 700],
  [2140, 880], [2420, 720], [580, 1180], [900, 1320],
  [1200, 1100], [1500, 1380], [1820, 1200], [2120, 1380]
]

const stage: Stage = {
  id: 'stage49',
  name: 'Minefield',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    ...positions.map(([x, y]) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x, y, w: 80, h: 80, rot: 0
    })),

    // Three gravity wells pull the spinner toward a mine — scoring aid.
    { id: id(), type: 'gravityWell', x: 1100, y: 900, w: 90, h: 90, rot: 0 },
    { id: id(), type: 'gravityWell', x: 1800, y: 900, w: 90, h: 90, rot: 0 },
    { id: id(), type: 'gravityWell', x: 2300, y: 1100, w: 90, h: 90, rot: 0 },

    // Booster gives an initial heading.
    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, 2550, H - 300, 80, 'castle', 180),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
