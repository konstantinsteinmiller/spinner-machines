import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap, drawRotRect } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'
import { spawnExplosion } from '@/game/vfx'

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return
  if (m.triggered) return
  m.triggered = true
  // Activates every machine sharing this plate's meta.link key. Any
  // machine type can be a target — walls open shortcuts, glass tubes
  // shatter early, generators fire their chain, etc. Plates never
  // destroy other plates (avoids accidental self-triggering loops).
  const link = m.meta?.link
  if (link) {
    for (const other of ctx.machines) {
      if (other === m) continue
      if (other.destroyed) continue
      if (other.type === 'pressurePlate') continue
      if (other.meta?.link !== link) continue
      other.destroyed = true
      if (other.type === 'destroyableGlassTube') {
        other.destroyedAt = ctx.now
      }
      // Every linked kill triggered by the plate gets a fixed 100×100
      // blast VFX at the target's position.
      spawnExplosion(other.x, other.y, 100)
    }
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, _now: number) => {
  // ── Art mode: swap between normal and pressed sprite on trigger. ──
  if (machineArtEnabled.value) {
    const src = m.triggered ? MACHINE_ART.pressurePlatePressed : MACHINE_ART.pressurePlate
    const img = getMachineImage(src)
    if (img) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)
      ctx.drawImage(img, -m.w / 2, -m.h / 2, m.w, m.h)
      ctx.restore()
      return
    }
  }

  drawRotRect(ctx, m, m.triggered ? '#065f46' : '#78350f', '#fbbf24')
}

const mod: MachineModule = {
  type: 'pressurePlate',
  label: 'Pressure Plate',
  defaultSize: { w: 60, h: 60 },
  color: '#fbbf24',
  tick,
  render
}
export default mod
