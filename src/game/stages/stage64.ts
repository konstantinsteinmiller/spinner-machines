import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 64: "Rail Switch" ───────────────────────────────────────────
// Three parallel rails; two are initially blocked by glass tube
// barriers. A gear near spawn rotates a linked wall out of the way,
// opening the fastest express rail straight to the boss.
const W = 3000, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage64',
  name: 'Rail Switch',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // 3 horizontal rails.
    { id: id(), type: 'magneticRail', x: W / 2, y: 400, w: 1800, h: 30, rot: 0 },
    { id: id(), type: 'magneticRail', x: W / 2, y: H / 2, w: 1800, h: 30, rot: 0 },
    { id: id(), type: 'magneticRail', x: W / 2, y: H - 400, w: 1800, h: 30, rot: 0 },

    // Gate: metal wall across the middle rail, linked to a gear.
    linked(
      { id: id(), type: 'wall', x: 800, y: H / 2, w: 30, h: 100, rot: 0, meta: { material: 'metal' } },
      'switch'
    ),

    // Gear that opens the gate.
    gear(id, 500, H / 2 - 300, 'switch', 70, 90),

    // Outer rails have glass tube barriers every few units — slow but scoring.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 700 + i * 200, y: 400, w: 40, h: 80, rot: Math.PI / 2
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 700 + i * 200, y: H - 400, w: 40, h: 80, rot: Math.PI / 2
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 70, 'phoenix', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
