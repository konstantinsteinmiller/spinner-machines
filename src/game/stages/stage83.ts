import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 83: "Rail & Ruin" ───────────────────────────────────────────
// Long rail corridor flanked by generator batteries. The rail is the
// fast route; stepping off pulls the spinner into generator blast
// range, which is ideal for score but slow to escape.
const W = 3200, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage83',
  name: 'Rail & Ruin',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Central rail through the whole arena.
    { id: id(), type: 'magneticRail', x: W / 2, y: H / 2, w: 2600, h: 30, rot: 0 },

    // Generator battery above and below.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 240, y: 400, w: 80, h: 80, rot: 0
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 240, y: H - 400, w: 80, h: 80, rot: 0
    })),

    // Glass tubes as "speed bumps" on the rail path.
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 300, y: H / 2, w: 40, h: 80, rot: Math.PI / 2
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 78, 'phoenix', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
