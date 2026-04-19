import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 43: "Generator Garden" ──────────────────────────────────────
// Sparse generator pattern at classic chain-range intervals — they
// don't auto-chain (spacing > blast radius) so each has to be hit
// individually. Rewards methodical clearing runs over explosive-swing
// strategies.
const W = 2600, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage43',
  name: 'Generator Garden',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // 12 generators scattered outside blast radius — each worth the
    // full 100 direct-hit score, no chains.
    { id: id(), type: 'overloadedGenerator', x: 500, y: 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 800, y: 260, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1100, y: 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1400, y: 260, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1700, y: 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 2000, y: 260, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 500, y: H - 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 800, y: H - 260, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1100, y: H - 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1400, y: H - 260, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1700, y: H - 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 2000, y: H - 260, w: 80, h: 80, rot: 0 },

    // Two gravity wells pull the spinner deeper as it bounces around.
    { id: id(), type: 'gravityWell', x: 1100, y: H / 2, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'gravityWell', x: 1900, y: H / 2, w: 80, h: 80, rot: 0 },

    // Booster near spawn kicks off the garden run.
    { id: id(), type: 'centrifugalBooster', x: 380, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, 2400, H / 2, 70, 'castle', 180),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
