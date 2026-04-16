/**
 * Machine art toggle + image cache.
 *
 * Set `machineArtEnabled` to `false` to fall back to the original
 * line-drawn render implementations for every machine. Individual
 * machine `render` functions read the flag and branch.
 *
 * Images are loaded lazily via `getMachineImage(src)`. The first call
 * starts the fetch and returns `null`; once the image is decoded,
 * subsequent calls return the live `HTMLImageElement` so render can
 * `drawImage` it.
 */

import { ref } from 'vue'
import { prependBaseUrl } from '@/utils/function'
import { resourceCache } from '@/use/useAssets'

const STORAGE_KEY = 'bm_machine_art_enabled'
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

export const machineArtEnabled = ref<boolean>(stored === null ? true : stored === 'true')

export function setMachineArtEnabled(on: boolean) {
  machineArtEnabled.value = on
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false')
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function toggleMachineArt() {
  setMachineArtEnabled(!machineArtEnabled.value)
}

// ─── Image cache ──────────────────────────────────────────────────────

const imageCache = new Map<string, HTMLImageElement>()

export function getMachineImage(relativePath: string): HTMLImageElement | null {
  const src = prependBaseUrl(relativePath)
  // Check the preloader's cache first — if the boot preload already
  // fetched + decoded this image we reuse it instead of creating a
  // duplicate Image object.
  const preloaded = resourceCache.images.get(src)
  if (preloaded && preloaded.complete && preloaded.naturalWidth > 0) {
    imageCache.set(src, preloaded)
    return preloaded
  }
  let img = imageCache.get(src)
  if (!img) {
    img = new Image()
    img.src = src
    imageCache.set(src, img)
  }
  if (img.complete && img.naturalWidth > 0) return img
  return null
}

// ─── Asset paths ──────────────────────────────────────────────────────
export const MACHINE_ART = {
  exitGate: 'images/machines/exit-gate_256x256.webp',
  centrifugalBoosterBase: 'images/machines/centrifugal-booster_256x256.webp',
  rotatorSheet: 'images/machines/rotator_660x110.webp',
  conveyorBeltBase: 'images/machines/conveyer-belt_256x256.webp',
  conveyorBeltSheet: 'images/machines/conveyer-belt-belt_718x127.webp',
  magneticRail: 'images/machines/magnetic-rail_256x256.webp',
  pneumaticLauncher: 'images/machines/pneumatic-launcher_256x256.webp',
  gravityWell: 'images/machines/gravity-well_256x256.webp',
  glassTube: 'images/machines/glass-tube_256x256.webp',
  glassTubeShards: 'images/machines/glass-tube-shards_768x256.webp',
  overloadedGenerator: 'images/machines/overloaded-generator_256x256.webp',
  stoneBrick: 'images/machines/brick_128x128.webp',
  metalBrick: 'images/machines/metal-brick_128x128.webp',
  woodSlap: 'images/machines/wood_128x128.webp',
  pressurePlate: 'images/machines/pressure-plate_256x256.webp',
  pressurePlatePressed: 'images/machines/pressure-plate-pressed_256x256.webp',
  gearSystem: 'images/machines/gear-system_256x256.webp',
  bgTile: 'images/bg/spinner-machines-bg-tile_256x256.webp',
  explosionSheet: 'images/vfx/explosion_2080x160.webp',
  launcherShotSheet: 'images/vfx/pneumatic-launcher-shot_1280x128.webp'
} as const

// Machine sprites are preloaded by useAssets during boot (critical path).
// getMachineImage() falls back to lazy on-demand fetch for any sprite
// not yet in cache, so no eager loop is needed here.
