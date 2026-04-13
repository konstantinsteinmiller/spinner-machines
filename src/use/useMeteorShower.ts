import { ref } from 'vue'
import type { MeteorParticle } from '@/types/spinner'

/**
 * Reusable meteor-shower VFX ported from useSpinnerGame so it can play in
 * the stage intro independently of the arena game loop. Particles live in a
 * local coordinate system — translate the canvas to the focal point before
 * calling `render`.
 */
export function useMeteorShower() {
  const particles = ref<MeteorParticle[]>([])

  const spawn = (count = 80, spawnRadius = 50, maxLife = 65) => {
    const maxDelay = Math.floor(maxLife * 0.6)
    const out: MeteorParticle[] = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
      const spawnDist = spawnRadius + (Math.random() - 0.5) * 6
      const spd = 1.5 + Math.random() * 2.5
      const lifeVar = maxLife + Math.floor(Math.random() * 20)
      const delay = Math.floor(Math.random() * maxDelay)
      out.push({
        x: Math.cos(angle) * spawnDist,
        y: Math.sin(angle) * spawnDist,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        life: lifeVar + delay,
        maxLife: lifeVar,
        hue:
          Math.random() < 0.25
            ? 20 + Math.floor(Math.random() * 25)
            : 190 + Math.floor(Math.random() * 40)
      })
    }
    particles.value = out
  }

  const update = () => {
    const alive: MeteorParticle[] = []
    for (const p of particles.value) {
      p.life--
      if (p.life <= 0) continue
      if (p.life <= p.maxLife) {
        p.x += p.vx
        p.y += p.vy
        const dist = Math.sqrt(p.x * p.x + p.y * p.y)
        if (dist > 0.1) {
          p.vx += (p.x / dist) * 0.02
          p.vy += (p.y / dist) * 0.02
        }
      }
      alive.push(p)
    }
    particles.value = alive
  }

  /** Render meteor particles in the current transform (caller translates).
   *  `scale` multiplies stroke + head size so the original arena-tuned
   *  values can be reused in large world-unit canvases. */
  const render = (ctx: CanvasRenderingContext2D, scale = 1) => {
    const stroke = 2 * scale
    const headR = 1.5 * scale
    for (const p of particles.value) {
      if (p.life > p.maxLife) continue
      const alpha = (p.life / p.maxLife) * 0.8
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
      const tailLen = spd * 4 * scale
      const nx = spd > 0.01 ? p.vx / spd : 0
      const ny = spd > 0.01 ? p.vy / spd : 0
      ctx.strokeStyle = `hsla(${p.hue}, 90%, 70%, ${alpha})`
      ctx.lineWidth = stroke
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(p.x - nx * tailLen, p.y - ny * tailLen)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      ctx.fillStyle = `hsla(${p.hue}, 90%, 90%, ${alpha})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, headR, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.lineCap = 'butt'
  }

  const isActive = () => particles.value.length > 0

  return { particles, spawn, update, render, isActive }
}

export default useMeteorShower
