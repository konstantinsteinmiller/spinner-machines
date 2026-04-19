import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 44: "Explosive Corridor" ────────────────────────────────────
// Two parallel corridors, each lined with a long chain of generators.
// The corridors are separated by a glass strip so one blast can jump
// the divide into the other channel — lighting one side often flashes
// the other for a huge cascade.
const W = 2800, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage44',
  name: 'Explosive Corridor',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 50,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Top corridor
    wall(id, W / 2, 300, 2000, 20, 'stone'),
    wall(id, W / 2, 620, 2000, 20, 'stone'),
    ...Array.from({ length: 11 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 140, y: 460, w: 80, h: 80, rot: 0
    })),

    // Glass separator — 140 wide so blast can jump it.
    ...Array.from({ length: 11 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 140, y: H / 2, w: 40, h: 120, rot: 0
    })),

    // Bottom corridor
    wall(id, W / 2, H - 300, 2000, 20, 'stone'),
    wall(id, W / 2, H - 620, 2000, 20, 'stone'),
    ...Array.from({ length: 11 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 500 + i * 140, y: H - 460, w: 80, h: 80, rot: 0
    })),

    // Launchers — one per corridor entry.
    { id: id(), type: 'pneumaticLauncher', x: 360, y: 460, w: 90, h: 60, rot: 0 },
    { id: id(), type: 'pneumaticLauncher', x: 360, y: H - 460, w: 90, h: 60, rot: 0 },

    boss(id, 2500, H / 2, 70, 'phoenix', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
