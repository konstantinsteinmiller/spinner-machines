import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'
import { spawnLauncherShot } from '@/game/vfx'
import useSounds from '@/use/useSound'

const { playSound } = useSounds()

const LAUNCH_SPEED = 22

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
  sp.vx = dirX * LAUNCH_SPEED
  sp.vy = dirY * LAUNCH_SPEED
  const muzzleX = m.x + dirX * (m.w / 2 + 10)
  const muzzleY = m.y + dirY * (m.w / 2 + 10)
  spawnLauncherShot(muzzleX, muzzleY, m.rot, 100)
  playSound('pneumatic-shot')
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  // ── Art mode: cannon sprite, stretched to the hitbox and rotated ──
  if (machineArtEnabled.value) {
    const img = getMachineImage(MACHINE_ART.pneumaticLauncher)
    if (img) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)
      // When the cannon would end up upside-down (muzzle pointing left
      // in world space), mirror the sprite along its local Y axis so
      // the base stays on the "ground" while the muzzle still points
      // in the launch direction.
      if (Math.cos(m.rot) < 0) {
        ctx.scale(1, -1)
      }
      // The sprite's muzzle faces +x so drawing at the native orientation
      // lines up with m.rot (which is also the launch direction).
      // Slight overdraw so the cannon silhouette isn't clipped to the
      // tight hitbox.
      const w = m.w * 1.4
      const h = m.h * 1.9
      ctx.drawImage(img, -w / 2, -h / 2, w, h)
      ctx.restore()
      return
    }
  }

  drawRotRect(ctx, m, '#14532d', '#22c55e')
  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)
  ctx.fillStyle = '#22c55e'
  ctx.beginPath()
  const w = m.w / 2
  const h = m.h / 2
  ctx.moveTo(w, 0)
  ctx.lineTo(w - 18, -h + 6)
  ctx.lineTo(w - 18, h - 6)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

const mod: MachineModule = {
  type: 'pneumaticLauncher',
  label: 'Pneumatic Launcher',
  defaultSize: { w: 90, h: 60 },
  color: '#22c55e',
  tick,
  render
}
export default mod
