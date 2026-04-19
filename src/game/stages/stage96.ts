import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 96: "Boss Rush" ─────────────────────────────────────────────
// Thematic nod to fighting multiple bosses — only one real boss
// (wolf-demon) at the end, but the arena is sectioned into 3 "arenas"
// by glass walls, each with its own generator/glass setup. Clearing
// one arena to reach the next feels like beating a phase.
const W = 3400, H = 2000
const id = mkId()

const sectionWidth = 1000

const stage: Stage = {
  id: 'stage96',
  name: 'Boss Rush',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1700],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Section 1: generator cluster.
    ...Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 3 }, (_, col) => ({
        id: id(), type: 'overloadedGenerator' as const,
        x: 400 + col * 140, y: 500 + row * 250, w: 80, h: 80, rot: 0
      }))
    ).flat(),

    // Wall between section 1 and 2 (glass).
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 1000, y: 300 + i * 200, w: 40, h: 160, rot: 0
    })),

    // Section 2: mixed glass + gravity well.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 1200 + (i % 5) * 140, y: 500 + Math.floor(i / 5) * 500, w: 40, h: 120, rot: 0
    })),
    { id: id(), type: 'gravityWell', x: 1500, y: H / 2, w: 110, h: 110, rot: 0 },

    // Wall between section 2 and 3 (glass).
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 2000, y: 300 + i * 200, w: 40, h: 160, rot: 0
    })),

    // Section 3: generator field (boss arena).
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 2300 + (i % 3) * 180, y: 500 + Math.floor(i / 3) * 500, w: 80, h: 80, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 400, H / 2, 120, 'wolf-demon', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
