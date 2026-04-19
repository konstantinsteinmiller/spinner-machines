import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 75: "Orbit Path" ────────────────────────────────────────────
// Five gravity wells arranged in a circle create a stable orbit zone at
// the right radius. Glass tubes line the orbit. The spinner can be
// coaxed into a slowly-decaying orbit around the group.
const W = 2600, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage75',
  name: 'Orbit Path',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // 5 gravity wells in a small ring at the center.
    ...Array.from({ length: 5 }, (_, i) => {
      const a = (i / 5) * Math.PI * 2
      return {
        id: id(), type: 'gravityWell' as const,
        x: cx + Math.cos(a) * 180, y: cy + Math.sin(a) * 180,
        w: 90, h: 90, rot: 0
      }
    }),

    // Outer glass orbit (two concentric rings at the stable orbit band).
    ...Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 600, y: cy + Math.sin(a) * 600,
        w: 40, h: 120, rot: a
      }
    }),
    ...Array.from({ length: 26 }, (_, i) => {
      const a = (i / 26) * Math.PI * 2 + 0.12
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 850, y: cy + Math.sin(a) * 850,
        w: 40, h: 120, rot: a
      }
    }),

    // Launcher tangent to the orbit for an elegant entry.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: -Math.PI / 8 },

    boss(id, cx, cy, 78, 'castle', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
