import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal } from './_helpers'

// ── Stage 37: "Bridge of Plates" ──────────────────────────────────────
// A sequence of three plates progressively demolish the walls of a
// zig-zag corridor. Each plate shatters the next "step" so the spinner
// has to bounce back and forth to keep advancing. Completing the whole
// bridge gives a clean run to the boss; skipping plates means slamming
// into metal walls.
const W = 3000, H = 1200
const id = mkId()

const stage: Stage = {
  id: 'stage37',
  name: 'Bridge of Plates',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 50,
  bossKillBonus: 300,
  bossModelId: 'snake',
  machines: [
    ...boundary(id, W, H),

    // Step 1 — wall links to plate P1. Plate P1 sits at top.
    linked(wall(id, 900, H / 2, 30, 700, 'metal'), 'P1'),
    plate(id, 600, 180, 'P1'),

    // Step 2 — wall links to plate P2 (bottom side).
    linked(wall(id, 1500, H / 2, 30, 700, 'metal'), 'P2'),
    plate(id, 1200, H - 180, 'P2'),

    // Step 3 — wall links to plate P3 (top again).
    linked(wall(id, 2100, H / 2, 30, 700, 'metal'), 'P3'),
    plate(id, 1800, 180, 'P3'),

    // Score fodder — one glass tube in each cell of the zig-zag.
    { id: id(), type: 'destroyableGlassTube', x: 700, y: H / 2, w: 40, h: 200, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: 1300, y: H / 2, w: 40, h: 200, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: 1900, y: H / 2, w: 40, h: 200, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 400, y: H / 2, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 2500, y: H / 2, w: 80, h: 80, rot: 0 },

    // Booster pair bounces the spinner between top and bottom.
    { id: id(), type: 'centrifugalBooster', x: 600, y: H / 2, w: 120, h: 100, rot: -Math.PI / 2 },
    { id: id(), type: 'centrifugalBooster', x: 1200, y: H / 2, w: 120, h: 100, rot: Math.PI / 2 },
    { id: id(), type: 'centrifugalBooster', x: 1800, y: H / 2, w: 120, h: 100, rot: -Math.PI / 2 },

    boss(id, 2600, H / 2, 65, 'snake', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
