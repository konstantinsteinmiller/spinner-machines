import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 82: "Gearworks Inferno" ─────────────────────────────────────
// 8 gears hold back walls around a dense generator cache. Every gear
// you break releases more generators into the main chamber. Destroy
// all 8 and the entire arena becomes a generator minefield.
const W = 2800, H = 2200
const id = mkId()
const cx = W / 2, cy = H / 2

const arm = (ax: number, ay: number, key: string) => [
  linked(
    { id: id(), type: 'wall', x: ax, y: ay, w: 280, h: 30, rot: 0, meta: { material: 'metal' } },
    key
  ),
  // 2 generators hidden behind the wall.
  { id: id(), type: 'overloadedGenerator' as const, x: ax - 80, y: ay + 70, w: 80, h: 80, rot: 0 },
  { id: id(), type: 'overloadedGenerator' as const, x: ax + 80, y: ay + 70, w: 80, h: 80, rot: 0 }
]

const stage: Stage = {
  id: 'stage82',
  name: 'Gearworks Inferno',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 900, 1500],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // 8 gears around arena.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return gear(id, cx + Math.cos(a) * 900, cy + Math.sin(a) * 900, `arm${i}`, 70, 90)
    }),

    // 8 generator caches — one per gear.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return arm(cx + Math.cos(a) * 450, cy + Math.sin(a) * 450, `arm${i}`)
    }).flat(),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 85, 'fire', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
