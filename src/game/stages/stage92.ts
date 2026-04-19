import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 92: "Demon Forge" ───────────────────────────────────────────
// Industrial demon lair — the boss stands on a forge ringed by
// conveyors and surrounded by generator-powered hammers (stationary
// generators). Lava channels are depicted as long red glass rows.
const W = 2800, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage92',
  name: 'Demon Forge',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1600],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // Hammer generators around the forge.
    ...Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2
      return {
        id: id(), type: 'overloadedGenerator' as const,
        x: cx + Math.cos(a) * 400, y: cy + Math.sin(a) * 400,
        w: 80, h: 80, rot: 0
      }
    }),

    // Conveyor ring.
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2
      return {
        id: id(), type: 'conveyorBelt' as const,
        x: cx + Math.cos(a) * 750, y: cy + Math.sin(a) * 750,
        w: 500, h: 60, rot: a + Math.PI / 2
      }
    }),

    // Lava channels (glass tubes).
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 230, y: 400, w: 180, h: 40, rot: 0
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 500 + i * 230, y: H - 400, w: 180, h: 40, rot: 0
    })),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 105, 'demon', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
