import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Small tight arena, heavy on chain generators.
const width = 1800
const height = 1200

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Narrow funnel at start
  wall(350, 420, 500, 20),
  wall(350, 780, 500, 20),
  { id: id(), type: 'centrifugalBooster', x: 520, y: 600, w: 120, h: 100, rot: 0 },

  // First generator cluster
  m('overloadedGenerator', 760, 500, 80, 80),
  m('overloadedGenerator', 860, 600, 80, 80),
  m('overloadedGenerator', 760, 700, 80, 80),
  m('overloadedGenerator', 660, 600, 80, 80),

  // Diagonal wall redirect
  wall(1000, 400, 300, 24, Math.PI / 5),
  wall(1000, 800, 300, 24, -Math.PI / 5),

  // Second chain cluster
  m('overloadedGenerator', 1200, 520, 80, 80),
  m('overloadedGenerator', 1300, 600, 80, 80),
  m('overloadedGenerator', 1200, 680, 80, 80),
  m('overloadedGenerator', 1100, 600, 80, 80),

  // Pneumatic kicker fires rightward through the lower corridor,
  // pushing the spinner toward the boss room wall gap.
  { id: id(), type: 'pneumaticLauncher', x: 1000, y: 900, w: 100, h: 80, rot: 0 },

  // Boss room at top-right
  wall(1550, 300, 20, 480),
  {
    id: id(), type: 'boss',
    x: 1640, y: 300, w: 180, h: 180, rot: 0,
    hp: 70, maxHp: 70, modelId: 'dark'
  },

  m('goal', 1640, 500, 90, 90),

  // ── Pressure plate cage (retrofit) ────────────────────────────────
  { id: id(), type: 'wall', x: 900, y: 70, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 900, y: 290, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 790, y: 180, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1010, y: 180, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'overloadedGenerator', x: 850, y: 180, w: 80, h: 80, rot: 0, meta: { link: 'plateS2' } },
  { id: id(), type: 'overloadedGenerator', x: 950, y: 180, w: 80, h: 80, rot: 0, meta: { link: 'plateS2' } },
  { id: id(), type: 'destroyableGlassTube', x: 900, y: 120, w: 60, h: 60, rot: 0, meta: { link: 'plateS2' } },
  { id: id(), type: 'pressurePlate', x: 900, y: 1000, w: 90, h: 70, rot: 0, meta: { link: 'plateS2' } }
]

const stage2: Stage = {
  id: 'stage-2',
  name: 'Twin Generators',
  width,
  height,
  spawn: { x: 180, y: 600 },
  goal: { x: 1640, y: 500 },
  machines,
  starThresholds: [0, 600, 1200],
  launchPenalty: 50,
  bossKillBonus: 280,
  bossModelId: 'dark'
}

export default stage2
