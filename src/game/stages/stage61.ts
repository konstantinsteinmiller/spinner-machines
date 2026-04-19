import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 61: "Rail Runner" ───────────────────────────────────────────
// Long magnetic rails form a zig-zag through the arena. Hopping rails
// is the fastest route. Glass tubes between rails add point pickups for
// players who can steer off-rail mid-run.
const W = 3000, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage61',
  name: 'Rail Runner',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 50,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Four diagonal rails in a zig-zag.
    { id: id(), type: 'magneticRail', x: 700, y: 600, w: 600, h: 30, rot: Math.PI / 6 },
    { id: id(), type: 'magneticRail', x: 1400, y: H - 600, w: 600, h: 30, rot: -Math.PI / 6 },
    { id: id(), type: 'magneticRail', x: 2100, y: 600, w: 600, h: 30, rot: Math.PI / 6 },
    { id: id(), type: 'magneticRail', x: 2700, y: H / 2, w: 400, h: 30, rot: 0 },

    // Glass tubes in the pockets between rails.
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 900 + i * 300, y: 350, w: 40, h: 140, rot: 0
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 900 + i * 300, y: H - 350, w: 40, h: 140, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: Math.PI / 8 },

    boss(id, W - 380, H / 2, 65, 'phoenix', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
