import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Big open maze with gravity wells steering the blade.
const width = 2400
const height = 1600

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Interior maze walls
  wall(600, 400, 20, 600),
  wall(1000, 900, 20, 600),
  wall(1400, 400, 20, 600),
  wall(1800, 900, 20, 600),
  wall(800, 200, 420, 20),
  wall(1600, 200, 420, 20),
  wall(800, 1400, 420, 20),
  wall(1600, 1400, 420, 20),

  // Gravity well grid
  m('gravityWell', 800, 500, 80, 80),
  m('gravityWell', 1200, 700, 80, 80),
  m('gravityWell', 1600, 500, 80, 80),
  m('gravityWell', 800, 1100, 80, 80),
  m('gravityWell', 1600, 1100, 80, 80),

  // Glass bonuses between cells
  m('destroyableGlassTube', 400, 300, 40, 120),
  m('destroyableGlassTube', 400, 1300, 40, 120),
  m('destroyableGlassTube', 2000, 300, 40, 120),
  m('destroyableGlassTube', 2000, 1300, 40, 120),

  // One booster to traverse the big space
  { id: id(), type: 'centrifugalBooster', x: 400, y: 800, w: 120, h: 100, rot: 0 },

  // Boss in central chamber
  {
    id: id(), type: 'boss',
    x: 2150, y: 800, w: 200, h: 200, rot: 0,
    hp: 80, maxHp: 80, modelId: 'tornado'
  },

  m('goal', 2280, 800, 90, 90)
]

const stage3: Stage = {
  id: 'stage-3',
  name: 'Gravity Maze',
  width,
  height,
  spawn: { x: 200, y: 800 },
  goal: { x: 2280, y: 800 },
  machines,
  starThresholds: [0, 450, 900],
  launchPenalty: 70,
  bossKillBonus: 300,
  bossModelId: 'tornado'
}

export default stage3
