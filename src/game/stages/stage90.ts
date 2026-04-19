import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked, plate } from './_helpers'

// ── Stage 90: "Mechanized Colosseum" ──────────────────────────────────
// Chapter-G capstone. Every mechanic in concert: gears, plates, rails,
// launchers, gravity wells, conveyors, generators, glass. The arena is
// a gladiatorial ring where the boss is surrounded by layered defenses.
const W = 3000, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const stage: Stage = {
  id: 'stage90',
  name: 'Mechanized Colosseum',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1700],
  launchPenalty: 65,
  bossKillBonus: 400,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Outer perimeter: 4 plates → open 4 outer walls to the arena.
    plate(id, 500, 400, 'outerN', 130, 70),
    plate(id, W - 500, 400, 'outerE', 130, 70),
    plate(id, W - 500, H - 400, 'outerS', 130, 70),
    plate(id, 500, H - 400, 'outerW', 130, 70),
    linked({
      id: id(),
      type: 'wall',
      x: cx,
      y: cy - 900,
      w: 700,
      h: 30,
      rot: 0,
      meta: { material: 'metal' }
    }, 'outerN'),
    linked({
      id: id(),
      type: 'wall',
      x: cx + 900,
      y: cy,
      w: 30,
      h: 700,
      rot: 0,
      meta: { material: 'metal' }
    }, 'outerE'),
    linked({
      id: id(),
      type: 'wall',
      x: cx,
      y: cy + 900,
      w: 700,
      h: 30,
      rot: 0,
      meta: { material: 'metal' }
    }, 'outerS'),
    linked({
      id: id(),
      type: 'wall',
      x: cx - 900,
      y: cy,
      w: 30,
      h: 700,
      rot: 0,
      meta: { material: 'metal' }
    }, 'outerW'),

    // Middle ring: 4 gears → open 4 inner walls.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return gear(id, cx + Math.cos(a) * 600, cy + Math.sin(a) * 600, `inner${i}`, 70, 100)
    }),
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2
      return linked(
        {
          id: id(),
          type: 'wall',
          x: cx + Math.cos(a) * 300,
          y: cy + Math.sin(a) * 300,
          w: 260,
          h: 30,
          rot: a + Math.PI / 2,
          meta: { material: 'metal' }
        },
        `inner${i}`
      )
    }),

    // Gravity well at center.
    { id: id(), type: 'gravityWell', x: cx, y: cy, w: 120, h: 120, rot: 0 },

    // Radial conveyor belts.
    { id: id(), type: 'conveyorBelt', x: cx, y: cy - 150, w: 260, h: 50, rot: 0 },
    { id: id(), type: 'conveyorBelt', x: cx, y: cy + 150, w: 260, h: 50, rot: Math.PI },

    // Glass tubes around the arena.
    ...Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 750, y: cy + Math.sin(a) * 750,
        w: 40, h: 120, rot: a
      }
    }),

    // Entry amenities.
    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },
    { id: id(), type: 'centrifugalBooster', x: 340, y: 600, w: 120, h: 100, rot: Math.PI / 4 },
    { id: id(), type: 'centrifugalBooster', x: 340, y: H - 600, w: 120, h: 100, rot: -Math.PI / 4 },

    boss(id, cx, cy, 95, 'wolf-demon', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
