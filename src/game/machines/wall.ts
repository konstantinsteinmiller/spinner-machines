import type { MachineModule } from './base'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'

// A single stone brick in the spritesheet is assumed to be 20×20 world
// units, so a 140×20 wall is 7 bricks wide × 1 brick tall, a 120×40 wall
// is 6 × 2, etc. Rows are offset by half a brick for a running bond.
const BRICK_SIZE = 20

// Walls are resolved by the physics loop in useStageGame (AABB bounce).
// They are destroyable — hp is tracked on the Machine and the renderer
// tints / cracks the surface as the wall takes damage.
const mod: MachineModule = {
  type: 'wall',
  label: 'Wall',
  defaultSize: { w: 120, h: 24 },
  color: '#52525b',
  tick: () => {
  },
  render: (ctx, m) => {
    const hpRatio = m.maxHp && m.hp !== undefined
      ? Math.max(0, Math.min(1, m.hp / m.maxHp))
      : 1
    const material = (m.meta?.material ?? 'wood') as 'wood' | 'stone' | 'metal'
    const palette = material === 'metal'
      ? { base: [180, 190, 205] as const, stroke: '#cbd5e1' }
      : material === 'stone'
        ? { base: [120, 120, 128] as const, stroke: '#94a3b8' }
        : { base: [120, 80, 44] as const, stroke: '#78350f' }
    ctx.save()
    ctx.translate(m.x, m.y)
    ctx.rotate(m.rot)
    // Healthier walls show their material colour; damaged walls blush red.
    const dmg = 1 - hpRatio
    const bodyR = Math.round(palette.base[0] * hpRatio + 180 * dmg)
    const bodyG = Math.round(palette.base[1] * hpRatio + 40 * dmg)
    const bodyB = Math.round(palette.base[2] * hpRatio + 40 * dmg)

    // ── Wood wall: tile the slap sprite as square panels along the
    //     wall's long axis, axis-agnostic so vertical slabs work too. ──
    let drewBricks = false
    if (machineArtEnabled.value && material === 'wood') {
      const slap = getMachineImage(MACHINE_ART.woodSlap)
      if (slap) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(-m.w / 2, -m.h / 2, m.w, m.h)
        ctx.clip()
        // Tile size = short axis. Count along long axis. This means a
        // 140×20 (horizontal slab) gets 7 panels stacked left→right and
        // a 20×140 (vertical slab) gets 7 panels stacked top→bottom,
        // instead of a single stretched panel.
        const horizontal = m.w >= m.h
        const tile = horizontal ? m.h : m.w
        const long = horizontal ? m.w : m.h
        const cols = Math.ceil(long / tile) + 1
        const startLong = -long / 2
        for (let c = 0; c < cols; c++) {
          if (horizontal) {
            ctx.drawImage(slap, startLong + c * tile, -m.h / 2, tile, tile)
          } else {
            ctx.drawImage(slap, -m.w / 2, startLong + c * tile, tile, tile)
          }
        }
        ctx.restore()
        drewBricks = true
      }
    }

    // ── Stone / metal wall: tile the brick sprite in a running-bond. ──
    if (!drewBricks && machineArtEnabled.value && (material === 'stone' || material === 'metal')) {
      const brick = getMachineImage(
        material === 'metal' ? MACHINE_ART.metalBrick : MACHINE_ART.stoneBrick
      )
      if (brick) {
        ctx.beginPath()
        ctx.rect(-m.w / 2, -m.h / 2, m.w, m.h)
        ctx.save()
        ctx.clip()
        // Lay rows along the short axis; run bricks along the long axis
        // so vertical walls don't get a half-brick offset in their
        // single-brick width.
        const horizontal = m.w >= m.h
        const shortDim = horizontal ? m.h : m.w
        const longDim = horizontal ? m.w : m.h
        const rows = Math.max(1, Math.round(shortDim / BRICK_SIZE))
        const rowStart = -shortDim / 2 + (shortDim - rows * BRICK_SIZE) / 2
        for (let r = 0; r < rows; r++) {
          const rowOffset = (r % 2 === 1) ? BRICK_SIZE / 2 : 0
          const firstLong = -longDim / 2 - rowOffset - BRICK_SIZE
          const cols = Math.ceil((longDim + rowOffset + BRICK_SIZE * 2) / BRICK_SIZE)
          for (let c = 0; c < cols; c++) {
            const longPos = firstLong + c * BRICK_SIZE
            const shortPos = rowStart + r * BRICK_SIZE
            if (horizontal) {
              ctx.drawImage(brick, longPos, shortPos, BRICK_SIZE, BRICK_SIZE)
            } else {
              ctx.drawImage(brick, shortPos, longPos, BRICK_SIZE, BRICK_SIZE)
            }
          }
        }
        ctx.restore()
        drewBricks = true
      }
    }

    if (!drewBricks) {
      ctx.fillStyle = `rgb(${bodyR},${bodyG},${bodyB})`
      ctx.fillRect(-m.w / 2, -m.h / 2, m.w, m.h)
    }
    ctx.strokeStyle = palette.stroke
    ctx.lineWidth = 2
    ctx.strokeRect(-m.w / 2, -m.h / 2, m.w, m.h)

    // Damaged stone walls get a red overlay painted over the bricks so
    // the "bleeding" tint still reads through the tile pattern.
    if (drewBricks && dmg > 0) {
      ctx.fillStyle = `rgba(200,40,40,${dmg * 0.35})`
      ctx.fillRect(-m.w / 2, -m.h / 2, m.w, m.h)
    }

    // Crack lines appear once hp drops below 75%.
    if (hpRatio < 0.75) {
      const crackAlpha = (0.75 - hpRatio) / 0.75
      ctx.strokeStyle = `rgba(0,0,0,${crackAlpha * 0.8})`
      ctx.lineWidth = 1.5
      const seed = (m.id * 9301 + 49297) % 233280
      const rnd = (i: number) => {
        const v = Math.sin(seed + i * 12.9898) * 43758.5453
        return v - Math.floor(v)
      }
      const cracks = 3 + Math.floor((1 - hpRatio) * 4)
      for (let i = 0; i < cracks; i++) {
        const x0 = (rnd(i * 2) - 0.5) * m.w
        const y0 = (rnd(i * 2 + 1) - 0.5) * m.h
        const len = (8 + rnd(i + 100) * 20) * (1 + (1 - hpRatio))
        const ang = rnd(i + 200) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x0 + Math.cos(ang) * len, y0 + Math.sin(ang) * len)
        ctx.stroke()
      }
    }
    ctx.restore()
  }
}
export default mod
