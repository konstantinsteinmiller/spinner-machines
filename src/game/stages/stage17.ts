import type { Stage } from '@/types/stage'

// ── Stage 17: "Conveyor Corridor" ─────────────────────────────────────
// A serpentine of conveyor belts ferries the spinner around the stage.
// Aim once, let the belts do the work, pop plates and tubes en route.
const stage: Stage = {
  id: 'stage17',
  name: 'Conveyor Corridor',
  width: 2400,
  height: 1600,
  spawn: { x: 200, y: 200 },
  goal: { x: 2200, y: 1400 },
  starThresholds: [0, 600, 1200],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'dark',
  machines: [
    { id: 1, type: 'wall', x: 1200, y: 20, w: 2400, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1200, y: 1580, w: 2400, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 800, w: 40, h: 1600, rot: 0 },
    { id: 4, type: 'wall', x: 2380, y: 800, w: 40, h: 1600, rot: 0 },

    // Serpentine belts — three horizontal runs, offset
    { id: 10, type: 'conveyorBelt', x: 900, y: 300, w: 1200, h: 60, rot: 0 },
    { id: 11, type: 'conveyorBelt', x: 1500, y: 800, w: 1200, h: 60, rot: 0 },
    { id: 12, type: 'conveyorBelt', x: 900, y: 1300, w: 1200, h: 60, rot: 0 },

    // Divider walls between belt runs with narrow gaps at the ends
    { id: 20, type: 'wall', x: 800, y: 550, w: 1800, h: 20, rot: 0 },
    { id: 21, type: 'wall', x: 1600, y: 1050, w: 1800, h: 20, rot: 0 },

    // Glass tubes above each belt for easy score
    { id: 30, type: 'destroyableGlassTube', x: 700, y: 220, w: 60, h: 100, rot: 0 },
    { id: 31, type: 'destroyableGlassTube', x: 1100, y: 220, w: 60, h: 100, rot: 0 },
    { id: 32, type: 'destroyableGlassTube', x: 1500, y: 220, w: 60, h: 100, rot: 0 },
    { id: 33, type: 'destroyableGlassTube', x: 1300, y: 720, w: 60, h: 100, rot: 0 },
    { id: 34, type: 'destroyableGlassTube', x: 1700, y: 720, w: 60, h: 100, rot: 0 },
    { id: 35, type: 'destroyableGlassTube', x: 2100, y: 720, w: 60, h: 100, rot: 0 },
    { id: 36, type: 'destroyableGlassTube', x: 700, y: 1220, w: 60, h: 100, rot: 0 },
    { id: 37, type: 'destroyableGlassTube', x: 1100, y: 1220, w: 60, h: 100, rot: 0 },

    // Steel cage with linked plate
    { id: 40, type: 'wall', x: 300, y: 960, w: 20, h: 180, rot: 0, meta: { material: 'metal' } },
    { id: 41, type: 'wall', x: 480, y: 960, w: 20, h: 180, rot: 0, meta: { material: 'metal' } },
    { id: 42, type: 'wall', x: 390, y: 870, w: 200, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 43, type: 'wall', x: 390, y: 1050, w: 200, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 44, type: 'overloadedGenerator', x: 340, y: 960, w: 80, h: 80, rot: 0, meta: { link: 'plate17' } },
    { id: 45, type: 'overloadedGenerator', x: 440, y: 960, w: 80, h: 80, rot: 0, meta: { link: 'plate17' } },

    { id: 50, type: 'pressurePlate', x: 2200, y: 400, w: 80, h: 60, rot: 0, meta: { link: 'plate17' } },

    { id: 60, type: 'boss', x: 2000, y: 1400, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'dark' },
    { id: 70, type: 'goal', x: 2200, y: 1400, w: 120, h: 120, rot: 0 }
  ]
}

export default stage
