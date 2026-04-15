import type { Stage } from '@/types/stage'

// ── Stage 18: "Booster Gauntlet" ──────────────────────────────────────
// Five centrifugal boosters in a ring. Every launch spends a long time
// bouncing around the boosters before it finally settles, so the
// player gets lots of incidental machine hits per shot.
const stage: Stage = {
  id: 'stage18',
  name: 'Booster Gauntlet',
  width: 2200,
  height: 1600,
  spawn: { x: 200, y: 800 },
  goal: { x: 2000, y: 800 },
  starThresholds: [0, 650, 1300],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'rainbow',
  machines: [
    { id: 1, type: 'wall', x: 1100, y: 20, w: 2200, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1100, y: 1580, w: 2200, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 800, w: 40, h: 1600, rot: 0 },
    { id: 4, type: 'wall', x: 2180, y: 800, w: 40, h: 1600, rot: 0 },

    // Ring of boosters around the center
    { id: 10, type: 'centrifugalBooster', x: 700, y: 400, w: 120, h: 100, rot: 0 },
    { id: 11, type: 'centrifugalBooster', x: 1400, y: 400, w: 120, h: 100, rot: 0 },
    { id: 12, type: 'centrifugalBooster', x: 1700, y: 800, w: 120, h: 100, rot: 0 },
    { id: 13, type: 'centrifugalBooster', x: 1400, y: 1200, w: 120, h: 100, rot: 0 },
    { id: 14, type: 'centrifugalBooster', x: 700, y: 1200, w: 120, h: 100, rot: 0 },
    { id: 15, type: 'centrifugalBooster', x: 400, y: 800, w: 120, h: 100, rot: 0 },

    // Stone pillars between boosters to chip away at for extra score
    { id: 20, type: 'wall', x: 1050, y: 600, w: 20, h: 200, rot: 0, meta: { material: 'stone' } },
    { id: 21, type: 'wall', x: 1050, y: 900, w: 20, h: 200, rot: 0, meta: { material: 'stone' } },
    { id: 22, type: 'wall', x: 1050, y: 300, w: 200, h: 20, rot: 0, meta: { material: 'stone' } },
    { id: 23, type: 'wall', x: 1050, y: 1280, w: 200, h: 20, rot: 0, meta: { material: 'stone' } },

    // Glass tubes clustered around each booster
    { id: 30, type: 'destroyableGlassTube', x: 600, y: 300, w: 60, h: 100, rot: 0 },
    { id: 31, type: 'destroyableGlassTube', x: 800, y: 300, w: 60, h: 100, rot: 0 },
    { id: 32, type: 'destroyableGlassTube', x: 1300, y: 300, w: 60, h: 100, rot: 0 },
    { id: 33, type: 'destroyableGlassTube', x: 1500, y: 300, w: 60, h: 100, rot: 0 },
    { id: 34, type: 'destroyableGlassTube', x: 600, y: 1300, w: 60, h: 100, rot: 0 },
    { id: 35, type: 'destroyableGlassTube', x: 800, y: 1300, w: 60, h: 100, rot: 0 },
    { id: 36, type: 'destroyableGlassTube', x: 1300, y: 1300, w: 60, h: 100, rot: 0 },
    { id: 37, type: 'destroyableGlassTube', x: 1500, y: 1300, w: 60, h: 100, rot: 0 },

    // Steel cage at the top — plate in the bottom ring reaches it
    { id: 40, type: 'wall', x: 1000, y: 140, w: 20, h: 200, rot: 0, meta: { material: 'metal' } },
    { id: 41, type: 'wall', x: 1200, y: 140, w: 20, h: 200, rot: 0, meta: { material: 'metal' } },
    { id: 42, type: 'wall', x: 1100, y: 60, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 43, type: 'wall', x: 1100, y: 260, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 44, type: 'overloadedGenerator', x: 1060, y: 150, w: 80, h: 80, rot: 0, meta: { link: 'plate18' } },
    { id: 45, type: 'overloadedGenerator', x: 1160, y: 150, w: 80, h: 80, rot: 0, meta: { link: 'plate18' } },

    { id: 50, type: 'pressurePlate', x: 1100, y: 1480, w: 80, h: 60, rot: 0, meta: { link: 'plate18' } },

    { id: 60, type: 'boss', x: 1900, y: 800, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'rainbow' },
    { id: 70, type: 'goal', x: 2000, y: 800, w: 120, h: 120, rot: 0 }
  ]
}

export default stage
