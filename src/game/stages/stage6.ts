import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Compact square arena — pure boss fight.
const width = 1600
const height = 1600

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Diamond of diagonal walls forming an inner chamber
  wall(width / 2, 300, 600, 24, Math.PI / 4),
  wall(width / 2, 300, 600, 24, -Math.PI / 4),
  wall(width / 2, 1300, 600, 24, Math.PI / 4),
  wall(width / 2, 1300, 600, 24, -Math.PI / 4),

  // One right-facing launcher at the spawn side; the other three
  // cardinal positions were non-right launchers (up/down/left) which
  // the sprite cannot depict, so they're swapped for centrifugal
  // boosters — same "keep the blade bouncing" role, rotation-agnostic.
  { id: id(), type: 'pneumaticLauncher', x: 120, y: 800, w: 100, h: 80, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 1480, y: 800, w: 120, h: 100, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 800, y: 120, w: 120, h: 100, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 800, y: 1480, w: 120, h: 100, rot: 0 },

  // Gravity wells in the corners
  m('gravityWell', 400, 400, 80, 80),
  m('gravityWell', 1200, 400, 80, 80),
  m('gravityWell', 400, 1200, 80, 80),
  m('gravityWell', 1200, 1200, 80, 80),

  // Generators ringed around the boss
  m('overloadedGenerator', 600, 800, 80, 80),
  m('overloadedGenerator', 1000, 800, 80, 80),
  m('overloadedGenerator', 800, 600, 80, 80),
  m('overloadedGenerator', 800, 1000, 80, 80),

  // The boss at the center
  {
    id: id(), type: 'boss',
    x: 800, y: 800, w: 220, h: 220, rot: 0,
    hp: 100, maxHp: 100, modelId: 'boulder'
  },

  // Goal tucked behind a small wall
  wall(1400, 1450, 200, 20),
  m('goal', 1400, 1380, 90, 90),

  // ── Pressure plate cage (retrofit) ────────────────────────────────
  { id: id(), type: 'wall', x: 1300, y: 90, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1300, y: 310, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1190, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1410, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'overloadedGenerator', x: 1250, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS6' } },
  { id: id(), type: 'overloadedGenerator', x: 1350, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS6' } },
  { id: id(), type: 'destroyableGlassTube', x: 1300, y: 140, w: 60, h: 60, rot: 0, meta: { link: 'plateS6' } },
  { id: id(), type: 'pressurePlate', x: 300, y: 1300, w: 90, h: 70, rot: 0, meta: { link: 'plateS6' } }
]

const stage6: Stage = {
  id: 'stage-6',
  name: 'Pinball Chamber',
  width,
  height,
  spawn: { x: 200, y: 800 },
  goal: { x: 1400, y: 1380 },
  machines,
  starThresholds: [0, 650, 1300],
  launchPenalty: 55,
  bossKillBonus: 350,
  bossModelId: 'boulder'
}

export default stage6
