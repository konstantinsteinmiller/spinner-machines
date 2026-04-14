import type { MachineModule } from './base'

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
    ctx.fillStyle = `rgb(${bodyR},${bodyG},${bodyB})`
    ctx.fillRect(-m.w / 2, -m.h / 2, m.w, m.h)
    ctx.strokeStyle = palette.stroke
    ctx.lineWidth = 2
    ctx.strokeRect(-m.w / 2, -m.h / 2, m.w, m.h)

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
