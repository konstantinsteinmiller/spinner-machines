import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 48: "Fireworks" ─────────────────────────────────────────────
// Five isolated clusters of 5 generators each, spread across the arena.
// Clusters are internally chainable but too far apart to cross-chain, so
// the player has to ricochet between clusters to score everything.
const W = 2800, H = 2000
const id = mkId()

const cluster = (cx: number, cy: number) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = (i / 5) * Math.PI * 2
    return {
      id: id(), type: 'overloadedGenerator' as const,
      x: cx + Math.cos(a) * 110, y: cy + Math.sin(a) * 110,
      w: 80, h: 80, rot: 0
    }
  })

const stage: Stage = {
  id: 'stage48',
  name: 'Fireworks',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    ...cluster(700, 500),
    ...cluster(700, H - 500),
    ...cluster(W / 2, H / 2),
    ...cluster(W - 900, 500),
    ...cluster(W - 900, H - 500),

    // Bumper walls to keep spinner ricocheting between clusters.
    wall(id, W / 2, 200, 20, 200, 'wood'),
    wall(id, W / 2, H - 200, 20, 200, 'wood'),

    // Booster puts spinner on a diagonal trajectory through a cluster.
    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, W - 350, H / 2, 70, 'phoenix', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
