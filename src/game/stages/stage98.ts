import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 98: "Maelstrom" ─────────────────────────────────────────────
// Whirlpool-style — gravity well at center, conveyors spiraling in
// toward it, and the boss at the vortex core. Everything is designed
// to pull the spinner into the center for a final crash on the boss.
const W = 2600, H = 2600
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage98',
  name: 'Maelstrom',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: cx, y: cy },
  starThresholds: [0, 1000, 1600],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Central gravity well (strong pull).
    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 180, h: 180, rot: 0 },

    // Spiral conveyor belts (each tangent to its radius).
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      const r = 400 + (i % 3) * 200
      return {
        id: id(), type: 'conveyorBelt' as const,
        x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r,
        w: 400, h: 60, rot: a + Math.PI / 2 + 0.3  // tangent with a slight inward tilt
      }
    }),

    // Glass tubes peppered through.
    ...Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2 + 0.3
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 900, y: cy + Math.sin(a) * 900,
        w: 40, h: 130, rot: a
      }
    }),

    // Perimeter boosters (slingshot spinners inward).
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 1100, y: cy + Math.sin(a) * 1100,
        w: 130, h: 100, rot: a + Math.PI
      }
    }),

    boss(id, cx, cy, 120, 'phoenix', 160),
    goal(id, cx, cy)
  ]
}

export default stage
