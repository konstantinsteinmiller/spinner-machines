import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal } from './_helpers'

// ── Stage 32: "Double Lock" ───────────────────────────────────────────
// Two plates, each destroying half the boss-chamber wall. Either plate
// on its own leaves a single-tile corridor into the boss — playable but
// tight. Hit both and the whole wall shatters, clearing a wide attack
// lane plus scoring extra wall-destruct points for both halves.
const W = 2600, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage32',
  name: 'Double Lock',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 50,
  bossKillBonus: 340,
  bossModelId: 'wulf',
  machines: [
    ...boundary(id, W, H),

    // Boss wall split into top & bottom halves — each linked to its own plate.
    ...Array.from({ length: 3 }, (_, i) =>
      linked(wall(id, 1500, 340 + i * 180, 40, 180, 'metal'), 'pA')
    ),
    ...Array.from({ length: 3 }, (_, i) =>
      linked(wall(id, 1500, H - 340 - i * 180, 40, 180, 'metal'), 'pB')
    ),

    // Plate A — top branch, gated by a glass curtain.
    plate(id, 1100, 200, 'pA', 100, 80),
    { id: id(), type: 'destroyableGlassTube', x: 1100, y: 360, w: 120, h: 40, rot: 0 },

    // Plate B — bottom branch, gated by a generator pair.
    plate(id, 1100, H - 200, 'pB', 100, 80),
    { id: id(), type: 'overloadedGenerator', x: 1000, y: H - 380, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1200, y: H - 380, w: 80, h: 80, rot: 0 },

    // Entry corridor walls — funnel the spinner into either branch.
    wall(id, 700, H / 2 - 300, 20, 400, 'wood'),
    wall(id, 700, H / 2 + 300, 20, 400, 'wood'),

    // Boosters launch the spinner up or down from the fork.
    { id: id(), type: 'centrifugalBooster', x: 800, y: H / 2 - 200, w: 120, h: 100, rot: -Math.PI / 2 },
    { id: id(), type: 'centrifugalBooster', x: 800, y: H / 2 + 200, w: 120, h: 100, rot: Math.PI / 2 },

    boss(id, 1900, H / 2, 75, 'wulf', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
