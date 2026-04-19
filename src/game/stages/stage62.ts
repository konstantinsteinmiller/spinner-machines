import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 62: "Loop de Loop" ──────────────────────────────────────────
// Rails arranged as a near-full loop around a central glass courtyard.
// Catch the loop and the spinner circles scoring glass hit after hit;
// miss it and fall into the courtyard trap of generators.
const W = 2400, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

// 8 rail segments around a circle (slight gaps between for realism).
const loopRails = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2
  const rx = cx + Math.cos(angle) * 800
  const ry = cy + Math.sin(angle) * 800
  return {
    id: id(), type: 'magneticRail' as const,
    x: rx, y: ry, w: 520, h: 30, rot: angle + Math.PI / 2
  }
})

const stage: Stage = {
  id: 'stage62',
  name: 'Loop de Loop',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1300],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    ...loopRails,

    // Central courtyard: mix of glass pickups (safe) and generators (scary).
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 260, y: cy + Math.sin(a) * 260,
        w: 40, h: 120, rot: a
      }
    }),
    { id: id(), type: 'overloadedGenerator', x: cx, y: cy, w: 80, h: 80, rot: 0 },

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy - 900, 70, 'fire', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
