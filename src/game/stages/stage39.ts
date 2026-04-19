import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, plate, linked, boss, goal } from './_helpers'

// ── Stage 39: "Deep Vault" ────────────────────────────────────────────
// Nested cages. The outer cage opens with plate A (easy access). A's
// inner cage opens with plate B (tucked inside A). Plate B's inner
// cage around the boss opens with plate C. You have to pop each layer
// before the boss becomes reachable.
const W = 2400, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage39',
  name: 'Deep Vault',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 600, 1100],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'galaxy',
  machines: [
    ...boundary(id, W, H),

    // Outer cage (big) — plate A opens it. Leave a small gap where the
    // plate is so A itself stays reachable.
    linked(wall(id, cx, cy - 650, 1000, 30, 'metal'), 'A'),
    linked(wall(id, cx - 500, cy - 200, 30, 900, 'metal'), 'A'),
    linked(wall(id, cx + 500, cy - 200, 30, 900, 'metal'), 'A'),
    linked(wall(id, cx - 260, cy + 250, 480, 30, 'metal'), 'A'),
    linked(wall(id, cx + 260, cy + 250, 480, 30, 'metal'), 'A'),

    // Middle cage (plate B).
    linked(wall(id, cx, cy - 420, 700, 30, 'metal'), 'B'),
    linked(wall(id, cx - 350, cy, 30, 700, 'metal'), 'B'),
    linked(wall(id, cx + 350, cy, 30, 700, 'metal'), 'B'),
    linked(wall(id, cx - 160, cy + 250, 380, 30, 'metal'), 'B'),
    linked(wall(id, cx + 160, cy + 250, 380, 30, 'metal'), 'B'),

    // Inner cage (plate C — the last boss wall).
    linked(wall(id, cx, cy - 200, 420, 30, 'metal'), 'C'),
    linked(wall(id, cx - 200, cy, 30, 420, 'metal'), 'C'),
    linked(wall(id, cx + 200, cy, 30, 420, 'metal'), 'C'),
    linked(wall(id, cx, cy + 200, 420, 30, 'metal'), 'C'),

    // Plates — A outside the outer ring, B inside the outer, C inside middle.
    plate(id, 250, 250, 'A'),
    plate(id, W - 400, cy + 220, 'B'),
    plate(id, cx, cy + 100, 'C'),

    // Sparse score fodder — glass & generators in the outer ring.
    { id: id(), type: 'overloadedGenerator', x: 300, y: H - 300, w: 80, h: 80, rot: 0 },
    { id: id(), type: 'overloadedGenerator', x: W - 300, y: 300, w: 80, h: 80, rot: 0 },
    ...Array.from({ length: 6 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 600 + i * 240, y: H - 200, w: 40, h: 120, rot: 0
    })),

    boss(id, cx, cy, 100, 'galaxy', 160),
    goal(id, W - 220, cy)
  ]
}

export default stage
