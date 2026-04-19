import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal, box } from './_helpers'

// ── Stage 31: "Plate Gate" ────────────────────────────────────────────
// New plate use-case — instead of breaking caged explosives, a single
// plate DESTROYS a thick metal wall that blocks direct boss access.
// The plate is tucked into a far corner, so the player has to send the
// spinner on a long detour before the attack run.
const W = 2400, H = 1600
const id = mkId()

const stage: Stage = {
  id: 'stage31',
  name: 'Plate Gate',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 50,
  bossKillBonus: 320,
  bossModelId: 'reddragon',
  machines: [
    ...boundary(id, W, H),

    // Thick metal wall sealing the boss chamber — split into 5 tall
    // segments all wired to one plate key so a single step shatters them.
    ...Array.from({ length: 5 }, (_, i) =>
      linked(wall(id, 1400, 300 + i * 220, 40, 220, 'metal'), 'p31')
    ),

    // Plate hidden behind a glass curtain in the far bottom-right — the
    // spinner has to bounce all the way back there before the boss run.
    plate(id, W - 300, H - 200, 'p31', 100, 80),
    { id: id(), type: 'destroyableGlassTube', x: W - 500, y: H - 200, w: 40, h: 180, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: W - 300, y: H - 400, w: 40, h: 180, rot: 0 },

    // Score fodder — glass in the entry corridor.
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 400 + i * 140, y: 400, w: 40, h: 140, rot: 0
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 400 + i * 140, y: H - 400, w: 40, h: 140, rot: 0
    })),

    // Booster guides the spinner toward the plate after the front-run.
    { id: id(), type: 'centrifugalBooster', x: 1300, y: H - 300, w: 120, h: 100, rot: -Math.PI / 6 },
    { id: id(), type: 'centrifugalBooster', x: 400, y: H - 300, w: 120, h: 100, rot: -Math.PI / 4 },

    boss(id, 1800, H / 2, 65, 'reddragon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
