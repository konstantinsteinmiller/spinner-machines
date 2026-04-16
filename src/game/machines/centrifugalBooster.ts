import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'
import useSounds from '@/use/useSound'

const { playSound } = useSounds()

const ROTATOR_FRAMES = 6
const ROTATOR_FRAME_MS = 70
const ROTATOR_FRAME_W = 110
const ROTATOR_FRAME_H = 110

const BOOST = 1.5
const MIN_EXIT = 8

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) {
    m.triggered = false
    return
  }
  if (m.triggered) return
  m.triggered = true
  const dirX = Math.cos(m.rot)
  const dirY = Math.sin(m.rot)
  const speed = Math.hypot(sp.vx, sp.vy)
  const newSpeed = Math.max(speed * BOOST, MIN_EXIT)
  sp.vx = dirX * newSpeed
  sp.vy = dirY * newSpeed
  playSound('fan-whoosh')
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  // ── Art mode: base sprite + animated rotator on the blue plate ──
  if (machineArtEnabled.value) {
    const base = getMachineImage(MACHINE_ART.centrifugalBoosterBase)
    const sheet = getMachineImage(MACHINE_ART.rotatorSheet)
    if (base) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)
      // Stretch base to the machine's hitbox.
      ctx.drawImage(base, -m.w / 2, -m.h / 2, m.w - 10, m.h)

      if (sheet) {
        // The blue plate occupies roughly the top-center 55% of the
        // base image; center the rotator on that area and scale it to
        // a bit smaller than the plate's short side.
        const plateCx = -m.w * 0.04
        const plateCy = -m.h * 0.08
        const plateSize = Math.min(m.w, m.h) * 0.55
        const frame = Math.floor(now / ROTATOR_FRAME_MS) % ROTATOR_FRAMES
        ctx.drawImage(
          sheet,
          frame * ROTATOR_FRAME_W, 0, ROTATOR_FRAME_W, ROTATOR_FRAME_H,
          plateCx - plateSize / 2, plateCy - plateSize / 2, plateSize, plateSize
        )
      }
      ctx.restore()
      return
    }
  }

  drawRotRect(ctx, m, '#1f2937', '#facc15')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot + now * 0.01)
  ctx.strokeStyle = '#facc15'
  ctx.lineWidth = 3
  const r = Math.min(m.w, m.h) / 3
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    ctx.stroke()
  }
  ctx.restore()
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.fillStyle = 'rgba(250,204,21,0.9)'
  ctx.beginPath()
  ctx.moveTo(m.w / 2, 0)
  ctx.lineTo(m.w / 2 - 10, -8)
  ctx.lineTo(m.w / 2 - 10, 8)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

const mod: MachineModule = {
  type: 'centrifugalBooster',
  label: 'Centrifugal Booster',
  defaultSize: { w: 100, h: 60 },
  color: '#facc15',
  tick,
  render
}
export default mod
