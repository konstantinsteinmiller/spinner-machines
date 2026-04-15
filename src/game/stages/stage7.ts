import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Glass Palace — mostly destroyable tubes for huge point runs.
const width = 2200
const height = 1400

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // Entry corridor
  wall(400, 400, 600, 20),
  wall(400, 1000, 600, 20),
  { id: id(), type: 'centrifugalBooster', x: 600, y: 700, w: 120, h: 100, rot: 0 },

  // Huge glass tube grid
  ...Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 8 }, (_, c) =>
      m('destroyableGlassTube', 900 + c * 110, 300 + r * 160, 40, 120)
    )
  ).flat(),

  // Mid-grid boosters and a gravity well
  m('gravityWell', 1400, 700, 80, 80),
  { id: id(), type: 'centrifugalBooster', x: 1900, y: 400, w: 120, h: 100, rot: Math.PI / 2 },
  { id: id(), type: 'centrifugalBooster', x: 1900, y: 1000, w: 120, h: 100, rot: -Math.PI / 2 },

  // Boss against far wall
  wall(2000, 600, 20, 500),
  {
    id: id(), type: 'boss',
    x: 2080, y: 700, w: 180, h: 180, rot: 0,
    hp: 70, maxHp: 70, modelId: 'teleporter'
  },

  m('goal', 2100, 1200, 90, 90),

  // ── Pressure plate cage (retrofit) ────────────────────────────────
  { id: id(), type: 'wall', x: 1100, y: 90, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1100, y: 310, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 990, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1210, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'overloadedGenerator', x: 1050, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS7' } },
  { id: id(), type: 'overloadedGenerator', x: 1150, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS7' } },
  { id: id(), type: 'destroyableGlassTube', x: 1100, y: 140, w: 60, h: 60, rot: 0, meta: { link: 'plateS7' } },
  { id: id(), type: 'pressurePlate', x: 400, y: 1200, w: 90, h: 70, rot: 0, meta: { link: 'plateS7' } }
]

const stage7: Stage = {
  id: 'stage-7',
  name: 'Glass Palace',
  width,
  height,
  spawn: { x: 200, y: 700 },
  goal: { x: 2100, y: 1200 },
  machines,
  starThresholds: [0, 650, 1300],
  launchPenalty: 55,
  bossKillBonus: 300,
  bossModelId: 'teleporter'
}

export default stage7
