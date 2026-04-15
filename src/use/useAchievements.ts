import { ref, computed, watch } from 'vue'
import { STAGES } from '@/game/stages'
import { SKINS_PER_TOP, isSkinOwned, ownedSkins } from '@/use/useModels'
import type { TopPartId } from '@/types/spinner'

// ─── Types ────────────────────────────────────────────────────────────

export interface AchievementState {
  totalScore: number
  bestStars: Record<string, number>
  killedBosses: string[]
  minLaunchesPerStage: Record<string, number>
  bestScorePerStage: Record<string, number>
  summedBestScore: number
  stagesWithBoss: string[]
  maxLaunchesEver: number
  triggeredPlates: string[]
  topRankStages: string[]
}

export interface AchievementDef {
  id: string
  title: string
  description: string
  /** Short label drawn inside the crest shield. */
  glyph: string
  /** Accent colors driving the crest gradient / border. */
  color: { from: string; to: string; accent: string }
  check: (s: AchievementState) => boolean
}

// ─── Persistent state ─────────────────────────────────────────────────

const STORAGE_KEY = 'bm_achievements_v1'
const UNLOCKED_KEY = 'bm_achievements_unlocked_v1'

interface Persisted {
  totalScore: number
  killedBosses: string[]
  minLaunchesPerStage: Record<string, number>
  bestScorePerStage: Record<string, number>
  maxLaunchesEver: number
  triggeredPlates: string[]
  topRankStages: string[]
}

function loadPersisted(): Persisted {
  const empty: Persisted = {
    totalScore: 0,
    killedBosses: [],
    minLaunchesPerStage: {},
    bestScorePerStage: {},
    maxLaunchesEver: 0,
    triggeredPlates: [],
    topRankStages: []
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw)
    return {
      totalScore: Number(parsed.totalScore) || 0,
      killedBosses: Array.isArray(parsed.killedBosses) ? parsed.killedBosses : [],
      minLaunchesPerStage: parsed.minLaunchesPerStage && typeof parsed.minLaunchesPerStage === 'object'
        ? parsed.minLaunchesPerStage
        : {},
      bestScorePerStage: parsed.bestScorePerStage && typeof parsed.bestScorePerStage === 'object'
        ? parsed.bestScorePerStage
        : {},
      maxLaunchesEver: Number(parsed.maxLaunchesEver) || 0,
      triggeredPlates: Array.isArray(parsed.triggeredPlates) ? parsed.triggeredPlates : [],
      topRankStages: Array.isArray(parsed.topRankStages) ? parsed.topRankStages : []
    }
  } catch {
    return empty
  }
}

function loadUnlocked(): Record<string, number> {
  try {
    const raw = localStorage.getItem(UNLOCKED_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const persisted = ref<Persisted>(loadPersisted())
const unlocked = ref<Record<string, number>>(loadUnlocked())

const UNSEEN_KEY = 'bm_achievements_unseen_v1'

function loadUnseen(): string[] {
  try {
    const raw = localStorage.getItem(UNSEEN_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const unseen = ref<string[]>(loadUnseen())

function saveUnseen() {
  localStorage.setItem(UNSEEN_KEY, JSON.stringify(unseen.value))
}

function savePersisted() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted.value))
}

function saveUnlocked() {
  localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked.value))
}

// ─── Helpers ──────────────────────────────────────────────────────────

function stageIdsInRange(from: number, to: number): string[] {
  return STAGES.map((s) => s.id).filter((id) => {
    const m = id.match(/(\d+)/)
    if (!m) return false
    const n = parseInt(m[1]!, 10)
    return n >= from && n <= to
  })
}

function allThreeStars(state: AchievementState, ids: string[]): boolean {
  if (ids.length === 0) return false
  return ids.every((id) => (state.bestStars[id] ?? 0) >= 3)
}

function stagesWithBoss(): string[] {
  return STAGES.filter((s) => s.machines.some((m) => m.type === 'boss')).map((s) => s.id)
}

/** True when every (topPartId, modelId) pair in the catalog is owned. */
function allSkinsOwned(): boolean {
  for (const top of Object.keys(SKINS_PER_TOP) as TopPartId[]) {
    for (const m of SKINS_PER_TOP[top]) {
      if (!isSkinOwned(top, m)) return false
    }
  }
  return true
}

/** Every pressure plate across every stage, encoded as "stageId:machineId". */
function allPlateKeys(): string[] {
  const out: string[] = []
  for (const s of STAGES) {
    for (const machine of s.machines) {
      if (machine.type === 'pressurePlate') out.push(`${s.id}:${machine.id}`)
    }
  }
  return out
}

// ─── Achievement definitions ──────────────────────────────────────────

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'score_10k',
    title: 'Point Hoarder',
    description: 'Accumulate 10,000 total points across all levels.',
    glyph: '10K',
    color: { from: '#fde047', to: '#f59e0b', accent: '#b45309' },
    check: (s) => s.totalScore >= 10_000
  },
  {
    id: 'score_100k_best',
    title: 'Score Legend',
    description: 'Reach 100,000 points summed from your best score on every stage.',
    glyph: '100K',
    color: { from: '#fef9c3', to: '#d97706', accent: '#451a03' },
    check: (s) => s.summedBestScore >= 100_000
  },
  {
    id: 'three_stars_1_5',
    title: 'First Five Flawless',
    description: 'Finish levels 1–5 with 3 stars each.',
    glyph: 'I–V',
    color: { from: '#86efac', to: '#16a34a', accent: '#064e20' },
    check: (s) => allThreeStars(s, stageIdsInRange(1, 5))
  },
  {
    id: 'three_stars_6_10',
    title: 'Second Act Master',
    description: 'Finish levels 6–10 with 3 stars each.',
    glyph: 'VI–X',
    color: { from: '#60a5fa', to: '#1d4ed8', accent: '#0b1d5c' },
    check: (s) => allThreeStars(s, stageIdsInRange(6, 10))
  },
  {
    id: 'three_stars_11_15',
    title: 'Midgame Marvel',
    description: 'Finish levels 11–15 with 3 stars each.',
    glyph: 'XI–XV',
    color: { from: '#f472b6', to: '#be185d', accent: '#4a0a2d' },
    check: (s) => allThreeStars(s, stageIdsInRange(11, 15))
  },
  {
    id: 'three_stars_16_20',
    title: 'Endgame Emperor',
    description: 'Finish levels 16–20 with 3 stars each.',
    glyph: 'XVI–XX',
    color: { from: '#c084fc', to: '#6b21a8', accent: '#2e0a4a' },
    check: (s) => allThreeStars(s, stageIdsInRange(16, 20))
  },
  {
    id: 'three_launches',
    title: 'One Good Shot',
    description: 'Finish any level in 3 launches or fewer.',
    glyph: '≤3',
    color: { from: '#fef08a', to: '#f97316', accent: '#7c2d12' },
    check: (s) => Object.values(s.minLaunchesPerStage).some((n) => n <= 3)
  },
  {
    id: 'boss_two_launches',
    title: 'Bossbuster',
    description: 'Kill a boss in 2 launches or fewer.',
    glyph: 'KO',
    color: { from: '#f87171', to: '#991b1b', accent: '#450a0a' },
    check: (s) => {
      // A boss was killed in ≤2 launches if any stage with a boss has
      // minLaunches ≤ 2 AND that boss id is in killedBosses.
      return s.killedBosses.some((id) => (s.minLaunchesPerStage[id] ?? Infinity) <= 2)
    }
  },
  {
    id: 'all_stages_done',
    title: 'Completionist',
    description: 'Finish every available stage at least once.',
    glyph: '★★★',
    color: { from: '#67e8f9', to: '#0e7490', accent: '#083344' },
    check: (s) => s.stagesWithBoss.length >= 0 // placeholder, real check below
  },
  {
    id: 'tough_day',
    title: 'Though Day',
    description: 'Finish any level with 30 or more launches.',
    glyph: '30+',
    color: { from: '#fcd34d', to: '#b45309', accent: '#451a03' },
    check: (s) => s.maxLaunchesEver >= 30
  },
  {
    id: 'high_pressure',
    title: 'High Pressure',
    description: 'Activated every pressure plate in the game.',
    glyph: 'PSI',
    color: { from: '#fde68a', to: '#ca8a04', accent: '#422006' },
    check: (s) => {
      const all = allPlateKeys()
      if (all.length === 0) return false
      return all.every((k) => s.triggeredPlates.includes(k))
    }
  },
  {
    id: 'all_skins',
    title: 'Wardrobe Hoarder',
    description: 'Unlocked all skins.',
    glyph: '★ALL',
    color: { from: '#fbcfe8', to: '#a21caf', accent: '#3b0764' },
    check: () => allSkinsOwned()
  },
  {
    id: 'highest_rank',
    title: 'Highest Rank',
    description: 'Reach leaderboard rank 1 on any stage.',
    glyph: '#1',
    color: { from: '#fef08a', to: '#ea580c', accent: '#431407' },
    check: (s) => s.topRankStages.length > 0
  },
  {
    id: 'all_bosses_killed',
    title: 'Boss Harvester',
    description: 'Kill at least one boss on every boss stage.',
    glyph: '☠',
    color: { from: '#e9d5ff', to: '#7c3aed', accent: '#1e0a4a' },
    check: (s) => {
      if (s.stagesWithBoss.length === 0) return false
      return s.stagesWithBoss.every((id) => s.killedBosses.includes(id))
    }
  }
]

// "Completionist" — override the placeholder check now that we can
// reference the stage list cleanly.
const compIdx = ACHIEVEMENTS.findIndex((a) => a.id === 'all_stages_done')
if (compIdx >= 0) {
  ACHIEVEMENTS[compIdx]!.check = (s) => {
    const allIds = STAGES.map((x) => x.id)
    if (allIds.length === 0) return false
    return allIds.every((id) => (s.bestStars[id] ?? 0) >= 1)
  }
}

// ─── Evaluation & recording ───────────────────────────────────────────

function buildState(bestStars: Record<string, number>): AchievementState {
  const best = { ...persisted.value.bestScorePerStage }
  const summed = Object.values(best).reduce((a, b) => a + b, 0)
  return {
    totalScore: persisted.value.totalScore,
    bestStars,
    killedBosses: persisted.value.killedBosses.slice(),
    minLaunchesPerStage: { ...persisted.value.minLaunchesPerStage },
    bestScorePerStage: best,
    summedBestScore: summed,
    stagesWithBoss: stagesWithBoss(),
    maxLaunchesEver: persisted.value.maxLaunchesEver,
    triggeredPlates: persisted.value.triggeredPlates.slice(),
    topRankStages: persisted.value.topRankStages.slice()
  }
}

function evaluateAll(bestStars: Record<string, number>): string[] {
  const state = buildState(bestStars)
  const newly: string[] = []
  for (const a of ACHIEVEMENTS) {
    if (unlocked.value[a.id]) continue
    if (a.check(state)) {
      unlocked.value[a.id] = Date.now()
      newly.push(a.id)
    }
  }
  if (newly.length > 0) {
    unlocked.value = { ...unlocked.value }
    saveUnlocked()
    // Queue them as unseen so the HUD can nudge the player to open the modal.
    for (const id of newly) {
      if (!unseen.value.includes(id)) unseen.value.push(id)
    }
    unseen.value = unseen.value.slice()
    saveUnseen()
  }
  return newly
}

function markAllSeen() {
  if (unseen.value.length === 0) return
  unseen.value = []
  saveUnseen()
}

export interface StageFinishRecord {
  stageId: string
  finalScore: number
  stars: number
  launches: number
  bossKilled: boolean
  bestStars: Record<string, number>
  /** Ids of pressure plate machines that were triggered during this run. */
  triggeredPlateIds?: number[]
}

function recordStageFinish(r: StageFinishRecord): string[] {
  persisted.value.totalScore += Math.max(0, r.finalScore)
  // Track smallest launches the player ever finished this stage with.
  const prevMin = persisted.value.minLaunchesPerStage[r.stageId] ?? Infinity
  if (r.launches > 0 && r.launches < prevMin) {
    persisted.value.minLaunchesPerStage[r.stageId] = r.launches
  }
  if (r.launches > persisted.value.maxLaunchesEver) {
    persisted.value.maxLaunchesEver = r.launches
  }
  // Track the per-stage highest final score — feeds the "summed best" check.
  const prevBest = persisted.value.bestScorePerStage[r.stageId] ?? 0
  if (r.finalScore > prevBest) {
    persisted.value.bestScorePerStage[r.stageId] = r.finalScore
  }
  if (r.bossKilled && !persisted.value.killedBosses.includes(r.stageId)) {
    persisted.value.killedBosses.push(r.stageId)
  }
  // Merge the plates triggered during this run into the persistent set.
  if (r.triggeredPlateIds && r.triggeredPlateIds.length > 0) {
    const set = new Set(persisted.value.triggeredPlates)
    for (const pid of r.triggeredPlateIds) set.add(`${r.stageId}:${pid}`)
    persisted.value.triggeredPlates = Array.from(set)
  }
  savePersisted()
  return evaluateAll(r.bestStars)
}

/** Record that the player is currently rank 1 on a given stage's
 *  leaderboard. Called from the stage-finish flow after the leaderboard
 *  rank is re-evaluated. */
function recordTopRank(stageId: string, bestStars: Record<string, number>): string[] {
  if (!persisted.value.topRankStages.includes(stageId)) {
    persisted.value.topRankStages.push(stageId)
    savePersisted()
  }
  return evaluateAll(bestStars)
}

// Watch the catalog for new unlocks (skin shop / battle pass / daily
// rewards all funnel through ownedSkins). Re-evaluate achievements
// whenever the set grows so "Wardrobe Hoarder" can fire mid-session.
function loadStageStars(): Record<string, number> {
  try {
    const raw = localStorage.getItem('bm_stage_stars')
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

watch(ownedSkins, () => {
  evaluateAll(loadStageStars())
}, { deep: true })

// ─── Public API ───────────────────────────────────────────────────────

const useAchievements = () => ({
  achievements: ACHIEVEMENTS,
  unlocked: computed(() => unlocked.value),
  isUnlocked: (id: string) => Boolean(unlocked.value[id]),
  unlockedCount: computed(() => Object.keys(unlocked.value).length),
  unseenCount: computed(() => unseen.value.length),
  totalCount: ACHIEVEMENTS.length,
  recordStageFinish,
  recordTopRank,
  markAllSeen
})

export default useAchievements
