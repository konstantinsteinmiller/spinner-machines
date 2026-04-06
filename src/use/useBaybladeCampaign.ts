import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { TopPartId, BottomPartId } from '@/types/bayblade'

// ─── Stage Enemy Config ─────────────────────────────────────────────────────

export interface StageBladeConfig {
  topPartId: TopPartId
  bottomPartId: BottomPartId
  topLevel: number
  bottomLevel: number
}

export interface Stage {
  id: number
  name: string
  enemyTeam: [StageBladeConfig, StageBladeConfig]
  rewardWin: number
  rewardLose: number
}

// ─── Manually Editable Stage Definitions ────────────────────────────────────

export const STAGES: Stage[] = [
  // ── Early Game: low stats, forgiving ──────────────────────────────────────
  {
    id: 1,
    name: 'Rookie Arena',
    enemyTeam: [
      { topPartId: 'cushioned', bottomPartId: 'balanced', topLevel: 0, bottomLevel: 0 },
      { topPartId: 'round', bottomPartId: 'balanced', topLevel: 0, bottomLevel: 0 }
    ],
    rewardWin: 80,
    rewardLose: 30
  },
  {
    id: 2,
    name: 'Training Grounds',
    enemyTeam: [
      { topPartId: 'quadratic', bottomPartId: 'balanced', topLevel: 0, bottomLevel: 0 },
      { topPartId: 'triangle', bottomPartId: 'balanced', topLevel: 0, bottomLevel: 0 }
    ],
    rewardWin: 90,
    rewardLose: 30
  },

  // ── Mid Game: enemies start upgrading ─────────────────────────────────────
  {
    id: 3,
    name: 'Iron League',
    enemyTeam: [
      { topPartId: 'triangle', bottomPartId: 'speedy', topLevel: 1, bottomLevel: 0 },
      { topPartId: 'round', bottomPartId: 'tanky', topLevel: 0, bottomLevel: 1 }
    ],
    rewardWin: 100,
    rewardLose: 35
  },
  {
    id: 4,
    name: 'Steel Circuit',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'balanced', topLevel: 1, bottomLevel: 0 },
      { topPartId: 'quadratic', bottomPartId: 'speedy', topLevel: 1, bottomLevel: 1 }
    ],
    rewardWin: 110,
    rewardLose: 35
  },
  {
    id: 5,
    name: 'Gold Division',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'speedy', topLevel: 1, bottomLevel: 1 },
      { topPartId: 'triangle', bottomPartId: 'tanky', topLevel: 1, bottomLevel: 1 }
    ],
    rewardWin: 120,
    rewardLose: 40
  },

  // ── Late Game: higher upgrades, tougher combos ────────────────────────────
  {
    id: 6,
    name: 'Platinum Ring',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'speedy', topLevel: 2, bottomLevel: 1 },
      { topPartId: 'round', bottomPartId: 'tanky', topLevel: 1, bottomLevel: 2 }
    ],
    rewardWin: 140,
    rewardLose: 45
  },
  {
    id: 7,
    name: 'Diamond Arena',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'speedy', topLevel: 2, bottomLevel: 2 },
      { topPartId: 'triangle', bottomPartId: 'speedy', topLevel: 2, bottomLevel: 1 }
    ],
    rewardWin: 160,
    rewardLose: 50
  },
  {
    id: 8,
    name: 'Champion\'s Gate',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'balanced', topLevel: 3, bottomLevel: 2 },
      { topPartId: 'cushioned', bottomPartId: 'tanky', topLevel: 2, bottomLevel: 3 }
    ],
    rewardWin: 180,
    rewardLose: 55
  },

  // ── End Game: maxed enemies ───────────────────────────────────────────────
  {
    id: 9,
    name: 'Legend\'s Trial',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'speedy', topLevel: 3, bottomLevel: 3 },
      { topPartId: 'quadratic', bottomPartId: 'tanky', topLevel: 3, bottomLevel: 3 }
    ],
    rewardWin: 200,
    rewardLose: 60
  },
  {
    id: 10,
    name: 'Final Boss',
    enemyTeam: [
      { topPartId: 'star', bottomPartId: 'speedy', topLevel: 4, bottomLevel: 3 },
      { topPartId: 'star', bottomPartId: 'tanky', topLevel: 3, bottomLevel: 4 }
    ],
    rewardWin: 300,
    rewardLose: 80
  }
]

// ─── Upgrade Definitions ────────────────────────────────────────────────────

/** Per-level bonus for each top part (leans into the part's identity) */
export const TOP_UPGRADE_BONUS: Record<TopPartId, { damage: number; defense: number; hp: number }> = {
  star: { damage: 0.12, defense: 0.03, hp: 1 },  // glass cannon
  triangle: { damage: 0.08, defense: 0.05, hp: 2 },  // aggressive balanced
  round: { damage: 0.04, defense: 0.08, hp: 4 },  // defensive
  quadratic: { damage: 0.06, defense: 0.06, hp: 3 },  // true balanced
  cushioned: { damage: 0.03, defense: 0.10, hp: 5 }   // pure tank
}

/** Per-level bonus for each bottom part */
export const BOTTOM_UPGRADE_BONUS: Record<BottomPartId, { speed: number; decay: number; hp: number }> = {
  speedy: { speed: 0.06, decay: 0.00015, hp: 1 },  // leans into speed
  tanky: { speed: 0.02, decay: 0.00020, hp: 4 },  // leans into survival
  balanced: { speed: 0.04, decay: 0.00018, hp: 2 }   // balanced
}

/** Cost for upgrading to a given level: 100 + (level - 1) * 20 */
export const upgradeCost = (toLevel: number): number =>
  100 + (toLevel - 1) * 20

// ─── Persistence ────────────────────────────────────────────────────────────

const STAGE_KEY = 'bayblade_campaign_stage'
const UPGRADES_KEY = 'bayblade_upgrades'

export interface PlayerUpgrades {
  tops: Record<TopPartId, number>
  bottoms: Record<BottomPartId, number>
}

const DEFAULT_UPGRADES: PlayerUpgrades = {
  tops: { star: 0, triangle: 0, round: 0, quadratic: 0, cushioned: 0 },
  bottoms: { speedy: 0, tanky: 0, balanced: 0 }
}

const loadStage = (): number => {
  try {
    const raw = localStorage.getItem(STAGE_KEY)
    if (raw) {
      const n = parseInt(raw, 10)
      if (n >= 1 && n <= STAGES.length) return n
    }
  } catch { /* fall through */
  }
  return 1
}

const loadUpgrades = (): PlayerUpgrades => {
  try {
    const raw = localStorage.getItem(UPGRADES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.tops && parsed?.bottoms) return parsed
    }
  } catch { /* fall through */
  }
  return JSON.parse(JSON.stringify(DEFAULT_UPGRADES))
}

// ─── Singleton State ────────────────────────────────────────────────────────

const currentStageId: Ref<number> = ref(loadStage())
const playerUpgrades: Ref<PlayerUpgrades> = ref(loadUpgrades())

// ─── Derived ────────────────────────────────────────────────────────────────

const currentStage = computed(() =>
  STAGES.find(s => s.id === currentStageId.value) ?? STAGES[0]!
)

const isLastStage = computed(() =>
  currentStageId.value >= STAGES.length
)

// ─── Actions ────────────────────────────────────────────────────────────────

const saveState = () => {
  localStorage.setItem(STAGE_KEY, currentStageId.value.toString())
  localStorage.setItem(UPGRADES_KEY, JSON.stringify(playerUpgrades.value))
}

const advanceStage = () => {
  if (currentStageId.value < STAGES.length) {
    currentStageId.value++
    saveState()
  }
}

const upgradeTop = (partId: TopPartId): boolean => {
  const current = playerUpgrades.value.tops[partId]
  const cost = upgradeCost(current + 1)
  // Caller is responsible for checking coins — return false if level is already maxed
  playerUpgrades.value = {
    ...playerUpgrades.value,
    tops: { ...playerUpgrades.value.tops, [partId]: current + 1 }
  }
  saveState()
  return true
}

const upgradeBottom = (partId: BottomPartId): boolean => {
  const current = playerUpgrades.value.bottoms[partId]
  const cost = upgradeCost(current + 1)
  playerUpgrades.value = {
    ...playerUpgrades.value,
    bottoms: { ...playerUpgrades.value.bottoms, [partId]: current + 1 }
  }
  saveState()
  return true
}

// ─── Public API ─────────────────────────────────────────────────────────────

const useBaybladeCampaign = () => ({
  currentStageId,
  currentStage,
  isLastStage,
  playerUpgrades,
  advanceStage,
  upgradeTop,
  upgradeBottom,
  upgradeCost
})

export default useBaybladeCampaign
