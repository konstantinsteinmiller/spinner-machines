import {
  applyBonusCoins,
  computeMeta,
  decideMerge,
  isPayloadKey,
  META_KEY,
  parseMeta,
  SAVE_KEYS,
  serializeMeta,
  type SaveMeta
} from './SaveMergePolicy'
import type {
  HydrateNotice,
  HydrateNoticeListener,
  HydrateState,
  LocalStorageAccessor,
  SaveStrategy
} from './types'

// ─── CrazyGames data-module strategy ───────────────────────────────────────
//
// Mirrors the game's localStorage into the CrazyGames SDK's `data` module so
// progress follows the player between devices on the CrazyGames portal.
//
// The SDK does not expose a "list keys" API, so we keep our own manifest of
// keys we've written. On boot we read the manifest, pull each key back from
// the SDK into localStorage, then patch-through every subsequent local
// write.
//
// Legacy migration:
//   The original useCrazyGames implementation used the manifest key
//   `__ca_keys__`. The bulletproof rework moved to `__save_internal__crazy_keys`.
//   On hydrate we look up BOTH keys — if only the legacy one is present
//   we honor it so existing CrazyGames player saves continue to work
//   without a forced reset. The next flush writes both manifests so old
//   builds (if any are still in the wild) and new builds stay coherent.
//
// Bulletproofing rules:
//   1. Track `hydrateState` explicitly. Collapsing "SDK returned an
//      error" and "SDK returned no manifest" into the same code path
//      lets a transient network blip during boot wipe the player's
//      cloud save.
//   2. NEVER push to remote while `hydrateState` isn't a `success-*`
//      state. Local writes accumulate in `dirty` and flush on the next
//      successful hydrate.
//   3. On a successful hydrate that finds remote data, run the merge
//      policy: higher progress score wins.
//   4. On hydrate failure, schedule a background retry ladder
//      (5s → 15s → 45s → 2m → 5m → 15m loop).

const KEYS_MANIFEST = '__save_internal__crazy_keys'
const LEGACY_KEYS_MANIFEST = '__ca_keys__'
const FLUSH_DELAY_MS = 500
const HYDRATE_RETRY_DELAYS_MS = [5_000, 15_000, 45_000, 120_000, 300_000]
const HYDRATE_RETRY_LOOP_MS = 900_000  // every 15 min once exhausted

interface SdkDataModule {
  getItem: (key: string) => Promise<string | null> | string | null
  setItem: (key: string, value: string) => Promise<void> | void
  removeItem: (key: string) => Promise<void> | void
}

export type CrazySdkDataGetter = () => SdkDataModule | null

export class CrazyGamesStrategy implements SaveStrategy {
  readonly name = 'crazyGames'

  private _hydrateState: HydrateState = 'pending'
  private local: LocalStorageAccessor | null = null
  private dirty = new Map<string, string | null>()
  private flushTimer: ReturnType<typeof setTimeout> | null = null
  private retryAttempt = 0
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private noticeListeners = new Set<HydrateNoticeListener>()

  constructor(private readonly getData: CrazySdkDataGetter) {
  }

  get hydrateState(): HydrateState {
    return this._hydrateState
  }

  async hydrate(local: LocalStorageAccessor): Promise<void> {
    this.local = local
    await this.runHydrateAttempt(local, 'hydrate')
    if (this._hydrateState === 'failed-retrying') {
      this.scheduleRetry()
    }
  }

  async retryHydrate(local: LocalStorageAccessor): Promise<HydrateState> {
    this.local = local
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    await this.runHydrateAttempt(local, 'retry')
    if (this._hydrateState === 'failed-retrying') {
      this.scheduleRetry()
    }
    return this._hydrateState
  }

  onHydrateNotice(listener: HydrateNoticeListener): () => void {
    this.noticeListeners.add(listener)
    return () => this.noticeListeners.delete(listener)
  }

  onLocalSet(key: string, value: string): void {
    if (!isPayloadKey(key) && key !== META_KEY) return
    this.dirty.set(key, value)
    this.trackKey(key)
    this.scheduleFlush()
  }

  onLocalRemove(key: string): void {
    if (!isPayloadKey(key) && key !== META_KEY) return
    this.dirty.set(key, null)
    this.untrackKey(key)
    this.scheduleFlush()
  }

  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
      this.flushTimer = null
    }
    await this.doFlush()
  }

  dispose(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer)
      this.flushTimer = null
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
      this.retryTimer = null
    }
    this.dirty.clear()
    this.noticeListeners.clear()
  }

  // ─── hydrate path ───────────────────────────────────────────────────────

  private async runHydrateAttempt(local: LocalStorageAccessor, source: 'hydrate' | 'retry'): Promise<void> {
    const data = this.getData()
    if (!data) {
      this.setState('success-empty', source === 'retry' ? 'sdk unavailable' : 'sdk unavailable, local-only')
      return
    }

    let manifestRaw: string | null
    try {
      manifestRaw = (await data.getItem(KEYS_MANIFEST)) ?? null
    } catch (e) {
      console.warn('[save/crazy] hydrate manifest failed', e)
      this.setState('failed-retrying', `manifest fetch failed: ${describeError(e)}`)
      return
    }

    let remoteKeys = parseManifest(manifestRaw)
    let usedLegacyManifest = false

    // Legacy migration — if the new manifest is absent, fall back to the
    // pre-bulletproof `__ca_keys__` manifest. Any keys it lists are still
    // in `sdk.data` and should be hydrated on first boot of the new code.
    if (manifestRaw === null && remoteKeys.length === 0) {
      let legacyRaw: string | null = null
      try {
        legacyRaw = (await data.getItem(LEGACY_KEYS_MANIFEST)) ?? null
      } catch (e) {
        console.warn('[save/crazy] legacy manifest fetch failed', e)
      }
      if (legacyRaw !== null) {
        const legacyKeys = parseManifest(legacyRaw)
        if (legacyKeys.length > 0) {
          remoteKeys = legacyKeys
          usedLegacyManifest = true
        }
      }
    }

    // Genuine "fresh remote": SDK responded successfully but had no manifest.
    if (manifestRaw === null && !usedLegacyManifest && remoteKeys.length === 0) {
      this.setState('success-empty', 'remote has no save')
      this.scheduleFlush()
      return
    }

    const remoteSnapshot = new Map<string, string>()
    let perKeyErrors = 0
    for (const key of remoteKeys) {
      try {
        const value = await data.getItem(key)
        if (value !== null && value !== undefined) {
          remoteSnapshot.set(key, String(value))
        }
      } catch (e) {
        perKeyErrors++
        console.warn(`[save/crazy] hydrate getItem("${key}") failed`, e)
      }
    }

    if (remoteKeys.length > 0 && remoteSnapshot.size === 0 && perKeyErrors > 0) {
      this.setState('failed-retrying', 'all per-key fetches failed')
      return
    }

    const remoteMeta: SaveMeta | null =
      parseMeta(remoteSnapshot.get(META_KEY) ?? null)
      ?? (remoteSnapshot.size > 0
        ? computeMeta({ get: (k) => remoteSnapshot.get(k) ?? null })
        : null)

    const localMeta: SaveMeta | null =
      parseMeta(local.get(META_KEY))
      ?? (anyPayloadKeyPresent(local) ? computeMeta({ get: (k) => local.get(k) }) : null)

    const resolution = decideMerge(localMeta, remoteMeta)
    let bonusCoinsAwarded = 0

    switch (resolution.kind) {
      case 'remote-only':
      case 'remote-wins': {
        for (const [key, value] of remoteSnapshot) {
          if (key === META_KEY) continue
          local.set(key, value)
        }
        if (remoteMeta) local.set(META_KEY, serializeMeta(remoteMeta))

        if (resolution.kind === 'remote-wins' && resolution.bonusCoins > 0) {
          const newCoins = applyBonusCoins({ get: (k) => local.get(k) }, resolution.bonusCoins)
          local.set(SAVE_KEYS.COINS, newCoins)
          bonusCoinsAwarded = resolution.bonusCoins
          this.dirty.set(SAVE_KEYS.COINS, newCoins)
          this.trackKey(SAVE_KEYS.COINS)
          const newMeta = computeMeta({ get: (k) => local.get(k) })
          local.set(META_KEY, serializeMeta(newMeta))
          this.dirty.set(META_KEY, serializeMeta(newMeta))
          this.trackKey(META_KEY)
        }
        break
      }
      case 'local-wins': {
        for (const key of local.keys()) {
          if (!isPayloadKey(key) && key !== META_KEY) continue
          const v = local.get(key)
          if (v != null) {
            this.dirty.set(key, v)
            this.trackKey(key)
          }
        }
        break
      }
      case 'tie-keep-local':
      case 'local-only':
        break
    }

    // If we adopted the legacy manifest, force a flush so the new manifest
    // gets written under `__save_internal__crazy_keys` and future boots
    // skip the legacy-fallback path entirely.
    if (usedLegacyManifest) {
      for (const key of remoteKeys) {
        const v = remoteSnapshot.get(key)
        if (v !== undefined) {
          this.dirty.set(key, v)
          this.trackKey(key)
        }
      }
    }

    this.retryAttempt = 0
    const hasData = resolution.kind !== 'local-only'
      || anyPayloadKeyPresent(local)
    this.setState(hasData ? 'success-with-data' : 'success-empty', resolutionReason(resolution), bonusCoinsAwarded)

    if (this.dirty.size > 0) this.scheduleFlush()
  }

  private scheduleRetry(): void {
    if (this.retryTimer) return
    const delay = this.retryAttempt < HYDRATE_RETRY_DELAYS_MS.length
      ? HYDRATE_RETRY_DELAYS_MS[this.retryAttempt]!
      : HYDRATE_RETRY_LOOP_MS
    this.retryAttempt++
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null
      const local = this.local
      if (!local) return
      void this.retryHydrate(local)
    }, delay)
  }

  private setState(state: HydrateState, reason: string, bonusCoinsAwarded = 0): void {
    this._hydrateState = state
    const notice: HydrateNotice = { state, reason }
    if (bonusCoinsAwarded > 0) notice.bonusCoinsAwarded = bonusCoinsAwarded
    for (const fn of this.noticeListeners) {
      try {
        fn(notice)
      } catch (e) {
        console.warn('[save/crazy] notice listener threw', e)
      }
    }
  }

  // ─── flush path ─────────────────────────────────────────────────────────

  private scheduleFlush(): void {
    if (this.flushTimer !== null) return
    if (!this.canFlush()) return
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null
      void this.doFlush()
    }, FLUSH_DELAY_MS)
  }

  private canFlush(): boolean {
    return this._hydrateState === 'success-with-data'
      || this._hydrateState === 'success-empty'
  }

  private async doFlush(): Promise<void> {
    if (!this.canFlush()) return
    const data = this.getData()
    if (!data) return
    if (this.dirty.size === 0) return

    const local = this.local
    if (local) {
      const meta = computeMeta({ get: (k) => local.get(k) })
      const serialized = serializeMeta(meta)
      local.set(META_KEY, serialized)
      this.dirty.set(META_KEY, serialized)
      this.trackKey(META_KEY)
    }

    const batch = this.dirty
    this.dirty = new Map()
    for (const [key, value] of batch) {
      try {
        if (value !== null) {
          await data.setItem(key, value)
        } else {
          await data.removeItem(key)
        }
      } catch (e) {
        console.warn(`[save/crazy] sdk.data sync ("${key}") failed`, e)
        this.dirty.set(key, value)
      }
    }
    try {
      const manifest = this.readManifest()
      const json = JSON.stringify(manifest)
      await data.setItem(KEYS_MANIFEST, json)
      // Mirror to legacy key so a downgrade to the old code path still
      // sees the manifest. Cheap safety net during the migration window.
      await data.setItem(LEGACY_KEYS_MANIFEST, json)
    } catch (e) {
      console.warn('[save/crazy] manifest sync failed', e)
    }
  }

  // ─── manifest helpers ───────────────────────────────────────────────────

  private readManifest(): string[] {
    if (!this.local) return []
    const raw = this.local.get(KEYS_MANIFEST)
    return parseManifest(raw)
  }

  private writeManifest(keys: string[]): void {
    this.local?.set(KEYS_MANIFEST, JSON.stringify(keys))
  }

  private trackKey(key: string): void {
    const keys = this.readManifest()
    if (!keys.includes(key)) {
      keys.push(key)
      this.writeManifest(keys)
    }
  }

  private untrackKey(key: string): void {
    const keys = this.readManifest()
    const next = keys.filter(k => k !== key)
    if (next.length !== keys.length) this.writeManifest(next)
  }
}

const parseManifest = (raw: unknown): string[] => {
  if (typeof raw !== 'string') return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.filter((k): k is string => typeof k === 'string') : []
  } catch {
    return []
  }
}

const anyPayloadKeyPresent = (local: LocalStorageAccessor): boolean => {
  for (const key of local.keys()) {
    if (isPayloadKey(key) && key !== META_KEY) return true
  }
  return false
}

const describeError = (e: unknown): string => {
  if (e instanceof Error) return e.message
  if (typeof e === 'string') return e
  try {
    return JSON.stringify(e)
  } catch {
    return String(e)
  }
}

const resolutionReason = (r: { kind: string }): string => {
  switch (r.kind) {
    case 'remote-only':
      return 'restored from cloud'
    case 'remote-wins':
      return 'cloud was ahead — restored'
    case 'local-wins':
      return 'local ahead of cloud — pushing'
    case 'tie-keep-local':
      return 'cloud matches local'
    case 'local-only':
      return 'cloud has no save'
    default:
      return r.kind
  }
}
