import type { MachineModule, StageCtx } from './base'
import type { Machine } from '@/types/stage'
import { modelImgPath } from '@/use/useModels'
import { useScreenshake } from '@/use/useScreenshake'
import useSounds from '@/use/useSound'

const { triggerShake } = useScreenshake()
const { playSound } = useSounds()

const HIT_COOLDOWN = 400

const imageCache: Record<string, HTMLImageElement> = {}
const getImg = (modelId: string): HTMLImageElement => {
  if (!imageCache[modelId]) {
    const img = new Image()
    img.src = modelImgPath(modelId)
    imageCache[modelId] = img
  }
  return imageCache[modelId]!
}

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  const dx = sp.x - m.x
  const dy = sp.y - m.y
  const dist = Math.hypot(dx, dy)
  const bossR = m.w / 2
  if (dist < bossR + sp.r) {
    // Bounce spinner off the boss.
    const nx = dx / (dist || 1)
    const ny = dy / (dist || 1)
    const overlap = bossR + sp.r - dist
    sp.x += nx * overlap
    sp.y += ny * overlap
    const vn = sp.vx * nx + sp.vy * ny
    if (vn < 0) {
      sp.vx -= 2 * vn * nx
      sp.vy -= 2 * vn * ny
      // Damage proportional to impact speed — bosses are not too tanky.
      if ((m.cooldownUntil ?? 0) < ctx.now) {
        const impact = Math.hypot(sp.vx, sp.vy)
        const dmg = Math.max(1, Math.round(impact * 0.6))
        m.hp = (m.hp ?? m.maxHp ?? 10) - dmg
        m.cooldownUntil = ctx.now + HIT_COOLDOWN
        // Clash sfx on every damaging hit — random 1..5 variant.
        playSound(`clash-${1 + Math.floor(Math.random() * 5)}`)
        // Screen-shake — intensity scales with impact speed, killing
        // blow upgrades to the 'big' preset.
        if (m.hp <= 0) {
          m.destroyed = true
          triggerShake('big')
          // Kill bonus is handled in onBossDead — no per-hit score.
          ctx.onBossDead()
        } else {
          triggerShake(impact > 10 ? 'strong' : 'small')
        }
      }
    }
  }
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  const r = m.w / 2
  ctx.save()
  ctx.translate(m.x, m.y)
  const pulse = 1 + Math.sin(now * 0.004) * 0.02
  ctx.rotate(now * 0.003)
  ctx.scale(pulse, pulse)
  const modelId = m.modelId || 'bluedragon'
  const img = getImg(modelId)
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, -r, -r, r * 2, r * 2)
  } else {
    ctx.fillStyle = '#7c3aed'
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
  // HP bar
  const max = m.maxHp ?? 10
  const hp = Math.max(0, m.hp ?? max)
  const w = r * 2
  ctx.save()
  ctx.translate(m.x - r, m.y - r - 18)
  ctx.fillStyle = 'rgba(0,0,0,0.7)'
  ctx.fillRect(0, 0, w, 10)
  ctx.fillStyle = '#ef4444'
  ctx.fillRect(2, 2, (w - 4) * (hp / max), 6)
  ctx.strokeStyle = '#fff'
  ctx.strokeRect(0, 0, w, 10)
  ctx.restore()
}

const mod: MachineModule = {
  type: 'boss',
  label: 'Boss',
  defaultSize: { w: 180, h: 180 },
  color: '#7c3aed',
  tick,
  render
}
export default mod
