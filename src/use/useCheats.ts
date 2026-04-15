import { onMounted, onUnmounted, ref } from 'vue'
import useSpinnerConfig from '@/use/useSpinnerConfig.ts'

const storedCheat = localStorage.getItem('cheat') || 'false'
const isCheat = ref<boolean>(JSON.parse(storedCheat))

/**
 * Bumped by cheat shortcut — StageView watches this to open the
 * level-cleared reward screen with a forced star count (1, 2, or 3).
 * The nonce increments on every trigger so repeated presses with the
 * same star count still fire the watcher.
 */
export const cheatStageRewardSignal = ref<{ stars: number; nonce: number }>({
  stars: 0,
  nonce: 0
})

const useCheats = () => {
  if (!isCheat.value) return {}

  const { addCoins } = useSpinnerConfig()

  const cheatsMap: Record<string, () => void> = {
    'ctrl+shift+alt+k': () => {
      addCoins(3000)
      console.warn('[CHEAT] +3000 coins.')
    },
    // Force-open the Level-Cleared reward screen with 1 / 2 / 3 stars.
    'ctrl+alt+1': () => {
      cheatStageRewardSignal.value = { stars: 1, nonce: cheatStageRewardSignal.value.nonce + 1 }
      console.warn('[CHEAT] Reward screen — 1 star.')
    },
    'ctrl+alt+2': () => {
      cheatStageRewardSignal.value = { stars: 2, nonce: cheatStageRewardSignal.value.nonce + 1 }
      console.warn('[CHEAT] Reward screen — 2 stars.')
    },
    'ctrl+alt+3': () => {
      cheatStageRewardSignal.value = { stars: 3, nonce: cheatStageRewardSignal.value.nonce + 1 }
      console.warn('[CHEAT] Reward screen — 3 stars.')
    }
  }

  const heldKeys = new Set<string>()
  const MODIFIER_KEYS = new Set(['control', 'shift', 'alt', 'meta'])

  const normalizeKey = (e: KeyboardEvent): string | null => {
    const codeMatch = e.code.match(/^Digit(\d)$/)
    if (codeMatch) return codeMatch[1]!
    const k = e.key.toLowerCase()
    return MODIFIER_KEYS.has(k) ? null : k
  }

  const buildShortcut = (e: KeyboardEvent): string => {
    const parts: string[] = []
    if (e.ctrlKey || e.metaKey) parts.push('ctrl')
    if (e.shiftKey) parts.push('shift')
    if (e.altKey) parts.push('alt')
    const sorted = [...heldKeys].sort()
    parts.push(...sorted)
    return parts.join('+')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = normalizeKey(e)
    if (key) heldKeys.add(key)
    const shortcut = buildShortcut(e)
    if (cheatsMap[shortcut]) {
      e.preventDefault()
      cheatsMap[shortcut]()
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = normalizeKey(e)
    if (key) heldKeys.delete(key)
  }

  const handleBlur = () => {
    heldKeys.clear()
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown, { passive: false })
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleBlur)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    window.removeEventListener('blur', handleBlur)
  })

  return { isCheat }
}

export default useCheats
