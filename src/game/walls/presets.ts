import type { Machine } from '@/types/stage'

export type WallMaterial = 'wood' | 'stone' | 'metal'

export const WALL_MATERIALS: { id: WallMaterial; label: string; color: string }[] = [
  { id: 'wood', label: 'Wood', color: '#a16207' },
  { id: 'stone', label: 'Stone', color: '#78716c' },
  { id: 'metal', label: 'Metal', color: '#cbd5e1' }
]

/**
 * Composite wall presets — each preset expands into one or more regular
 * `wall` machines when dropped into the editor. All segments stay as
 * standard walls so the physics layer keeps treating them uniformly; the
 * material is carried on `meta.material` and governs HP / look.
 */
export interface WallPreset {
  id: string
  label: string
  color: string
  /** Visual hint used for the palette icon bounding box. */
  hint: { w: number; h: number }
  build: (cx: number, cy: number, nextId: () => number, material?: WallMaterial) => Machine[]
}

const seg = (
  id: number,
  x: number,
  y: number,
  w: number,
  h: number,
  rot = 0,
  material: WallMaterial = 'wood'
): Machine => ({
  id, type: 'wall', x, y, w, h, rot, meta: { material }
})

export const WALL_PRESETS: WallPreset[] = [
  {
    id: 'wall-tiny',
    label: 'Tiny Block',
    color: '#64748b',
    hint: { w: 20, h: 20 },
    build: (cx, cy, nid, mat = 'wood') => [seg(nid(), cx, cy, 20, 20, 0, mat)]
  },
  {
    id: 'wall-short',
    label: 'Short Wall',
    color: '#64748b',
    hint: { w: 40, h: 20 },
    build: (cx, cy, nid, mat = 'wood') => [seg(nid(), cx, cy, 40, 20, 0, mat)]
  },
  {
    id: 'wall-long',
    label: 'Long Wall',
    color: '#64748b',
    hint: { w: 400, h: 24 },
    build: (cx, cy, nid, mat = 'wood') => [seg(nid(), cx, cy, 400, 24, 0, mat)]
  },
  {
    id: 'wall-xlong',
    label: 'Extra Long Wall',
    color: '#64748b',
    hint: { w: 640, h: 24 },
    build: (cx, cy, nid, mat = 'wood') => [seg(nid(), cx, cy, 640, 24, 0, mat)]
  },
  {
    id: 'wall-thick',
    label: 'Thick Wall',
    color: '#475569',
    hint: { w: 320, h: 56 },
    build: (cx, cy, nid, mat = 'wood') => [seg(nid(), cx, cy, 320, 56, 0, mat)]
  },
  {
    id: 'wall-l',
    label: 'L-Shape',
    color: '#64748b',
    hint: { w: 260, h: 260 },
    build: (cx, cy, nid, mat = 'wood') => [
      seg(nid(), cx, cy - 120, 260, 24, 0, mat),
      seg(nid(), cx - 120, cy, 24, 260, 0, mat)
    ]
  },
  {
    id: 'wall-u',
    label: 'U-Shape',
    color: '#64748b',
    hint: { w: 320, h: 220 },
    build: (cx, cy, nid, mat = 'wood') => [
      seg(nid(), cx, cy + 100, 320, 24, 0, mat),
      seg(nid(), cx - 148, cy, 24, 220, 0, mat),
      seg(nid(), cx + 148, cy, 24, 220, 0, mat)
    ]
  },
  {
    id: 'wall-box',
    label: 'Box Frame',
    color: '#475569',
    hint: { w: 320, h: 320 },
    build: (cx, cy, nid, mat = 'wood') => [
      seg(nid(), cx, cy - 148, 320, 24, 0, mat),
      seg(nid(), cx, cy + 148, 320, 24, 0, mat),
      seg(nid(), cx - 148, cy, 24, 320, 0, mat),
      seg(nid(), cx + 148, cy, 24, 320, 0, mat)
    ]
  },
  {
    id: 'wall-halfmoon',
    label: 'Half Moon',
    color: '#64748b',
    hint: { w: 360, h: 200 },
    build: (cx, cy, nid, mat = 'wood') => {
      const segs: Machine[] = []
      const r = 180
      const count = 14
      const segLen = (Math.PI * r) / count + 6
      for (let i = 0; i <= count; i++) {
        const a = Math.PI + (i / count) * Math.PI
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        const rot = a + Math.PI / 2
        segs.push(seg(nid(), x, y, segLen, 20, rot, mat))
      }
      return segs
    }
  },
  {
    id: 'wall-arc',
    label: 'Quarter Arc',
    color: '#64748b',
    hint: { w: 240, h: 240 },
    build: (cx, cy, nid, mat = 'wood') => {
      const segs: Machine[] = []
      const r = 200
      const count = 9
      const segLen = ((Math.PI / 2) * r) / count + 6
      for (let i = 0; i <= count; i++) {
        const a = Math.PI + (i / count) * (Math.PI / 2)
        const x = cx + Math.cos(a) * r
        const y = cy + Math.sin(a) * r
        const rot = a + Math.PI / 2
        segs.push(seg(nid(), x, y, segLen, 20, rot, mat))
      }
      return segs
    }
  },
  {
    id: 'wall-diagonal',
    label: 'Diagonal',
    color: '#64748b',
    hint: { w: 360, h: 24 },
    build: (cx, cy, nid, mat = 'wood') => [seg(nid(), cx, cy, 360, 24, Math.PI / 4, mat)]
  }
]
