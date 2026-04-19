import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 67: "Bounce House" ──────────────────────────────────────────
// Six centrifugal boosters at the cardinal + diagonal points. The
// spinner pings between them indefinitely if aimed right, racking up
// glass destruction on each pass.
const W = 2400, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage67',
  name: 'Bounce House',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: cx, y: cy },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // 8 boosters arranged around the room.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 900, y: cy + Math.sin(a) * 900,
        w: 120, h: 100, rot: a + Math.PI  // point inward
      }
    }),

    // Inner ring of glass tubes.
    ...Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 450, y: cy + Math.sin(a) * 450,
        w: 40, h: 120, rot: a
      }
    }),

    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 100, h: 100, rot: 0 },

    boss(id, cx, cy - 250, 80, 'castle', 160),
    goal(id, cx, cy)
  ]
}

export default stage
