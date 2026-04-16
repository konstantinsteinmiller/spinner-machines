import type { Stage } from '@/types/stage'

// ── Stage 12: "Rail Express" ──────────────────────────────────────────
// Two long magnetic rails carry the spinner the length of the stage.
// Walls hug the rails so the only route through is locking onto them.
const stage: Stage = {
  id: 'stage12',
  name: 'Rail Express',
  width: 3000,
  height: 1200,
  spawn: { x: 200, y: 260 },
  goal: { x: 2800, y: 940 },
  starThresholds: [0, 550, 1100],
  launchPenalty: 55,
  bossKillBonus: 300,
  bossModelId: 'diamond',
  machines: [
    { id: 1, type: 'wall', x: 1500, y: 20, w: 3000, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1500, y: 1180, w: 3000, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 600, w: 40, h: 1200, rot: 0 },
    { id: 4, type: 'wall', x: 2980, y: 600, w: 40, h: 1200, rot: 0 },

    // Upper rail
    { id: 10, type: 'magneticRail', x: 900, y: 260, w: 1200, h: 50, rot: 0 },
    // Lower rail
    { id: 11, type: 'magneticRail', x: 1900, y: 940, w: 1200, h: 50, rot: 0 },

    // Glass tubes strung along each rail
    { id: 20, type: 'destroyableGlassTube', x: 500, y: 260, w: 60, h: 120, rot: 0 },
    { id: 21, type: 'destroyableGlassTube', x: 1500, y: 260, w: 60, h: 120, rot: 0 },
    { id: 22, type: 'destroyableGlassTube', x: 1800, y: 940, w: 60, h: 120, rot: 0 },
    { id: 23, type: 'destroyableGlassTube', x: 2400, y: 940, w: 60, h: 120, rot: 0 },

    // Divider wall between the two rails so the player has to exit the
    // upper rail and drop into the lower one on purpose.
    { id: 30, type: 'wall', x: 1500, y: 600, w: 2600, h: 20, rot: 0 },

    // Gap in the divider at the right end — the only way down.
    // (No machine; omission creates the gap where the divider ends at x=2800.)

    // Steel cage with generators linked to a plate on the lower rail
    { id: 40, type: 'wall', x: 2300, y: 160, w: 20, h: 200, rot: 0, meta: { material: 'metal' } },
    { id: 41, type: 'wall', x: 2500, y: 160, w: 20, h: 200, rot: 0, meta: { material: 'metal' } },
    { id: 42, type: 'wall', x: 2400, y: 60, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 43, type: 'wall', x: 2400, y: 260, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 44, type: 'overloadedGenerator', x: 2360, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plate12' } },
    { id: 45, type: 'overloadedGenerator', x: 2460, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plate12' } },

    // Plate sits right at the end of the lower rail
    { id: 50, type: 'pressurePlate', x: 2650, y: 940, w: 80, h: 60, rot: 0, meta: { link: 'plate12' } },

    // Booster kicks spinner off the lower rail toward the goal
    { id: 60, type: 'centrifugalBooster', x: 2650, y: 700, w: 120, h: 100, rot: 0 },

    // Boss next to goal
    { id: 70, type: 'boss', x: 2600, y: 940, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'diamond' },

    { id: 80, type: 'goal', x: 2800, y: 940, w: 120, h: 120, rot: 0 },

    // ── Gear system: on bottom wall, rotates a wall blocking the lower rail shortcut ──
    { id: 81, type: 'gearSystem', x: 1200, y: 1180, w: 100, h: 100, rot: 0, meta: { link: 'gear12' } },
    { id: 82, type: 'wall', x: 1200, y: 800, w: 120, h: 20, rot: 0, meta: { material: 'metal', link: 'gear12' } }
  ]
}

export default stage
