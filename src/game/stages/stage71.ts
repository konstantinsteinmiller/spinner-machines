import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 71: "Gravity Trap" ──────────────────────────────────────────
// A single massive gravity well anchors the arena center, ringed by
// concentric circles of glass tubes and a cage of walls. The spinner is
// pulled in, orbits, and takes glass with it until velocity decays.
const W = 2400, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const ring = (radius: number, count: number) =>
  Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    return {
      id: id(), type: 'destroyableGlassTube' as const,
      x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius,
      w: 40, h: 120, rot: a
    }
  })

const stage: Stage = {
  id: 'stage71',
  name: 'Gravity Trap',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Central gravity well (strong).
    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 160, h: 160, rot: 0 },

    // Three concentric glass rings.
    ...ring(400, 10),
    ...ring(600, 14),
    ...ring(850, 18),

    // Booster from spawn shoots tangentially into the rings.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: -Math.PI / 6 },

    boss(id, cx, 250, 78, 'demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
