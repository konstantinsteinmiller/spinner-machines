import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Wide horizontal rail network.
const width = 2800
const height = 1200

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Three horizontal lanes
  wall(width / 2, 420, width - 200, 20),
  wall(width / 2, 780, width - 200, 20),

  // Multiple magnetic rails chained across
  { id: id(), type: 'magneticRail', x: 500, y: 220, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'magneticRail', x: 1200, y: 220, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'magneticRail', x: 1900, y: 220, w: 400, h: 50, rot: 0 },

  { id: id(), type: 'magneticRail', x: 500, y: 600, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'magneticRail', x: 1200, y: 600, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'magneticRail', x: 1900, y: 600, w: 400, h: 50, rot: 0 },

  { id: id(), type: 'magneticRail', x: 500, y: 980, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'magneticRail', x: 1200, y: 980, w: 400, h: 50, rot: 0 },
  { id: id(), type: 'magneticRail', x: 1900, y: 980, w: 400, h: 50, rot: 0 },

  // Boosters between rails
  { id: id(), type: 'centrifugalBooster', x: 900, y: 220, w: 120, h: 100, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 1600, y: 600, w: 120, h: 100, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 900, y: 980, w: 120, h: 100, rot: 0 },

  // Some glass bonuses between lanes
  m('destroyableGlassTube', 800, 320, 40, 80),
  m('destroyableGlassTube', 1500, 320, 40, 80),
  m('destroyableGlassTube', 800, 880, 40, 80),
  m('destroyableGlassTube', 1500, 880, 40, 80),

  // Boss at far right
  wall(2400, 300, 20, 600),
  {
    id: id(), type: 'boss',
    x: 2550, y: 600, w: 200, h: 200, rot: 0,
    hp: 75, maxHp: 75, modelId: 'diamond'
  },

  m('goal', 2700, 600, 90, 90)
]

const stage4: Stage = {
  id: 'stage-4',
  name: 'Rail Network',
  width,
  height,
  spawn: { x: 200, y: 600 },
  goal: { x: 2700, y: 600 },
  machines,
  starThresholds: [0, 500, 1000],
  launchPenalty: 80,
  bossKillBonus: 320,
  bossModelId: 'diamond'
}

export default stage4
