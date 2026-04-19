import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 58: "Prism Corridor" ────────────────────────────────────────
// A narrow triangular prism of glass on each side of a long corridor.
// The spinner ricochets along the corridor shattering one glass wall,
// then bouncing off the opposite one, etc. Rail-like motion through
// breakables.
const W = 3000, H = 1400
const id = mkId()

const stage: Stage = {
  id: 'stage58',
  name: 'Prism Corridor',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Top-angled glass "prism" (tubes slightly rotated toward corridor center).
    ...Array.from({ length: 18 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 130, y: 370 + (i % 2) * 30,
      w: 40, h: 140, rot: (i % 2 === 0 ? 0.2 : -0.2)
    })),

    // Bottom-angled glass prism (mirror of the top).
    ...Array.from({ length: 18 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 130, y: H - 370 - (i % 2) * 30,
      w: 40, h: 140, rot: (i % 2 === 0 ? -0.2 : 0.2)
    })),

    // Launcher rockets through the narrow channel.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: 0 },

    boss(id, W - 380, H / 2, 68, 'phoenix', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
