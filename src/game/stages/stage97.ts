import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 97: "Ancient Mechanism" ─────────────────────────────────────
// A mechanical clockwork puzzle — 12 gears arranged like hour marks
// around a central dial. Each gear, when destroyed, removes one segment
// of a ring-wall around the central boss. The stage rewards getting
// many gears, not just a few.
const W = 2800, H = 2800
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage97',
  name: 'Ancient Mechanism',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1600],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // 12 gears, each linked to one ring-wall segment.
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return gear(id, cx + Math.cos(a) * 1050, cy + Math.sin(a) * 1050, `clock${i}`, 70, 90)
    }),

    // Ring wall made of 12 linked segments around the boss.
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return linked(
        {
          id: id(),
          type: 'wall',
          x: cx + Math.cos(a) * 400,
          y: cy + Math.sin(a) * 400,
          w: 240,
          h: 30,
          rot: a + Math.PI / 2,
          meta: { material: 'metal' }
        },
        `clock${i}`
      )
    }),

    // Glass tubes between gears and ring (scoring reward).
    ...Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 720, y: cy + Math.sin(a) * 720,
        w: 40, h: 120, rot: a
      }
    }),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 115, 'castle', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
