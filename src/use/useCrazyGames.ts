// ─── CrazyGames SDK integration ────────────────────────────────────────────
//
// Encapsulates everything the rest of the app needs to talk to the
// CrazyGames SDK loaded via a <script> tag in index.html:
//
//   1. `initCrazyGames()` — probes `window.CrazyGames.SDK`, calls SDK.init(),
//      and flips `isSdkActive` to true iff the SDK reports a real CrazyGames
//      environment ('crazygames' for live iframe, 'local' for local dev
//      tooling) AND the build-time `isCrazyWeb` flag is set.
//
//   2. Persistence — owned by `CrazyGamesStrategy` + `SaveManager`. This
//      module exposes `createCrazyGamesSaveStrategy()` so `main.ts` can
//      hand it to `SaveManager` at boot. The strategy talks to `sdk.data`
//      via the lazy getter we close over here.
//
//   3. Gameplay lifecycle — `startGameplay()` / `stopGameplay()` wrap the
//      SDK's `game.gameplayStart()` / `gameplayStop()` hooks.
//
//   4. `showRewardedAd()` / `showMidgameAd()` — Promise-based wrappers
//      around `sdk.ad.requestAd(...)`. Rewarded resolves `true` only when
//      the video played all the way through.
//
// Outside of a CrazyGames build the module is inert: `isSdkActive` stays
// false and `showRewardedAd()` resolves false.

import { ref } from 'vue'
import { isCrazyWeb } from '@/use/useUser'
import { CrazyGamesStrategy } from '@/utils/save/CrazyGamesStrategy'
import type { SaveStrategy } from '@/utils/save/types'

declare global {
  interface Window {
    CrazyGames?: {
      SDK?: any
    }
  }
}

/** Reactive: true when the SDK finished init AND we're in a crazy-web build. */
export const isSdkActive = ref(false)

/**
 * Last known mute state reported by the CrazyGames SDK. `null` until we've
 * either read `sdk.game.muteAudio` at init time or received an event from
 * `sdk.game.addSettingsChangeListener`.
 */
export const isSdkMuted = ref<boolean | null>(null)

/**
 * CrazyGames-side display name for the current player, when available.
 * Falls back to `null` for anonymous sessions or non-crazy builds.
 */
export const crazyPlayerName = ref<string | null>(null)

/**
 * Reactive: true once we've detected that the player's browser is blocking
 * CrazyGames ad requests (uBlock, AdGuard, Brave Shields, etc.). Two
 * sources feed this:
 *   1. `sdk.ad.hasAdblock()` — explicit method exposed by CG SDK v3,
 *      probed at init time. Fast path.
 *   2. `adError({ code: 'adblocker' })` — reported by the SDK at show
 *      time. Catches blockers that activated AFTER init.
 * Wired into `AdProvider.isAdsBlocked` via `CrazyGamesProvider`.
 */
export const isCrazyAdsBlocked = ref(false)

/**
 * Two-letter language code derived from `sdk.user.systemInfo.locale`
 * (e.g. `en` from `en-US`). `null` when the SDK didn't expose one.
 */
export const crazyLocale = ref<string | null>(null)

let sdk: any = null
let initialized = false
let gameplayActive = false

const getSdk = (): any => (typeof window !== 'undefined' ? window.CrazyGames?.SDK ?? null : null)

const isActiveEnv = (s: any): boolean => {
  if (!s) return false
  const env = s.environment
  // 'crazygames' — running inside an iframe on crazygames.com
  // 'local'      — local dev via `crazygames-sdk` CLI tool
  // 'disabled'   — plain localhost, no SDK tooling
  return (env === 'crazygames' || env === 'local') && isCrazyWeb
}

// ─── Init ──────────────────────────────────────────────────────────────────

/**
 * Initialize the SDK. Must be awaited *before* `SaveManager.init()` runs
 * because the CrazyGames save strategy reads `sdk.data` lazily and needs
 * the SDK to be up by the time hydrate fires.
 *
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export const initCrazyGames = async (): Promise<void> => {
  if (initialized) return
  initialized = true

  const candidate = getSdk()
  if (!candidate) {
    return
  }

  try {
    await candidate.init?.()
  } catch (e) {
    console.warn('[crazygames] SDK init failed', e)
    return
  }

  if (!isActiveEnv(candidate)) {
    return
  }

  sdk = candidate
  isSdkActive.value = true

  signalLoadingStart()
  await captureSdkProfile()
  registerMuteListener()
  probeAdBlocker()
}

/**
 * Build the save strategy backed by the CrazyGames `data` module. The
 * strategy pulls the SDK lazily through the closure so it can be
 * constructed before `initCrazyGames()` has resolved — the actual data
 * calls happen inside `hydrate()` which `SaveManager` awaits AFTER SDK
 * init.
 */
export const createCrazyGamesSaveStrategy = (): SaveStrategy =>
  new CrazyGamesStrategy(() => {
    const data = sdk?.data
    if (!data || typeof data.getItem !== 'function') return null
    return data
  })

// ─── Profile / settings capture ───────────────────────────────────────────

const captureSdkProfile = async (): Promise<void> => {
  try {
    let m: unknown = sdk?.game?.settings?.muteAudio
    if (typeof m !== 'boolean') m = sdk?.game?.muteAudio
    if (typeof m !== 'boolean' && typeof sdk?.game?.isMuted === 'function') {
      m = sdk.game.isMuted()
    }
    if (typeof m === 'boolean') isSdkMuted.value = m
  } catch (e) {
    console.warn('[crazygames] read settings.muteAudio failed', e)
  }

  try {
    const u = await sdk?.user?.getUser?.()
    const name = typeof u?.username === 'string' ? u.username.trim() : ''
    if (name) crazyPlayerName.value = name
  } catch (e) {
    console.warn('[crazygames] getUser failed', e)
  }

  const extractLocale = (info: any): string | null => {
    const raw =
      info?.locale ??
      info?.userLocale ??
      info?.language ??
      null
    return typeof raw === 'string' && raw.length >= 2 ? raw : null
  }
  try {
    let raw = extractLocale(sdk?.user?.systemInfo)
    if (!raw && typeof sdk?.user?.getSystemInfo === 'function') {
      raw = extractLocale(await sdk.user.getSystemInfo())
    }
    if (raw) crazyLocale.value = raw.split(/[-_]/)[0]!.toLowerCase()
  } catch (e) {
    console.warn('[crazygames] systemInfo locale read failed', e)
  }
}

// ─── Loading lifecycle ───────────────────────────────────────────────────

let loadingActive = false

export const signalLoadingStart = (): void => {
  if (!sdk || loadingActive) return
  try {
    sdk.game?.sdkGameLoadingStart?.()
    loadingActive = true
  } catch (e) {
    console.warn('[crazygames] sdkGameLoadingStart failed', e)
  }
}

export const signalLoadingStop = (): void => {
  if (!sdk || !loadingActive) return
  try {
    sdk.game?.sdkGameLoadingStop?.()
    loadingActive = false
  } catch (e) {
    console.warn('[crazygames] sdkGameLoadingStop failed', e)
  }
}

// ─── Gameplay lifecycle ───────────────────────────────────────────────────

export const triggerHappytime = (): void => {
  if (!sdk || !isSdkActive.value) return
  try {
    sdk.game?.happytime?.()
  } catch (e) {
    console.warn('[crazygames] happytime failed', e)
  }
}

export const startGameplay = (): void => {
  if (!sdk || gameplayActive) return
  try {
    sdk.game?.gameplayStart?.()
    gameplayActive = true
  } catch (e) {
    console.warn('[crazygames] gameplayStart failed', e)
  }
}

export const stopGameplay = (): void => {
  if (!sdk || !gameplayActive) return
  try {
    sdk.game?.gameplayStop?.()
    gameplayActive = false
  } catch (e) {
    console.warn('[crazygames] gameplayStop failed', e)
  }
}

// ─── Mute sync ────────────────────────────────────────────────────────────

type MuteCallback = (muted: boolean) => void
const muteListeners = new Set<MuteCallback>()

const registerMuteListener = (): void => {
  if (!sdk?.game) return

  const handleMuteChange = (muted: boolean) => {
    if (isSdkMuted.value === muted) return
    isSdkMuted.value = muted
    muteListeners.forEach(cb => {
      try {
        cb(muted)
      } catch (e) {
        console.warn('[crazygames] mute callback threw', e)
      }
    })
  }

  if (typeof sdk.game.addSettingsChangeListener === 'function') {
    try {
      sdk.game.addSettingsChangeListener((newSettings: any) => {
        const m = newSettings?.muteAudio
        if (typeof m === 'boolean') handleMuteChange(m)
      })
    } catch (e) {
      console.warn('[crazygames] addSettingsChangeListener failed', e)
    }
  } else if (typeof sdk.game.addMuteListener === 'function') {
    try {
      sdk.game.addMuteListener((muted: boolean) => handleMuteChange(!!muted))
    } catch (e) {
      console.warn('[crazygames] addMuteListener failed', e)
    }
  }
}

export const onCrazyMuteChange = (cb: MuteCallback): (() => void) => {
  muteListeners.add(cb)
  if (isSdkMuted.value !== null) {
    try {
      cb(isSdkMuted.value)
    } catch (e) {
      console.warn('[crazygames] mute replay callback threw', e)
    }
  }
  return () => muteListeners.delete(cb)
}

export const setCrazyMuted = (muted: boolean): void => {
  isSdkMuted.value = muted
}

export const addCrazyMuteListener = onCrazyMuteChange

// ─── Ad-blocker detection ─────────────────────────────────────────────────

const probeAdBlocker = (): void => {
  const fn = sdk?.ad?.hasAdblock
  if (typeof fn !== 'function') return
  try {
    const result = fn.call(sdk.ad)
    Promise.resolve(result).then(
      (v) => {
        if (typeof v === 'boolean') isCrazyAdsBlocked.value = v
      },
      (e) => console.warn('[crazygames] hasAdblock rejected', e)
    )
  } catch (e) {
    console.warn('[crazygames] hasAdblock threw', e)
  }
}

const isAdBlockerError = (err: any): boolean => {
  const code = String(err?.code ?? '').toLowerCase()
  if (code === 'adblocker' || code === 'adblock') return true
  const msg = String(err?.message ?? err ?? '').toLowerCase()
  return msg.includes('adblock') || msg.includes('blocked by client')
}

// ─── Rewarded video ads ───────────────────────────────────────────────────

export const showRewardedAd = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!sdk || !isSdkActive.value) {
      resolve(false)
      return
    }

    const resumeAfterAd = () => startGameplay()

    try {
      sdk.ad?.requestAd?.('rewarded', {
        adStarted: () => {
          stopGameplay()
        },
        adFinished: () => {
          resumeAfterAd()
          resolve(true)
        },
        adError: (err: unknown) => {
          console.warn('[crazygames] rewarded ad error', err)
          if (isAdBlockerError(err)) isCrazyAdsBlocked.value = true
          resumeAfterAd()
          resolve(false)
        }
      })
    } catch (e) {
      console.warn('[crazygames] requestAd threw', e)
      if (isAdBlockerError(e)) isCrazyAdsBlocked.value = true
      resumeAfterAd()
      resolve(false)
    }
  })
}

// ─── Midgame interstitial ads ─────────────────────────────────────────────

export const showMidgameAd = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!sdk || !isSdkActive.value) {
      resolve()
      return
    }

    const resumeAfterAd = () => startGameplay()

    try {
      sdk.ad?.requestAd?.('midgame', {
        adStarted: () => {
          stopGameplay()
        },
        adFinished: () => {
          resumeAfterAd()
          resolve()
        },
        adError: (err: unknown) => {
          console.warn('[crazygames] midgame ad error', err)
          if (isAdBlockerError(err)) isCrazyAdsBlocked.value = true
          resumeAfterAd()
          resolve()
        }
      })
    } catch (e) {
      console.warn('[crazygames] requestAd midgame threw', e)
      if (isAdBlockerError(e)) isCrazyAdsBlocked.value = true
      resumeAfterAd()
      resolve()
    }
  })
}

// ─── Default export (composable-style convenience) ───────────────────────

const useCrazyGames = () => ({
  isSdkActive,
  isSdkMuted,
  crazyPlayerName,
  crazyLocale,
  isCrazyAdsBlocked,
  initCrazyGames,
  createCrazyGamesSaveStrategy,
  startGameplay,
  stopGameplay,
  signalLoadingStart,
  signalLoadingStop,
  showRewardedAd,
  showMidgameAd,
  addCrazyMuteListener,
  onCrazyMuteChange,
  setCrazyMuted,
  triggerHappytime
})

export default useCrazyGames
