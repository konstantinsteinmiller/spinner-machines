import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 78: "Conveyor Belt Maze" ────────────────────────────────────
// Long parallel conveyor belts form corridors. Adjacent belts run in
// opposite directions — stepping off one belt puts the spinner on
// another going the other way. Glass pickups line the corridors.
const W = 2800, H = 2000
const id = mkId()

const stage: Stage = {
  id: 'stage78',
  name: 'Conveyor Belt Maze',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'phoenix',
  machines: [
    ...boundary(id, W, H),

    // 5 conveyor belts alternating direction.
    ...Array.from({ length: 5 }, (_, i) => ({
      id: id(), type: 'conveyorBelt' as const,
      x: W / 2, y: 400 + i * 280,
      w: 1900, h: 100,
      rot: i % 2 === 0 ? 0 : Math.PI
    })),

    // Divider walls between belts.
    ...Array.from({ length: 4 }, (_, i) => ({
      id: id(), type: 'wall' as const,
      x: W / 2, y: 540 + i * 280, w: 1900, h: 20, rot: 0, meta: { material: 'wood' }
    })),

    // Glass pickups on each belt.
    ...Array.from({ length: 5 }, (_, row) =>
      Array.from({ length: 8 }, (_, col) => ({
        id: id(), type: 'destroyableGlassTube' as const,
        x: 700 + col * 210, y: 400 + row * 280, w: 40, h: 80, rot: 0
      }))
    ).flat(),

    { id: id(), type: 'pneumaticLauncher', x: 340, y: H / 2, w: 110, h: 70, rot: 0 },

    boss(id, W - 380, H / 2, 72, 'phoenix', 140),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
