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

  // Pneumatic kicker back to boss
  { id: id(), type: 'pneumaticLauncher', x: 1400, y: 900, w: 100, h: 80, rot: -Math.PI / 2 },

  // Boss room at top-right
  wall(1550, 300, 20, 480),
  {
    id: id(), type: 'boss',
    x: 1640, y: 300, w: 180, h: 180, rot: 0,
    hp: 70, maxHp: 70, modelId: 'dark'
  },

  m('goal', 1640, 500, 90, 90)
]

const stage2: Stage = {
  id: 'stage-2',
  name: 'Twin Generators',
  width,
  height,
  spawn: { x: 180, y: 600 },
  goal: { x: 1640, y: 500 },
  machines,
  starThresholds: [0, 400, 800],
  launchPenalty: 70,
  bossKillBonus: 280,
  bossModelId: 'dark'
}

export default stage2
