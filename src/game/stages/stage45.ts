import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, grid } from './_helpers'

// ── Stage 45: "Demolition Derby" ──────────────────────────────────────
// Mixed generator + glass field where every generator is packed next
// to two glass tubes. Igniting a single generator destroys the glass
// as part of the blast chain, so the score yield per detonation is
// much higher than a pure generator-only stage.
const W = 2400, H = 1800
const id = mkId()

const stage: Stage = {
  id: 'stage45',
  name: 'Demolition Derby',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 600, 1100],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'wolf-demon',
  machines: [
    ...boundary(id, W, H),

    // Grid of [generator, glass, glass] triplets.
    ...Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 4 }, (_, col) => {
        const x0 = 500 + col * 340
        const y0 = 400 + row * 300
        return [
          { id: id(), type: 'overloadedGenerator' as const, x: x0, y: y0, w: 80, h: 80, rot: 0 },
          { id: id(), type: 'destroyableGlassTube' as const, x: x0 + 100, y: y0, w: 40, h: 120, rot: 0 },
          { id: id(), type: 'destroyableGlassTube' as const, x: x0, y: y0 + 100, w: 120, h: 40, rot: 0 }
        ]
      }).flat()
    ).flat(),

    // Boosters on both spawn-side edges push the spinner into the derby.
    { id: id(), type: 'centrifugalBooster', x: 300, y: 400, w: 120, h: 100, rot: Math.PI / 4 },
    { id: id(), type: 'centrifugalBooster', x: 300, y: H - 400, w: 120, h: 100, rot: -Math.PI / 4 },

    boss(id, 2150, H / 2, 75, 'wolf-demon', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
