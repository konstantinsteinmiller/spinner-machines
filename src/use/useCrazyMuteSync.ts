import { onMounted, onUnmounted, computed } from 'vue'
import useUser from '@/use/useUser'
import {
  isSdkActive,
  isSdkMuted,
  addCrazyMuteListener,
  setCrazyMuted
} from '@/use/useCrazyGames'

const { userSoundVolume, userMusicVolume, setSettingValue } = useUser()

const isMuted = computed(() => userMusicVolume.value === 0 && userSoundVolume.value === 0)

let prevMusicVol = 0.15
let prevSoundVol = 0.7

export const applyMute = (muted: boolean) => {
  if (muted && !isMuted.value) {
    prevMusicVol = userMusicVolume.value || 0.15
    prevSoundVol = userSoundVolume.value || 0.7
    setSettingValue('music', 0)
    setSettingValue('sound', 0)
  } else if (!muted && isMuted.value) {
    setSettingValue('music', prevMusicVol || 0.5)
    setSettingValue('sound', prevSoundVol || 0.7)
  }
}

export const toggleMute = () => {
  const next = !isMuted.value
  applyMute(next)
  setCrazyMuted(next)
}

export { isMuted }

/**
 * Call once at the App level to keep the CrazyGames platform mute toggle
 * in sync with the in-game volume for the entire session, regardless of
 * which components are mounted.
 */
export const useCrazyMuteSync = () => {
  let removeMuteListener: (() => void) | null = null

  onMounted(() => {
    if (!isSdkActive.value) return
    if (isSdkMuted.value !== null && isSdkMuted.value !== isMuted.value) {
      applyMute(isSdkMuted.value)
    }
    removeMuteListener = addCrazyMuteListener((muted) => applyMute(muted))
  })

  onUnmounted(() => {
    removeMuteListener?.()
    removeMuteListener = null
  })
}
