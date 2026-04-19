import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 72: "Pinball Pro" ───────────────────────────────────────────
// Pure pinball: boosters at the flippers, gravity wells as bumpers,
// glass in the trap lanes. The spinner stays alive via bumper
// repulsion for a long time, racking up hit counts.
const W = 2000, H = 2600
const id = mkId()

const stage: Stage = {
  id: 'stage72',
  name: 'Pinball Pro',
  width: W, height: H,
  spawn: { x: W / 2, y: H - 200 },
  goal: { x: W / 2, y: 220 },
  starThresholds: [0, 800, 1400],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'fire',
  machines: [
    ...boundary(id, W, H),

    // Gravity well "bumpers" (3 in a triangle).
    { id: id(), type: 'gravityWell', x: W / 2 - 300, y: 1200, w: 110, h: 110, rot: 0 },
    { id: id(), type: 'gravityWell', x: W / 2 + 300, y: 1200, w: 110, h: 110, rot: 0 },
    { id: id(), type: 'gravityWell', x: W / 2, y: 800, w: 110, h: 110, rot: 0 },

    // Flipper boosters at the bottom.
    { id: id(), type: 'centrifugalBooster', x: W / 2 - 450, y: H - 400, w: 140, h: 90, rot: Math.PI / 5 },
    { id: id(), type: 'centrifugalBooster', x: W / 2 + 450, y: H - 400, w: 140, h: 90, rot: -Math.PI / 5 },

    // Side lanes with glass trap tubes.
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: 200, y: 400 + i * 240, w: 40, h: 140, rot: 0
    })),
    ...Array.from({ length: 8 }, (_, i) => ({
      id: id(), type: 'destroyableGlassTube' as const,
      x: W - 200, y: 400 + i * 240, w: 40, h: 140, rot: 0
    })),

    // Central pinball launcher at the bottom.
    { id: id(), type: 'pneumaticLauncher', x: W / 2, y: H - 320, w: 100, h: 70, rot: -Math.PI / 2 },

    boss(id, W / 2, 400, 75, 'fire', 150),
    goal(id, W / 2, 220)
  ]
}

export default stage
