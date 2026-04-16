import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'
import { spawnExplosion } from '@/game/vfx'
import useSounds from '@/use/useSound'

const { playSound } = useSounds()
let explosionVariant = 0

const SCORE = 100
const CHAIN_SCORE = 50
const BLAST_RADIUS = 160

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  // Bounce spinner away a bit from blast.
  const dx = sp.x - m.x
  const dy = sp.y - m.y
  const d = Math.hypot(dx, dy) || 1
  sp.vx += (dx / d) * 10
  sp.vy += (dy / d) * 10
  explode(m, ctx, SCORE)
}

const explode = (m: Machine, ctx: StageCtx, score: number) => {
  if (m.destroyed) return
  m.destroyed = true
  ctx.destroyMachine(m)
  ctx.addScore(score)
  // Fixed-size blast VFX (100 world units) — consistent pop regardless
  // of which machine triggered it.
  spawnExplosion(m.x, m.y, 100)
  explosionVariant = (explosionVariant % 3) + 1
  playSound(`explosion-${explosionVariant}`)
  // Chain reaction: destroy neighbors in blast radius.
  for (const other of ctx.machines) {
    if (other === m || other.destroyed) continue
    const dd = Math.hypot(other.x - m.x, other.y - m.y)
    if (dd < BLAST_RADIUS) {
      if (other.type === 'overloadedGenerator') {
        explode(other, ctx, CHAIN_SCORE)
      } else if (other.type === 'destroyableGlassTube' || other.type === 'wall') {
        other.destroyed = true
        if (other.type === 'destroyableGlassTube') other.destroyedAt = ctx.now
        ctx.destroyMachine(other)
        ctx.addScore(CHAIN_SCORE)
      }
    }
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  const pulse = 0.6 + 0.4 * Math.sin(now * 0.008)

  // ── Art mode: base sprite + pulsing orange glow halo ──
  if (machineArtEnabled.value) {
    const img = getMachineImage(MACHINE_ART.overloadedGenerator)
    if (img) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)

      // Pulsing orange bloom around the core window so the generator
      // visibly breathes like a primed explosive.
      const r = Math.max(m.w, m.h) * 0.75
      const haloGrad = ctx.createRadialGradient(0, 0, Math.min(m.w, m.h) * 0.2, 0, 0, r)
      haloGrad.addColorStop(0, `rgba(251,146,60,${pulse * 0.85})`)
      haloGrad.addColorStop(0.55, `rgba(249,115,22,${pulse * 0.4})`)
      haloGrad.addColorStop(1, 'rgba(249,115,22,0)')
      ctx.fillStyle = haloGrad
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()

      // Base sprite with a matching shadowBlur so the silhouette itself
      // glows in time with the halo.
      ctx.shadowColor = `rgba(251,146,60,${pulse * 0.8})`
      ctx.shadowBlur = 16 + pulse * 10
      ctx.drawImage(img, -m.w / 2, -m.h / 2, m.w, m.h)
      ctx.restore()
      return
    }
  }

  drawRotRect(ctx, m, '#450a0a', '#f97316')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.fillStyle = `rgba(249,115,22,${pulse})`
  ctx.beginPath()
  ctx.arc(0, 0, Math.min(m.w, m.h) / 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

const mod: MachineModule = {
  type: 'overloadedGenerator',
  label: 'Overloaded Generator',
  defaultSize: { w: 80, h: 80 },
  color: '#f97316',
  tick,
  render
}
export default mod
