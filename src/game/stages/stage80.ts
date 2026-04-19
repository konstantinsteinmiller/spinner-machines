import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, linked, plate } from './_helpers'

// ── Stage 80: "Centrifuge" ────────────────────────────────────────────
// Chapter-F capstone. A centrifuge chamber: spinner enters through a
// one-way door and gets flung by radial boosters while gravity wells
// in the corners tug it wide. The boss sits at the center behind
// plate-activated shutters.
const W = 2800, H = 2400
const id = mkId()
const cx = W / 2, cy = H / 2

const shutters: [number, number, number, number, string][] = [
  [cx, cy - 200, 260, 30, 'shutN'],
  [cx, cy + 200, 260, 30, 'shutS'],
  [cx - 200, cy, 30, 260, 'shutW'],
  [cx + 200, cy, 30, 260, 'shutE']
]

const stage: Stage = {
  id: 'stage80',
  name: 'Centrifuge',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 900, 1500],
  launchPenalty: 60,
  bossKillBonus: 380,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // Plate-driven shutters.
    ...shutters.map(([x, y, w, h, key]) =>
      linked({ id: id(), type: 'wall', x, y, w, h, rot: 0, meta: { material: 'metal' } }, key)
    ),

    // 4 plates at arena corners — each opens one shutter.
    plate(id, 400, 400, 'shutN', 140, 80),
    plate(id, W - 400, 400, 'shutE', 140, 80),
    plate(id, W - 400, H - 400, 'shutS', 140, 80),
    plate(id, 400, H - 400, 'shutW', 140, 80),

    // 4 corner gravity wells.
    { id: id(), type: 'gravityWell', x: 400, y: 400, w: 110, h: 110, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 400, y: 400, w: 110, h: 110, rot: 0 },
    { id: id(), type: 'gravityWell', x: W - 400, y: H - 400, w: 110, h: 110, rot: 0 },
    { id: id(), type: 'gravityWell', x: 400, y: H - 400, w: 110, h: 110, rot: 0 },

    // Central radial boosters.
    ...Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4
      return {
        id: id(), type: 'centrifugalBooster' as const,
        x: cx + Math.cos(a) * 400, y: cy + Math.sin(a) * 400,
        w: 120, h: 90, rot: a + Math.PI
      }
    }),

    // Glass tubes around middle perimeter.
    ...Array.from({ length: 20 }, (_, i) => {
      const a = (i / 20) * Math.PI * 2
      return {
        id: id(), type: 'destroyableGlassTube' as const,
        x: cx + Math.cos(a) * 650, y: cy + Math.sin(a) * 650,
        w: 40, h: 120, rot: a
      }
    }),

    boss(id, cx, cy, 90, 'castle', 150),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
