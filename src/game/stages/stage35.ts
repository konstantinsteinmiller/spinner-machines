import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal, grid } from './_helpers'

// ── Stage 35: "Detonation Chain" ──────────────────────────────────────
// One plate arms a long dormant corridor of generators. Triggering the
// plate simultaneously destroys all of them — the chain-explosion
// score is massive but only fires once, so timing the plate hit before
// the spinner dumps its energy is the skill test.
const W = 3000, H = 1400
const id = mkId()

const stage: Stage = {
  id: 'stage35',
  name: 'Detonation Chain',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'thunder',
  machines: [
    ...boundary(id, W, H),

    // Top & bottom generator corridors (all linked to the plate so one
    // step pops the entire chain — 14 machines of score).
    ...Array.from({ length: 7 }, (_, i) => linked({
      id: id(), type: 'overloadedGenerator' as const,
      x: 700 + i * 240, y: 300, w: 80, h: 80, rot: 0
    }, 'det')),
    ...Array.from({ length: 7 }, (_, i) => linked({
      id: id(), type: 'overloadedGenerator' as const,
      x: 700 + i * 240, y: H - 300, w: 80, h: 80, rot: 0
    }, 'det')),

    // Plate — deep in the corridor, behind a glass gate.
    plate(id, W - 400, H / 2, 'det', 120, 100),
    { id: id(), type: 'destroyableGlassTube', x: W - 600, y: H / 2 - 80, w: 40, h: 160, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: W - 600, y: H / 2 + 80, w: 40, h: 160, rot: 0 },

    // Launcher at entry fires the spinner straight down the middle.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: 0 },

    // Inner rail keeps the spinner centered during the long traverse.
    { id: id(), type: 'magneticRail', x: W / 2, y: H / 2, w: 1600, h: 40, rot: 0 },

    boss(id, 500, H / 2 + 200, 55, 'thunder', 150),
    goal(id, W - 220, 300)
  ]
}

export default stage
