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

// ─── Phase-5 per-route critical lists ────────────────────────────────
// Only the stage-route images the player sees at first paint. Arena
// icons, meteor sprites, big-spark, dark-smoke, earth-rip-decal,
// parchment-ribbon and the full 13-sfx arena bank used to block boot.
// Everything else is loaded lazily as the player goes deeper, and the
// "remaining" bucket (all other skins + parchment) is fetched in the
// background once the hot path is done and the network is idle.
const STAGE_CRITICAL_IMAGES = [
  'images/logo/logo_256x256.webp',
  'images/icons/team_128x128.webp',
  'images/icons/gears_128x128.webp',
  'images/icons/trophy_128x128.webp'
]

// Assets that are NOT needed for the first frame but should be warmed
// opportunistically so the skin shop / battle pass / reward ribbon feel
// instant when they first render.
const BACKGROUND_IMAGES = [
  'images/bg/parchment-ribbon_553x188.webp'
]

type AssetEntry = { src: string; type: 'image' | 'audio' }

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
    if (type === 'image') {
      const img = new Image()
      img.onload = () => {
        resourceCache.images.set(src, img)
        onLoaded?.()
        resolve(img)
      }
      img.onerror = () => {
        console.error('Preload fail:', src)
        onLoaded?.()
        resolve(null)
      }
      img.src = src
    } else {
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        resourceCache.audio.set(src, audio)
        onLoaded?.()
        resolve(audio)
      }
      audio.onerror = () => {
        onLoaded?.()
        resolve(null)
      }
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
 *   • fresh player (no `bm_tutorial_done`) → peek at the tutorial stage
 *   • otherwise → peek at stage1
 *
 * Returns the skin id or `null` if the stage has no boss machine.
 */
async function resolveInitialBossSkin(): Promise<string | null> {
  const tutorialDone = localStorage.getItem('bm_tutorial_done') === '1'
  try {
    const mod = tutorialDone
      ? await import('@/game/stages/stage1')
      : await import('@/game/stages/tutorial')
    const boss = mod.default.machines.find((m) => m.type === 'boss')
    return boss?.modelId ?? null
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
      ...BACKGROUND_IMAGES.map(src => ({ src: prependBaseUrl(src), type: 'image' as const })),
      ...SPINNER_MODEL_IDS
        .map(id => modelImgPath(id))
        .filter(src => !alreadyCachedSkin.has(src))
        .map(src => ({ src, type: 'image' as const }))
    ]

    // Small chunks so the main thread / uplink stays available for the
    // active game loop. No progress reporting — this is fire-and-forget.
    try {
      await runInChunks(queue, 3)
    } catch (err) {
      console.warn('[assets] background preload failed:', err)
    }
  })
}

export default () => {
  /**
   * Boot-time preload. Fetches only the minimum assets needed to render
   * the stage route's first frame:
   *   • 4 HUD icons + logo
   *   • The currently-selected player star-skin (resolved from the
   *     player's actual selection — NOT hardcoded to 'blades').
   *   • The boss skin of the stage that will boot first (tutorial boss
   *     on a fresh install, stage1 boss afterwards).
   *
   * Everything else (machine art, sfx, vfx, battle music, parchment,
   * the rest of the skin catalog) is loaded lazily when the feature
   * that needs it first renders, with `preloadBackgroundAssets` running
   * after the hot path to opportunistically warm skin shop + parchment.
   */
  const preloadAssets = async () => {
    if (areAllAssetsLoaded.value) return

    // `getSelectedSkin('star')` reads the player's persisted selection
    // and falls back to the first skin in the star pool if nothing is
    // stored yet. For a fresh player that first pool entry is 'blades'.
    const playerSkinSrc = modelImgPath(getSelectedSkin('star'))

    const bossSkinId = await resolveInitialBossSkin()
    const bossSkinSrc = bossSkinId ? modelImgPath(bossSkinId) : null

    const allAssets: AssetEntry[] = [
      ...STAGE_CRITICAL_IMAGES.map(src => ({ src: prependBaseUrl(src), type: 'image' as const })),
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
