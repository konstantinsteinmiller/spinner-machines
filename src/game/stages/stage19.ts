import type { Stage } from '@/types/stage'

// ── Stage 19: "Steel Fortress" ────────────────────────────────────────
// Mostly metal walls. Direct impact barely scratches them, so the only
// real route through is finding the pressure plates that detonate the
// caged generators and blow the steel open.
const stage: Stage = {
  id: 'stage19',
  name: 'Steel Fortress',
  width: 2600,
  height: 1600,
  spawn: { x: 200, y: 200 },
  goal: { x: 2400, y: 1400 },
  starThresholds: [0, 700, 1400],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'diamond',
  machines: [
    { id: 1, type: 'wall', x: 1300, y: 20, w: 2600, h: 40, rot: 0, meta: { material: 'metal' } },
    { id: 2, type: 'wall', x: 1300, y: 1580, w: 2600, h: 40, rot: 0, meta: { material: 'metal' } },
    { id: 3, type: 'wall', x: 20, y: 800, w: 40, h: 1600, rot: 0, meta: { material: 'metal' } },
    { id: 4, type: 'wall', x: 2580, y: 800, w: 40, h: 1600, rot: 0, meta: { material: 'metal' } },

    // Two big interior metal walls creating a locked chamber
    { id: 10, type: 'wall', x: 800, y: 600, w: 20, h: 700, rot: 0, meta: { material: 'metal', link: 'plate19a' } },
    { id: 11, type: 'wall', x: 1800, y: 600, w: 20, h: 700, rot: 0, meta: { material: 'metal', link: 'plate19b' } },

    // Generator clusters beside each locked wall (linked — plate kills
    // the wall AND pops the generators for score).
    { id: 20, type: 'overloadedGenerator', x: 700, y: 400, w: 80, h: 80, rot: 0, meta: { link: 'plate19a' } },
    { id: 21, type: 'overloadedGenerator', x: 700, y: 800, w: 80, h: 80, rot: 0, meta: { link: 'plate19a' } },
    { id: 22, type: 'destroyableGlassTube', x: 700, y: 600, w: 60, h: 120, rot: 0, meta: { link: 'plate19a' } },

    { id: 30, type: 'overloadedGenerator', x: 1900, y: 400, w: 80, h: 80, rot: 0, meta: { link: 'plate19b' } },
    { id: 31, type: 'overloadedGenerator', x: 1900, y: 800, w: 80, h: 80, rot: 0, meta: { link: 'plate19b' } },
    { id: 32, type: 'destroyableGlassTube', x: 1900, y: 600, w: 60, h: 120, rot: 0, meta: { link: 'plate19b' } },

    // Plate A — reachable from the spawn corridor
    { id: 40, type: 'pressurePlate', x: 500, y: 1400, w: 80, h: 60, rot: 0, meta: { link: 'plate19a' } },
    // Plate B — reachable only AFTER plate A breaks down the first wall
    { id: 41, type: 'pressurePlate', x: 1400, y: 1400, w: 80, h: 60, rot: 0, meta: { link: 'plate19b' } },

    // Right-facing launcher tucked along the top lane — fires the
    // blade toward the plate B corridor once plate A has opened the
    // first wall.
    { id: 50, type: 'pneumaticLauncher', x: 300, y: 300, w: 90, h: 60, rot: 0 },

    { id: 60, type: 'boss', x: 2200, y: 1400, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'diamond' },
    { id: 70, type: 'goal', x: 2400, y: 1400, w: 120, h: 120, rot: 0 },

    // ── Gear system: on right wall, rotates a metal wall near the boss ──
    { id: 71, type: 'gearSystem', x: 2580, y: 800, w: 100, h: 100, rot: 0, meta: { link: 'gear19' } },
    { id: 72, type: 'wall', x: 2100, y: 1000, w: 20, h: 200, rot: 0, meta: { material: 'metal', link: 'gear19' } }
  ]
}

export default stage
