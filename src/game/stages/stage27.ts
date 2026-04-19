import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal } from './_helpers'

// ── Stage 27: "Gear Ladder" ───────────────────────────────────────────
// A vertical tower of four floors, each separated by a rotating wall
// gate. One gear per floor. To reach the boss at the top, every gate
// must be rotated flat. Each floor also houses a couple of glass tubes
// and a generator as bounce-bait, so the spinner can keep scoring
// while climbing.
const W = 1600, H = 2600
const id = mkId()

const stage: Stage = {
  id: 'stage27',
  name: 'Gear Ladder',
  width: W, height: H,
  spawn: { x: W / 2, y: H - 200 },
  goal: { x: W / 2, y: 200 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'hawk',
  machines: [
    ...boundary(id, W, H),

    // Floor dividers with rotating gates. Bottom → top.
    // Floor 1 divider (y = 2000)
    wall(id, 200, 2000, 400, 24, 'stone'),
    linked(wall(id, W - 600, 2000, 600, 24, 'metal'), 'f1'),
    gear(id, W - 200, 2100, 'f1'),
    { id: id(), type: 'overloadedGenerator', x: 400, y: 2200, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: 800, y: 2200, w: 40, h: 140, rot: 0 },

    // Floor 2 divider (y = 1500)
    linked(wall(id, 600, 1500, 600, 24, 'metal'), 'f2'),
    wall(id, W - 200, 1500, 400, 24, 'stone'),
    gear(id, 200, 1600, 'f2'),
    { id: id(), type: 'destroyableGlassTube', x: 500, y: 1700, w: 40, h: 140, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: W - 400, y: 1700, w: 80, h: 80, rot: 0 },

    // Floor 3 divider (y = 1000)
    wall(id, 200, 1000, 400, 24, 'stone'),
    linked(wall(id, W - 600, 1000, 600, 24, 'metal'), 'f3'),
    gear(id, W - 200, 1100, 'f3'),
    { id: id(), type: 'destroyableGlassTube', x: 600, y: 1200, w: 40, h: 140, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: 1000, y: 1200, w: 80, h: 80, rot: 0 },

    // Floor 4 divider (y = 500) — last gate.
    linked(wall(id, 600, 500, 600, 24, 'metal'), 'f4'),
    wall(id, W - 200, 500, 400, 24, 'stone'),
    gear(id, 200, 600, 'f4'),

    // Launcher at the base fires upward.
    { id: id(), type: 'pneumaticLauncher', x: W / 2, y: H - 320, w: 90, h: 60, rot: -Math.PI / 2 },

    boss(id, W / 2, 350, 60, 'hawk', 160),
    goal(id, W / 2, 200)
  ]
}

export default stage
