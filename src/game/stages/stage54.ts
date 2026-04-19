import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 54: "Mirror Hall" ───────────────────────────────────────────
// Three parallel horizontal glass curtains stretch across the arena,
// offset vertically. The spinner has to zig-zag through them, each
// curtain shattering as a distinct cascade of score.
const W = 2800, H = 1600
const id = mkId()

const curtain = (y: number) =>
  Array.from({ length: 16 }, (_, i) => ({
    id: id(), type: 'destroyableGlassTube' as const,
    x: 500 + i * 130, y, w: 40, h: 140, rot: 0
  }))

const stage: Stage = {
  id: 'stage54',
  name: 'Mirror Hall',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    ...curtain(400),
    ...curtain(H / 2),
    ...curtain(H - 400),

    // Vertical guide walls force the spinner across curtains.
    wall(id, 1100, 280, 20, 240, 'wood'),
    wall(id, 1800, H - 280, 20, 240, 'wood'),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 380, H / 2, 70, 'phoenix', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
