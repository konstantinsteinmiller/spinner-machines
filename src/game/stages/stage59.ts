import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, box } from './_helpers'

// ── Stage 59: "Fragile Fortress" ──────────────────────────────────────
// The boss sits inside a glass-tube fortress — four glass walls around
// it, each made from a row of tubes. Any hit pops one wall segment;
// a strong cascade can crumble multiple sides at once.
const W = 2600, H = 1900
const id = mkId()

const glassRow = (cx: number, cy: number, horizontal: boolean, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const off = -((n - 1) / 2) * 100 + i * 100
    return {
      id: id(), type: 'destroyableGlassTube' as const,
      x: cx + (horizontal ? off : 0), y: cy + (horizontal ? 0 : off),
      w: horizontal ? 90 : 40, h: horizontal ? 40 : 90, rot: 0
    }
  })

const stage: Stage = {
  id: 'stage59',
  name: 'Fragile Fortress',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 750, 1300],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Glass fortress walls around the boss at center.
    ...glassRow(W / 2, H / 2 - 260, true, 6),
    ...glassRow(W / 2, H / 2 + 260, true, 6),
    ...glassRow(W / 2 - 300, H / 2, false, 6),
    ...glassRow(W / 2 + 300, H / 2, false, 6),

    // Approach: ring of glass tubes around the fortress.
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: W / 2 + Math.cos(a) * 550,
        y: H / 2 + Math.sin(a) * 550,
        w: 40, h: 120, rot: a
      }
    }),

    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 400, y: H - 300, w: 90, h: 90, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 400, y: 300, w: 90, h: 90, rot: 0 },

    boss(id, W / 2, H / 2, 80, 'wolf-demon', 160),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
