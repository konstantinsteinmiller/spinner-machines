<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import useSpinnerConfig from '@/use/useSpinnerConfig'
import useSounds from '@/use/useSound'
import IconCoin from '@/components/icons/IconCoin.vue'

const COIN_REWARD = 75
const COOLDOWN_MS = 10 * 60 * 1000 // 10 min between claims
const STORAGE_KEY = 'bm_stage_chest_ready_at'

const emit = defineEmits<{
  (e: 'coins-awarded', sourceEl: HTMLElement): void
}>()

const { addCoins } = useSpinnerConfig()
const { playSound } = useSounds()

const now = ref(Date.now())
const readyAt = ref<number>(parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10) || 0)
const btnRef = ref<HTMLElement | null>(null)

const isReady = computed(() => now.value >= readyAt.value)
const msRemaining = computed(() => Math.max(0, readyAt.value - now.value))

/** Formats hh:mm:ss left on the cooldown. */
const countdown = computed(() => {
  const total = Math.ceil(msRemaining.value / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
})

let tickId: number | null = null
onMounted(() => {
  tickId = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onUnmounted(() => {
  if (tickId !== null) clearInterval(tickId)
})

function onCollect() {
  if (!isReady.value) return
  addCoins(COIN_REWARD)
  // Set cooldown BEFORE playSound — if playSound throws (Firefox volume
  // edge case) the chest still locks and can't be collected infinitely.
  readyAt.value = Date.now() + COOLDOWN_MS
  localStorage.setItem(STORAGE_KEY, String(readyAt.value))
  now.value = Date.now()
  playSound(`celebration-${1 + Math.floor(Math.random() * 3)}`)
  if (btnRef.value) emit('coins-awarded', btnRef.value)
}
</script>

<template lang="pug">
  button.chest-btn.relative.game-text.cursor-pointer.select-none(
    ref="btnRef"
    :disabled="!isReady"
    :class="{ 'chest-btn--ready': isReady, 'chest-btn--cooling': !isReady }"
    :aria-label="`Treasure chest: ${COIN_REWARD} coins`"
    @click="onCollect"
  )
    span.chest-btn__shadow
    span.chest-btn__body
      span.chest-btn__glyph 🎁
      div.chest-btn__reward.flex.items-center.gap-1(v-if="isReady")
        span.text-yellow-200.font-black.leading-none +{{ COIN_REWARD }}
        IconCoin.w-3.h-3.text-yellow-300
      div.chest-btn__cd(v-else) {{ countdown }}
</template>

<style scoped lang="sass">
.chest-btn
  display: block
  padding: 0
  background: transparent
  border: none
  -webkit-tap-highlight-color: transparent
  transition: transform 0.15s ease

  &--ready
    animation: chest-pulse 2s infinite ease-in-out

    &:active
      transform: scale(0.92)

  &--cooling
    opacity: 0.55
    cursor: not-allowed

.chest-btn__shadow
  position: absolute
  inset: 2px 0 0 0
  border-radius: 10px
  background: #1a2b4b

.chest-btn__body
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  gap: 2px
  padding: 6px 10px
  border-radius: 10px
  border: 2px solid #0f1a30
  background: linear-gradient(to bottom, #f59e0b, #b45309)
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.4)

.chest-btn__glyph
  font-size: 1.35rem
  line-height: 1
  filter: drop-shadow(0 2px 0 #000)

.chest-btn__reward
  font-size: 0.65rem

.chest-btn__cd
  font-size: 0.6rem
  color: #fde68a
  font-weight: 800
  white-space: nowrap

@keyframes chest-pulse
  0%, 100%
    transform: translateY(0) scale(1)
  50%
    transform: translateY(-2px) scale(1.035)
</style>
