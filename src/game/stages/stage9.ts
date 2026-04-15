import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Big square spiral from outside in.
const width = 2400
const height = 2400

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Spiral ring 1
  wall(width / 2, 300, 1800, 24),
  wall(2100, width / 2 + 100, 24, 1800),
  wall(width / 2 + 100, 2100, 1800, 24),
  wall(300, width / 2, 24, 1600),

  // Spiral ring 2
  wall(width / 2 + 200, 600, 1200, 24),
  wall(1800, width / 2 + 200, 24, 1200),
  wall(width / 2 + 200, 1800, 1200, 24),
  wall(600, width / 2 + 100, 24, 1000),

  // Spiral ring 3
  wall(width / 2 + 100, 900, 700, 24),
  wall(1500, width / 2 + 100, 24, 700),
  wall(width / 2 + 100, 1500, 700, 24),

  // Boosters guiding around each ring
  { id: id(), type: 'centrifugalBooster', x: 1200, y: 180, w: 120, h: 100, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 2200, y: 1200, w: 120, h: 100, rot: Math.PI / 2 },
  { id: id(), type: 'centrifugalBooster', x: 1200, y: 2200, w: 120, h: 100, rot: Math.PI },
  { id: id(), type: 'centrifugalBooster', x: 180, y: 1200, w: 120, h: 100, rot: -Math.PI / 2 },

  // Gravity wells tucked at corners
  m('gravityWell', 500, 500, 80, 80),
  m('gravityWell', 1900, 500, 80, 80),
  m('gravityWell', 1900, 1900, 80, 80),
  m('gravityWell', 500, 1900, 80, 80),

  // Generators around inner ring
  m('overloadedGenerator', 1100, 760, 80, 80),
  m('overloadedGenerator', 1400, 760, 80, 80),

  // Glass bonuses in inner ring
  m('destroyableGlassTube', 1000, 1100, 40, 140),
  m('destroyableGlassTube', 1400, 1100, 40, 140),
  m('destroyableGlassTube', 1000, 1350, 40, 140),
  m('destroyableGlassTube', 1400, 1350, 40, 140),

  // Boss at the spiral's heart
  {
    id: id(), type: 'boss',
    x: 1200, y: 1220, w: 220, h: 220, rot: 0,
    hp: 90, maxHp: 90, modelId: 'rainbow'
  },

  m('goal', 1200, 1420, 90, 90),

  // ── Pressure plate cage (retrofit) ────────────────────────────────
  { id: id(), type: 'wall', x: 2200, y: 90, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 2200, y: 310, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 2090, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 2310, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'overloadedGenerator', x: 2150, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS9' } },
  { id: id(), type: 'overloadedGenerator', x: 2250, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS9' } },
  { id: id(), type: 'destroyableGlassTube', x: 2200, y: 140, w: 60, h: 60, rot: 0, meta: { link: 'plateS9' } },
  { id: id(), type: 'pressurePlate', x: 1200, y: 2200, w: 90, h: 70, rot: 0, meta: { link: 'plateS9' } }
]

const stage9: Stage = {
  id: 'stage-9',
  name: 'Inward Spiral',
  width,
  height,
  spawn: { x: 180, y: 180 },
  goal: { x: 1200, y: 1420 },
  machines,
  starThresholds: [0, 750, 1500],
  launchPenalty: 65,
  bossKillBonus: 380,
  bossModelId: 'rainbow'
}

export default stage9
