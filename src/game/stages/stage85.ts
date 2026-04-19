import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 85: "Gear Labyrinth" ────────────────────────────────────────
// Nested gear chambers: outer ring has 4 gears, destroying any one
// opens a wall into the middle ring which has 4 more gears behind its
// own walls. Destroy all 8 to reach the boss. Gear score stacks
// nicely — 8 gears × (+60 destroy + 15 hit) ≈ 600+.
const W = 2800, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage85',
  name: 'Gear Labyrinth',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 360,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // OUTER RING: 4 gears and 4 linked walls behind them.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2
      return gear(id, cx + Math.cos(a) * 1050, cy + Math.sin(a) * 1050, `outer${i}`, 70, 90)
    }),
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2
      return linked(
        {
          id: id(),
          type: 'wall',
          x: cx + Math.cos(a) * 800,
          y: cy + Math.sin(a) * 800,
          w: 240,
          h: 30,
          rot: a + Math.PI / 2,
          meta: { material: 'metal' }
        },
        `outer${i}`
      )
    }),

    // INNER RING: 4 gears and 4 linked walls.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return gear(id, cx + Math.cos(a) * 550, cy + Math.sin(a) * 550, `inner${i}`, 80, 90)
    }),
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return linked(
        {
          id: id(),
          type: 'wall',
          x: cx + Math.cos(a) * 300,
          y: cy + Math.sin(a) * 300,
          w: 180,
          h: 30,
          rot: a + Math.PI / 2,
          meta: { material: 'metal' }
        },
        `inner${i}`
      )
    }),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 80, 'wolf-demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
