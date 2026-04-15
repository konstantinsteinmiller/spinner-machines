import type { Stage } from '@/types/stage'

// ── Stage 14: "Tube Garden" ───────────────────────────────────────────
// Dense thickets of destroyable glass tubes — every launch is a tube-
// shattering frenzy. Great score-dense stage that rewards just swinging
// through the whole arena.
const stage: Stage = {
  id: 'stage14',
  name: 'Tube Garden',
  width: 2400,
  height: 1400,
  spawn: { x: 200, y: 700 },
  goal: { x: 2200, y: 700 },
  starThresholds: [0, 700, 1400],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'forest-dragon',
  machines: [
    { id: 1, type: 'wall', x: 1200, y: 20, w: 2400, h: 40, rot: 0 },
    { id: 2, type: 'wall', x: 1200, y: 1380, w: 2400, h: 40, rot: 0 },
    { id: 3, type: 'wall', x: 20, y: 700, w: 40, h: 1400, rot: 0 },
    { id: 4, type: 'wall', x: 2380, y: 700, w: 40, h: 1400, rot: 0 },

    // Tube thicket — grid of glass tubes arranged in 4 rows × 6 cols
    ...Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => ({
        id: 100 + r * 10 + c,
        type: 'destroyableGlassTube' as const,
        x: 500 + c * 260,
        y: 300 + r * 260,
        w: 60,
        h: 120,
        rot: 0
      }))
    ).flat(),

    // Two centrifugal boosters flanking the thicket so the spinner
    // circulates several times per launch.
    { id: 200, type: 'centrifugalBooster', x: 400, y: 300, w: 120, h: 100, rot: 0 },
    { id: 201, type: 'centrifugalBooster', x: 400, y: 1100, w: 120, h: 100, rot: 0 },
    { id: 202, type: 'centrifugalBooster', x: 2000, y: 300, w: 120, h: 100, rot: 0 },
    { id: 203, type: 'centrifugalBooster', x: 2000, y: 1100, w: 120, h: 100, rot: 0 },

    // Steel cage with linked generators — plate in the thicket's path
    { id: 210, type: 'wall', x: 1100, y: 80, w: 20, h: 160, rot: 0, meta: { material: 'metal' } },
    { id: 211, type: 'wall', x: 1300, y: 80, w: 20, h: 160, rot: 0, meta: { material: 'metal' } },
    { id: 212, type: 'wall', x: 1200, y: 80, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 213, type: 'wall', x: 1200, y: 240, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
    { id: 214, type: 'overloadedGenerator', x: 1160, y: 160, w: 80, h: 80, rot: 0, meta: { link: 'plate14' } },
    { id: 215, type: 'overloadedGenerator', x: 1260, y: 160, w: 80, h: 80, rot: 0, meta: { link: 'plate14' } },

    { id: 220, type: 'pressurePlate', x: 1200, y: 1200, w: 80, h: 60, rot: 0, meta: { link: 'plate14' } },

    { id: 230, type: 'boss', x: 2000, y: 700, w: 140, h: 140, rot: 0, hp: 50, maxHp: 50, modelId: 'forest-dragon' },
    { id: 240, type: 'goal', x: 2200, y: 700, w: 120, h: 120, rot: 0 }
  ]
}

export default stage
