import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 41: "Domino" ────────────────────────────────────────────────
// A single long line of generators spaced within their blast radius so
// the first detonation cascades along the entire row. Hitting the
// domino head with speed is worth almost half the 3-star threshold in
// one go.
const W = 3000, H = 1200
const id = mkId()

const stage: Stage = {
  id: 'stage41',
  name: 'Domino',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 45,
  bossKillBonus: 280,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // 12 generators chained left-to-right; spacing 140 << BLAST_RADIUS 160.
    ...Array.from({ length: 12 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 600 + i * 140, y: H / 2, w: 80, h: 80, rot: 0
    })),

    // Top & bottom guide walls so the spinner tends to hit the head.
    wall(id, W / 2, 300, 1600, 20, 'wood'),
    wall(id, W / 2, H - 300, 1600, 20, 'wood'),

    // A launcher on the left fires the spinner at the first domino.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: 0 },

    // Glass curtain at the far end rewards the blast-follow-through.
    ...Array.from({ length: 4 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 2400 + i * 100, y: H / 2, w: 40, h: 160, rot: 0
    })),

    boss(id, W - 400, H / 2, 55, 'fire', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
