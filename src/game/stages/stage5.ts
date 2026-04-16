import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Conveyor-driven vertical ascent.
const width = 2000
const height = 1800

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Zig-zag conveyor floors
  wall(300, 1500, 600, 20),
  wall(1700, 1500, 600, 20),
  { id: id(), type: 'conveyorBelt', x: 500, y: 1470, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'conveyorBelt', x: 1500, y: 1470, w: 400, h: 50, rot: Math.PI },

  wall(900, 1150, 600, 20),
  wall(1100, 1150, 600, 20, 0),
  { id: id(), type: 'conveyorBelt', x: 700, y: 1120, w: 400, h: 50, rot: Math.PI },
  { id: id(), type: 'conveyorBelt', x: 1300, y: 1120, w: 400, h: 50, rot: 0 },

  wall(300, 800, 600, 20),
  wall(1700, 800, 600, 20),
  { id: id(), type: 'conveyorBelt', x: 500, y: 770, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'conveyorBelt', x: 1500, y: 770, w: 400, h: 50, rot: Math.PI },

  // Side boosters to keep things moving
  { id: id(), type: 'centrifugalBooster', x: 960, y: 400, w: 120, h: 100, rot: -Math.PI / 2 },

  // Glass bonus pillars between conveyors
  m('destroyableGlassTube', 900, 1300, 40, 140),
  m('destroyableGlassTube', 1100, 1300, 40, 140),
  m('destroyableGlassTube', 900, 950, 40, 140),
  m('destroyableGlassTube', 1100, 950, 40, 140),

  // Generator near top
  m('overloadedGenerator', 600, 300, 80, 80),
  m('overloadedGenerator', 1400, 300, 80, 80),

  // Boss at top center
  wall(700, 200, 20, 200),
  wall(1300, 200, 20, 200),
  {
    id: id(), type: 'boss',
    x: 1000, y: 200, w: 200, h: 200, rot: 0,
    hp: 75, maxHp: 75, modelId: 'thunderstorm'
  },

  m('goal', 1000, 80, 90, 90),

  // ── Pressure plate cage (retrofit) ────────────────────────────────
  { id: id(), type: 'wall', x: 1750, y: 1100, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1750, y: 1320, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1640, y: 1210, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1860, y: 1210, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'overloadedGenerator', x: 1700, y: 1210, w: 80, h: 80, rot: 0, meta: { link: 'plateS5' } },
  { id: id(), type: 'overloadedGenerator', x: 1800, y: 1210, w: 80, h: 80, rot: 0, meta: { link: 'plateS5' } },
  { id: id(), type: 'destroyableGlassTube', x: 1750, y: 1150, w: 60, h: 60, rot: 0, meta: { link: 'plateS5' } },
  { id: id(), type: 'pressurePlate', x: 600, y: 900, w: 90, h: 70, rot: 0, meta: { link: 'plateS5' } },

  // ── Gear system: on right wall, rotates a wall to open a direct path upward ──
  { id: id(), type: 'gearSystem', x: 1980, y: 1200, w: 100, h: 100, rot: 0, meta: { link: 'gearS5' } },
  { id: id(), type: 'wall', x: 1700, y: 1150, w: 140, h: 20, rot: 0, meta: { material: 'stone', link: 'gearS5' } }
]

const stage5: Stage = {
  id: 'stage-5',
  name: 'Conveyor Chaos',
  width,
  height,
  spawn: { x: 200, y: 1650 },
  goal: { x: 1000, y: 80 },
  machines,
  starThresholds: [0, 600, 1200],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'thunderstorm'
}

export default stage5
