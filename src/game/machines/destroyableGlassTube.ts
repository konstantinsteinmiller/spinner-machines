import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'
import useSounds from '@/use/useSound'

const { playSound } = useSounds()
let glassVariant = 0

const SCORE = 40
const SHARD_FRAMES = 3
const SHARD_DURATION_MS = 600

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  m.destroyed = true
  // Stamp the moment of death so the renderer can play the shard VFX.
  m.destroyedAt = ctx.now
  ctx.destroyMachine(m)
  ctx.addScore(SCORE)
  glassVariant = (glassVariant % 2) + 1
  playSound(`glass-shatter-${glassVariant}`)
  // Slight slowdown to feel the crunch.
  sp.vx *= 0.92
  sp.vy *= 0.92
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  // ── Post-destruction VFX: stepped shard spritesheet over 600 ms ──
  if (m.destroyed && m.destroyedAt !== undefined) {
    const elapsed = now - m.destroyedAt
    if (elapsed > SHARD_DURATION_MS) return
    if (machineArtEnabled.value) {
      const shards = getMachineImage(MACHINE_ART.glassTubeShards)
      if (shards) {
        const t = Math.min(0.999, elapsed / SHARD_DURATION_MS)
        const frame = Math.min(SHARD_FRAMES - 1, Math.floor(t * SHARD_FRAMES))
        const frameW = shards.naturalWidth / SHARD_FRAMES
        const frameH = shards.naturalHeight
        // Shards expand slightly and fade out.
        const scale = 1 + t * 0.35
        const alpha = 1 - t
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.translate(m.x, m.y)
        ctx.rotate(m.rot)
        const drawW = m.w * scale
        const drawH = m.h * scale * 2.5 // shard spread goes well past the hitbox
        ctx.drawImage(
          shards,
          frame * frameW, 0, frameW, frameH,
          -drawW / 2, -drawH / 2, drawW, drawH
        )
        ctx.restore()
      }
    }
    return
  }

  // ── Intact tube ──
  if (machineArtEnabled.value) {
    const img = getMachineImage(MACHINE_ART.glassTube)
    if (img) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)
      ctx.drawImage(img, -m.w / 2, -m.h / 2, m.w, m.h)
      ctx.restore()
      return
    }
  }

  drawRotRect(ctx, m, 'rgba(56,189,248,0.35)', '#38bdf8')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'
  ctx.lineWidth = 1
  for (let i = -m.w / 2 + 6; i < m.w / 2; i += 12) {
    ctx.beginPath()
    ctx.moveTo(i, -m.h / 2 + 2)
    ctx.lineTo(i + 4, m.h / 2 - 2)
    ctx.stroke()
  }
  ctx.restore()
}

const mod: MachineModule = {
  type: 'destroyableGlassTube',
  label: 'Glass Tube',
  defaultSize: { w: 60, h: 100 },
  color: '#38bdf8',
  tick,
  render
}
export default mod
