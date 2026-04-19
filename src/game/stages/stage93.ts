import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 93: "Castle Keep" ───────────────────────────────────────────
// The boss sits deep in a keep behind layered stone walls. Four corner
// gears each hold back one wall; break them all to open the keep. The
// path to each gear threads through a glass-tube moat.
const W = 3000, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const keepWallThick = 40

const stage: Stage = {
  id: 'stage93',
  name: 'Castle Keep',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 1000, 1600],
  launchPenalty: 60,
  bossKillBonus: 400,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // Keep walls (4, each linked to a gear).
    linked({
      id: id(),
      type: 'wall',
      x: cx,
      y: cy - 300,
      w: 500,
      h: keepWallThick,
      rot: 0,
      meta: { material: 'stone' }
    }, 'keepN'),
    linked({
      id: id(),
      type: 'wall',
      x: cx + 280,
      y: cy,
      w: keepWallThick,
      h: 500,
      rot: 0,
      meta: { material: 'stone' }
    }, 'keepE'),
    linked({
      id: id(),
      type: 'wall',
      x: cx,
      y: cy + 300,
      w: 500,
      h: keepWallThick,
      rot: 0,
      meta: { material: 'stone' }
    }, 'keepS'),
    linked({
      id: id(),
      type: 'wall',
      x: cx - 280,
      y: cy,
      w: keepWallThick,
      h: 500,
      rot: 0,
      meta: { material: 'stone' }
    }, 'keepW'),

    // 4 corner gears.
    gear(id, 500, 500, 'keepN', 80, 100),
    gear(id, W - 500, 500, 'keepE', 80, 100),
    gear(id, W - 500, H - 500, 'keepS', 80, 100),
    gear(id, 500, H - 500, 'keepW', 80, 100),

    // Moat: ring of glass tubes between keep and gears.
    ...Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 600, y: cy + Math.sin(a) * 600,
        w: 40, h: 140, rot: a
      }
    }),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, cx, cy, 110, 'castle', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
