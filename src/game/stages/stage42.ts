import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, grid } from './_helpers'

// ── Stage 42: "Chain Reaction" ────────────────────────────────────────
// A dense 5×5 generator grid. Triggering a corner generator detonates
// a diagonal slice; triggering the center lights the entire grid at
// once. Finding a center-shot lane is the skill test.
const W = 2400, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage42',
  name: 'Chain Reaction',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 50,
  bossKillBonus: 300,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // 5×5 tightly packed generator grid. Spacing 140 << blast radius.
    ...grid(id, 'overloadedGenerator', 700, 500, 5, 5, 140, 140, 80, 80),

    // Gravity well above & below the grid — pulls the spinner into it.
    { id: id(), type: 'gravityWell', x: W / 2, y: 280, w: 100, h: 100, rot: 0 },
    { id: id(), type: 'gravityWell', x: W / 2, y: H - 280, w: 100, h: 100, rot: 0 },

    // Entry corridor with a booster aimed into the grid center.
    wall(id, 400, 400, 400, 20, 'stone'),
    wall(id, 400, H - 400, 400, 20, 'stone'),
    { id: id(), type: 'centrifugalBooster', x: 480, y: H / 2, w: 120, h: 100, rot: 0 },

    // Bounce walls in the far corners keep the spinner alive after the blast.
    wall(id, W - 300, 300, 300, 20, 'wood'),
    wall(id, W - 300, H - 300, 300, 20, 'wood'),

    boss(id, W - 400, H / 2, 70, 'demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
