import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 57: "Shard Scatter" ─────────────────────────────────────────
// Smaller glass tubes distributed evenly across the arena in a sparse
// grid. No clumps, no walls — just a lot of ground to cover. Rewards
// long bouncing runs where momentum is preserved.
const W = 2800, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage57',
  name: 'Shard Scatter',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // Staggered 8x6 grid of small glass tubes.
    ...Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        id: id(), type: 'destroyableGlassTube' as const,
        x: 500 + col * 260 + (row % 2 === 0 ? 0 : 130),
        y: 320 + row * 260,
        w: 40, h: 100, rot: row % 2 === 0 ? 0 : Math.PI / 2
      }))
    ).flat(),

    // Four boosters at arena cardinal points keep momentum up.
    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 110, h: 90, rot: 0 },
    { id: id(), type: 'centrifugalBooster', x: W / 2, y: 220, w: 110, h: 90, rot: Math.PI / 2 },
    { id: id(), type: 'centrifugalBooster', x: W / 2, y: H - 220, w: 110, h: 90, rot: -Math.PI / 2 },

    boss(id, W - 380, H / 2, 72, 'castle', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
