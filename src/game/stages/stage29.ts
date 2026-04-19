import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal, box } from './_helpers'

// ── Stage 29: "Spinning Mandala" ──────────────────────────────────────
// Four concentric rings of rotating walls. Each ring has its own gear
// spinning a single wall into alignment with the next ring's gap. A
// 3-star run requires threading all four alignments; a 2-star run is
// possible by shattering the outermost generator cluster without
// reaching the core.
const W = 2600, H = 2600
const id = mkId()
const cx = W / 2, cy = H / 2

const ring = (radius: number, link: string, count: number) => {
  const out: any[] = []
  for (let i = 0; i < count; i++) {
    const a = i * Math.PI * 2 / count
    const wObj = {
      id: id(), type: 'wall' as const,
      x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius,
      w: (radius * 2 * Math.PI) / count - 60, h: 24,
      rot: a + Math.PI / 2,
      meta: { material: 'metal' as const, link: i === 0 ? link : undefined }
    }
    // Only the first wall in each ring is gear-linked — that's the one
    // that rotates into the gap as the gear is hit.
    if (i !== 0) delete (wObj.meta as any).link
    out.push(wObj)
  }
  return out
}

const stage: Stage = {
  id: 'stage29',
  name: 'Spinning Mandala',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 360,
  bossModelId: 'mysticaleye',
  machines: [
    ...boundary(id, W, H),

    // Outer ring — 8 wall segments, one rotates.
    ...ring(900, 'r1', 8),
    // Middle ring — 6 segments, one rotates.
    ...ring(620, 'r2', 6),
    // Inner ring — 4 segments, one rotates.
    ...ring(360, 'r3', 4),
    // Core cage — two-wall pocket, one rotates.
    ...ring(180, 'r4', 4),

    // Four gears, one per ring, planted in the corners.
    gear(id, 400, 400, 'r1'),
    gear(id, W - 400, 400, 'r2'),
    gear(id, 400, H - 400, 'r3'),
    gear(id, W - 400, H - 400, 'r4'),

    // Generator ring just inside the outer wall — chain fuel.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = i * Math.PI / 4 + Math.PI / 8
      return {
        id: id(), type: 'overloadedGenerator' as const,
        x: cx + Math.cos(a) * 1080, y: cy + Math.sin(a) * 1080, w: 80, h: 80, rot: 0
      }
    }),

    // Launcher ring for circulation.
    { id: id(), type: 'pneumaticLauncher', x: 180, y: cy, w: 90, h: 60, rot: 0 },

    boss(id, cx, cy, 80, 'mysticaleye', 120),
    goal(id, W - 220, cy)
  ]
}

export default stage
