import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 65: "Launcher Cascade" ──────────────────────────────────────
// Every pocket holds a launcher pointing into the next. The spinner
// goes launcher → launcher → launcher all the way across, passing
// through a gauntlet of glass each leg.
const W = 3200, H = 1800
const id = mkId()

// 5 launcher waypoints, each firing toward the next.
const launchers: [number, number, number][] = [
  [400, 400, 0.2],         // slight downward
  [900, 1300, -0.4],       // up-right
  [1500, 400, 0.3],        // down-right
  [2100, 1400, -0.5],      // up-right
  [2700, 600, 0.0]         // horizontal right to boss
]

const stage: Stage = {
  id: 'stage65',
  name: 'Launcher Cascade',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: 600 },
  starThresholds: [0, 750, 1300],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    ...launchers.map(([x, y, rot]) => ({
      id: id(), type: 'pneumaticLauncher' as const,
      x, y, w: 100, h: 70, rot
    })),

    // Glass curtains between each launcher leg.
    ...Array.from({ length: 4 }, (_, leg) =>
      Array.from({ length: 4 }, (_, i) => ({
        id: id(), type: 'destroyableGlassTube' as const,
        x: 600 + leg * 600 + i * 80,
        y: leg % 2 === 0 ? 800 + i * 40 : 1200 - i * 40,
        w: 40, h: 120, rot: 0
      }))
    ).flat(),

    boss(id, W - 400, 600, 70, 'fire', 140),
    goal(id, W - 220, 600)
  ]
}

export default stage
