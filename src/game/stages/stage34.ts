import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal } from './_helpers'

// ── Stage 34: "Plate Hunt" ────────────────────────────────────────────
// Four plates, four walls — a fully caged boss chamber. Each plate is
// tucked in a different quadrant behind its own mini-obstacle: glass
// curtain, generator, rail, and a gravity well. Most runs will open
// two or three sides — the four-plate sweep is the high-score play.
const W = 2800, H = 2000
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage34',
  name: 'Plate Hunt',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 360,
  bossModelId: 'sandstorm',
  machines: [
    ...boundary(id, W, H),

    // Central boss cage — four sides, each wired to its own plate.
    linked(wall(id, cx, cy - 300, 400, 30, 'metal'), 'c1'),
    linked(wall(id, cx, cy + 300, 400, 30, 'metal'), 'c2'),
    linked(wall(id, cx - 300, cy, 30, 400, 'metal'), 'c3'),
    linked(wall(id, cx + 300, cy, 30, 400, 'metal'), 'c4'),

    // Plate 1 — top-left, behind a glass curtain.
    plate(id, 400, 400, 'c1', 100, 80),
    ...Array.from({ length: 3 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 400, y: 600 + i * 80, w: 140, h: 40, rot: 0
    })),

    // Plate 2 — top-right, behind twin generators.
    plate(id, W - 400, 400, 'c2', 100, 80),
    { id: id(), type: 'overloadedGenerator', x: W - 500, y: 600, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: W - 300, y: 600, w: 80, h: 80, rot: 0 },

    // Plate 3 — bottom-left, behind a magnetic rail.
    plate(id, 400, H - 400, 'c3', 100, 80),
    { id: id(), type: 'magneticRail', x: 400, y: H - 700, w: 50, h: 400, rot: Math.PI / 2 },

    // Plate 4 — bottom-right, guarded by a gravity well.
    plate(id, W - 400, H - 400, 'c4', 100, 80),
    { id: id(), type: 'gravityWell', x: W - 400, y: H - 700, w: 80, h: 80, rot: 0 },

    // Launcher ring for circulation around the outer ring.
    { id: id(), type: 'pneumaticLauncher', x: 180, y: 300, w: 90, h: 60, rot: Math.PI / 6 },
    { id: id(), type: 'pneumaticLauncher', x: W - 180, y: H - 300, w: 90, h: 60, rot: -5 * Math.PI / 6 },

    boss(id, cx, cy, 80, 'sandstorm', 200),
    goal(id, W - 220, cy)
  ]
}

export default stage
