/**
 * Lightweight world-space VFX layer.
 *
 * Currently provides one effect — `spawnExplosion(x, y, size)` — which
 * plays the 13-frame 160×160 `explosion_2080x160.webp` spritesheet as a
 * transient overlay at the given world position. The `renderVfx` call
 * is placed after the machine render loop in `StageView.vue` so
 * explosions visually cover whatever machine just got destroyed.
 *
 * The system is intentionally tiny: a single `activeExplosions` array
 * of plain objects, no classes, no Vue reactivity. Explosions that have
 * played past their duration are dropped on the next render.
 *
 * Integration points:
 *   - `overloadedGenerator#explode` fires one at the generator position.
 *   - `pressurePlate#tick` fires one at every linked target it kills.
 *   - `spawnSpinnerExplosion(x, y)` is exported for the (future) spinner
 *     destruction path — call site is up to the game logic.
 */

import { getMachineImage } from '@/use/useMachineArt'
import { machineArtEnabled } from '@/use/useMachineArt'

const EXPLOSION_SRC = 'images/vfx/explosion_2080x160.webp'
const EXPLOSION_FRAMES = 13
const EXPLOSION_FRAME_W = 160
const EXPLOSION_FRAME_H = 160
const EXPLOSION_FRAME_MS = 55
const EXPLOSION_DURATION_MS = EXPLOSION_FRAMES * EXPLOSION_FRAME_MS

const LAUNCHER_SHOT_SRC = 'images/vfx/pneumatic-launcher-shot_1280x128.webp'
const LAUNCHER_SHOT_FRAMES = 10
const LAUNCHER_SHOT_FRAME_W = 128
const LAUNCHER_SHOT_FRAME_H = 128
const LAUNCHER_SHOT_FRAME_MS = 40
const LAUNCHER_SHOT_DURATION_MS = LAUNCHER_SHOT_FRAMES * LAUNCHER_SHOT_FRAME_MS

interface Explosion {
  x: number
  y: number
  /** World-space diameter the explosion should cover. */
  size: number
  startTs: number
}

interface LauncherShot {
  x: number
  y: number
  rot: number
  size: number
  startTs: number
}

const activeExplosions: Explosion[] = []
const activeLauncherShots: LauncherShot[] = []

/** Spawn a world-space explosion at `(x, y)` sized to `size` world units. */
export function spawnExplosion(x: number, y: number, size: number) {
  activeExplosions.push({
    x,
    y,
    size: Math.max(32, size),
    startTs: performance.now()
  })
}

/** Convenience wrapper for the "spinner blew up" case — bigger blast. */
export function spawnSpinnerExplosion(x: number, y: number) {
  spawnExplosion(x, y, 220)
}

/** Spawn a launcher muzzle-flash at `(x, y)`, rotated to match the barrel. */
export function spawnLauncherShot(x: number, y: number, rot: number, size = 50) {
  activeLauncherShots.push({ x, y, rot, size, startTs: performance.now() })
}

/** Drop every active explosion — called when a stage reloads. */
export function clearExplosions() {
  activeExplosions.length = 0
  activeLauncherShots.length = 0
}

/** Render all active explosions in world-space into `ctx`. */
export function renderVfx(ctx: CanvasRenderingContext2D, now: number) {
  // Launcher shots
  if (activeLauncherShots.length > 0) {
    const shotSheet = getMachineImage(LAUNCHER_SHOT_SRC)
    for (let i = activeLauncherShots.length - 1; i >= 0; i--) {
      const s = activeLauncherShots[i]!
      const elapsed = now - s.startTs
      if (elapsed >= LAUNCHER_SHOT_DURATION_MS) {
        activeLauncherShots.splice(i, 1)
        continue
      }
      if (!shotSheet) continue
      const frame = Math.min(
        LAUNCHER_SHOT_FRAMES - 1,
        Math.floor(elapsed / LAUNCHER_SHOT_FRAME_MS)
      )
      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.rotate(s.rot)
      ctx.drawImage(
        shotSheet,
        frame * LAUNCHER_SHOT_FRAME_W, 0, LAUNCHER_SHOT_FRAME_W, LAUNCHER_SHOT_FRAME_H,
        (-s.size / 2) + 10, (-s.size / 2) - 30, s.size, s.size
      )
      ctx.restore()
    }
  }

  if (activeExplosions.length === 0) return
  // Preload the sheet even in line-mode so spawning works once the user
  // toggles art back on. In line-mode we still want the VFX to show;
  // the sheet is a standalone asset, not gated by the toggle.
  const sheet = getMachineImage(EXPLOSION_SRC)

  // Walk the list, drop finished explosions in place.
  for (let i = activeExplosions.length - 1; i >= 0; i--) {
    const e = activeExplosions[i]!
    const elapsed = now - e.startTs
    if (elapsed >= EXPLOSION_DURATION_MS) {
      activeExplosions.splice(i, 1)
      continue
    }
    if (!sheet) continue // asset still loading, skip this frame
    const frame = Math.min(EXPLOSION_FRAMES - 1, Math.floor(elapsed / EXPLOSION_FRAME_MS))
    ctx.save()
    ctx.translate(e.x, e.y)
    const scale = e.size
    ctx.drawImage(
      sheet,
      frame * EXPLOSION_FRAME_W, 0, EXPLOSION_FRAME_W, EXPLOSION_FRAME_H,
      -scale / 2, -scale / 2, scale, scale
    )
    ctx.restore()
  }

  // Keep the reference so the linter doesn't prune the import when the
  // "art mode off" path is taken (the sheet may still be drawn above).
  void machineArtEnabled
}
