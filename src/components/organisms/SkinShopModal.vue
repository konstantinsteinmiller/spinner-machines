<script setup lang="ts">
import { computed } from 'vue'
import IconCoin from '@/components/icons/IconCoin.vue'
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

// Shop uses the "star" top as the canonical slot — simple unlock model.
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
</script>

<template lang="pug">
  Transition(name="fade")
    div.fixed.inset-0.z-50.flex.items-center.justify-center.backdrop-blur-md.p-4(
      v-if="isOpen"
      class="bg-black/70"
      @click.self="emit('close')"
      :style="{\
      paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))',\
      paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'\
    }"
    )
      div.shop-panel.relative.flex.flex-col.rounded-2xl.overflow-hidden(
        class="w-full max-w-4xl max-h-[90vh]"
        @click.stop
      )
        div.flex.items-center.justify-between.px-4.py-3.border-b-2.border-yellow-400
          span.text-white.font-black.uppercase.game-text(class="text-xl sm:text-2xl") Skin Shop
          div.flex.items-center.gap-3
            div.flex.items-center.gap-2
              IconCoin(class="w-6 h-6 text-yellow-300")
              span.text-yellow-300.font-black.game-text(class="text-lg") {{ coins }}
            button.text-white.font-black.px-3.py-1.rounded-full.bg-red-600.game-text(
              @click="emit('close')"
            ) ×

        div.grid.gap-3.p-4.overflow-y-auto(
          class="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
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
            button.w-full.py-1.rounded-full.font-black.game-text.uppercase(
              class="text-xs sm:text-sm"
              :class="[\
              isOwned(id) ? (selected === id ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white') : (coins >= cost(id) ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400')\
            ]"
              :disabled="!isOwned(id) && coins < cost(id)"
              @click="onUnlock(id)"
            )
              template(v-if="isOwned(id)")
                | {{ selected === id ? 'SELECTED' : 'EQUIP' }}
              template(v-else)
                span.inline-flex.items-center.gap-1
                  | Unlock {{ cost(id) }}
                  IconCoin(class="w-3 h-3 text-yellow-200")
</template>

<style scoped lang="sass">
.shop-panel
  background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%)
  border: 3px solid #fcd34d
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7)

.skin-card
  background: linear-gradient(145deg, #1b3e95 0%, #0b1220 100%)
  border: 2px solid #334155

.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity: 0
</style>
