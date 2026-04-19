import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 68: "Double Launch" ─────────────────────────────────────────
// Two launchers at spawn fire in opposite directions — one up, one down.
// The spinner has to choose its path; each path leads through a
// different set of generators and glass before converging at the boss.
const W = 3000, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage68',
  name: 'Double Launch',
  width: W, height: H,
  spawn: { x: 400, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: 500, w: 100, h: 70, rot: -Math.PI / 8 },
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H - 500, w: 100, h: 70, rot: Math.PI / 8 },

    // Top route — generators
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 800 + i * 200, y: 400, w: 80, h: 80, rot: 0
    })),
    // Bottom route — glass
    ...Array.from({ length: 14 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 700 + i * 130, y: H - 400, w: 40, h: 140, rot: 0
    })),

    // Merge chamber walls.
    wall(id, 2200, 300, 20, 400, 'stone'),
    wall(id, 2200, H - 300, 20, 400, 'stone'),

    boss(id, W - 400, H / 2, 70, 'phoenix', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
