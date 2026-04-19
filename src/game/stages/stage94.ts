import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 94: "Fire Dance" ────────────────────────────────────────────
// Two parallel fire pits (generator lines) with the boss pacing between
// them. Rails above and below let the spinner zip past the fire pits
// repeatedly for chained blasts.
const W = 3200, H = 2200
const id = mkId()

const stage: Stage = {
  id: 'stage94',
  name: 'Fire Dance',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1600],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // Two fire lines.
    ...Array.from({ length: 14 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 160, y: H / 2 - 200, w: 80, h: 80, rot: 0
    })),
    ...Array.from({ length: 14 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 160, y: H / 2 + 200, w: 80, h: 80, rot: 0
    })),

    // Two horizontal rails above and below.
    { id: id(), type: 'magneticRail', x: W / 2, y: 400, w: 2400, h: 30, rot: 0 },
    { id: id(), type: 'magneticRail', x: W / 2, y: H - 400, w: 2400, h: 30, rot: 0 },

    // Turn-around boosters at the ends.
    { id: id(), type: 'centrifugalBooster', x: W - 250, y: 500, w: 120, h: 90, rot: Math.PI },
    { id: id(), type: 'centrifugalBooster', x: W - 250, y: H - 500, w: 120, h: 90, rot: Math.PI },

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: -Math.PI / 12 },

    boss(id, W / 2, H / 2, 105, 'fire', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
