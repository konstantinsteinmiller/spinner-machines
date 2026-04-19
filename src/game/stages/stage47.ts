import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 47: "Generator Tower" ───────────────────────────────────────
// Portrait arena. A vertical chimney stacked with generators runs up
// the center, bracketed by glass panes. Igniting the bottom-most
// generator rips a hot column all the way up and shatters the glass
// walls framing it.
const W = 1600, H = 2600
const id = mkId()

const stage: Stage = {
  id: 'stage47',
  name: 'Generator Tower',
  width: W, height: H,
  spawn: { x: W / 2, y: H - 200 },
  goal: { x: W / 2, y: 220 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Chimney walls — gap at bottom for the spinner to enter.
    wall(id, W / 2 - 220, H / 2, 20, 1600, 'stone'),
    wall(id, W / 2 + 220, H / 2, 20, 1600, 'stone'),

    // Generator stack, 10 high.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: W / 2, y: 400 + i * 180, w: 80, h: 80, rot: 0
    })),

    // Glass panes flanking each generator — blast from chimney shatters them.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: W / 2 - 180, y: 400 + i * 180, w: 40, h: 120, rot: 0
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: W / 2 + 180, y: 400 + i * 180, w: 40, h: 120, rot: 0
    })),

    // Vertical launcher at the bottom of the chimney.
    { id: id(), type: 'pneumaticLauncher', x: W / 2, y: H - 320, w: 100, h: 70, rot: -Math.PI / 2 },

    boss(id, W / 2, 380, 70, 'demon', 150),
    goal(id, W / 2, 220)
  ]
}

export default stage
