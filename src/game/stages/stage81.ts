import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked, plate } from './_helpers'

// ── Stage 81: "Combined Lock" ─────────────────────────────────────────
// Three locks to the boss room: a gear wall, a plate wall, and a glass
// wall. All three must be broken. Teaches the player that the suite of
// unlock mechanisms stacks rather than substituting.
const W = 3000, H = 2200
const id = mkId()

const stage: Stage = {
  id: 'stage81',
  name: 'Combined Lock',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Three barriers across the arena, each of a different unlock type.
    // Barrier 1: gear-driven metal wall.
    linked(
      { id: id(), type: 'wall', x: 900, y: H / 2, w: 40, h: 800, rot: 0, meta: { material: 'metal' } },
      'lockA'
    ),
    gear(id, 600, 500, 'lockA', 80, 100),

    // Barrier 2: plate-driven stone wall.
    linked(
      { id: id(), type: 'wall', x: 1600, y: H / 2, w: 40, h: 800, rot: 0, meta: { material: 'stone' } },
      'lockB'
    ),
    plate(id, 1250, H - 400, 'lockB', 120, 80),

    // Barrier 3: glass wall (just punch through it).
    ...Array.from({ length: 7 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 2200, y: 600 + i * 160, w: 40, h: 140, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 78, 'demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
