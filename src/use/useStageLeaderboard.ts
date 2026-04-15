/**
 * Stage leaderboard — per-user, per-stage highscores stored in a single
 * jsonbin.io bin.
 *
 * Design goals (prototype, ~30 concurrent players, 10k req/day limit):
 *
 *  - Every player fetches the shared bin **once per day** on first
 *    interaction. Their local copy is then overlaid with their own newest
 *    highscores until the next fetch window.
 *  - New highscores never trigger a network request on their own. They
 *    mutate the local cache only.
 *  - When the tab goes hidden / unloads, if the local cache is dirty we
 *    flush to the bin using `fetch({ keepalive: true })` so the PUT
 *    survives navigation.
 *  - Before flushing, we re-read the bin, merge OUR player entry into the
 *    fresh server snapshot, and PUT that. Other players' rows are never
 *    overwritten — last-writer-wins only affects the writer's own row.
 *  - The schema is a flat array keyed by player id so missing / new
 *    stages degrade gracefully: a stage the player has never cleared is
 *    simply absent from their `scores` map.
 *
 * Expected daily request budget per player (ignoring edge cases):
 *   1 GET (daily refresh)  + 1 GET + 1 PUT (on close if dirty)
 *   ≈ 3 requests / player / day → ~90/day for 30 players.
 */

import { ref, computed } from 'vue'

const BASE = 'https://api.jsonbin.io/v3'
const BIN_ID_ENV = import.meta.env.VITE_JSONBIN_BIN_ID as string | undefined
const MASTER_KEY = import.meta.env.VITE_JSONBIN_KEY as string | undefined
const BIN_ID_OVERRIDE_KEY = 'bm_stage_leaderboard_bin_id'

function getBinId(): string | undefined {
  const override = localStorage.getItem(BIN_ID_OVERRIDE_KEY) || ''
  return override || BIN_ID_ENV
}

export interface LeaderboardEntry {
  id: string
  name: string
  scores: Record<string, number>
  updatedAt: number
}

export interface LeaderboardData {
  players: LeaderboardEntry[]
}

const LOCAL_KEY = 'bm_stage_leaderboard'
const LOCAL_FETCHED_KEY = 'bm_stage_leaderboard_fetched_at'
const LOCAL_DIRTY_KEY = 'bm_stage_leaderboard_dirty'
const USER_ID_KEY = 'bm_player_id'
const USER_NAME_KEY = 'bm_player_name'

const FETCH_COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24h

// ─── Identity ──────────────────────────────────────────────────────────

function getOrCreatePlayerId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

function getOrCreatePlayerName(): string {
  let n = localStorage.getItem(USER_NAME_KEY)
  if (!n) {
    n = 'Player-' + Math.random().toString(36).slice(2, 6).toUpperCase()
    localStorage.setItem(USER_NAME_KEY, n)
  }
  return n
}

const playerId = getOrCreatePlayerId()
const playerName = ref<string>(getOrCreatePlayerName())

// ─── Local cache ───────────────────────────────────────────────────────

function loadLocal(): LeaderboardData {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return { players: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.players)) return { players: [] }
    return parsed as LeaderboardData
  } catch {
    return { players: [] }
  }
}

function saveLocal(data: LeaderboardData) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
}

const leaderboard = ref<LeaderboardData>(loadLocal())

// ─── Server I/O ────────────────────────────────────────────────────────

// Session-scoped kill switches. Once either trips, we stop hitting the
// network for the rest of the tab so the console stays clean and we
// don't spam jsonbin with doomed requests. A page reload resets them.
let serverDisabled = false
let createBinAttempted = false

function headers(withKey: boolean): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (withKey && MASTER_KEY) h['X-Master-Key'] = MASTER_KEY
  return h
}

async function fetchFromServer(): Promise<LeaderboardData | null> {
  if (serverDisabled) return null
  // Without a master key we can neither read private bins, auto-create
  // a fresh one, nor write scores back. Skip the network round-trip.
  if (!MASTER_KEY) {
    serverDisabled = true
    return null
  }
  let binId = getBinId()
  // No bin configured at all — try to provision one on the fly.
  if (!binId) {
    const created = await createBin()
    if (!created) {
      serverDisabled = true
      return null
    }
    binId = created
    console.info(
      '[leaderboard] Created new jsonbin record: ' + created +
      '. Cache persisted in localStorage.'
    )
    return { players: [] }
  }
  try {
    const res = await fetch(`${BASE}/b/${binId}/latest`, {
      method: 'GET',
      headers: headers(true)
    })
    if (res.status === 404) {
      // Stale id — drop the localStorage override so we don't keep
      // hammering a non-existent bin on every refresh. We can't clear
      // the env value, so we also trip the session kill switch below
      // if bin creation fails.
      if (localStorage.getItem(BIN_ID_OVERRIDE_KEY)) {
        localStorage.removeItem(BIN_ID_OVERRIDE_KEY)
      }
      const created = await createBin()
      if (created) {
        console.info(
          '[leaderboard] Created new jsonbin record. ' +
          'Update VITE_JSONBIN_BIN_ID in your env to: ' + created
        )
        return { players: [] }
      }
      // No bin and no way to make one — stop trying for this session.
      serverDisabled = true
      return null
    }
    if (res.status === 401 || res.status === 403) {
      // Unauthorized — the key is wrong / missing permissions. Give up
      // for the session instead of hammering the endpoint.
      serverDisabled = true
      return null
    }
    if (!res.ok) return null
    const j = await res.json()
    const record = j?.record
    if (!record || !Array.isArray(record.players)) return { players: [] }
    return record as LeaderboardData
  } catch {
    return null
  }
}

async function createBin(): Promise<string | null> {
  if (!MASTER_KEY) return null
  if (createBinAttempted) return null
  createBinAttempted = true
  try {
    const res = await fetch(`${BASE}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
        'X-Bin-Name': 'spinner-machines-leaderboard',
        'X-Bin-Private': 'false'
      },
      body: JSON.stringify({ players: [] } as LeaderboardData)
    })
    if (!res.ok) return null
    const j = await res.json()
    const newId: string | undefined = j?.metadata?.id
    if (!newId) return null
    localStorage.setItem(BIN_ID_OVERRIDE_KEY, newId)
    return newId
  } catch {
    return null
  }
}

async function writeToServer(data: LeaderboardData, opts: { keepalive?: boolean } = {}): Promise<boolean> {
  if (serverDisabled) return false
  const binId = getBinId()
  if (!binId || !MASTER_KEY) return false
  try {
    const res = await fetch(`${BASE}/b/${binId}`, {
      method: 'PUT',
      headers: headers(true),
      body: JSON.stringify(data),
      keepalive: opts.keepalive === true
    })
    if (res.status === 404 || res.status === 401 || res.status === 403) {
      serverDisabled = true
    }
    return res.ok
  } catch {
    return false
  }
}

// ─── Merge & dirty tracking ────────────────────────────────────────────

function mergeMine(into: LeaderboardData, mine: LeaderboardEntry): LeaderboardData {
  const out: LeaderboardData = { players: into.players.slice() }
  const existingIdx = out.players.findIndex((p) => p.id === mine.id)
  if (existingIdx === -1) {
    out.players.push(mine)
    return out
  }
  // Keep my per-stage max, never lower a stale server number under mine.
  const existing = out.players[existingIdx]!
  const mergedScores: Record<string, number> = { ...existing.scores }
  for (const [k, v] of Object.entries(mine.scores)) {
    mergedScores[k] = Math.max(v, mergedScores[k] ?? 0)
  }
  out.players[existingIdx] = {
    id: mine.id,
    name: mine.name,
    scores: mergedScores,
    updatedAt: Math.max(existing.updatedAt, mine.updatedAt)
  }
  return out
}

function markDirty() {
  localStorage.setItem(LOCAL_DIRTY_KEY, '1')
}

function isDirty(): boolean {
  return localStorage.getItem(LOCAL_DIRTY_KEY) === '1'
}

function clearDirty() {
  localStorage.removeItem(LOCAL_DIRTY_KEY)
}

// ─── Public API ────────────────────────────────────────────────────────

function myEntry(): LeaderboardEntry {
  const fromLocal = leaderboard.value.players.find((p) => p.id === playerId)
  if (fromLocal) return fromLocal
  const fresh: LeaderboardEntry = {
    id: playerId,
    name: playerName.value,
    scores: {},
    updatedAt: Date.now()
  }
  leaderboard.value.players.push(fresh)
  saveLocal(leaderboard.value)
  return fresh
}

/** Called whenever the player finishes a stage — updates the local cache
 *  and fires a best-effort flush to the remote bin so new highscores land
 *  on the server right away instead of waiting for tab close. */
function recordHighscore(stageId: string, score: number): boolean {
  const me = myEntry()
  const prev = me.scores[stageId] ?? 0
  if (score <= prev) return false
  me.scores[stageId] = score
  me.name = playerName.value
  me.updatedAt = Date.now()
  saveLocal(leaderboard.value)
  markDirty()
  void flushIfDirty()
  return true
}

/** Daily fetch — cheap no-op if we're inside the cooldown window. */
async function fetchDailyIfDue(): Promise<void> {
  const lastStr = localStorage.getItem(LOCAL_FETCHED_KEY)
  const last = lastStr ? parseInt(lastStr, 10) : 0
  if (Date.now() - last < FETCH_COOLDOWN_MS) return
  const server = await fetchFromServer()
  if (!server) return
  // Preserve our own pending (unflushed) highscores on top of server data.
  const mine = leaderboard.value.players.find((p) => p.id === playerId)
  const merged = mine ? mergeMine(server, mine) : server
  leaderboard.value = merged
  saveLocal(merged)
  localStorage.setItem(LOCAL_FETCHED_KEY, String(Date.now()))
}

/** Flush local highscores to jsonbin. Safe to call in visibilitychange/pagehide. */
async function flushIfDirty(opts: { keepalive?: boolean } = {}): Promise<void> {
  if (!isDirty()) return
  if (!getBinId() || !MASTER_KEY) return
  const mine = leaderboard.value.players.find((p) => p.id === playerId)
  if (!mine) return
  // Re-read the server so concurrent players' rows aren't clobbered.
  const server = await fetchFromServer()
  const merged = mergeMine(server ?? { players: [] }, mine)
  const ok = await writeToServer(merged, { keepalive: opts.keepalive })
  if (ok) {
    leaderboard.value = merged
    saveLocal(merged)
    clearDirty()
  }
}

let unloadInstalled = false

function installUnloadFlush() {
  if (unloadInstalled || typeof window === 'undefined') return
  unloadInstalled = true
  const onHidden = () => {
    if (document.visibilityState === 'hidden') {
      void flushIfDirty({ keepalive: true })
    }
  }
  window.addEventListener('visibilitychange', onHidden)
  window.addEventListener('pagehide', () => void flushIfDirty({ keepalive: true }))
}

// ─── Ranking helpers ───────────────────────────────────────────────────

export interface RankedRow {
  rank: number
  id: string
  name: string
  score: number
  isMe: boolean
}

/** Player's rank for a single stage, or null if they have no score yet. */
function myRankForStage(stageId: string): { rank: number; total: number; score: number } | null {
  const ranked = leaderboard.value.players
    .map((p) => ({ id: p.id, score: p.scores[stageId] ?? 0 }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
  const idx = ranked.findIndex((r) => r.id === playerId)
  if (idx === -1) return null
  return { rank: idx + 1, total: ranked.length, score: ranked[idx]!.score }
}

/** Top 5 for a given stage, plus the player's row appended if they're below 5. */
function topForStage(stageId: string): { top: RankedRow[]; mine: RankedRow | null } {
  const ranked = leaderboard.value.players
    .map((p) => ({
      id: p.id,
      name: p.name,
      score: p.scores[stageId] ?? 0
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ rank: i + 1, ...r, isMe: r.id === playerId }))

  const top = ranked.slice(0, 5)
  const myRow = ranked.find((r) => r.isMe) ?? null
  const mine = myRow && myRow.rank > 5 ? myRow : null
  return { top, mine }
}

const useStageLeaderboard = () => ({
  playerId,
  playerName,
  leaderboard: computed(() => leaderboard.value),
  recordHighscore,
  fetchDailyIfDue,
  flushIfDirty,
  installUnloadFlush,
  topForStage,
  myRankForStage
})

export default useStageLeaderboard
