import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal, box, grid } from './_helpers'

// ── Stage 25: "Gear Vault" ────────────────────────────────────────────
// A central treasury packed with generators, sealed on all four sides.
// Four gears — one per face — each rotate that face's wall open. You
// only need ONE face open to reach the treasure, but hitting every
// gear guarantees a 3-star run because each open face exposes more
// generators to chain.
const W = 2200, H = 2200
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage25',
  name: 'Gear Vault',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 300,
  bossModelId: 'diamond',
  machines: [
    ...boundary(id, W, H),

    // Vault walls (linked to the matching gear so they can rotate out).
    linked(wall(id, cx, cy - 300, 400, 24, 'metal'), 'vN'),
    linked(wall(id, cx, cy + 300, 400, 24, 'metal'), 'vS'),
    linked(wall(id, cx - 300, cy, 24, 400, 'metal'), 'vW'),
    linked(wall(id, cx + 300, cy, 24, 400, 'metal'), 'vE'),

    // Four gears — one on each outer side, leading to its face.
    gear(id, cx, 300, 'vN'),
    gear(id, cx, H - 300, 'vS'),
    gear(id, 300, cy, 'vW'),
    gear(id, W - 300, cy, 'vE'),

    // Generator grid inside the vault — packed tight for chain pops.
    ...grid(id, 'overloadedGenerator', cx - 180, cy - 180, 4, 4, 120, 120, 80, 80),

    // Pinball-style glass bumpers in each corner for side-score.
    ...box(id, 400, 400, 120, 120, 'none', 'wood'),
    ...box(id, W - 400, 400, 120, 120, 'none', 'wood'),
    ...box(id, 400, H - 400, 120, 120, 'none', 'wood'),
    ...box(id, W - 400, H - 400, 120, 120, 'none', 'wood'),

    // Gravity wells keep the spinner orbiting the vault.
    { id: id(), type: 'gravityWell', x: 700, y: 700, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 700, y: H - 700, w: 80, h: 80, rot: 0 },

    boss(id, cx, cy, 80, 'diamond', 180),
    goal(id, W - 220, cy)
  ]
}

export default stage
