import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal, box } from './_helpers'

// ── Stage 33: "Triple Lock" ───────────────────────────────────────────
// Three plates arranged in a triangle, each destroying one side of a
// triangular boss cage. Any side left closed channels the spinner away
// from the boss, so a 3-star run usually requires popping all three.
const W = 2400, H = 2000
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage33',
  name: 'Triple Lock',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Triangular boss cage — each side has two metal segments, linked
    // to its matching plate so stepping on a plate shatters that side.
    ...(() => {
      const out: any[] = []
      for (let s = 0; s < 3; s++) {
        const a1 = -Math.PI / 2 + s * (Math.PI * 2) / 3
        const a2 = -Math.PI / 2 + (s + 1) * (Math.PI * 2) / 3
        const x1 = cx + Math.cos(a1) * 320, y1 = cy + Math.sin(a1) * 320
        const x2 = cx + Math.cos(a2) * 320, y2 = cy + Math.sin(a2) * 320
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        const rot = Math.atan2(y2 - y1, x2 - x1)
        const len = Math.hypot(x2 - x1, y2 - y1)
        out.push(linked({
          id: id(), type: 'wall', x: mx, y: my, w: len, h: 24,
          rot, meta: { material: 'metal' }
        }, `s${s}`))
      }
      return out
    })(),

    // Three plates at the stage corners.
    plate(id, 300, 300, 's0', 100, 80),
    plate(id, W - 300, 300, 's1', 100, 80),
    plate(id, cx, H - 250, 's2', 100, 80),

    // Each plate has a gatekeeping machine in front of it.
    { id: id(), type: 'overloadedGenerator', x: 500, y: 500, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'destroyableGlassTube', x: W - 500, y: 500, w: 120, h: 40, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: cx, y: H - 500, w: 80, h: 80, rot: 0 },

    // Gravity wells at the triangle inner corners to circulate the spinner.
    { id: id(), type: 'gravityWell', x: cx, y: 500, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'gravityWell', x: 500, y: H - 600, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 500, y: H - 600, w: 80, h: 80, rot: 0 },

    boss(id, cx, cy, 75, 'demon', 150),
    goal(id, W - 220, cy)
  ]
}

export default stage
