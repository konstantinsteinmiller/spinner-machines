import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Twisting corridors with diagonal walls.
const width = 2400
const height = 1600

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Diagonal corridor walls — bounces off tilted surfaces
  wall(500, 500, 600, 24, Math.PI / 6),
  wall(500, 1100, 600, 24, -Math.PI / 6),
  wall(1200, 500, 600, 24, -Math.PI / 6),
  wall(1200, 1100, 600, 24, Math.PI / 6),
  wall(1900, 500, 600, 24, Math.PI / 6),
  wall(1900, 1100, 600, 24, -Math.PI / 6),

  // Bumper gravity wells
  m('gravityWell', 500, 800, 80, 80),
  m('gravityWell', 1200, 800, 80, 80),
  m('gravityWell', 1900, 800, 80, 80),

  // Chain generators along the path
  m('overloadedGenerator', 800, 300, 80, 80),
  m('overloadedGenerator', 800, 1300, 80, 80),
  m('overloadedGenerator', 1500, 300, 80, 80),
  m('overloadedGenerator', 1500, 1300, 80, 80),

  // A launcher slingshots from bottom lane back up
  { id: id(), type: 'pneumaticLauncher', x: 300, y: 1400, w: 100, h: 80, rot: -Math.PI / 2 },

  // Glass rewards
  m('destroyableGlassTube', 1100, 800, 40, 160),
  m('destroyableGlassTube', 1800, 800, 40, 160),

  // Boss chamber
  wall(2180, 400, 20, 800),
  {
    id: id(), type: 'boss',
    x: 2300, y: 800, w: 180, h: 180, rot: 0,
    hp: 85, maxHp: 85, modelId: 'sandstorm'
  },

  m('goal', 2300, 1200, 90, 90)
]

const stage8: Stage = {
  id: 'stage-8',
  name: 'Twisting Halls',
  width,
  height,
  spawn: { x: 200, y: 800 },
  goal: { x: 2300, y: 1200 },
  machines,
  starThresholds: [0, 600, 1200],
  launchPenalty: 85,
  bossKillBonus: 340,
  bossModelId: 'sandstorm'
}

export default stage8
