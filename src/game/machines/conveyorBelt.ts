import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'

const BELT_FRAMES = 3
const BELT_FRAME_MS = 100

const PUSH = 0.35
const MIN_RETURN_SPEED = 3

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  const dirX = Math.cos(m.rot)
  const dirY = Math.sin(m.rot)
  const speed = Math.hypot(sp.vx, sp.vy)
  if (speed < MIN_RETURN_SPEED) {
    sp.vx = dirX * MIN_RETURN_SPEED
    sp.vy = dirY * MIN_RETURN_SPEED
  } else {
    sp.vx += dirX * PUSH
    sp.vy += dirY * PUSH
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  // ── Art mode: animated belt under the cut-out frame ──
  if (machineArtEnabled.value) {
    const base = getMachineImage(MACHINE_ART.conveyorBeltBase)
    const sheet = getMachineImage(MACHINE_ART.conveyorBeltSheet)
    if (base) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)

      // Draw the animated belt first so the base frame's top/bottom
      // chevron rails sit on top of it. The belt occupies the inner
      // horizontal strip — roughly the middle 65% of the base image.
      if (sheet) {
        // Frame dimensions come from the loaded image so the sheet can
        // grow / shrink without touching this file again.
        const frameW = sheet.naturalWidth / BELT_FRAMES
        const frameH = sheet.naturalHeight
        const frame = Math.floor(now / BELT_FRAME_MS) % BELT_FRAMES
        const beltW = m.w
        const beltH = m.h * 0.65
        ctx.drawImage(
          sheet,
          frame * frameW, 0, frameW, frameH,
          -beltW / 2, -beltH / 2, beltW, beltH
        )
      }

      // Base frame on top — its cut-out lets the belt show through.
      ctx.drawImage(base, -m.w / 2, -m.h / 2, m.w, m.h)
      ctx.restore()
      return
    }
  }

  drawRotRect(ctx, m, '#334155', '#94a3b8')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 2
  const offset = (now * 0.05) % 20
  for (let x = -m.w / 2 + offset; x < m.w / 2; x += 20) {
    ctx.beginPath()
    ctx.moveTo(x, -m.h / 2 + 4)
    ctx.lineTo(x + 8, m.h / 2 - 4)
    ctx.stroke()
  }
  ctx.restore()
}

const mod: MachineModule = {
  type: 'conveyorBelt',
  label: 'Conveyor Belt',
  defaultSize: { w: 180, h: 50 },
  color: '#94a3b8',
  tick,
  render
}
export default mod
