import { ref } from 'vue'
import { modelImgPath, getSelectedSkin, SPINNER_MODEL_IDS } from '@/use/useModels.ts'
import { prependBaseUrl } from '@/utils/function.ts'

// Shared reactive loader state — surfaced to FLogoProgress.
const loadingProgress = ref(0)
const areAllAssetsLoaded = ref(false)

// Persistent cache across component unmounts / route changes.
export const resourceCache = {
  images: new Map<string, HTMLImageElement>(),
  audio: new Map<string, HTMLAudioElement>()
}

// ─── Critical assets: everything the player sees at first paint ──────
// These block the loading screen. Order: HUD chrome, then machine
// sprites + wall bricks + VFX sheets so the stage renders fully once
// the progress bar hits 100% — no pop-in.
// NOTE: bg-tile and logo are NOT listed here — they're already loaded by
// the static HTML splash in index.html before any JS runs.
const HUD_IMAGES = [
  'images/icons/team_128x128.webp',
  'images/icons/gears_128x128.webp',
  'images/icons/trophy_128x128.webp'
]

// Machine sprites used by every stage — loaded before the first frame
// so nothing pops in after the loading screen.
const MACHINE_SPRITE_IMAGES = [
  'images/machines/exit-gate_256x256.webp',
  'images/machines/centrifugal-booster_256x256.webp',
  'images/machines/rotator_660x110.webp',
  'images/machines/conveyer-belt_256x256.webp',
  'images/machines/conveyer-belt-belt_718x127.webp',
  'images/machines/magnetic-rail_256x256.webp',
  'images/machines/pneumatic-launcher_256x256.webp',
  'images/machines/gravity-well_256x256.webp',
  'images/machines/glass-tube_256x256.webp',
  'images/machines/glass-tube-shards_768x256.webp',
  'images/machines/overloaded-generator_256x256.webp',
  'images/machines/brick_128x128.webp',
  'images/machines/metal-brick_128x128.webp',
  'images/machines/wood_128x128.webp',
  'images/machines/pressure-plate_256x256.webp',
  'images/machines/pressure-plate-pressed_256x256.webp'
]

// VFX that fire immediately on first hit — must be ready before play.
const VFX_IMAGES = [
  'images/vfx/explosion_2080x160.webp',
  'images/vfx/pneumatic-launcher-shot_1280x128.webp'
]

// Assets that are NOT needed for the first frame but should be warmed
// opportunistically so the skin shop / battle pass / reward ribbon feel
// instant when they first render.
const BACKGROUND_IMAGES = [
  'images/bg/parchment-ribbon_553x188.webp',
  'images/vfx/dark-smoke_1280x128.webp',
  'images/vfx/earth-rip-decal_138x138.webp'
]

// SFX that should be warmed in the background so the first collision
// doesn't stutter. Not critical — playSound falls back to on-demand.
const BACKGROUND_SFX = [
  'audio/sfx/steel-collision.ogg',
  'audio/sfx/wood-collision.ogg',
  'audio/sfx/stone-brick-collision.ogg',
  'audio/sfx/glass-shatter-1.ogg',
  'audio/sfx/glass-shatter-2.ogg',
  'audio/sfx/explosion-1.ogg',
  'audio/sfx/explosion-2.ogg',
  'audio/sfx/explosion-3.ogg',
  'audio/sfx/fan-whoosh.ogg',
  'audio/sfx/gravity-well.ogg',
  'audio/sfx/magnetic-rail-acceleration.ogg',
  'audio/sfx/pneumatic-shot.ogg',
  'audio/sfx/gear-1.ogg',
  'audio/sfx/gear-2.ogg',
  'audio/sfx/gear-3.ogg',
  'audio/sfx/clash-1.ogg',
  'audio/sfx/clash-2.ogg',
  'audio/sfx/clash-3.ogg',
  'audio/sfx/clash-4.ogg',
  'audio/sfx/clash-5.ogg',
  'audio/sfx/celebration-1.ogg',
  'audio/sfx/celebration-2.ogg',
  'audio/sfx/celebration-3.ogg',
  'audio/sfx/happy.ogg',
  'audio/sfx/win.ogg',
  'audio/sfx/reward-continue.ogg'
]

type AssetEntry = { src: string; type: 'image' | 'audio' }

const ASSET_TIMEOUT_MS = 8000

const loadAsset = (
  { src, type }: AssetEntry,
  onLoaded?: () => void
): Promise<unknown> => {
  if (type === 'image' && resourceCache.images.has(src)) {
    onLoaded?.()
    return Promise.resolve()
  }
  if (type === 'audio' && resourceCache.audio.has(src)) {
    onLoaded?.()
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    let settled = false
    const done = (v: unknown) => {
      if (settled) return
      settled = true
      onLoaded?.()
      resolve(v)
    }
    // Safety timeout — if the asset never loads or errors, unblock the
    // progress bar so the game can start.
    setTimeout(() => done(null), ASSET_TIMEOUT_MS)

    if (type === 'image') {
      const img = new Image()
      img.onload = () => {
        resourceCache.images.set(src, img)
        done(img)
      }
      img.onerror = () => {
        console.error('Preload fail:', src)
        done(null)
      }
      img.src = src
    } else {
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        resourceCache.audio.set(src, audio)
        done(audio)
      }
      audio.onerror = () => done(null)
      audio.src = src
      audio.load()
    }
  })
}

const runInChunks = async (assets: AssetEntry[], chunkSize: number, onLoaded?: () => void) => {
  for (let i = 0; i < assets.length; i += chunkSize) {
    const chunk = assets.slice(i, i + chunkSize)
    await Promise.all(chunk.map(a => loadAsset(a, onLoaded)))
  }
}

/**
 * Resolve the boss skin id for the stage the player will boot into.
 * Mirrors the logic in `StageView.loadInitialStage`:
 *   • fresh player (no `bm_tutorial_done`) → tutorial stage
 *   • last played stage saved → that stage
 *   • otherwise → stage1
 *
 * Returns the skin id or `null` if the stage has no boss machine.
 */
/** Race a promise against a timeout so a stuck dynamic import can't
 *  block the boot indefinitely. */
function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([p, new Promise<T>(r => setTimeout(() => r(fallback), ms))])
}

async function resolveInitialBossSkin(): Promise<string | null> {
  return withTimeout(resolveInitialBossSkinInner(), 3000, null)
}

async function resolveInitialBossSkinInner(): Promise<string | null> {
  const tutorialDone = localStorage.getItem('bm_tutorial_done') === '1'
  if (!tutorialDone) {
    try {
      const mod = await import('@/game/stages/tutorial')
      return mod.default.machines.find((m) => m.type === 'boss')?.modelId ?? null
    } catch {
      return null
    }
  }
  // Try the last-played stage first, fall back to stage1.
  const lastId = localStorage.getItem('bm_last_stage')
  if (lastId && lastId !== 'tutorial') {
    try {
      const { loadStageById } = await import('@/game/stages')
      const stage = await loadStageById(lastId)
      return stage.machines.find((m) => m.type === 'boss')?.modelId ?? null
    } catch { /* fall through */
    }
  }
  try {
    const mod = await import('@/game/stages/stage1')
    return mod.default.machines.find((m) => m.type === 'boss')?.modelId ?? null
  } catch {
    return null
  }
}

/**
 * Opportunistic loader for assets that shouldn't block the first paint.
 * Runs after the hot path completes, ideally during browser idle time.
 *
 * Preload order:
 *   1. parchment-ribbon (reward / ribbon overlays)
 *   2. every skin model image the player doesn't already have cached
 *      from the critical path (iterated in catalog order)
 *
 * Uses `requestIdleCallback` where available so we never fight the
 * stage-view's initial render for bandwidth, and limits concurrency to
 * 3 at a time so weak mobile connections don't get saturated.
 */
let backgroundPreloadKicked = false

export function preloadBackgroundAssets(): void {
  if (backgroundPreloadKicked) return
  backgroundPreloadKicked = true

  const schedule = (cb: () => void) => {
    const ric = (window as any).requestIdleCallback as
      | ((fn: () => void, opts?: { timeout: number }) => number)
      | undefined
    if (typeof ric === 'function') {
      ric(cb, { timeout: 2500 })
    } else {
      setTimeout(cb, 1500)
    }
  }

  schedule(async () => {
    const alreadyCachedSkin = new Set<string>()
    for (const id of SPINNER_MODEL_IDS) {
      const src = modelImgPath(id)
      if (resourceCache.images.has(src)) alreadyCachedSkin.add(src)
    }

    const queue: AssetEntry[] = [
      // UI images (parchment ribbon, VFX decals)
      ...BACKGROUND_IMAGES.map(src => ({ src: prependBaseUrl(src), type: 'image' as const })),
      // Remaining skins not already cached from the critical path
      ...SPINNER_MODEL_IDS
        .map(id => modelImgPath(id))
        .filter(src => !alreadyCachedSkin.has(src))
        .map(src => ({ src, type: 'image' as const })),
      // SFX — warm so first collision doesn't cause a decode stutter
      ...BACKGROUND_SFX.map(src => ({ src: prependBaseUrl(src), type: 'audio' as const }))
    ]

    // Small chunks so the main thread / uplink stays available for the
    // active game loop. No progress reporting — this is fire-and-forget.
    try {
      await runInChunks(queue, 4)
    } catch (err) {
      console.warn('[assets] background preload failed:', err)
    }
  })
}

export default () => {
  /**
   * Boot-time preload. Fetches every asset needed to render the stage
   * route's first frame WITHOUT pop-in:
   *   • HUD icons + logo + background tile
   *   • All machine sprites, wall material bricks, VFX sheets
   *   • The currently-selected player star-skin
   *   • The boss skin of the stage that will boot first
   *
   * After this completes the stage renders fully on the first paint.
   * Remaining assets (other skins, audio, parchment, decal VFX) are
   * warmed lazily via `preloadBackgroundAssets`.
   */
  const preloadAssets = async () => {
    if (areAllAssetsLoaded.value) return

    const playerSkinSrc = modelImgPath(getSelectedSkin('star'))
    const bossSkinId = await resolveInitialBossSkin()
    const bossSkinSrc = bossSkinId ? modelImgPath(bossSkinId) : null

    const allAssets: AssetEntry[] = [
      // HUD chrome + bg tile
      ...HUD_IMAGES.map(src => ({ src: prependBaseUrl(src), type: 'image' as const })),
      // Machine sprites — every type the first stage might use
      ...MACHINE_SPRITE_IMAGES.map(src => ({ src: prependBaseUrl(src), type: 'image' as const })),
      // VFX sheets (explosions, launcher muzzle flash)
      ...VFX_IMAGES.map(src => ({ src: prependBaseUrl(src), type: 'image' as const })),
      // Player + boss skins
      { src: playerSkinSrc, type: 'image' as const },
      ...(bossSkinSrc && bossSkinSrc !== playerSkinSrc
        ? [{ src: bossSkinSrc, type: 'image' as const }]
        : [])
    ]

    let loadedCount = 0
    const totalCount = allAssets.length
    const onOne = () => {
      loadedCount++
      loadingProgress.value = Math.floor((loadedCount / totalCount) * 100)
    }

    try {
      await runInChunks(allAssets, 8, onOne)
      areAllAssetsLoaded.value = true
      loadingProgress.value = 100
    } catch (error) {
      console.error('Preload failed:', error)
      loadingProgress.value = 100
    }

    // Kick off the background warmup the moment the hot path is done
    // and the browser goes idle. Fire-and-forget; nothing awaits it.
    preloadBackgroundAssets()
  }

  return {
    loadingProgress,
    areAllAssetsLoaded,
    preloadAssets,
    preloadBackgroundAssets,
    resourceCache
  }
}
