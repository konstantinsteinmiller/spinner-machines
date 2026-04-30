// ─── Save merge policy ────────────────────────────────────────────────────
//
// Decides what to do when a hydrate brings back remote data that disagrees
// with the local snapshot. Pure module — no Vue, no I/O, no side effects.
//
// Each persisted save carries a meta blob (`__save_meta__`) alongside the
// player's actual keys. The blob lets the next hydrate score local vs.
// remote and pick a winner deterministically without prompting.
//
// Spinner Machines score formula:
//   coins × 1
//
// The user nuked stage / owned-items / upgrades from the formula because
// none of those concepts exist in this game (or aren't tracked under a
// stable key). Coins are the single durable progress signal — players
// that have spent serious time accumulate them, fresh installs sit at 0.
// On a coin tie the merge falls back to newer-savedAt wins, which covers
// the "two devices both at 0 coins" edge case without surprises.
//
// Conflict policy:
//   - higher score wins
//   - tie on score → newer savedAt wins
//   - same time too → keep local
//   - if remote wins and local had ANY progress (score > 0), the player
//     gets bonus coins = winner.maxStage × 0 (disabled — no stage signal)

import { isInternalKey } from './types'

/** Where the meta blob is stored. NOT prefixed with `__save_internal__` —
 *  this key needs to round-trip through the strategy's mirror just like
 *  player data. */
export const META_KEY = '__save_meta__'

/** Bumped when the meta blob's shape changes in a non-additive way. */
export const SCHEMA_VERSION = 1

// ─── Game-specific keys the score formula reads ───────────────────────────
//
// Re-declared here as constants so this module stays pure (no Vue imports).
// Renames in the composables that own these keys MUST be mirrored here,
// otherwise scoring silently degrades to "everyone is a brand-new player".

const COINS_KEY = 'bm_coins'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SaveMeta {
  /** ISO timestamp of when this save was generated. */
  savedAt: string
  /** Output of the score formula above. */
  progressScore: number
  schemaVersion: number
  /** Highest stage the save represents — kept on the meta blob for future
   *  use; currently always 0 because Spinner Machines has no single
   *  "stage" key (per-stage best stars are tracked under `bm_stage_stars`
   *  but that's a JSON object, not a monotonic int). */
  maxStage: number
}

export interface SnapshotReader {
  get(key: string): string | null
}

export type MergeResolution =
  | { kind: 'remote-wins'; bonusCoins: number }
  | { kind: 'local-wins' }
  | { kind: 'remote-only' }
  | { kind: 'local-only' }
  | { kind: 'tie-keep-local' }

// ─── Helpers ──────────────────────────────────────────────────────────────

const safeInt = (v: string | null, fallback: number): number => {
  if (v == null) return fallback
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : fallback
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Compute a fresh meta blob from the current localStorage snapshot.
 * Pure — no side effects.
 */
export const computeMeta = (
  read: SnapshotReader,
  savedAt: string = new Date().toISOString()
): SaveMeta => {
  const coins = Math.max(0, safeInt(read.get(COINS_KEY), 0))
  const progressScore = coins
  return { savedAt, progressScore, schemaVersion: SCHEMA_VERSION, maxStage: 0 }
}

export const parseMeta = (raw: string | null | undefined): SaveMeta | null => {
  if (!raw) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof parsed !== 'object' || parsed === null) return null
  const m = parsed as Partial<SaveMeta>
  if (
    typeof m.savedAt !== 'string' ||
    typeof m.progressScore !== 'number' || !Number.isFinite(m.progressScore) ||
    typeof m.schemaVersion !== 'number' || !Number.isFinite(m.schemaVersion) ||
    typeof m.maxStage !== 'number' || !Number.isFinite(m.maxStage)
  ) return null
  return { savedAt: m.savedAt, progressScore: m.progressScore, schemaVersion: m.schemaVersion, maxStage: m.maxStage }
}

export const serializeMeta = (meta: SaveMeta): string => JSON.stringify(meta)

/**
 * Compare local and remote metas, return the resolution.
 *
 * Rules (in order):
 *   1. No remote → 'local-only'
 *   2. No local  → 'remote-only'
 *   3. remote.score > local.score → 'remote-wins'
 *   4. local.score > remote.score → 'local-wins'
 *   5. Equal scores → newer savedAt wins
 *   6. Equal everything → 'tie-keep-local'
 */
export const decideMerge = (
  localMeta: SaveMeta | null,
  remoteMeta: SaveMeta | null
): MergeResolution => {
  if (!remoteMeta) return { kind: 'local-only' }
  if (!localMeta) return { kind: 'remote-only' }

  if (remoteMeta.progressScore > localMeta.progressScore) {
    // No bonus path — Spinner Machines doesn't have a stage signal to scale
    // a soft-loss bonus against. If product wants one later, multiply
    // remoteMeta.progressScore (or another field) by a small factor here.
    return { kind: 'remote-wins', bonusCoins: 0 }
  }
  if (localMeta.progressScore > remoteMeta.progressScore) {
    return { kind: 'local-wins' }
  }

  const lt = Date.parse(localMeta.savedAt)
  const rt = Date.parse(remoteMeta.savedAt)
  if (Number.isFinite(rt) && Number.isFinite(lt) && rt > lt) {
    return { kind: 'remote-wins', bonusCoins: 0 }
  }
  return { kind: 'tie-keep-local' }
}

/**
 * Add the bonus to the local coin total. Returns the new value as a
 * string ready to be written back to COINS_KEY. Caller does the write.
 */
export const applyBonusCoins = (read: SnapshotReader, bonus: number): string => {
  const current = safeInt(read.get(COINS_KEY), 0)
  return String(current + Math.max(0, bonus))
}

/**
 * True for keys that participate in the persisted payload. Mirrors what
 * GlitchStrategy.collectPayload already filters; centralised here so the
 * CrazyGames strategy uses the same rule.
 */
export const isPayloadKey = (key: string): boolean => !isInternalKey(key)

export const SAVE_KEYS = {
  COINS: COINS_KEY
} as const
