import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 55: "Tube Forest" ───────────────────────────────────────────
// A dense, irregular forest of vertical glass tubes. The spinner has to
// plough through many of them to reach the boss in the clearing at
// center. Tube density is high enough that speed + aim wins big.
const W = 2800, H = 2000
const id = mkId()

// 40 randomly-placed tubes — but deterministic (fixed positions).
const tubePositions: [number, number][] = [
  [500, 400], [640, 300], [780, 500], [920, 350],
  [1060, 460], [1200, 310], [1340, 520], [1480, 380],
  [2000, 430], [2140, 290], [2280, 510], [2420, 370],
  [500, 700], [640, 850], [780, 720], [920, 890],
  [1060, 780], [1200, 910], [1340, 760], [1480, 880],
  [2000, 770], [2140, 900], [2280, 760], [2420, 880],
  [500, 1200], [640, 1350], [780, 1180], [920, 1360],
  [1060, 1240], [1200, 1390], [1340, 1210], [1480, 1370],
  [2000, 1250], [2140, 1390], [2280, 1220], [2420, 1380],
  [660, 1600], [1100, 1620], [2080, 1600], [2380, 1620]
]

const stage: Stage = {
  id: 'stage55',
  name: 'Tube Forest',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    ...tubePositions.map(([x, y]) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x, y, w: 40, h: 140, rot: 0
    })),

    // Clearing at center — boss here.
    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, W / 2, H / 2, 75, 'fire', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
