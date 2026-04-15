import type { Stage } from '@/types/stage'

// ── Stage 15: "Plate Maze" ────────────────────────────────────────────
// Three pressure plates, each linked to its own cluster of caged
// generators + tubes. The player has to hit every plate to clear the
// path, and the plate chains are where most of the score lives.
const stage: Stage = {
  id: 'stage15',
  name: 'Plate Maze',
  width: 2600,
  height: 1600,
  spawn: { x: 200, y: 800 },
  goal: { x: 2400, y: 800 },
  starThresholds: [0, 700, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'boulder',
  machines: [
    { id: 1, type: 'wall', x: 1300, y: 20, w: 2600, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1300, y: 1580, w: 2600, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 800, w: 40, h: 1600, rot: 0 },
    { id: 4, type: 'wall', x: 2580, y: 800, w: 40, h: 1600, rot: 0 },

    // ── Plate A cage (top-left) ──────────────────────────────────────
    { id: 100, type: 'wall', x: 500, y: 160, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 101, type: 'wall', x: 720, y: 160, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 102, type: 'wall', x: 610, y: 60, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 103, type: 'wall', x: 610, y: 280, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 104, type: 'overloadedGenerator', x: 560, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plateA' } },
    { id: 105, type: 'overloadedGenerator', x: 660, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plateA' } },
    { id: 106, type: 'destroyableGlassTube', x: 610, y: 100, w: 60, h: 60, rot: 0, meta: { link: 'plateA' } },
    { id: 107, type: 'pressurePlate', x: 600, y: 500, w: 80, h: 60, rot: 0, meta: { link: 'plateA' } },

    // ── Plate B cage (top-right) ─────────────────────────────────────
    { id: 120, type: 'wall', x: 1800, y: 160, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 121, type: 'wall', x: 2020, y: 160, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 122, type: 'wall', x: 1910, y: 60, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 123, type: 'wall', x: 1910, y: 280, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 124, type: 'overloadedGenerator', x: 1860, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plateB' } },
    { id: 125, type: 'overloadedGenerator', x: 1960, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plateB' } },
    { id: 126, type: 'destroyableGlassTube', x: 1910, y: 100, w: 60, h: 60, rot: 0, meta: { link: 'plateB' } },
    { id: 127, type: 'pressurePlate', x: 1900, y: 500, w: 80, h: 60, rot: 0, meta: { link: 'plateB' } },

    // ── Plate C cage (bottom center) ─────────────────────────────────
    { id: 140, type: 'wall', x: 1150, y: 1260, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 141, type: 'wall', x: 1370, y: 1260, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 142, type: 'wall', x: 1260, y: 1160, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 143, type: 'wall', x: 1260, y: 1380, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 144, type: 'overloadedGenerator', x: 1210, y: 1270, w: 80, h: 80, rot: 0, meta: { link: 'plateC' } },
    { id: 145, type: 'overloadedGenerator', x: 1310, y: 1270, w: 80, h: 80, rot: 0, meta: { link: 'plateC' } },
    { id: 146, type: 'destroyableGlassTube', x: 1260, y: 1200, w: 60, h: 60, rot: 0, meta: { link: 'plateC' } },
    { id: 147, type: 'pressurePlate', x: 1250, y: 900, w: 80, h: 60, rot: 0, meta: { link: 'plateC' } },

    // Central booster for circulation
    { id: 160, type: 'centrifugalBooster', x: 1250, y: 700, w: 120, h: 100, rot: 0 },

    // Boss guarding the goal
    { id: 170, type: 'boss', x: 2200, y: 800, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'boulder' },
    { id: 180, type: 'goal', x: 2400, y: 800, w: 120, h: 120, rot: 0 }
  ]
}

export default stage
