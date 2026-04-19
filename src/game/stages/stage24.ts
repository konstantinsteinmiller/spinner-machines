import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal, box } from './_helpers'

// ── Stage 24: "Clockwork Maze" ────────────────────────────────────────
// Five gears, each sharing a unique link with one wall of the central
// boss cage. The cage has 5 faces (a pentagon of walls); every gear
// must be tagged to rotate its wall out of the way. Miss any gear and
// the cage stays intact. Pure gear-puzzle stage — no bosses die on a
// first-launch run.
const W = 2400, H = 2000
const id = mkId()
const cx = W / 2, cy = H / 2

// Pentagon wall positions around the boss cage.
const walls: { x: number; y: number; rot: number; link: string }[] = []
for (let i = 0; i < 5; i++) {
  const a = -Math.PI / 2 + i * (Math.PI * 2) / 5
  walls.push({
    x: cx + Math.cos(a) * 280,
    y: cy + Math.sin(a) * 280,
    rot: a + Math.PI / 2,
    link: `m24_${i}`
  })
}
// Five gears scattered to the edges, each tied to one cage wall.
const gearPos: { x: number; y: number; link: string }[] = [
  { x: 400, y: 400, link: 'm24_0' },
  { x: W - 400, y: 400, link: 'm24_1' },
  { x: W - 400, y: H - 400, link: 'm24_2' },
  { x: 400, y: H - 400, link: 'm24_3' },
  { x: cx, y: 250, link: 'm24_4' }
]

const stage: Stage = {
  id: 'stage24',
  name: 'Clockwork Maze',
  width: W, height: H,
  spawn: { x: 200, y: cy },
  goal: { x: W - 220, y: cy },
  starThresholds: [0, 500, 1000],
  launchPenalty: 55,
  bossKillBonus: 340,
  bossModelId: 'chain',
  machines: [
    ...boundary(id, W, H),

    // Inner bounce walls — make the spinner ricochet more.
    ...box(id, cx, cy, 650, 650, 'none', 'stone').filter(() => false), // placeholder (removed)

    // Pentagon cage walls — each linked to its gear.
    ...walls.map((w) => linked(
      { id: id(), type: 'wall', x: w.x, y: w.y, w: 280, h: 24, rot: w.rot, meta: { material: 'metal' } },
      w.link
    )),

    // Five gears around the perimeter.
    ...gearPos.map((g) => gear(id, g.x, g.y, g.link, 60, 110)),

    // Perimeter centrifugal boosters to keep the spinner in orbit.
    { id: id(), type: 'centrifugalBooster', x: 300, y: cy, w: 120, h: 100, rot: 0 },
    { id: id(), type: 'centrifugalBooster', x: W - 300, y: cy, w: 120, h: 100, rot: Math.PI },
    { id: id(), type: 'centrifugalBooster', x: cx, y: 300, w: 120, h: 100, rot: Math.PI / 2 },
    { id: id(), type: 'centrifugalBooster', x: cx, y: H - 300, w: 120, h: 100, rot: -Math.PI / 2 },

    // Inner glass ring for score — shatter by ricochet.
    ...Array.from({ length: 10 }, (_, i) => {
      const a = i * Math.PI / 5
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 480, y: cy + Math.sin(a) * 480, w: 40, h: 120, rot: a
      }
    }),

    boss(id, cx, cy, 70, 'chain', 160),
    goal(id, W - 220, cy)
  ]
}

export default stage
