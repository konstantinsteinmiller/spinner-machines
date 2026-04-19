import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal } from './_helpers'

// ── Stage 53: "Glass Labyrinth" ───────────────────────────────────────
// Maze built entirely from glass tube walls — every "wall" the spinner
// bounces off pops. The layout guides the player through in a sensible
// path, but aggressive play can shortcut through walls for more points.
const W = 2600, H = 2000
const id = mkId()

const glassWall = (cx: number, cy: number, w: number, h: number) => {
  // Lay glass tubes along the wall axis so each segment is one tube.
  const horizontal = w >= h
  const count = Math.max(1, Math.round((horizontal ? w : h) / 120))
  const step = (horizontal ? w : h) / count
  return Array.from({ length: count }, (_, i) => {
    const off = -((count - 1) / 2) * step + i * step
    return {
      id: id(), type: 'destroyableGlassTube' as const,
      x: cx + (horizontal ? off : 0),
      y: cy + (horizontal ? 0 : off),
      w: horizontal ? step - 10 : 40,
      h: horizontal ? 40 : step - 10,
      rot: 0
    }
  })
}

const stage: Stage = {
  id: 'stage53',
  name: 'Glass Labyrinth',
  width: W, height: H,
  spawn: { x: 200, y: 200 },
  goal: { x: W - 220, y: H - 220 },
  starThresholds: [0, 700, 1200],
  launchPenalty: 55,
  bossKillBonus: 320,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // Maze corridors (horizontal glass walls).
    ...glassWall(900, 400, 800, 40),
    ...glassWall(1700, 800, 800, 40),
    ...glassWall(900, 1200, 800, 40),
    ...glassWall(1700, 1600, 700, 40),

    // Vertical glass pillars.
    ...glassWall(400, 900, 40, 600),
    ...glassWall(1300, 600, 40, 500),
    ...glassWall(2100, 1200, 40, 500),

    // Two boosters seeded in open pockets.
    { id: id(), type: 'centrifugalBooster', x: 500, y: 500, w: 110, h: 90, rot: Math.PI / 4 },
    { id: id(), type: 'centrifugalBooster', x: W - 600, y: H - 500, w: 110, h: 90, rot: 0 },

    boss(id, W - 400, H / 2, 75, 'castle', 170),
    goal(id, W - 220, H - 220)
  ]
}

export default stage
