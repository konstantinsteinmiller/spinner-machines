import type { MachineModule, StageCtx } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'

const STRENGTH = 0.9
const RADIUS = 180

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  const dx = m.x - sp.x
  const dy = m.y - sp.y
  const d = Math.hypot(dx, dy)
  if (d < 1 || d > RADIUS) return
  const pull = STRENGTH * (1 - d / RADIUS)
  sp.vx += (dx / d) * pull
  sp.vy += (dy / d) * pull
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  ctx.save()
  ctx.translate(m.x, m.y)

  // Violet pull-zone aura (kept from the drawn version) — always drawn
  // so the player can see the gravity radius regardless of art mode.
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, RADIUS)
  grad.addColorStop(0, 'rgba(168,85,247,0.45)')
  grad.addColorStop(1, 'rgba(168,85,247,0)')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, RADIUS, 0, Math.PI * 2)
  ctx.fill()

  // ── Art mode: core sprite layered into the aura, then pulsating rings ──
  if (machineArtEnabled.value) {
    const img = getMachineImage(MACHINE_ART.gravityWell)
    if (img) {
      // Draw the core sprite at the machine's hitbox size.
      const size = m.w
      ctx.drawImage(img, -size / 2, -size / 2, size, size)

      // Pulsating rings from the original drawn version, rescaled so they
      // still hug the sprite instead of disappearing inside it. Anchor at
      // the core radius and grow outward.
      const coreR = size / 2
      ctx.strokeStyle = '#a855f7'
      ctx.lineWidth = 3
      for (let i = 0; i < 3; i++) {
        const r = coreR + 6 + i * 10 + (Math.sin(now * 0.006 + i) + 1) * 4
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()
      return
    }
  }

  // Fallback — the original drawn core (tight purple rings at the center).
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 3
  for (let i = 0; i < 3; i++) {
    const r = 18 + i * 10 + (Math.sin(now * 0.006 + i) + 1) * 4
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

const mod: MachineModule = {
  type: 'gravityWell',
  label: 'Gravity Well',
  defaultSize: { w: 60, h: 60 },
  color: '#a855f7',
  tick,
  render
}
export default mod
