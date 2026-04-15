<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCoin from '@/components/icons/IconCoin.vue'
import FModal from '@/components/molecules/FModal.vue'

const { t } = useI18n()
import {
  SPINNER_MODEL_IDS,
  modelImgPath,
  skinCost,
  SPECIAL_SKINS,
  isSkinOwned,
  buySkin,
  selectSkin,
  getSelectedSkin,
  type SpinnerModelId
} from '@/use/useModels'
import useSpinnerConfig from '@/use/useSpinnerConfig'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const { coins, addCoins } = useSpinnerConfig()

const CANONICAL_TOP = 'star' as const
const selected = computed(() => getSelectedSkin(CANONICAL_TOP))

const isOwned = (id: SpinnerModelId) => isSkinOwned(CANONICAL_TOP, id) || id === 'blades'
const cost = (id: SpinnerModelId) => skinCost(id)
const isSpecial = (id: SpinnerModelId) => SPECIAL_SKINS.has(id)

const onUnlock = (id: SpinnerModelId) => {
  if (isOwned(id)) {
    selectSkin(CANONICAL_TOP, id)
    return
  }
  const c = cost(id)
  if (coins.value < c) return
  addCoins(-c)
  buySkin(CANONICAL_TOP, id)
  selectSkin(CANONICAL_TOP, id)
}

const buttonTheme = (id: SpinnerModelId) => {
  if (isOwned(id)) {
    if (selected.value === id) {
      return { from: '#fde047', to: '#f7a000', shadow: '#7a4b00' }
    }
    return { from: '#4ade80', to: '#15803d', shadow: '#0a3d1a' }
  }
  return { from: '#50aaff', to: '#2266ff', shadow: '#102e7a' }
}
</script>

<template lang="pug">
  FModal(
    :model-value="isOpen"
    @update:model-value="(v) => !v && emit('close')"
    :title="t('stageUi.skinShopTitle')"
  )
    div.flex.items-center.justify-center.gap-2.mb-3
      IconCoin(class="w-6 h-6 text-yellow-300")
      span.text-yellow-300.font-black.game-text(class="text-lg") {{ coins }}

    div.grid.gap-3.overflow-y-auto(
      class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-h-[60vh] p-1"
    )
      div.skin-card.rounded-xl.p-3.flex.flex-col.items-center.gap-2(
        v-for="id in SPINNER_MODEL_IDS"
        :key="id"
        :class="{ 'ring-4 ring-yellow-300': selected === id, 'ring-2 ring-purple-400': isSpecial(id) }"
      )
        img.object-contain.drop-shadow-lg.pointer-events-none(
          :src="modelImgPath(id)"
          class="w-20 h-20 sm:w-24 sm:h-24"
          :class="{ 'grayscale opacity-60': !isOwned(id) }"
          draggable="false"
        )
        span.text-white.font-bold.game-text.text-center.uppercase(class="text-xs") {{ id }}

        button.unlock-btn.relative.w-full.select-none.cursor-pointer.transition-transform(
          :disabled="!isOwned(id) && coins < cost(id)"
          :class="{ 'opacity-50 grayscale pointer-events-none': !isOwned(id) && coins < cost(id) }"
          @click="onUnlock(id)"
        )
          span.unlock-btn__shadow(:style="{ backgroundColor: buttonTheme(id).shadow }")
          span.unlock-btn__body(
            :style="{ backgroundImage: `linear-gradient(to bottom, ${buttonTheme(id).from}, ${buttonTheme(id).to})` }"
          )
            span.unlock-btn__shine
            span.unlock-btn__label.game-text
              template(v-if="isOwned(id)")
                | {{ selected === id ? 'SELECTED' : 'EQUIP' }}
              template(v-else)
                span.inline-flex.items-center.justify-center.gap-1.whitespace-nowrap
                  span UNLOCK
                  span.text-yellow-100 {{ cost(id) }}
                  IconCoin(class="unlock-btn__coin text-yellow-200 shrink-0")
</template>

<style scoped lang="sass">
.skin-card
  background: linear-gradient(145deg, #1b3e95 0%, #0b1220 100%)
  border: 2px solid #334155


.unlock-btn
  display: block
  -webkit-tap-highlight-color: transparent
  padding: 0
  background: transparent
  border: 0
  // Reserve vertical space for the 3D drop shadow so nothing clips.
  padding-bottom: 3px

  &:hover:not(:disabled)
    filter: brightness(1.08)

  &:active:not(:disabled)
    transform: translateY(2px)

.unlock-btn__shadow
  position: absolute
  left: 0
  right: 0
  top: 3px
  bottom: 0
  border-radius: 0.75rem
  z-index: 0

.unlock-btn__body
  position: relative
  display: block
  border: 2px solid #0f1a30
  border-radius: 0.75rem
  padding: 0.375rem 0.5rem
  z-index: 1

.unlock-btn__shine
  position: absolute
  inset: 0 0 auto 0
  height: 50%
  background: rgba(255, 255, 255, 0.25)
  border-top-left-radius: 0.6rem
  border-top-right-radius: 0.6rem
  pointer-events: none

.unlock-btn__label
  position: relative
  display: block
  color: #fff
  font-weight: 900
  text-transform: uppercase
  font-size: 0.75rem
  line-height: 1
  letter-spacing: 0.02em
  white-space: nowrap
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000

@media (min-width: 640px)
  .unlock-btn__label
    font-size: 0.875rem

.unlock-btn__coin
  width: 0.85rem
  height: 0.85rem

</style>