import type { Stage } from '@/types/stage'

// ── Stage 16: "Boss Approach" ─────────────────────────────────────────
// Funnel of walls channeling the spinner toward a single full-hp boss.
// Minimal machines en route — this stage is about precision and the
// boss kill bonus, not wide-area score.
const stage: Stage = {
  id: 'stage16',
  name: 'Boss Approach',
  width: 2200,
  height: 1400,
  spawn: { x: 200, y: 700 },
  goal: { x: 2000, y: 700 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 400,
  bossModelId: 'thunderstorm',
  machines: [
    { id: 1, type: 'wall', x: 1100, y: 20, w: 2200, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1100, y: 1380, w: 2200, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 700, w: 40, h: 1400, rot: 0 },
    { id: 4, type: 'wall', x: 2180, y: 700, w: 40, h: 1400, rot: 0 },

    // Funnel top and bottom — stone so the player can chip through if
    // they want the extra walls score.
    { id: 10, type: 'wall', x: 800, y: 400, w: 20, h: 300, rot: 0.3, meta: { material: 'stone' } },
    { id: 11, type: 'wall', x: 800, y: 1000, w: 20, h: 300, rot: -0.3, meta: { material: 'stone' } },
    { id: 12, type: 'wall', x: 1200, y: 300, w: 20, h: 300, rot: 0.5, meta: { material: 'stone' } },
    { id: 13, type: 'wall', x: 1200, y: 1100, w: 20, h: 300, rot: -0.5, meta: { material: 'stone' } },

    // A launcher near the funnel entry adds a short-cut route
    { id: 20, type: 'pneumaticLauncher', x: 500, y: 700, w: 90, h: 60, rot: 0 },

    // Steel cage pressure-plate cluster tucked above the funnel
    { id: 30, type: 'wall', x: 1500, y: 160, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 31, type: 'wall', x: 1720, y: 160, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
    { id: 32, type: 'wall', x: 1610, y: 60, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 33, type: 'wall', x: 1610, y: 280, w: 240, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 34, type: 'overloadedGenerator', x: 1560, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plate16' } },
    { id: 35, type: 'overloadedGenerator', x: 1660, y: 170, w: 80, h: 80, rot: 0, meta: { link: 'plate16' } },
    { id: 36, type: 'destroyableGlassTube', x: 1610, y: 100, w: 60, h: 60, rot: 0, meta: { link: 'plate16' } },

    { id: 40, type: 'pressurePlate', x: 1100, y: 1200, w: 80, h: 60, rot: 0, meta: { link: 'plate16' } },

    // The big one — full-power boss, double score from the bonus.
    { id: 50, type: 'boss', x: 1750, y: 700, w: 180, h: 180, rot: 0, hp: 60, maxHp: 60, modelId: 'thunderstorm' },
    { id: 60, type: 'goal', x: 2000, y: 700, w: 120, h: 120, rot: 0 }
  ]
}

export default stage
