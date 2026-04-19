import type { Stage } from '@/types/stage'
import { mkId, wall, boundary, gear, linked, boss, goal, grid, box } from './_helpers'

// ── Stage 21: "Gear Gate" ─────────────────────────────────────────────
// First entry into gear-gated progression. A single gear system sits in
// the spinner's natural first-hit arc. Each hit rotates a pair of long
// walls by 90°; two hits rotate them flush so the boss chamber opens.
// Without hitting the gear the boss is unreachable — but with a stray
// bounce the gear is fairly easy to graze by accident, so it's a gentle
// introduction to the mechanic.
const W = 2200, H = 1400
const id = mkId()

const stage: Stage = {
  id: 'stage21',
  name: 'Gear Gate',
  width: W, height: H,
  spawn: { x: 180, y: H / 2 },
  goal: { x: W - 200, y: H / 2 },
  starThresholds: [0, 500, 1000],
  launchPenalty: 50,
  bossKillBonus: 280,
  bossModelId: 'bluedragon',
  machines: [
    ...boundary(id, W, H),

    // Entry corridor funnels toward the gear so first launches tend to hit it.
    wall(id, 700, 400, 20, 400, 'wood'),
    wall(id, 700, 1000, 20, 400, 'wood'),

    // Two rotating gate walls — linked to the gear, start perpendicular
    // (blocking). Two gear hits rotates them 180° so the corridor opens.
    linked(wall(id, 1100, 550, 20, 500, 'metal'), 'g21'),
    linked(wall(id, 1100, 850, 20, 500, 'metal'), 'g21'),

    // The gear itself — parked where a bounced spinner will drift toward.
    gear(id, 900, H / 2, 'g21', 120),

    // Score fodder in the front half: glass curtain and a couple of gens.
    ...grid(id, 'destroyableGlassTube', 400, 300, 1, 5, 0, 180, 40, 120),
    ...grid(id, 'destroyableGlassTube', 400, 900, 1, 3, 0, 160, 40, 120),
    { id: id(), type: 'overloadedGenerator', x: 450, y: 680, w: 80, h: 80, rot: 0 },

    // Boss chamber, sealed by the gated walls plus a metal backstop.
    ...box(id, 1700, H / 2, 280, 340, 'left', 'metal'),
    boss(id, 1700, H / 2, 55, 'bluedragon', 150),
    goal(id, W - 200, H / 2)
  ]
}

export default stage
