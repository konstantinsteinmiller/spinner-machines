import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 87: "Full Toolbox" ──────────────────────────────────────────
// Every machine type gets a dedicated zone. The arena is divided into
// four quadrants, each themed around one mechanic, and the boss sits
// at the nexus. Shows the player what the full toolkit feels like.
const W = 3000, H = 2200
const id = mkId()

const stage: Stage = {
  id: 'stage87',
  name: 'Full Toolbox',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 900, 1500],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // NW quadrant: generator field.
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + (i % 3) * 160, y: 400 + Math.floor(i / 3) * 160, w: 80, h: 80, rot: 0
    })),

    // NE quadrant: rails + boosters.
    { id: id(), type: 'magneticRail', x: 2200, y: 500, w: 600, h: 30, rot: Math.PI / 8 },
    { id: id(), type: 'centrifugalBooster', x: 2300, y: 700, w: 120, h: 100, rot: 0 },

    // SW quadrant: glass forest.
    ...Array.from({ length: 12 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 400 + (i % 4) * 150, y: H - 700 + Math.floor(i / 4) * 160, w: 40, h: 120, rot: 0
    })),

    // SE quadrant: gravity wells + conveyor.
    { id: id(), type: 'conveyorBelt', x: 2300, y: H - 500, w: 600, h: 70, rot: Math.PI },
    { id: id(), type: 'gravityWell', x: 2400, y: H - 700, w: 100, h: 100, rot: 0 },
    { id: id(), type: 'gravityWell', x: 2200, y: H - 300, w: 100, h: 100, rot: 0 },

    // Central nexus: pneumatic launcher at spawn.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W / 2, H / 2, 82, 'demon', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
