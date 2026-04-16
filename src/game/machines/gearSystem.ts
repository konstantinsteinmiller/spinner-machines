import type { MachineModule, StageCtx } from './base'
import { circleAabbOverlap } from './base'
import type { Machine } from '@/types/stage'
import { machineArtEnabled, getMachineImage, MACHINE_ART } from '@/use/useMachineArt'
import { spawnExplosion } from '@/game/vfx'
import useSounds from '@/use/useSound'

const { playSound } = useSounds()
let gearSoundIdx = 0

// ─── Constants ────────────────────────────────────────────────────────
const HIT_COOLDOWN = 300 // ms between activations
const ROT_PER_HIT = Math.PI / 2 // 90° per activation
const ROT_ANIM_MS = 300 // animation duration per rotation step
const GEAR_HP = 80 // base HP — tough like a metal wall
const SCORE_PER_HIT = 15 // score for each gear activation
const SCORE_ON_DESTROY = 60 // bonus score when the gear system is destroyed

const tick = (m: Machine, ctx: StageCtx) => {
  if (m.destroyed) return
  const sp = ctx.spinner
  if (!circleAabbOverlap(m, sp.x, sp.y, sp.r)) return

  // Hit cooldown — prevent spamming. HP damage is handled by the wall-
  // bounce loop in useStageGame so we only handle activation here.
  if (m.cooldownUntil && ctx.now < m.cooldownUntil) return
  m.cooldownUntil = ctx.now + HIT_COOLDOWN

  // Track cumulative rotation for rendering.
  if (!m.meta) m.meta = {}
  const prevRot = (m.meta._gearRot as number) ?? 0
  m.meta._gearRot = prevRot + ROT_PER_HIT
  m.meta._gearAnimStart = ctx.now

  // Rotate every linked target by ROT_PER_HIT.
  const link = m.meta?.link as string | undefined
  if (link) {
    for (const other of ctx.machines) {
      if (other === m) continue
      if (other.destroyed) continue
      if (other.meta?.link !== link) continue
      other.rot += ROT_PER_HIT
      // Store animation start so linked walls animate their rotation too.
      if (!other.meta) other.meta = {}
      other.meta._rotAnimStart = ctx.now
    }
  }

  ctx.addScore(SCORE_PER_HIT)
  // Rotate through gear-1, gear-2, gear-3 sounds sequentially.
  gearSoundIdx = (gearSoundIdx % 3) + 1
  playSound(`gear-${gearSoundIdx}`)

  // Destruction VFX — HP is drained by the physics bounce loop.
  if (m.hp !== undefined && m.hp <= 0 && !m.destroyedAt) {
    m.destroyedAt = ctx.now
    spawnExplosion(m.x, m.y, 120)
    ctx.addScore(SCORE_ON_DESTROY)
    playSound('explosion-1')
  }
}

// ─── Rendering: 3-gear clockwork with cel-shading ─────────────────────

function drawGear(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  outerR: number, innerR: number,
  teeth: number, rotation: number,
  fillColor: string, strokeColor: string
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rotation)

  // Trapezoidal teeth — wider base at inner radius, narrower top at outer.
  // baseHalf = angular half-width of the tooth base (at innerR)
  // tipHalf  = angular half-width of the tooth tip  (at outerR)
  const seg = (Math.PI * 2) / teeth
  const baseHalf = seg * 0.32 // wide base
  const tipHalf = seg * 0.18 // narrower outer edge

  ctx.beginPath()
  for (let i = 0; i < teeth; i++) {
    const center = (i + 0.5) * seg // angular center of this tooth
    const gapStart = i * seg
    const bL = center - baseHalf // base left angle
    const bR = center + baseHalf // base right angle
    const tL = center - tipHalf // tip left angle
    const tR = center + tipHalf // tip right angle

    if (i === 0) {
      ctx.moveTo(Math.cos(gapStart) * innerR, Math.sin(gapStart) * innerR)
    }
    // Arc along inner radius (gap) to tooth base left
    ctx.arc(0, 0, innerR, gapStart, bL)
    // Slanted side up to outer (trapezoid left edge)
    ctx.lineTo(Math.cos(tL) * outerR, Math.sin(tL) * outerR)
    // Flat top arc along outer radius
    ctx.arc(0, 0, outerR, tL, tR)
    // Slanted side down to inner (trapezoid right edge)
    ctx.lineTo(Math.cos(bR) * innerR, Math.sin(bR) * innerR)
    // Arc along inner radius to next gap
    ctx.arc(0, 0, innerR, bR, (i + 1) * seg)
  }
  ctx.closePath()
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 2
  ctx.stroke()

  // Hub circle — cel-shading highlight
  ctx.beginPath()
  ctx.arc(0, 0, innerR * 0.45, 0, Math.PI * 2)
  ctx.fillStyle = strokeColor
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, 0, innerR * 0.25, 0, Math.PI * 2)
  ctx.fillStyle = fillColor
  ctx.fill()
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.restore()
}

const render = (ctx: CanvasRenderingContext2D, m: Machine, now: number) => {
  if (m.destroyed) return

  // ── Art mode: use sprite if available ──
  if (machineArtEnabled.value) {
    const img = getMachineImage(MACHINE_ART.gearSystem)
    if (img) {
      ctx.save()
      ctx.translate(m.x, m.y)
      ctx.rotate(m.rot)
      ctx.drawImage(img, -m.w / 2, -m.h / 2, m.w, m.h)
      // Draw rotating overlay on top if animated
      const gearRot = (m.meta?._gearRot as number) ?? 0
      const animStart = (m.meta?._gearAnimStart as number) ?? 0
      const elapsed = now - animStart
      const t = animStart > 0 ? Math.min(1, elapsed / ROT_ANIM_MS) : 1
      const smoothT = t < 1 ? t * t * (3 - 2 * t) : 1 // smoothstep
      const currentRot = gearRot - ROT_PER_HIT + ROT_PER_HIT * smoothT
      // Even in art mode, overlay the gear rotation animation
      drawGearClockwork(ctx, m, currentRot, 0.4)
      ctx.restore()
      return
    }
  }

  // ── Fallback: procedural 3-gear clockwork ──
  const gearRot = (m.meta?._gearRot as number) ?? 0
  const animStart = (m.meta?._gearAnimStart as number) ?? 0
  const elapsed = now - animStart
  const t = animStart > 0 ? Math.min(1, elapsed / ROT_ANIM_MS) : 1
  const smoothT = t < 1 ? t * t * (3 - 2 * t) : 1
  const currentRot = gearRot > 0
    ? gearRot - ROT_PER_HIT + ROT_PER_HIT * smoothT
    : 0

  ctx.save()
  ctx.translate(m.x, m.y)
  ctx.rotate(m.rot)

  // HP-based tinting
  const hpRatio = (m.maxHp && m.hp !== undefined)
    ? Math.max(0, Math.min(1, m.hp / m.maxHp)) : 1
  const dmg = 1 - hpRatio

  // Base colors: metallic grey with cel-shading
  const baseR = Math.round(140 * hpRatio + 200 * dmg)
  const baseG = Math.round(150 * hpRatio + 60 * dmg)
  const baseB = Math.round(170 * hpRatio + 60 * dmg)
  const fill1 = `rgb(${baseR},${baseG},${baseB})`
  const fill2 = `rgb(${Math.round(baseR * 0.75)},${Math.round(baseG * 0.75)},${Math.round(baseB * 0.75)})`
  const fill3 = `rgb(${Math.round(baseR * 0.88)},${Math.round(baseG * 0.88)},${Math.round(baseB * 0.88)})`
  const stroke = dmg > 0.3 ? '#7f1d1d' : '#1e293b'

  // Gear layout: big gear center-left, medium top-right, small bottom-right
  // All interlocked like a clockwork
  const scale = Math.min(m.w, m.h) / 120

  const bigR = 32 * scale
  const medR = 22 * scale
  const smlR = 14 * scale

  // Positions relative to center
  const bigX = -12 * scale
  const bigY = 0
  const medX = 24 * scale
  const medY = -18 * scale
  const smlX = 28 * scale
  const smlY = 16 * scale

  // Counter-rotate meshed gears — big drives medium (opposite), medium drives small (opposite)
  const bigAngle = currentRot
  const medAngle = -currentRot * (bigR / medR)
  const smlAngle = currentRot * (bigR / smlR) * (medR / smlR) * 0.5

  // Draw back-to-front: small, medium, big
  drawGear(ctx, smlX, smlY, smlR, smlR * 0.6, 6, smlAngle, fill3, stroke)
  drawGear(ctx, medX, medY, medR, medR * 0.6, 8, medAngle, fill2, stroke)
  drawGear(ctx, bigX, bigY, bigR, bigR * 0.6, 12, bigAngle, fill1, stroke)

  // Cel-shading: a subtle highlight arc on the big gear
  ctx.globalAlpha = 0.15
  ctx.beginPath()
  ctx.arc(bigX - 4 * scale, bigY - 4 * scale, bigR * 0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.restore()
}

// Simplified gear overlay for art mode (semi-transparent rotating gears)
function drawGearClockwork(
  ctx: CanvasRenderingContext2D,
  m: Machine,
  currentRot: number,
  alpha: number
) {
  ctx.globalAlpha = alpha
  const scale = Math.min(m.w, m.h) / 120
  const bigR = 32 * scale
  const medR = 22 * scale
  const smlR = 14 * scale

  const bigAngle = currentRot
  const medAngle = -currentRot * (bigR / medR)
  const smlAngle = currentRot * (bigR / smlR) * (medR / smlR) * 0.5

  drawGear(ctx, -12 * scale, 0, bigR, bigR * 0.6, 12, bigAngle, 'rgba(180,190,205,0.5)', '#1e293b')
  drawGear(ctx, 24 * scale, -18 * scale, medR, medR * 0.6, 8, medAngle, 'rgba(160,170,185,0.5)', '#1e293b')
  drawGear(ctx, 28 * scale, 16 * scale, smlR, smlR * 0.6, 6, smlAngle, 'rgba(170,180,195,0.5)', '#1e293b')
  ctx.globalAlpha = 1
}

const mod: MachineModule = {
  type: 'gearSystem',
  label: 'Gear System',
  defaultSize: { w: 100, h: 100 },
  color: '#94a3b8',
  tick,
  render
}
export default mod
