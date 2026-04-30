import type {
  HydrateNoticeListener,
  HydrateState,
  LocalStorageAccessor,
  SaveStrategy
} from './types'
import { isInternalKey } from './types'
import { SAVE_KEYS } from './SaveMergePolicy'

// ─── SaveManager ───────────────────────────────────────────────────────────
//
// Owns the Strategy, the raw localStorage bindings, and the
// monkey-patching that forwards writes into the strategy. One instance is
// created at boot (`main.ts`) and held as a module-level singleton; game
// code keeps calling plain `localStorage.setItem` unchanged — the manager
// intercepts and forwards.
//
// Boot-time sanity guard:
//   When the initial hydrate does NOT report `success-with-data` AND the
//   local snapshot looks "fresh-defaults" (no coins), we run up to 3
//   retries spaced 1s apart before resolving init(). This catches the
//   common "transient SDK / network blip during boot" failure mode that
//   was costing returning players their entire progress. The 3-second
//   worst-case delay only applies when both conditions hit, which is
//   precisely the at-risk case.

const BOOT_SANITY_RETRIES = 3
const BOOT_SANITY_DELAY_MS = 1_000

export class SaveManager {
  private readonly rawSet: (key: string, value: string) => void
  private readonly rawRemove: (key: string) => void
  private readonly rawClear: () => void
  private readonly storage: Storage

  private patched = false
  private hydrated = false
  private mirroring = false

  constructor(
    private readonly strategy: SaveStrategy,
    storage: Storage = window.localStorage
  ) {
    this.storage = storage
    this.rawSet = storage.setItem.bind(storage)
    this.rawRemove = storage.removeItem.bind(storage)
    this.rawClear = storage.clear.bind(storage)
  }

  get strategyName(): string {
    return this.strategy.name
  }

  get hydrateState(): HydrateState {
    return this.strategy.hydrateState
  }

  isHydrated(): boolean {
    return this.hydrated
  }

  onHydrateNotice(listener: HydrateNoticeListener): () => void {
    return this.strategy.onHydrateNotice?.(listener) ?? (() => {
    })
  }

  async retryHydrate(): Promise<HydrateState> {
    if (!this.strategy.retryHydrate) return this.strategy.hydrateState
    return this.strategy.retryHydrate(this.localAccessor())
  }

  /**
   * Hydrate the local mirror from the backend, then patch
   * `localStorage.setItem` / `removeItem` so all future writes flow
   * through the strategy. Idempotent.
   *
   * MUST be awaited before the Vue app module graph loads, because
   * many composables read `localStorage.getItem(...)` at module
   * evaluation time.
   */
  async init(): Promise<void> {
    if (this.hydrated) return
    this.mirroring = true
    const local = this.localAccessor()
    try {
      await this.strategy.hydrate(local)
    } catch (e) {
      console.warn(`[save] hydrate failed (${this.strategy.name})`, e)
    }

    if (this.strategy.retryHydrate && shouldRunSanityGuard(this.strategy.hydrateState, local)) {
      for (let i = 0; i < BOOT_SANITY_RETRIES; i++) {
        await sleep(BOOT_SANITY_DELAY_MS)
        const newState = await this.strategy.retryHydrate(local).catch((e): HydrateState => {
          console.warn('[save] sanity-guard retry threw', e)
          return this.strategy.hydrateState
        })
        if (newState === 'success-with-data' || newState === 'success-empty') break
      }
    }

    this.mirroring = false
    this.patchLocalStorage()
    this.hydrated = true
  }

  async flush(): Promise<void> {
    await this.strategy.flush?.()
  }

  dispose(): void {
    this.strategy.dispose?.()
  }

  // ─── internals ──────────────────────────────────────────────────────────

  private localAccessor(): LocalStorageAccessor {
    return {
      get: (key) => this.storage.getItem(key),
      set: (key, value) => this.rawSet(key, value),
      remove: (key) => this.rawRemove(key),
      keys: () => {
        const out: string[] = []
        for (let i = 0; i < this.storage.length; i++) {
          const k = this.storage.key(i)
          if (k !== null) out.push(k)
        }
        return out
      }
    }
  }

  private patchLocalStorage(): void {
    if (this.patched) return
    this.patched = true

    this.storage.setItem = (key: string, value: string) => {
      this.rawSet(key, value)
      if (this.mirroring || isInternalKey(key)) return
      try {
        this.strategy.onLocalSet(key, value)
      } catch (e) {
        console.warn(`[save] onLocalSet("${key}") threw`, e)
      }
    }

    this.storage.removeItem = (key: string) => {
      this.rawRemove(key)
      if (this.mirroring || isInternalKey(key)) return
      try {
        this.strategy.onLocalRemove(key)
      } catch (e) {
        console.warn(`[save] onLocalRemove("${key}") threw`, e)
      }
    }

    this.storage.clear = () => {
      const keys: string[] = []
      for (let i = 0; i < this.storage.length; i++) {
        const k = this.storage.key(i)
        if (k !== null) keys.push(k)
      }
      this.rawClear()
      for (const k of keys) {
        if (isInternalKey(k)) continue
        try {
          this.strategy.onLocalRemove(k)
        } catch (e) {
          console.warn(`[save] onLocalRemove (clear) threw`, e)
        }
      }
    }
  }
}

// ─── helpers ───────────────────────────────────────────────────────────────

const shouldRunSanityGuard = (state: HydrateState, local: LocalStorageAccessor): boolean => {
  if (state === 'success-with-data') return false
  if (state === 'success-empty') return false
  return localLooksFresh(local)
}

/** A local snapshot is "fresh-defaults" if a brand-new player on a clean
 *  device would produce these exact values. If hydrate failed AND local
 *  matches this shape, we have no idea whether the player is genuinely
 *  new or had a real save we couldn't reach — retry to find out. */
const localLooksFresh = (local: LocalStorageAccessor): boolean => {
  const coins = parseInt(local.get(SAVE_KEYS.COINS) ?? '0', 10) || 0
  if (coins > 0) return false
  // Conservative additional signal: if any per-stage star data exists,
  // the player is definitely not fresh — skip the retry loop.
  if (local.get('bm_stage_stars')) return false
  return true
}

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
