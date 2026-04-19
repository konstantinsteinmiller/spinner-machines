import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked, plate } from './_helpers'

// ── Stage 99: "The Grand Forge" ───────────────────────────────────────
// Penultimate stage — a sprawling forge with every unlock mechanism
// active simultaneously. Two gears, two plates, and two giant glass
// walls separate the spinner from the boss. Only the most ambitious
// runs collect all possible scoring.
const W = 3400, H = 2400
const id = mkId()

const stage: Stage = {
  id: 'stage99',
  name: 'The Grand Forge',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1100, 1800],
  launchPenalty: 65,
  bossKillBonus: 450,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Gate 1: plate-locked stone wall.
    linked(
      { id: id(), type: 'wall', x: 900, y: H / 2, w: 40, h: 1200, rot: 0, meta: { material: 'stone' } },
      'fgate1'
    ),
    plate(id, 500, 400, 'fgate1', 140, 80),
    plate(id, 500, H - 400, 'fgate1', 140, 80),

    // Between gate 1 and 2: glass field.
    ...Array.from({ length: 18 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 1000 + (i % 6) * 120, y: 500 + Math.floor(i / 6) * 500,
      w: 40, h: 140, rot: 0
    })),

    // Gate 2: gear-locked metal wall.
    linked(
      { id: id(), type: 'wall', x: 1800, y: H / 2, w: 40, h: 1400, rot: 0, meta: { material: 'metal' } },
      'fgate2'
    ),
    gear(id, 1500, 500, 'fgate2', 80, 100),
    gear(id, 1500, H - 500, 'fgate2', 80, 100),

    // Boss arena: generator battery + glass ring + gravity well.
    ...Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2
      return {
        id: id(), type: 'overloadedGenerator' as const,
        x: (W + 1800) / 2 + Math.cos(a) * 420, y: H / 2 + Math.sin(a) * 420,
        w: 80, h: 80, rot: 0
      }
    }),
    ...Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: (W + 1800) / 2 + Math.cos(a) * 620, y: H / 2 + Math.sin(a) * 620,
        w: 40, h: 120, rot: a
      }
    }),
    { id: id(), type: 'gravityWell', x: (W + 1800) / 2, y: H / 2, w: 120, h: 120, rot: 0 },

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, (W + 1800) / 2, H / 2, 130, 'wolf-demon', 180),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
