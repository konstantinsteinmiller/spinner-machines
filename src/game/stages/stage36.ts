import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal, grid } from './_helpers'

// ── Stage 36: "Demolition" ────────────────────────────────────────────
// A single plate at the back of the stage is wired to demolish an
// enormous multi-wall boss bunker — the plate opens a clear attack
// lane for the spinner. Skipping the plate forces a harder, glancing
// boss approach through the bunker's narrow top slit.
const W = 2800, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage36',
  name: 'Demolition',
  width: W, height: H,
  spawn: { x: 200, y: H - 200 },
  goal: { x: W - 220, y: 260 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'boulder',
  machines: [
    ...boundary(id, W, H),

    // Bunker surrounding the boss on three sides. Every wall segment is
    // plate-linked so one step flattens the bunker.
    ...Array.from({ length: 4 }, (_, i) =>
      linked(wall(id, 1700, 500 + i * 180, 40, 180, 'metal'), 'dm')
    ),
    ...Array.from({ length: 4 }, (_, i) =>
      linked(wall(id, 2200, 500 + i * 180, 40, 180, 'metal'), 'dm')
    ),
    linked(wall(id, 1950, 400, 540, 40, 'metal'), 'dm'),

    // Narrow top slit — if the plate is skipped, this is the only way in.
    // (Intentional bunker roof with a 100px gap on the left.)
    wall(id, 2100, 1200, 340, 40, 'metal'),

    // Plate hidden in the top-right behind a short generator gauntlet.
    plate(id, W - 300, 300, 'dm', 100, 80),
    { id: id(), type: 'overloadedGenerator', x: W - 500, y: 300, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: W - 700, y: 300, w: 40, h: 160, rot: 0 },

    // Score fodder — a glass thicket in the front half.
    ...grid(id, 'destroyableGlassTube', 500, 350, 4, 3, 180, 180, 40, 120),

    // Launcher at the spawn corner shoots up-right into the thicket.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H - 200, w: 100, h: 70, rot: -Math.PI / 4 },

    boss(id, 1950, 750, 80, 'boulder', 180),
    goal(id, W - 220, 260)
  ]
}

export default stage
