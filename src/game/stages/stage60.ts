import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, boss, goal, gear, linked } from './_helpers'

// ── Stage 60: "Glassmith's Arena" ─────────────────────────────────────
// Chapter-D capstone. Mixes glass with gears: 4 gears each power a
// linked wall that hides additional glass tubes. Break every gear to
// expose ~24 bonus glass, then shatter it all before finishing.
const W = 2800, H = 2000
const id = mkId()

const revealKey = ['cacheA', 'cacheB', 'cacheC', 'cacheD']
const gearPositions: [number, number][] = [
  [700, 500], [2100, 500], [700, H - 500], [2100, H - 500]
]

const glassCache = (cx: number, cy: number, key: string) => [
  // wall that links to the gear — gets destroyed when gear dies.
  linked(
    { id: id(), type: 'wall', x: cx, y: cy, w: 300, h: 40, rot: 0, meta: { material: 'stone' } },
    key
  ),
  // six tubes behind the wall.
  ...Array.from({ length: 6 }, (_, i) => ({
    id: id(), type: 'destroyableGlassTube' as const,
    x: cx - 250 + i * 100, y: cy + 80, w: 40, h: 120, rot: 0
  }))
]

const stage: Stage = {
  id: 'stage60',
  name: 'Glassmith\'s Arena',
  width: W, height: H,
  spawn: { x: 200, y: H / 2 },
  goal: { x: W - 220, y: H / 2 },
  starThresholds: [0, 900, 1500],
  launchPenalty: 60,
  bossKillBonus: 360,
  bossModelId: 'castle',
  machines: [
    ...boundary(id, W, H),

    // 4 gears, each unlocking one glass cache.
    ...gearPositions.map(([x, y], i) => gear(id, x, y, revealKey[i], 80, 100)),

    // Glass caches + the walls that hide them.
    ...glassCache(W / 2 - 800, 280, 'cacheA'),
    ...glassCache(W / 2 + 500, 280, 'cacheB'),
    ...glassCache(W / 2 - 800, H - 280, 'cacheC'),
    ...glassCache(W / 2 + 500, H - 280, 'cacheD'),

    { id: id(), type: 'centrifugalBooster', x: 360, y: H / 2, w: 120, h: 100, rot: 0 },
    { id: id(), type: 'gravityWell', x: W / 2, y: H / 2, w: 120, h: 120, rot: 0 },

    boss(id, W - 400, H / 2, 80, 'castle', 170),
    goal(id, W - 220, H / 2)
  ]
}

export default stage
