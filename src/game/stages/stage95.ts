import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, plate, linked } from './_helpers'

// ── Stage 95: "Wolf Pack" ─────────────────────────────────────────────
// Three wolf-demons — no, just one boss, but three approach corridors.
// Each corridor has its own plate-locked gate. Open one quickly to
// skip ahead; open all three for the highest scoring path (more glass
// and generators on each corridor).
const W = 3000, H = 2400
const id = mkId()

const stage: Stage = {
  id: 'stage95',
  name: 'Wolf Pack',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1700],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Three horizontal corridor dividers.
    wall(id, W / 2, 700, 2000, 20, 'stone'),
    wall(id, W / 2, H - 700, 2000, 20, 'stone'),

    // Three gates.
    linked({ id: id(), type: 'wall', x: 900, y: 400, w: 40, h: 500, rot: 0, meta: { material: 'metal' } }, 'gateN'),
    linked({ id: id(), type: 'wall', x: 900, y: H / 2, w: 40, h: 500, rot: 0, meta: { material: 'metal' } }, 'gateM'),
    linked({ id: id(), type: 'wall', x: 900, y: H - 400, w: 40, h: 500, rot: 0, meta: { material: 'metal' } }, 'gateS'),

    // Plates for each gate (all reachable from spawn area).
    plate(id, 500, 300, 'gateN', 120, 70),
    plate(id, 500, H / 2, 'gateM', 120, 70),
    plate(id, 500, H - 300, 'gateS', 120, 70),

    // North corridor: glass field.
    ...Array.from({ length: 14 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 1100 + i * 120, y: 400, w: 40, h: 140, rot: 0
    })),
    // Middle corridor: generator line.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 1200 + i * 160, y: H / 2, w: 80, h: 80, rot: 0
    })),
    // South corridor: mixed.
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 1200 + i * 240, y: H - 400, w: 80, h: 80, rot: 0
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 1320 + i * 240, y: H - 400, w: 40, h: 120, rot: 0
    })),

    { id: id(), type: 'centrifugalBooster', x: 340, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, W - 400, H / 2, 115, 'wolf-demon', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
