import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal, grid } from './_helpers'

// ── Stage 28: "Mirrored Gears" ────────────────────────────────────────
// Horizontal split with two perfectly symmetric halves. Each half has
// its own gear-chain (3 gears) controlling a matched trio of walls.
// Both gear-chains must be completed for the spinner to reach the boss
// parked at the seam. A perfect 3-star run requires working both halves
// — the asymmetry cost of forgetting one side is a lot of score missed.
const W = 3000, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage28',
  name: 'Mirrored Gears',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'salamaner',
  machines: [
    ...boundary(id, W, H),

    // Mid-seam wall except for a center opening that the symmetric
    // gates sit either side of.
    wall(id, 600, H / 2, 400, 24, 'stone'),
    wall(id, W - 600, H / 2, 400, 24, 'stone'),

    // Top half: three gears control three rotating wall segments.
    linked(wall(id, 900, 300, 20, 200, 'metal'), 't1'),
    linked(wall(id, 1500, 300, 20, 200, 'metal'), 't2'),
    linked(wall(id, 2100, 300, 20, 200, 'metal'), 't3'),
    gear(id, 900, 120, 't1'),
    gear(id, 1500, 120, 't2'),
    gear(id, 2100, 120, 't3'),

    // Bottom half: symmetric mirror.
    linked(wall(id, 900, H - 300, 20, 200, 'metal'), 'b1'),
    linked(wall(id, 1500, H - 300, 20, 200, 'metal'), 'b2'),
    linked(wall(id, 2100, H - 300, 20, 200, 'metal'), 'b3'),
    gear(id, 900, H - 120, 'b1'),
    gear(id, 1500, H - 120, 'b2'),
    gear(id, 2100, H - 120, 'b3'),

    // Score fodder — glass double-rows between the gated walls.
    ...grid(id, 'destroyableGlassTube', 1000, 420, 6, 1, 140, 0, 40, 120),
    ...grid(id, 'destroyableGlassTube', 1000, H - 540, 6, 1, 140, 0, 40, 120),

    // Center gate — opens only if every gear has been hit once.
    linked(wall(id, 1500, H / 2, 24, 300, 'metal'), 'tC'),
    gear(id, W / 2, H / 2, 'tC'),

    boss(id, 2500, H / 2, 70, 'salamaner', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
