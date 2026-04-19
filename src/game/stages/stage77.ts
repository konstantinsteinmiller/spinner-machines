import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 77: "Spin Cycle" ────────────────────────────────────────────
// Concentric conveyor belts rotating in opposite directions create a
// washing-machine effect. The spinner is flung inward/outward as it
// crosses belt boundaries, hitting successive glass rings.
const W = 2400, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage77',
  name: 'Spin Cycle',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // Conveyor belts radiating outward like spokes (alternating direction).
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return {
        id: id(), type: 'conveyorBelt' as const,
        x: cx + Math.cos(a) * 450, y: cy + Math.sin(a) * 450,
        w: 500, h: 60, rot: a + (i % 2 === 0 ? 0 : Math.PI)
      }
    }),

    // Glass ring just outside the belts.
    ...Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 850, y: cy + Math.sin(a) * 850,
        w: 40, h: 120, rot: a
      }
    }),

    // Inner scoring: 4 generators at the hub.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2
      return {
        id: id(), type: 'overloadedGenerator' as const,
        x: cx + Math.cos(a) * 110, y: cy + Math.sin(a) * 110,
        w: 80, h: 80, rot: 0
      }
    }),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 100, h: 70, rot: 0 },

    boss(id, cx, cy - 1000, 75, 'fire', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
