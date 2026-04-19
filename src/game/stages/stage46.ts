import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, grid } from './_helpers'

// ── Stage 46: "Primed Field" ──────────────────────────────────────────
// Hexagonal-ish offset generator pattern. Every row is shifted so a
// blast from any generator reaches two in the row above and two below,
// forming a zig-zag chain that spreads diagonally in both directions.
const W = 2800, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage46',
  name: 'Primed Field',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Offset rows — even rows start at x=600, odd rows at x=670.
    ...Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        id: id(), type: 'overloadedGenerator' as const,
        x: (row % 2 === 0 ? 600 : 670) + col * 140,
        y: 400 + row * 200,
        w: 80, h: 80, rot: 0
      }))
    ).flat(),

    // Launcher aimed at the field middle.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, 2500, H / 2, 75, 'phoenix', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
