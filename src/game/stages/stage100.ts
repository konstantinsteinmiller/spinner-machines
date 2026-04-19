import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked, plate } from './_helpers'

// ── Stage 100: "Apotheosis" ───────────────────────────────────────────
// Final stage. Massive arena with four boss-gates — each guarded by a
// different unlock mechanic (glass, gears, plates, generator chain).
// Every scoring machine in the game is present. A 3-star here is the
// ultimate spinner machinist's badge of honor.
const W = 3600, H = 2600
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage100',
  name: 'Apotheosis',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: cx, y: cy },
  starThresholds: [0, 1200, 2000],
  launchPenalty: 70,
  bossKillBonus: 500,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // ─── Four approach corridors, each with a unique unlock ──────────
    // NORTH: glass wall approach.
    ...Array.from({ length: 10 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: cx - 600 + i * 130, y: 600, w: 40, h: 160, rot: 0
    })),

    // EAST: gear-locked metal gate + gear cluster.
    linked(
      { id: id(), type: 'wall', x: W - 800, y: cy, w: 40, h: 600, rot: 0, meta: { material: 'metal' } },
      'apoE'
    ),
    gear(id, W - 500, cy - 200, 'apoE', 80, 100),
    gear(id, W - 500, cy + 200, 'apoE', 80, 100),

    // SOUTH: pressure-plate gate + plates.
    linked(
      { id: id(), type: 'wall', x: cx, y: H - 600, w: 800, h: 40, rot: 0, meta: { material: 'stone' } },
      'apoS'
    ),
    plate(id, cx - 400, H - 300, 'apoS', 140, 80),
    plate(id, cx + 400, H - 300, 'apoS', 140, 80),

    // WEST: generator chain blocks path.
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'overloadedGenerator' as const,
      x: 600, y: cy - 560 + i * 160, w: 80, h: 80, rot: 0
    })),

    // ─── Central arena: the killing floor ────────────────────────────
    // Inner ring: glass tubes around the boss.
    ...Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 500, y: cy + Math.sin(a) * 500,
        w: 40, h: 130, rot: a
      }
    }),
    // Four radial boosters facing outward.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 280, y: cy + Math.sin(a) * 280,
        w: 120, h: 90, rot: a
      }
    }),
    // Rails at the corners for skilled ricochets.
    { id: id(), type: 'magneticRail', x: 1100, y: 900, w: 700, h: 30, rot: Math.PI / 6 },
    { id: id(), type: 'magneticRail', x: W - 1100, y: H - 900, w: 700, h: 30, rot: Math.PI / 6 },

    // Gravity wells at cardinal corners.
    { id: id(), type: 'gravityWell', x: 500, y: 500, w: 120, h: 120, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 500, y: H - 500, w: 120, h: 120, rot: 0 },

    // Conveyor belts behind the boss push the spinner back in.
    { id: id(), type: 'conveyorBelt', x: cx, y: cy - 800, w: 900, h: 60, rot: 0 },
    { id: id(), type: 'conveyorBelt', x: cx, y: cy + 800, w: 900, h: 60, rot: Math.PI },

    // Entry launcher.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 120, h: 80, rot: 0 },

    boss(id, cx, cy, 150, 'wolf-demon', 190),
    goal(id, cx, cy)
  ]
}

export default stage
