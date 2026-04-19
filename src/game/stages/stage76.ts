import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 76: "Booster Boss" ──────────────────────────────────────────
// Boss is ringed by six boosters that bat the spinner away unless it
// punches through with high momentum. A pneumatic launcher at spawn
// provides the initial speed; every miss requires another launch.
const W = 2400, H = 2200
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage76',
  name: 'Booster Boss',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // 6 boosters around the boss, aimed outward.
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 280, y: cy + Math.sin(a) * 280,
        w: 120, h: 90, rot: a
      }
    }),

    // Glass tubes fill the outer arena — scoring.
    ...Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 700, y: cy + Math.sin(a) * 700,
        w: 40, h: 120, rot: a
      }
    }),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 90, 'wolf-demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
