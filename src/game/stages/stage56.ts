import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 56: "Glassy Spiral" ─────────────────────────────────────────
// Glass tubes arranged along an Archimedean spiral centered on the
// arena. A well-placed shot can plough tube-to-tube along the curve in
// one long chain. Gravity well at the center pulls the spinner in.
const W = 2400, H = 2400
const id = mkId()

const cx = W / 2, cy = H / 2
const tubes = Array.from({ length: 48 }, (_, i) => {
  const t = i / 48
  const angle = t * Math.PI * 5  // 2.5 turns
  const radius = 200 + t * 850
  return {
    id: id(), type: 'destroyableGlassTube' as const,
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
    w: 40, h: 120, rot: angle + Math.PI / 2
  }
})

const stage: Stage = {
  id: 'stage56',
  name: 'Glassy Spiral',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: cx, y: cy },
  starThresholds: [0, 900, 1500],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    ...tubes,

    // Center attractor.
    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 110, h: 110, rot: 0 },

    // Launcher aimed tangent to the outer spiral.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy - 250, 85, 'demon', 160),
    goal(id, cx, cy)
  ]
}

export default stage
