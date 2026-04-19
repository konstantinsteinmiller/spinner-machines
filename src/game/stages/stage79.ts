import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 79: "Tumble Dryer" ──────────────────────────────────────────
// Circular arena with an outer conveyor belt ring pushing the spinner
// counterclockwise, and an inner ring of boosters aimed outward. The
// spinner gets trapped rotating through a glass field forever.
const W = 2600, H = 2600
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage79',
  name: 'Tumble Dryer',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: cx, y: cy },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Outer conveyor ring (12 tangent belts).
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return {
        id: id(), type: 'conveyorBelt' as const,
        x: cx + Math.cos(a) * 1050, y: cy + Math.sin(a) * 1050,
        w: 560, h: 70, rot: a + Math.PI / 2
      }
    }),

    // Glass between outer and inner (scoring zone).
    ...Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 700, y: cy + Math.sin(a) * 700,
        w: 40, h: 140, rot: a
      }
    }),

    // Inner booster ring pushes spinner outward when it drifts in.
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 300, y: cy + Math.sin(a) * 300,
        w: 110, h: 90, rot: a
      }
    }),

    boss(id, cx, cy, 82, 'wolf-demon', 140),
    goal(id, cx, cy)
  ]
}

export default stage
