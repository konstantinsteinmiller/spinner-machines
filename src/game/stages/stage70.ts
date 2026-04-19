import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 70: "Grand Junction" ────────────────────────────────────────
// Chapter-E capstone. All transport machines at once: launchers, rails,
// boosters, and conveyor belts. A central X-shaped conveyor sends the
// spinner in four possible directions based on where it lands, each
// arm terminating in a different scoring zone.
const W = 2800, H = 2200
const id = mkId()

const stage: Stage = {
  id: 'stage70',
  name: 'Grand Junction',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 360,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Central X-shaped conveyor.
    { id: id(), type: 'conveyorBelt', x: W / 2, y: H / 2, w: 600, h: 50, rot: Math.PI / 4 },
    { id: id(), type: 'conveyorBelt', x: W / 2, y: H / 2, w: 600, h: 50, rot: -Math.PI / 4 },

    // 4 corner zones.
    // NW: 4 generators.
    ...Array.from({ length: 4 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 140, y: 400, w: 80, h: 80, rot: 0
    })),
    // NE: 6 glass.
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 1700 + i * 130, y: 400, w: 40, h: 140, rot: 0
    })),
    // SW: rail.
    { id: id(), type: 'magneticRail', x: 800, y: H - 400, w: 900, h: 30, rot: 0 },
    // SE: booster + glass.
    { id: id(), type: 'centrifugalBooster', x: 1900, y: H - 400, w: 120, h: 100, rot: -Math.PI / 4 },
    ...Array.from({ length: 4 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 2100 + i * 100, y: H - 400, w: 40, h: 120, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 80, 'wolf-demon', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
