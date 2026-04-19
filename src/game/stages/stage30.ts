import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal, box, grid } from './_helpers'

// ── Stage 30: "Grand Clock" ───────────────────────────────────────────
// The chapter finale. Eight gears arrayed as the hours of a clock face
// drive eight wall segments of a giant rotating door. The boss sits in
// the middle, but the door only truly parts when every gear has been
// hit at least once. Miss one and there's still a metal sliver
// blocking the final approach.
const W = 2800, H = 2800
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage30',
  name: 'Grand Clock',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 600, 1100],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'thunderstorm',
  machines: [
    ...boundary(id, W, H),

    // Clock face — 8 gear-gated wall segments around a circle r=600.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4
      return linked({
        id: id(), type: 'wall' as const,
        x: cx + Math.cos(a) * 600, y: cy + Math.sin(a) * 600,
        w: 420, h: 30, rot: a + Math.PI / 2,
        meta: { material: 'metal' as const }
      }, `h${i}`)
    }),

    // Gears — on the outside of each wall segment.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4
      return gear(id, cx + Math.cos(a) * 1000, cy + Math.sin(a) * 1000, `h${i}`, 70, 100)
    }),

    // Inside the face: generator octagon for chain fireworks.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4 + Math.PI / 8
      return {
        id: id(), type: 'overloadedGenerator' as const,
        x: cx + Math.cos(a) * 360, y: cy + Math.sin(a) * 360, w: 80, h: 80, rot: 0
      }
    }),

    // Glass ring between gears and face — bounce scoring.
    ...Array.from({ length: 12 }, (_, i) => {
      const a = i * Math.PI / 6
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 820, y: cy + Math.sin(a) * 820, w: 40, h: 140, rot: a
      }
    }),

    // 4 boosters on the cardinal edges to keep orbit up.
    { id: id(), type: 'centrifugalBooster', x: 200, y: cy, w: 120, h: 100, rot: 0 },
    { id: id(), type: 'centrifugalBooster', x: W - 200, y: cy, w: 120, h: 100, rot: Math.PI },
    { id: id(), type: 'centrifugalBooster', x: cx, y: 200, w: 120, h: 100, rot: Math.PI / 2 },
    { id: id(), type: 'centrifugalBooster', x: cx, y: H - 200, w: 120, h: 100, rot: -Math.PI / 2 },

    boss(id, cx, cy, 100, 'thunderstorm', 200),
    goal(id, W - 220, cy)
  ]
}

export default stage
