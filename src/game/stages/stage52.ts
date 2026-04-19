import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 52: "Crystal Cavern" ────────────────────────────────────────
// Organic glass formations — clumps of 3-5 tubes at varied rotations
// scattered through the cave-like arena. Feels less gridded than stage
// 51, rewards aggressive exploration over straight-line ploughing.
const W = 2800, H = 2000
const id = mkId()

const cluster = (cx: number, cy: number, n: number, radius: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return {
      id: id(), type: 'destroyableGlassTube' as const,
      x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius,
      w: 40, h: 120, rot: a
    }
  })

const stage: Stage = {
  id: 'stage52',
  name: 'Crystal Cavern',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 650, 1200],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Cave walls — wooden, bouncy ricochet.
    wall(id, 900, 250, 400, 20, 'wood'),
    wall(id, 1400, H - 250, 400, 20, 'wood'),
    wall(id, 2100, 250, 400, 20, 'wood'),

    // 7 crystal clusters.
    ...cluster(700, 700, 5, 130),
    ...cluster(1200, 1200, 5, 130),
    ...cluster(1700, 600, 4, 110),
    ...cluster(1900, 1300, 5, 130),
    ...cluster(2300, 900, 5, 130),
    ...cluster(900, 1400, 4, 110),
    ...cluster(1500, 500, 4, 110),

    // Gravity wells keep the spinner bouncing through clusters.
    { id: id(), type: 'gravityWell', x: 1200, y: H / 2, w: 100, h: 100, rot: 0 },
    { id: id(), type: 'gravityWell', x: 1900, y: H / 2, w: 100, h: 100, rot: 0 },

    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },

    boss(id, 2550, H / 2, 70, 'demon', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
