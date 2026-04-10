import { prependBaseUrl } from '@/utils/function'
import { type Element, ELEMENTS } from '@/utils/enums'
import { isCampaignTest, isDbInitialized, isDebug } from '@/use/useMatch'
import useUser from '@/use/useUser'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { TopPartId } from '@/types/spinner'

export const modelImgPath = (id: string) => {
  return prependBaseUrl(`images/models/${id}_256x256.webp`)
}

// ─── Spinner Model Image Mapping ───────────────────────────────────────────

export const SPINNER_MODEL_IDS = [
  'fire', 'phoenix', 'thunder', 'bluedragon', 'turtle',
  'ice', 'chip', 'mysticaleye', 'nature', 'wulf',
  'castle', 'eagle', 'prisma', 'scorpion', 'shell',
  'snake', 'axe', 'demon', 'angelic', 'mountain',
  'tornado', 'reddragon', 'bear', 'hawk', 'blades',
  'gear', 'ape', 'shield', 'salamaner', 'galaxy',
  'piranha', 'thunderstorm'
] as const

export type SpinnerModelId = (typeof SPINNER_MODEL_IDS)[number]

/** Maps each top part to a player and default NPC model image */
export const SPINNER_MODEL_MAP: Record<TopPartId, { player: SpinnerModelId; npc: SpinnerModelId }> = {
  star: { player: 'blades', npc: 'phoenix' },
  triangle: { player: 'thunder', npc: 'wulf' },
  round: { player: 'nature', npc: 'ice' },
  quadratic: { player: 'chip', npc: 'mysticaleye' },
  cushioned: { player: 'shell', npc: 'mountain' },
  piercer: { player: 'scorpion', npc: 'snake' }
}

/** Available skins per top part (default skin is always first and free) */
export const SKINS_PER_TOP: Record<TopPartId, SpinnerModelId[]> = {
  // "star" top keeps its bold elemental roster. Swapped thunderstorm out
  // to give the new spiky ("triangle") top a jagged-themed lineup.
  star: ['blades', 'ice', 'tornado', 'reddragon', 'axe'],
  // Spiky top — jagged / barbed aesthetic (thunder bolts, thunderstorm,
  // razor-winged eagle).
  triangle: ['thunder', 'snake', 'phoenix', 'eagle', 'salamaner'],
  round: ['nature', 'turtle', 'piranha', 'bear', 'galaxy'],
  quadratic: ['chip', 'mysticaleye', 'bluedragon', 'angelic', 'prisma'],
  cushioned: ['shell', 'shield', 'castle', 'mountain', 'gear'],
  piercer: ['scorpion', 'wulf', 'demon', 'hawk', 'ape']
}

export const SKIN_COST = 300

/** Pick a random skin from the available pool for a given top part */
export const getRandomSkinForTop = (topPartId: TopPartId): SpinnerModelId => {
  const skins = SKINS_PER_TOP[topPartId]
  return skins[Math.floor(Math.random() * skins.length)] as SpinnerModelId
}

// ─── Skin Persistence (singleton) ───────────────────────────────────────────

const SKINS_KEY = 'spinner_owned_skins'
const SELECTED_SKINS_KEY = 'spinner_selected_skins'
const PICKER_OPENED_KEY = 'spinner_skin_picker_opened'

const loadOwnedSkins = (): Set<string> => {
  try {
    const raw = localStorage.getItem(SKINS_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch { /* fall through */
  }
  return new Set()
}

const loadSelectedSkins = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(SELECTED_SKINS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* fall through */
  }
  return {}
}

const loadPickerOpened = (): Set<string> => {
  try {
    const raw = localStorage.getItem(PICKER_OPENED_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch { /* fall through */
  }
  return new Set()
}

const ownedSkins: Ref<Set<string>> = ref(loadOwnedSkins())
const selectedSkins: Ref<Record<string, string>> = ref(loadSelectedSkins())
const pickerOpenedParts: Ref<Set<string>> = ref(loadPickerOpened())

const saveOwnedSkins = () => {
  localStorage.setItem(SKINS_KEY, JSON.stringify([...ownedSkins.value]))
}

const saveSelectedSkins = () => {
  localStorage.setItem(SELECTED_SKINS_KEY, JSON.stringify(selectedSkins.value))
}

const savePickerOpened = () => {
  localStorage.setItem(PICKER_OPENED_KEY, JSON.stringify([...pickerOpenedParts.value]))
}

/** Mark that the player has opened the skin picker for the given top part. */
export const markSkinPickerOpened = (topPartId: TopPartId) => {
  if (pickerOpenedParts.value.has(topPartId)) return
  pickerOpenedParts.value = new Set([...pickerOpenedParts.value, topPartId])
  savePickerOpened()
}

export const wasSkinPickerOpened = (topPartId: TopPartId): boolean =>
  pickerOpenedParts.value.has(topPartId)

/** All currently-owned skins for a top part (in declared order). */
export const ownedSkinsForTop = (topPartId: TopPartId): SpinnerModelId[] =>
  SKINS_PER_TOP[topPartId].filter(id => isSkinOwned(topPartId, id))

/** True if at least one skin in this top part's catalog is not yet owned. */
export const hasUnownedSkinsForTop = (topPartId: TopPartId): boolean =>
  SKINS_PER_TOP[topPartId].some(id => !isSkinOwned(topPartId, id))

/** Default skins (first in each list) are always owned */
export const isSkinOwned = (topPartId: TopPartId, modelId: SpinnerModelId): boolean => {
  if (SKINS_PER_TOP[topPartId][0] === modelId) return true
  return ownedSkins.value.has(`${topPartId}:${modelId}`)
}

export const buySkin = (topPartId: TopPartId, modelId: SpinnerModelId): boolean => {
  if (isSkinOwned(topPartId, modelId)) return false
  ownedSkins.value = new Set([...ownedSkins.value, `${topPartId}:${modelId}`])
  saveOwnedSkins()
  return true
}

export const selectSkin = (topPartId: TopPartId, modelId: SpinnerModelId, slotIndex = 0) => {
  const key = `${topPartId}:${slotIndex}`
  selectedSkins.value = { ...selectedSkins.value, [key]: modelId }
  // Keep the legacy un-indexed key in sync for slot 0 so older
  // callers that don't pass a slotIndex still resolve correctly.
  if (slotIndex === 0) {
    selectedSkins.value = { ...selectedSkins.value, [topPartId]: modelId }
  }
  saveSelectedSkins()
}

export const getSelectedSkin = (topPartId: TopPartId, slotIndex = 0): SpinnerModelId => {
  // Try slot-specific key first, fall back to legacy un-indexed key
  const slotKey = `${topPartId}:${slotIndex}`
  const sel = (selectedSkins.value[slotKey] ?? selectedSkins.value[topPartId]) as SpinnerModelId | undefined
  if (sel && isSkinOwned(topPartId, sel)) return sel
  return SPINNER_MODEL_MAP[topPartId].player
}

/** Get the resolved image path for a spinner given its top part, owner, and optional override */
export const spinnerModelImgPath = (topPartId: TopPartId, owner: 'player' | 'npc', modelOverride?: string): string => {
  if (modelOverride) return modelImgPath(modelOverride)
  if (owner === 'player') return modelImgPath(getSelectedSkin(topPartId))
  return modelImgPath(getRandomSkinForTop(topPartId))
}

/**
 * models
 */
export interface Card {
  id: string
  name: string
}

// export type InventoryCard = Card & { count: number }

export interface StoredCollectionCard {
  id: string
  count: number
}

const useModels = () => {
  const allModels: Card[] = [
    { id: 'postman-middle', name: 'Quicklin' },
    { id: 'gorilla-middle', name: 'Gondix' }
  ]

  const { setSettingValue, userCollection } = useUser()

  // const saveCollection = (collection: Array<InventoryCard | StoredCollectionCard>) => {
  //   const storedCollection: StoredCollectionCard[] = collection.map(card => ({ id: card.id, count: card.count }))
  //   setSettingValue('collection', storedCollection)
  // }

  const storedCollection = computed(() => {
    return typeof userCollection.value === 'string'
      ? JSON.parse(userCollection.value)
      : userCollection.value
  })

  // watch(isDbInitialized, () => {
  //   if (storedCollection.value.length >= 1 && storedCollection.value.every((card: StoredCollectionCard) => card.count === 0)) {
  //     saveCollection([])
  //   }
  // }, { immediate: true, once: true })

  return {
    allModels,
    // saveCollection,
    modelImgPath
  }
}

export default useModels