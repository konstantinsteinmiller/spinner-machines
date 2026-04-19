import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 63: "Jump Pad" ──────────────────────────────────────────────
// Pinball-like arena with 7 pneumatic launchers aimed in different
// directions. Landing on any launcher hurls the spinner into a new
// zone. Glass tubes in every zone reward multi-launch runs.
const W = 2600, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage63',
  name: 'Jump Pad',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 50,
  bossKillBonus: 320,
  bossModelId: 'demon',
  machines: [
    ...boundary(id, W, H),

    // 7 launchers distributed around the arena at different angles.
    { id: id(), type: 'pneumaticLauncher', x: 600, y: 400, w: 90, h: 60, rot: Math.PI / 3 },
    { id: id(), type: 'pneumaticLauncher', x: 1100, y: 300, w: 90, h: 60, rot: Math.PI / 2 },
    { id: id(), type: 'pneumaticLauncher', x: 1700, y: 400, w: 90, h: 60, rot: 2 * Math.PI / 3 },
    { id: id(), type: 'pneumaticLauncher', x: 2100, y: H / 2, w: 90, h: 60, rot: Math.PI },
    { id: id(), type: 'pneumaticLauncher', x: 1700, y: H - 400, w: 90, h: 60, rot: -2 * Math.PI / 3 },
    { id: id(), type: 'pneumaticLauncher', x: 1100, y: H - 300, w: 90, h: 60, rot: -Math.PI / 2 },
    { id: id(), type: 'pneumaticLauncher', x: 600, y: H - 400, w: 90, h: 60, rot: -Math.PI / 3 },

    // Glass tubes scattered — reachable only through launcher chains.
    ...Array.from({ length: 16 }, (_, i) => {
      const row = i < 8 ? 0 : 1
      const col = i % 8
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: 500 + col * 230, y: row === 0 ? 700 : H - 700,
        w: 40, h: 120, rot: 0
      }
    }),

    boss(id, W - 400, H / 2, 70, 'demon', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
