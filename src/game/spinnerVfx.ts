/**
 * Stage-game spinner VFX — trails, special-skin particles, auras, decals.
 *
 * Adapted from `useSpinnerGame.ts` (the Spinner Arena renderer) so the
 * stage spinner plays the same special-skin effects its arena counterpart
 * does. Module-scoped mutable state (no Vue reactivity) — the only
 * reactive entry point is the spinner ref read by the stage view's RAF
 * loop, which already rebuilds per frame.
 *
 * Effects implemented:
 *   • Standard fading blue trail (3-layer glow) — all skins, while moving.
 *   • `rainbow` — hue-cycling trail.
 *   • `forest-dragon` — 4 parallel colored trails.
 *   • `dark` — smoke clouds from an animated spritesheet.
 *   • `sandstorm` — sand grain trail + spiral wind aura.
 *   • `tornado` — vortex rings + debris aura.
 *   • `thunderstorm` — lightning bolt aura. Damage logic lives in
 *     useStageGame.ts so it can access the machine list.
 *   • `boulder` / `diamond` — earth-rip ground decals.
 *   • `teleporter` — no VFX here; wrap/phase logic in useStageGame.ts.
 */

import type { Spinner } from '@/types/stage'
import { prependBaseUrl } from '@/utils/function'
import { drawLightningBolt } from '@/utils/lightning'

// ─── Asset cache ───────────────────────────────────────────────────────
const imageCache = new Map<string, HTMLImageElement>()

function loadImg(path: string): HTMLImageElement | null {
  const src = prependBaseUrl(path)
  let img = imageCache.get(src)
  if (!img) {
    img = new Image()
    img.src = src
    imageCache.set(src, img)
  }
  return (img.complete && img.naturalWidth > 0) ? img : null
}

// Kick off preloads
const DARK_SMOKE_PATH = 'images/vfx/dark-smoke_1280x128.webp'
const EARTH_RIP_PATH = 'images/vfx/earth-rip-decal_138x138.webp'
loadImg(DARK_SMOKE_PATH)
loadImg(EARTH_RIP_PATH)

// ─── Trail system ──────────────────────────────────────────────────────
interface TrailPoint {
  x: number
  y: number
  speed: number
  time: number
}

const TRAIL_DURATION = 700
const trailPts: TrailPoint[] = []

const TRAIL_LAYERS = [
  { widthBase: 6, widthSpeed: 4, alphaScale: 0.15 },
  { widthBase: 3, widthSpeed: 3, alphaScale: 0.35 },
  { widthBase: 1, widthSpeed: 1.5, alphaScale: 0.7 }
]

export function recordTrail(sp: Spinner, now: number, moving: boolean) {
  if (!moving) {
    // Drain instead of truncating so the tail fades out naturally instead
    // of popping off the screen when the spinner settles.
    while (trailPts.length > 0 && now - trailPts[0]!.time > TRAIL_DURATION) {
      trailPts.shift()
    }
    return
  }
  const spd = Math.hypot(sp.vx, sp.vy)
  trailPts.push({ x: sp.x, y: sp.y, speed: spd, time: now })
  while (trailPts.length > 0 && now - trailPts[0]!.time > TRAIL_DURATION) {
    trailPts.shift()
  }
}

export function renderSpinnerTrail(ctx: CanvasRenderingContext2D, modelId: string) {
  if (trailPts.length < 2) return
  const now = performance.now()
  const oldestTime = trailPts[0]!.time
  const newestTime = trailPts[trailPts.length - 1]!.time
  const timeSpan = newestTime - oldestTime

  const isRainbow = modelId === 'rainbow'
  const isForestDragon = modelId === 'forest-dragon'

  if (isForestDragon) {
    const FD_COLORS: [number, number, number][] = [
      [220, 40, 40], [40, 180, 60], [50, 100, 220], [140, 90, 40]
    ]
    const stripWidth = 1.8
    for (let c = 0; c < FD_COLORS.length; c++) {
      const [cr, cg, cb] = FD_COLORS[c]!
      const laneOffset = (c - (FD_COLORS.length - 1) / 2) * stripWidth
      for (const layer of TRAIL_LAYERS) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = layer.widthBase * 0.6 + layer.widthSpeed * 0.4
        for (let i = 1; i < trailPts.length; i++) {
          const p0 = trailPts[i - 1]!
          const p1 = trailPts[i]!
          const t = timeSpan > 0 ? (p1.time - oldestTime) / timeSpan : 1
          const age = now - p1.time
          const ageFade = Math.max(0, 1 - age / TRAIL_DURATION)
          const alpha = ageFade * layer.alphaScale
          if (alpha <= 0.01) continue
          const r = Math.round(255 + (cr - 255) * t)
          const g = Math.round(255 + (cg - 255) * t)
          const b = Math.round(255 + (cb - 255) * t)
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          const dx = p1.x - p0.x
          const dy = p1.y - p0.y
          const len = Math.hypot(dx, dy) || 1
          const nx = -dy / len * laneOffset
          const ny = dx / len * laneOffset
          ctx.beginPath()
          ctx.moveTo(p0.x + nx, p0.y + ny)
          ctx.lineTo(p1.x + nx, p1.y + ny)
          ctx.stroke()
        }
      }
    }
    return
  }

  for (const layer of TRAIL_LAYERS) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = isRainbow
      ? (layer.widthBase + layer.widthSpeed) * 1.3
      : layer.widthBase + layer.widthSpeed
    for (let i = 1; i < trailPts.length; i++) {
      const p0 = trailPts[i - 1]!
      const p1 = trailPts[i]!
      const t = timeSpan > 0 ? (p1.time - oldestTime) / timeSpan : 1
      const age = now - p1.time
      const ageFade = Math.max(0, 1 - age / TRAIL_DURATION)
      const alpha = ageFade * layer.alphaScale
      if (alpha <= 0.01) continue
      if (isRainbow) {
        const hue = ((1 - t) * 360 + now * 0.15) % 360
        ctx.strokeStyle = `hsla(${hue}, 90%, 65%, ${alpha * 1.2})`
      } else {
        // Player = blue.
        const r = Math.round(255 + (80 - 255) * t)
        const g = Math.round(255 + (160 - 255) * t)
        const b = Math.round(255 + (255 - 255) * t)
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y)
      ctx.lineTo(p1.x, p1.y)
      ctx.stroke()
    }
  }
}

// ─── Dark smoke clouds ─────────────────────────────────────────────────
const SMOKE_FRAMES = 10
const SMOKE_FW = 128
const SMOKE_FH = 128
const SMOKE_FRAME_MS = 70

interface CloudParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  alpha: number
  frame: number
  frameTick: number
}

const cloudParticles: CloudParticle[] = []

// ─── Sandstorm grains ──────────────────────────────────────────────────
interface SandGrain {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

const sandGrains: SandGrain[] = []

// ─── Boulder/diamond ground decals ─────────────────────────────────────
interface GroundDecal {
  x: number
  y: number
  size: number
  time: number
  rotation: number
}

const groundDecals: GroundDecal[] = []
const GROUND_DECAL_DURATION = 800

export function updateSpinnerVfx(sp: Spinner, now: number, moving: boolean) {
  const spd = Math.hypot(sp.vx, sp.vy)
  const modelId = sp.modelId

  // Dark cloud emission
  if (moving && modelId === 'dark' && spd > 0.5) {
    const count = spd > 3 ? 2 : 1
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const drift = 0.2 + Math.random() * 0.3
      const maxLife = 400 + Math.random() * 300
      cloudParticles.push({
        x: sp.x + (Math.random() - 0.5) * sp.r,
        y: sp.y + (Math.random() - 0.5) * sp.r,
        vx: Math.cos(angle) * drift,
        vy: Math.sin(angle) * drift,
        life: maxLife,
        maxLife,
        size: 8 + Math.random() * 6,
        alpha: 0.7 + Math.random() * 0.3,
        frame: 0,
        frameTick: 0
      })
    }
  }
  // Update cloud particles (always, so they fade out after a skin swap too).
  for (let i = cloudParticles.length - 1; i >= 0; i--) {
    const p = cloudParticles[i]!
    p.x += p.vx
    p.y += p.vy
    p.life -= 16
    p.size += 0.08
    p.frameTick += 16
    if (p.frameTick >= SMOKE_FRAME_MS) {
      p.frameTick -= SMOKE_FRAME_MS
      if (p.frame < SMOKE_FRAMES - 1) p.frame++
    }
    if (p.life <= 0) cloudParticles.splice(i, 1)
  }

  // Sandstorm grains
  if (moving && modelId === 'sandstorm' && spd > 0.5) {
    const count = spd > 3 ? 3 : spd > 1.5 ? 2 : 1
    const colors = ['#e8c870', '#d4a855', '#c49040', '#bf8f3a', '#a87530']
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const drift = 0.15 + Math.random() * 0.25
      const maxLife = 350 + Math.random() * 250
      sandGrains.push({
        x: sp.x + (Math.random() - 0.5) * sp.r * 1.2,
        y: sp.y + (Math.random() - 0.5) * sp.r * 1.2,
        vx: Math.cos(angle) * drift,
        vy: Math.sin(angle) * drift,
        life: maxLife,
        maxLife,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]!
      })
    }
  }
  for (let i = sandGrains.length - 1; i >= 0; i--) {
    const g = sandGrains[i]!
    g.x += g.vx
    g.y += g.vy
    g.vy += 0.003
    g.life -= 16
    g.size *= 0.998
    if (g.life <= 0) sandGrains.splice(i, 1)
  }

  // Boulder / diamond ground decals
  if (moving && (modelId === 'boulder' || modelId === 'diamond') && spd > 1.0) {
    groundDecals.push({
      x: sp.x,
      y: sp.y,
      size: sp.r * (0.6 + spd * 0.04),
      time: now,
      rotation: Math.random() * Math.PI * 2
    })
  }
  while (groundDecals.length > 0 && now - groundDecals[0]!.time > GROUND_DECAL_DURATION) {
    groundDecals.shift()
  }
}

export function renderSpinnerDecals(ctx: CanvasRenderingContext2D, now: number) {
  const img = loadImg(EARTH_RIP_PATH)
  if (!img) return
  for (const d of groundDecals) {
    const age = now - d.time
    const fade = Math.max(0, 1 - age / GROUND_DECAL_DURATION)
    ctx.globalAlpha = 0.6 * fade
    const drawSize = d.size * 2
    ctx.save()
    ctx.translate(d.x, d.y)
    ctx.rotate(d.rotation)
    ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize)
    ctx.restore()
  }
  ctx.globalAlpha = 1
}

export function renderSpinnerParticles(ctx: CanvasRenderingContext2D) {
  // Dark clouds
  const smoke = loadImg(DARK_SMOKE_PATH)
  if (smoke) {
    for (const p of cloudParticles) {
      const fade = Math.max(0, p.life / p.maxLife)
      ctx.globalAlpha = p.alpha * fade
      const drawSize = p.size * 2
      ctx.drawImage(
        smoke,
        p.frame * SMOKE_FW, 0, SMOKE_FW, SMOKE_FH,
        p.x - drawSize / 2, p.y - drawSize / 2,
        drawSize, drawSize
      )
    }
    ctx.globalAlpha = 1
  }
  // Sand grains
  for (const g of sandGrains) {
    const fade = Math.max(0, g.life / g.maxLife)
    ctx.globalAlpha = 0.6 * fade
    ctx.fillStyle = g.color
    ctx.beginPath()
    ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function renderSpinnerAura(ctx: CanvasRenderingContext2D, sp: Spinner) {
  const mid = sp.modelId
  const R = sp.r
  const now = performance.now()

  // Thunderstorm — lightning bolts radiating from the spinner
  if (mid === 'thunderstorm') {
    const boltSeed = Math.floor(now / 100)
    const boltCount = 5
    ctx.save()
    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(now * 0.008)
    const glow = ctx.createRadialGradient(sp.x, sp.y, R * 0.3, sp.x, sp.y, R * 2)
    glow.addColorStop(0, 'rgba(150,200,255,0.4)')
    glow.addColorStop(1, 'rgba(100,150,255,0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(sp.x, sp.y, R * 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    for (let i = 0; i < boltCount; i++) {
      const baseAngle = (i / boltCount) * Math.PI * 2
      const jitterAngle = ((boltSeed * 7 + i * 41) % 30 - 15) * Math.PI / 180
      const angle = baseAngle + jitterAngle
      const len = R * (1.4 + ((boltSeed * 3 + i * 41) % 100) * 0.012)
      const ex = sp.x + Math.cos(angle) * len
      const ey = sp.y + Math.sin(angle) * len
      drawLightningBolt(ctx, sp.x, sp.y, ex, ey, {
        jitter: 8,
        segments: 7,
        branchChance: 0.55,
        branchLength: 0.55,
        maxDepth: 3,
        color: '#ffee66',
        glowColor: '#88bbff',
        lineWidth: 1.5,
        glowWidth: 4,
        alpha: 0.85
      })
    }
    const smallSeed = Math.floor(now / 130)
    for (let i = 0; i < 5; i++) {
      const angle = ((smallSeed * 11 + i * 73 + 34) % 360) * Math.PI / 180
      const len = R * (0.85 + ((smallSeed * 5 + i * 29) % 100) * 0.005)
      const ex = sp.x + Math.cos(angle) * len
      const ey = sp.y + Math.sin(angle) * len
      drawLightningBolt(ctx, sp.x, sp.y, ex, ey, {
        jitter: 5,
        segments: 5,
        branchChance: 0.35,
        branchLength: 0.4,
        maxDepth: 2,
        color: '#ffee66',
        glowColor: '#88bbff',
        lineWidth: 0.8,
        glowWidth: 2.5,
        alpha: 0.55
      })
    }
  }

  // Tornado — vortex rings + debris
  if (mid === 'tornado') {
    ctx.save()
    ctx.translate(sp.x, sp.y)
    const glowAngle = now * 0.002
    ctx.save()
    ctx.globalAlpha = 0.12 + 0.04 * Math.sin(now * 0.003)
    const grd = ctx.createRadialGradient(0, 0, R * 0.2, 0, 0, R * 2.2)
    grd.addColorStop(0, 'rgba(180,220,255,0.5)')
    grd.addColorStop(0.5, 'rgba(120,180,240,0.2)')
    grd.addColorStop(1, 'rgba(80,140,220,0)')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(0, 0, R * 2.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    for (let arm = 0; arm < 3; arm++) {
      const armPhase = glowAngle * (1.8 + arm * 0.3) + arm * (Math.PI * 2 / 3)
      ctx.save()
      ctx.globalAlpha = 0.18 - arm * 0.03
      ctx.strokeStyle = arm === 0 ? '#cceeff' : arm === 1 ? '#99ccee' : '#77aadd'
      ctx.lineWidth = 2 - arm * 0.3
      ctx.lineCap = 'round'
      ctx.beginPath()
      const steps = 28
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const angle = armPhase + t * Math.PI * 2.5
        const dist = R * (0.4 + t * 1.4)
        const px = Math.cos(angle) * dist
        const py = Math.sin(angle) * dist * 0.45
        if (s === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
      ctx.restore()
    }
    const rings = 6
    for (let r = 0; r < rings; r++) {
      const phase = now * 0.005 + r * Math.PI * 0.33
      const layerT = r / (rings - 1)
      const ringR = R * (0.6 + layerT * 1.3)
      const flatten = 0.2 + layerT * 0.15
      const wobX = Math.sin(phase * 1.3) * 2
      const wobY = Math.cos(phase * 0.7) * 1.5
      ctx.save()
      ctx.globalAlpha = 0.13 - layerT * 0.04
      ctx.strokeStyle = `hsl(${200 + layerT * 20}, 70%, ${75 + layerT * 10}%)`
      ctx.lineWidth = 1.8 - layerT * 0.5
      ctx.beginPath()
      ctx.ellipse(wobX, wobY, ringR, ringR * flatten, phase * 0.4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }
    ctx.restore()
  }

  // Sandstorm — dusty haze aura (the grains are particles rendered separately)
  if (mid === 'sandstorm') {
    ctx.save()
    ctx.translate(sp.x, sp.y)
    ctx.globalAlpha = 0.10 + 0.04 * Math.sin(now * 0.004)
    const haze = ctx.createRadialGradient(0, 0, R * 0.3, 0, 0, R * 2.0)
    haze.addColorStop(0, 'rgba(220,180,100,0.45)')
    haze.addColorStop(0.5, 'rgba(190,150,80,0.18)')
    haze.addColorStop(1, 'rgba(160,120,60,0)')
    ctx.fillStyle = haze
    ctx.beginPath()
    ctx.arc(0, 0, R * 2.0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function clearSpinnerVfx() {
  trailPts.length = 0
  cloudParticles.length = 0
  sandGrains.length = 0
  groundDecals.length = 0
}
