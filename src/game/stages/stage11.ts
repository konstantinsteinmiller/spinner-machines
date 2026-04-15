import type { Stage } from '@/types/stage'

// ── Stage 11: "Pneumatic Highway" ─────────────────────────────────────
// A long horizontal corridor whose traversal is driven by a chain of
// pneumatic launchers. One good launch and the spinner gets ping-ponged
// through the whole stage with minimal launch budget.
const stage: Stage = {
  id: 'stage11',
  name: 'Pneumatic Highway',
  width: 3200,
  height: 1000,
  spawn: { x: 200, y: 500 },
  goal: { x: 3000, y: 500 },
  starThresholds: [0, 600, 1200],
  launchPenalty: 55,
  bossKillBonus: 300,
  bossModelId: 'tornado',
  machines: [
    // Perimeter
    { id: 1, type: 'wall', x: 1600, y: 20, w: 3200, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1600, y: 980, w: 3200, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 500, w: 40, h: 1000, rot: 0 },
    { id: 4, type: 'wall', x: 3180, y: 500, w: 40, h: 1000, rot: 0 },

    // Spawn funnel walls — force a rightward launch
    { id: 10, type: 'wall', x: 400, y: 300, w: 200, h: 20, rot: 0 },
    { id: 11, type: 'wall', x: 400, y: 700, w: 200, h: 20, rot: 0 },

    // Launcher chain along the highway, each pointed at the next
    { id: 20, type: 'pneumaticLauncher', x: 700, y: 500, w: 90, h: 60, rot: 0 },
    { id: 21, type: 'pneumaticLauncher', x: 1150, y: 500, w: 90, h: 60, rot: 0 },
    { id: 22, type: 'pneumaticLauncher', x: 1600, y: 500, w: 90, h: 60, rot: 0 },
    { id: 23, type: 'pneumaticLauncher', x: 2050, y: 500, w: 90, h: 60, rot: 0 },
    { id: 24, type: 'pneumaticLauncher', x: 2500, y: 500, w: 90, h: 60, rot: 0 },

    // Hazard rows — glass tubes above/below to shatter on bounce
    { id: 30, type: 'destroyableGlassTube', x: 900, y: 260, w: 60, h: 120, rot: 0 },
    { id: 31, type: 'destroyableGlassTube', x: 900, y: 740, w: 60, h: 120, rot: 0 },
    { id: 32, type: 'destroyableGlassTube', x: 1350, y: 260, w: 60, h: 120, rot: 0 },
    { id: 33, type: 'destroyableGlassTube', x: 1350, y: 740, w: 60, h: 120, rot: 0 },
    { id: 34, type: 'destroyableGlassTube', x: 1800, y: 260, w: 60, h: 120, rot: 0 },
    { id: 35, type: 'destroyableGlassTube', x: 1800, y: 740, w: 60, h: 120, rot: 0 },
    { id: 36, type: 'destroyableGlassTube', x: 2250, y: 260, w: 60, h: 120, rot: 0 },
    { id: 37, type: 'destroyableGlassTube', x: 2250, y: 740, w: 60, h: 120, rot: 0 },

    // Steel cage holding a pressure plate payoff — unreachable directly
    { id: 40, type: 'wall', x: 2700, y: 200, w: 20, h: 200, rot: 0, meta: { material: 'metal' } },
    { id: 41, type: 'wall', x: 2900, y: 200, w: 20, h: 200, rot: 0, meta: { material: 'metal' } },
    { id: 42, type: 'wall', x: 2800, y: 100, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 43, type: 'wall', x: 2800, y: 300, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 44, type: 'overloadedGenerator', x: 2760, y: 210, w: 80, h: 80, rot: 0, meta: { link: 'plate11' } },
    { id: 45, type: 'overloadedGenerator', x: 2860, y: 210, w: 80, h: 80, rot: 0, meta: { link: 'plate11' } },
    { id: 46, type: 'destroyableGlassTube', x: 2800, y: 160, w: 60, h: 60, rot: 0, meta: { link: 'plate11' } },

    // Plate sits in the highway ricochet lane so one bounce triggers it
    { id: 50, type: 'pressurePlate', x: 2700, y: 740, w: 80, h: 60, rot: 0, meta: { link: 'plate11' } },

    // Boss just before the exit
    { id: 60, type: 'boss', x: 2780, y: 500, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'tornado' },

    // Goal
    { id: 70, type: 'goal', x: 3000, y: 500, w: 120, h: 120, rot: 0 }
  ]
}

export default stage
