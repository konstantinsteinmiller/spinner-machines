// ─── Save Strategy contract ────────────────────────────────────────────────
//
// The game uses the browser's synchronous `localStorage` as the source of
// truth at runtime — composables read `localStorage.getItem` at module
// evaluation time and write back on change. Each environment (plain web,
// CrazyGames, Glitch, GameDistribution) layers a different *backend* on
// top of that local mirror to persist progress between devices.
//
// Rather than scatter build-flag branches through every call site, each
// backend is implemented as a `SaveStrategy`. `SaveManager` picks one at
// boot, hydrates localStorage from the backend, then forwards every
// subsequent local write to the strategy. Adding a new backend is a matter
// of implementing this one interface.

/**
 * Narrow accessor passed to strategies so they can read / write
 * localStorage without re-entering the SaveManager's mirror wrappers.
 * Strategies MUST use this instead of `window.localStorage` during
 * hydration, otherwise they'd trigger their own mirror recursively.
 */
export interface LocalStorageAccessor {
  get(key: string): string | null

  set(key: string, value: string): void

  remove(key: string): void

  keys(): string[]
}

/**
 * Lifecycle of a strategy's hydrate path.
 *
 *   pending          → hydrate hasn't started / hasn't completed yet
 *   success-with-data→ remote responded with data; merged into local
 *   success-empty    → remote *confirmed* it has no save data (NOT a network error)
 *   failed-retrying  → couldn't reach remote; background retry loop active
 *   failed-final     → retries exhausted; treat local as authoritative
 *
 * The crucial split is `success-empty` vs `failed-*`. Collapsing both
 * into "no data, proceed" lets a transient SDK error during boot wipe a
 * player's progress (the game would default to fresh state and the next
 * autosave would push those defaults to the cloud, overwriting the real
 * save). This type forces strategies to declare which one they observed.
 */
export type HydrateState =
  | 'pending'
  | 'success-with-data'
  | 'success-empty'
  | 'failed-retrying'
  | 'failed-final'

/** Optional progress notification emitted by strategies after hydrate. */
export interface HydrateNotice {
  state: HydrateState
  bonusCoinsAwarded?: number
  reason?: string
}

export type HydrateNoticeListener = (notice: HydrateNotice) => void

export interface SaveStrategy {
  readonly name: string
  readonly hydrateState: HydrateState

  hydrate(local: LocalStorageAccessor): Promise<void>

  retryHydrate?(local: LocalStorageAccessor): Promise<HydrateState>

  onHydrateNotice?(listener: HydrateNoticeListener): () => void

  onLocalSet(key: string, value: string): void

  onLocalRemove(key: string): void

  flush?(): Promise<void>

  dispose?(): void
}

/**
 * Keys whose persistence is internal to a strategy (manifests, version
 * counters, etc.). SaveManager never forwards these to `onLocalSet` /
 * `onLocalRemove`, preventing recursion when a strategy writes its own
 * bookkeeping through the wrapped `localStorage.setItem`.
 *
 * `__ca_keys__` is the legacy manifest key the original useCrazyGames
 * implementation used; preserved here so existing CrazyGames cloud saves
 * round-trip through the new strategy without a forced reset.
 */
export const INTERNAL_KEY_PREFIX = '__save_internal__'

export const isInternalKey = (key: string): boolean =>
  key.startsWith(INTERNAL_KEY_PREFIX) ||
  key.startsWith('__SafeLocalStorage__') || // CrazyGames SDK scratch space
  key.startsWith('SDK_DATA_') ||             // CrazyGames SDK scratch space
  key === '__ca_keys__'                      // legacy CrazyGames manifest
