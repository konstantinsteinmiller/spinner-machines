import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 89: "Factory Floor" ─────────────────────────────────────────
// Industrial layout — conveyor lanes move scrap (glass tubes) past
// generators that detonate when pushed. Timing the run so the spinner
// arrives as the glass lines up triggers a combo explosion.
const W = 3000, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage89',
  name: 'Factory Floor',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Three horizontal conveyor belts.
    { id: id(), type: 'conveyorBelt', x: W / 2, y: 500, w: 2200, h: 70, rot: 0 },
    { id: id(), type: 'conveyorBelt', x: W / 2, y: H / 2, w: 2200, h: 70, rot: Math.PI },
    { id: id(), type: 'conveyorBelt', x: W / 2, y: H - 500, w: 2200, h: 70, rot: 0 },

    // Glass "cargo" pre-placed along the belts.
    ...Array.from({ length: 3 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => ({
        id: id(), type: 'destroyableGlassTube' as const,
        x: 600 + col * 200, y: 500 + row * ((H - 1000) / 2),
        w: 40, h: 100, rot: 0
      }))
    ).flat(),

    // Generator banks between belts.
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 700 + i * 280, y: 730, w: 80, h: 80, rot: 0
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 700 + i * 280, y: H - 730, w: 80, h: 80, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 75, 'phoenix', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
