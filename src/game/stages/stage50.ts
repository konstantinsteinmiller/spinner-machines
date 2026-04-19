import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, linked, plate } from './_helpers'

// ── Stage 50: "Critical Mass" ─────────────────────────────────────────
// Chapter-C capstone. The boss sits behind a solid metal wall that can
// only be destroyed by the chain reaction from a 6×3 generator wall
// just in front of it. A pressure plate in the spawn lane arms the
// generator bank — step on it and any hit cascades the entire wall.
const W = 3000, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage50',
  name: 'Critical Mass',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Metal wall (linked to 'bossGate') — plate-destroyable.
    linked(
      { id: id(), type: 'wall', x: W - 500, y: H / 2, w: 40, h: 700, rot: 0, meta: { material: 'metal' } },
      'bossGate'
    ),

    // Generator wall — 6 wide × 3 high, all chain-linked.
    ...Array.from({ length: 3 }, (_, row) =>
      Array.from({ length: 6 }, (_, col) => ({
        id: id(), type: 'overloadedGenerator' as const,
        x: 1600 + col * 140, y: H / 2 - 280 + row * 280, w: 80, h: 80, rot: 0
      }))
    ).flat(),

    // Plate that opens the wall — sits in the approach corridor.
    plate(id, 900, H / 2, 'bossGate', 120, 80),

    // Guide walls between plate and generator wall.
    wall(id, 1200, 600, 20, 400, 'stone'),
    wall(id, 1200, H - 600, 20, 400, 'stone'),

    // Spawn booster to get some momentum.
    { id: id(), type: 'centrifugalBooster', x: 380, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, W - 400, H / 2, 85, 'wolf-demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
