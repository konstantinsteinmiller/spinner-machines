import { ref, computed } from 'vue'
import { STAGES } from '@/game/stages'

// ─── Types ────────────────────────────────────────────────────────────

export interface AchievementState {
  totalScore: number
  bestStars: Record<string, number>
  killedBosses: string[]
  minLaunchesPerStage: Record<string, number>
  bestScorePerStage: Record<string, number>
  summedBestScore: number
  stagesWithBoss: string[]
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
}

function loadPersisted(): Persisted {
  const empty: Persisted = { totalScore: 0, killedBosses: [], minLaunchesPerStage: {}, bestScorePerStage: {} }
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
        : {}
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
    stagesWithBoss: stagesWithBoss()
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
}

function recordStageFinish(r: StageFinishRecord): string[] {
  persisted.value.totalScore += Math.max(0, r.finalScore)
  // Track smallest launches the player ever finished this stage with.
  const prevMin = persisted.value.minLaunchesPerStage[r.stageId] ?? Infinity
  if (r.launches > 0 && r.launches < prevMin) {
    persisted.value.minLaunchesPerStage[r.stageId] = r.launches
  }
  // Track the per-stage highest final score — feeds the "summed best" check.
  const prevBest = persisted.value.bestScorePerStage[r.stageId] ?? 0
  if (r.finalScore > prevBest) {
    persisted.value.bestScorePerStage[r.stageId] = r.finalScore
  }
  if (r.bossKilled && !persisted.value.killedBosses.includes(r.stageId)) {
    persisted.value.killedBosses.push(r.stageId)
  }
  savePersisted()
  return evaluateAll(r.bestStars)
}

// ─── Public API ───────────────────────────────────────────────────────

const useAchievements = () => ({
  achievements: ACHIEVEMENTS,
  unlocked: computed(() => unlocked.value),
  isUnlocked: (id: string) => Boolean(unlocked.value[id]),
  unlockedCount: computed(() => Object.keys(unlocked.value).length),
  unseenCount: computed(() => unseen.value.length),
  totalCount: ACHIEVEMENTS.length,
  recordStageFinish,
  markAllSeen
})

export default useAchievements
