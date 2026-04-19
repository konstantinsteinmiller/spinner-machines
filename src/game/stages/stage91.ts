import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 91: "Phoenix's Roost" ───────────────────────────────────────
// Nest stage — circular fire-themed arena. Phoenix boss at center,
// flanked by generators that detonate on approach. Glass "feathers"
// fall away as the nest is ransacked.
const W = 2400, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage91',
  name: 'Phoenix\'s Roost',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 900, 1500],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // Generator "eggs" around the center.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return {
        id: id(), type: 'overloadedGenerator' as const,
        x: cx + Math.cos(a) * 300, y: cy + Math.sin(a) * 300,
        w: 80, h: 80, rot: 0
      }
    }),

    // Glass feathers at mid radius.
    ...Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 700, y: cy + Math.sin(a) * 700,
        w: 40, h: 160, rot: a
      }
    }),

    // Booster ring outside.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 1000, y: cy + Math.sin(a) * 1000,
        w: 120, h: 90, rot: a + Math.PI
      }
    }),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 100, 'phoenix', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
