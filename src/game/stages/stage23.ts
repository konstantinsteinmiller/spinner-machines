import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal } from './_helpers'

// ── Stage 23: "Gear Escalator" ────────────────────────────────────────
// Three gears each control a wall segment in a rising staircase. Two
// hits on each gear rotate its segment flush, turning the stack of L-
// shaped walls into a clean diagonal ramp up to the boss chamber. Skip
// any one and the escalator is still blocked at that step.
const W = 2600, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage23',
  name: 'Gear Escalator',
  width: W, height: H,
  spawn: { x: 200, y: H - 250 },
  goal: { x: W - 220, y: 280 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 50,
  bossKillBonus: 320,
  bossModelId: 'mountain',
  machines: [
    ...boundary(id, W, H),

    // Staircase platforms with rotating drop-gates linked to gears.
    wall(id, 700, 1200, 500, 20, 'stone'),
    linked(wall(id, 950, 1100, 20, 240, 'metal'), 'e1'),
    gear(id, 600, 1000, 'e1'),

    wall(id, 1300, 900, 500, 20, 'stone'),
    linked(wall(id, 1550, 800, 20, 240, 'metal'), 'e2'),
    gear(id, 1200, 700, 'e2'),

    wall(id, 1900, 600, 500, 20, 'stone'),
    linked(wall(id, 2150, 500, 20, 240, 'metal'), 'e3'),
    gear(id, 1800, 400, 'e3'),

    // Score fodder along the rising path.
    { id: id(), type: 'overloadedGenerator', x: 500, y: 1000, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: 1100, y: 1000, w: 40, h: 140, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: 1400, y: 700, w: 40, h: 140, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1700, y: 400, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: 2000, y: 400, w: 40, h: 140, rot: 0 },

    // Launcher at the base kicks the spinner up along the stair axis.
    { id: id(), type: 'pneumaticLauncher', x: 300, y: 1200, w: 90, h: 60, rot: -Math.PI / 6 },

    boss(id, 2350, 280, 65, 'mountain', 160),
    goal(id, W - 220, 280)
  ]
}

export default stage
