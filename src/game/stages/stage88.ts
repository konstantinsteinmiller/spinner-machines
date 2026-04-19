import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 88: "Chainlock" ─────────────────────────────────────────────
// A chained lock puzzle: destroying gear-A reveals gear-B, destroying
// gear-B reveals gear-C, etc. The spinner has to work inward through
// four layers of metal walls, each unlocked by the previous gear.
const W = 2600, H = 2200
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage88',
  name: 'Chainlock',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // Outer gear (reachable from spawn).
    gear(id, 500, cy, 'gateA', 70, 100),

    // Wall A — gated by gateA, behind it is gear B.
    linked(
      { id: id(), type: 'wall', x: 900, y: cy, w: 40, h: 1000, rot: 0, meta: { material: 'metal' } },
      'gateA'
    ),
    gear(id, 1100, cy, 'gateB', 70, 100),

    // Wall B — gated by gateB, behind it is gear C.
    linked(
      { id: id(), type: 'wall', x: 1400, y: cy, w: 40, h: 1000, rot: 0, meta: { material: 'metal' } },
      'gateB'
    ),
    gear(id, 1600, cy, 'gateC', 70, 100),

    // Wall C — gated by gateC, behind it is gear D.
    linked(
      { id: id(), type: 'wall', x: 1900, y: cy, w: 40, h: 1000, rot: 0, meta: { material: 'metal' } },
      'gateC'
    ),
    gear(id, 2100, cy, 'gateD', 70, 100),

    // Wall D — gated by gateD, behind it is the boss.
    linked(
      { id: id(), type: 'wall', x: 2300, y: cy, w: 40, h: 1000, rot: 0, meta: { material: 'metal' } },
      'gateD'
    ),

    // Glass tubes on each tier (bonus score between gears).
    ...Array.from({ length: 4 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 500, y: cy - 300, w: 40, h: 140, rot: 0
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 500, y: cy + 300, w: 40, h: 140, rot: 0
    })),

    { id: id(), type: 'centrifugalBooster', x: 340, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, 2500, cy, 80, 'castle', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
