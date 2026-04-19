import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal } from './_helpers'

// ── Stage 26: "Pinwheel Chamber" ──────────────────────────────────────
// Six petal-walls arranged in a flower around a central boss. Each
// petal is linked to its own gear at the outer ring. Every petal that
// stays intact channels the spinner away from the boss. Hitting all
// six gears rotates every petal flat against the boss platform,
// exposing the core.
const W = 2400, H = 2000
const id = mkId()
const cx = W / 2, cy = H / 2

const petals: any[] = []
const gears: any[] = []
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3
  const link = `p26_${i}`
  petals.push(linked({
    id: id(), type: 'wall',
    x: cx + Math.cos(a) * 260, y: cy + Math.sin(a) * 260,
    w: 300, h: 24, rot: a, meta: { material: 'metal' }
  }, link))
  gears.push(gear(id, cx + Math.cos(a) * 700, cy + Math.sin(a) * 700, link, 60, 100))
}

const stage: Stage = {
  id: 'stage26',
  name: 'Pinwheel Chamber',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    ...petals,
    ...gears,

    // Gravity well at center pulls the spinner toward the boss once the
    // pinwheel is cracked open.
    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 100, h: 100, rot: 0 },

    // Launcher pair on opposite sides to keep the spin going.
    { id: id(), type: 'pneumaticLauncher', x: 200, y: 300, w: 90, h: 60, rot: Math.PI / 4 },
    { id: id(), type: 'pneumaticLauncher', x: W - 200, y: H - 300, w: 90, h: 60, rot: -3 * Math.PI / 4 },

    // Score ring — 8 glass tubes on an outer radius.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4 + Math.PI / 8
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 900, y: cy + Math.sin(a) * 900, w: 40, h: 120, rot: a
      }
    }),

    boss(id, cx, cy, 70, 'phoenix', 140),
    goal(id, W - 220, cy)
  ]
}

export default stage
