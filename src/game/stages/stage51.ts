import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, grid } from './_helpers'

// ── Stage 51: "Shatter Zone" ──────────────────────────────────────────
// A wall of glass 5 rows tall × 8 cols wide bars the path to the boss.
// Every glass tube is +40 score, so the full wall is worth 1600 on its
// own — trivially a 3-star if the spinner can plough through enough of
// it before settling.
const W = 2800, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage51',
  name: 'Shatter Zone',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1300],
  launchPenalty: 60,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // 8×5 glass wall.
    ...grid(id, 'destroyableGlassTube', 1100, 500, 8, 5, 90, 180, 40, 120),

    // Launcher aimed straight into the wall for max shatter yield.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    // Booster backup near spawn.
    { id: id(), type: 'centrifugalBooster', x: 340, y: 400, w: 120, h: 100, rot: 0 },
    { id: id(), type: 'centrifugalBooster', x: 340, y: H - 400, w: 120, h: 100, rot: 0 },

    boss(id, W - 380, H / 2, 65, 'fire', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
