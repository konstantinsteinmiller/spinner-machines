import type { Stage, Machine } from '@/types/stage'

let nextId = 1
const id = () => nextId++
const wall = (x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type: 'wall', x, y, w, h, rot
})
const m = (type: Machine['type'], x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id: id(), type, x, y, w, h, rot
})

// Final gauntlet — uses every machine type.
const width = 3000
const height = 1800

const machines: Machine[] = [
  wall(width / 2, 20, width, 40),
  wall(width / 2, height - 20, width, 40),
  wall(20, height / 2, 40, height),
  wall(width - 20, height / 2, 40, height),

  // ── Section 1: Booster slalom ──
  wall(500, 500, 700, 20),
  wall(500, 1300, 700, 20),
  { id: id(), type: 'centrifugalBooster', x: 300, y: 900, w: 120, h: 100, rot: 0 },
  { id: id(), type: 'centrifugalBooster', x: 700, y: 900, w: 120, h: 100, rot: 0 },
  m('destroyableGlassTube', 500, 900, 40, 160),
  m('destroyableGlassTube', 900, 900, 40, 160),

  // ── Section 2: Rail + conveyor handoff ──
  wall(1100, 500, 20, 800),
  { id: id(), type: 'magneticRail', x: 1400, y: 600, w: 500, h: 50, rot: 0 },
  { id: id(), type: 'conveyorBelt', x: 1400, y: 1200, w: 500, h: 50, rot: Math.PI },
  m('gravityWell', 1700, 900, 80, 80),

  // ── Section 3: Generator chain ──
  wall(1800, 400, 20, 1000),
  m('overloadedGenerator', 1950, 500, 80, 80),
  m('overloadedGenerator', 2050, 600, 80, 80),
  m('overloadedGenerator', 1950, 700, 80, 80),
  m('overloadedGenerator', 2050, 800, 80, 80),
  m('overloadedGenerator', 1950, 900, 80, 80),
  m('overloadedGenerator', 2050, 1000, 80, 80),
  m('overloadedGenerator', 1950, 1100, 80, 80),
  m('overloadedGenerator', 2050, 1200, 80, 80),

  // ── Section 4: Pneumatic tube + glass ──
  wall(2200, 400, 20, 1000),
  { id: id(), type: 'pneumaticLauncher', x: 2300, y: 1500, w: 100, h: 80, rot: -Math.PI / 2 },
  ...Array.from({ length: 5 }, (_, i) =>
    m('destroyableGlassTube', 2350 + i * 70, 500, 40, 120)
  ),
  ...Array.from({ length: 5 }, (_, i) =>
    m('destroyableGlassTube', 2350 + i * 70, 900, 40, 120)
  ),

  // ── Final boss chamber ──
  wall(2700, 400, 20, 1000),
  {
    id: id(), type: 'boss',
    x: 2820, y: 900, w: 260, h: 260, rot: 0,
    hp: 120, maxHp: 120, modelId: 'dark'
  },

  m('goal', 2900, 1500, 90, 90),

  // ── Pressure plate cage (retrofit) ────────────────────────────────
  { id: id(), type: 'wall', x: 1500, y: 90, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1500, y: 310, w: 220, h: 20, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1390, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'wall', x: 1610, y: 200, w: 20, h: 220, rot: 0, meta: { material: 'metal' } },
  { id: id(), type: 'overloadedGenerator', x: 1450, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS10' } },
  { id: id(), type: 'overloadedGenerator', x: 1550, y: 200, w: 80, h: 80, rot: 0, meta: { link: 'plateS10' } },
  { id: id(), type: 'destroyableGlassTube', x: 1500, y: 140, w: 60, h: 60, rot: 0, meta: { link: 'plateS10' } },
  { id: id(), type: 'pressurePlate', x: 1500, y: 1650, w: 90, h: 70, rot: 0, meta: { link: 'plateS10' } }
]

const stage10: Stage = {
  id: 'stage-10',
  name: 'Final Gauntlet',
  width,
  height,
  spawn: { x: 200, y: 900 },
  goal: { x: 2900, y: 1500 },
  machines,
  starThresholds: [0, 800, 1600],
  launchPenalty: 70,
  bossKillBonus: 500,
  bossModelId: 'dark'
}

export default stage10
