import type { Machine } from '@/types/stage'

/**
 * Composite wall presets — each preset expands into one or more regular
 * `wall` machines when dropped into the editor. All segments stay as
 * standard walls so the physics layer keeps treating them uniformly.
 */
export interface WallPreset {
  id: string
  label: string
  color: string
  /** Visual hint used for the palette icon bounding box. */
  hint: { w: number; h: number }
  build: (cx: number, cy: number, nextId: () => number) => Machine[]
}

const seg = (id: number, x: number, y: number, w: number, h: number, rot = 0): Machine => ({
  id, type: 'wall', x, y, w, h, rot
})

export const WALL_PRESETS: WallPreset[] = [
  {
    id: 'wall-long',
    label: 'Long Wall',
    color: '#64748b',
    hint: { w: 400, h: 24 },
    build: (cx, cy, nid) => [seg(nid(), cx, cy, 400, 24, 0)]
  },
  {
    id: 'wall-xlong',
    label: 'Extra Long Wall',
    color: '#64748b',
    hint: { w: 640, h: 24 },
    build: (cx, cy, nid) => [seg(nid(), cx, cy, 640, 24, 0)]
  },
  {
    id: 'wall-thick',
    label: 'Thick Wall',
    color: '#475569',
    hint: { w: 320, h: 56 },
    build: (cx, cy, nid) => [seg(nid(), cx, cy, 320, 56, 0)]
  },
  {
    id: 'wall-l',
    label: 'L-Shape',
    color: '#64748b',
    hint: { w: 260, h: 260 },
    build: (cx, cy, nid) => [
      seg(nid(), cx, cy - 120, 260, 24, 0),
      seg(nid(), cx - 120, cy, 24, 260, 0)
    ]
  },
  {
    id: 'wall-u',
    label: 'U-Shape',
    color: '#64748b',
    hint: { w: 320, h: 220 },
    build: (cx, cy, nid) => [
      seg(nid(), cx, cy + 100, 320, 24, 0),
      seg(nid(), cx - 148, cy, 24, 220, 0),
      seg(nid(), cx + 148, cy, 24, 220, 0)
    ]
  },
  {
    id: 'wall-box',
    label: 'Box Frame',
    color: '#475569',
    hint: { w: 320, h: 320 },
    build: (cx, cy, nid) => [
      seg(nid(), cx, cy - 148, 320, 24, 0),
      seg(nid(), cx, cy + 148, 320, 24, 0),
      seg(nid(), cx - 148, cy, 24, 320, 0),
      seg(nid(), cx + 148, cy, 24, 320, 0)
    ]
  },
  {
    id: 'wall-halfmoon',
    label: 'Half Moon',
    color: '#64748b',
    hint: { w: 360, h: 200 },
    build: (cx, cy, nid) => {
      // Lower half of a circle approximated by ~14 rotated wall segments.
      const segs: Machine[] = []
      const r = 180
      const count = 14
      const segLen = (Math.PI * r) / count + 6
      for (let i = 0; i <= count; i++) {
        const a = Math.PI + (i / count) * Math.PI
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        // Tangent direction = a + π/2
        const rot = a + Math.PI / 2
        segs.push(seg(nid(), x, y, segLen, 20, rot))
      }
      return segs
    }
  },
  {
    id: 'wall-arc',
    label: 'Quarter Arc',
    color: '#64748b',
    hint: { w: 240, h: 240 },
    build: (cx, cy, nid) => {
      const segs: Machine[] = []
      const r = 200
      const count = 9
      const segLen = ((Math.PI / 2) * r) / count + 6
      for (let i = 0; i <= count; i++) {
        const a = Math.PI + (i / count) * (Math.PI / 2)
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        const rot = a + Math.PI / 2
        segs.push(seg(nid(), x, y, segLen, 20, rot))
      }
      return segs
    }
  },
  {
    id: 'wall-diagonal',
    label: 'Diagonal',
    color: '#64748b',
    hint: { w: 360, h: 24 },
    build: (cx, cy, nid) => [seg(nid(), cx, cy, 360, 24, Math.PI / 4)]
  }
]
