<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import FModal from '@/components/molecules/FModal'
import type { BaybladeConfig, TopPartId, BottomPartId } from '@/types/bayblade'
import type { TabOption } from '@/components/atoms/FTabs'
import {
  TOP_PARTS_LIST,
  BOTTOM_PARTS_LIST,
  computeStats
} from '@/use/useBaybladeConfig'
import useBaybladeConfig from '@/use/useBaybladeConfig'
import useBaybladeCampaign, { upgradeCost, TOP_UPGRADE_BONUS, BOTTOM_UPGRADE_BONUS } from '@/use/useBaybladeCampaign'
import IconCoin from '@/components/icons/IconCoin.vue'
import IconAttack from '@/components/icons/IconAttack.vue'
import IconDefense from '@/components/icons/IconDefense.vue'
import IconHp from '@/components/icons/IconHp.vue'
import IconSpeed from '@/components/icons/IconSpeed.vue'
import IconWeight from '@/components/icons/IconWeight.vue'

interface Props {
  modelValue: boolean
  initialTeam?: BaybladeConfig[]
}

const props = withDefaults(defineProps<Props>(), {
  initialTeam: () => [
    { topPartId: 'star' as TopPartId, bottomPartId: 'balanced' as BottomPartId },
    { topPartId: 'round' as TopPartId, bottomPartId: 'balanced' as BottomPartId }
  ]
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', team: BaybladeConfig[]): void
}>()

// ─── Blade Selector (which blade are we configuring) ───────────────────────

const activeBladeIndex: Ref<string | number> = ref(0)

const bladeTabs = computed<TabOption[]>(() =>
  props.initialTeam.map((_, i) => ({
    label: `Blade ${i + 1}`,
    value: i
  }))
)

// ─── Per-Blade Configs (local editable copies) ────────────────────────────

const localTeam: Ref<BaybladeConfig[]> = ref([])

// Sync only when modal opens (not on every prop change, which would reset the tab)
watch(() => props.modelValue, (open) => {
  if (open) {
    localTeam.value = props.initialTeam.map(c => ({ ...c }))
    activeBladeIndex.value = 0
  }
}, { immediate: true })

// ─── Current Blade Being Edited ────────────────────────────────────────────

const currentConfig = computed(() =>
  localTeam.value[activeBladeIndex.value as number] ?? localTeam.value[0]
)

const { coins, addCoins } = useBaybladeConfig()
const { playerUpgrades, upgradeTop, upgradeBottom } = useBaybladeCampaign()

const topLevel = (id: TopPartId) => playerUpgrades.value.tops[id]
const bottomLevel = (id: BottomPartId) => playerUpgrades.value.bottoms[id]

const stats = computed(() => {
  const cfg = currentConfig.value
  return computeStats(cfg, topLevel(cfg.topPartId), bottomLevel(cfg.bottomPartId))
})

const buyTopUpgrade = (id: TopPartId) => {
  const cost = upgradeCost(topLevel(id) + 1)
  if (coins.value < cost) return
  addCoins(-cost)
  upgradeTop(id)
  emit('save', localTeam.value.map(c => ({ ...c })))
}

const buyBottomUpgrade = (id: BottomPartId) => {
  const cost = upgradeCost(bottomLevel(id) + 1)
  if (coins.value < cost) return
  addCoins(-cost)
  upgradeBottom(id)
  emit('save', localTeam.value.map(c => ({ ...c })))
}

// Upgraded stat values for display
const topDamage = (part: typeof TOP_PARTS_LIST[number]) =>
  (part.damageMultiplier + TOP_UPGRADE_BONUS[part.id].damage * topLevel(part.id)).toFixed(2)

const topDefense = (part: typeof TOP_PARTS_LIST[number]) =>
  (part.defenseMultiplier + TOP_UPGRADE_BONUS[part.id].defense * topLevel(part.id)).toFixed(2)

const topHp = (part: typeof TOP_PARTS_LIST[number]) =>
  part.healthBonus + TOP_UPGRADE_BONUS[part.id].hp * topLevel(part.id)

const bottomSpeed = (part: typeof BOTTOM_PARTS_LIST[number]) =>
  (part.speedMultiplier + BOTTOM_UPGRADE_BONUS[part.id].speed * bottomLevel(part.id)).toFixed(2)

const bottomHp = (part: typeof BOTTOM_PARTS_LIST[number]) =>
  part.healthBonus + BOTTOM_UPGRADE_BONUS[part.id].hp * bottomLevel(part.id)

const setTop = (id: TopPartId) => {
  const idx = activeBladeIndex.value as number
  localTeam.value[idx] = { ...localTeam.value[idx], topPartId: id }
  emit('save', localTeam.value.map(c => ({ ...c })))
}

const setBottom = (id: BottomPartId) => {
  const idx = activeBladeIndex.value as number
  localTeam.value[idx] = { ...localTeam.value[idx], bottomPartId: id }
  emit('save', localTeam.value.map(c => ({ ...c })))
}
</script>

<template lang="pug">
  FModal(
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :is-closable="true"
    :tabs="bladeTabs"
    :active-tab="activeBladeIndex"
    @update:active-tab="activeBladeIndex = $event"
  )
    div(class="space-y-4 max-h-[62vh] overflow-y-auto px-1 sm:px-3 py-2")

      //- ── Top Blade Parts ──────────────────────────────────────────────────
      div
        div.relative.flex.justify-center.items-center.mb-2

          div.absolute.left-0.flex.items-center.gap-1.rounded.font-bold(
            class="top-1/2 -translate-y-[50%] px-2 py-0.5 bg-yellow-600/60 text-yellow-300 text-[10px] sm:text-xs"
          )
            IconCoin(class="w-3.5 h-3.5 text-yellow-300")
            span {{ coins }}g
          h3.text-yellow-300.font-black.uppercase.italic(
            class="text-xs sm:text-sm tracking-wider"
          ) Top Blade
        div.grid.gap-2(class="grid-cols-3 sm:grid-cols-6")
          div(
            v-for="part in TOP_PARTS_LIST"
            :key="part.id"
            @click="setTop(part.id)"
            class="cursor-pointer rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 flex flex-col"
            :class="currentConfig.topPartId === part.id \
            ? 'bg-gradient-to-b from-yellow-500 to-yellow-600 border-2 border-yellow-300' \
            : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-400'"
          )
            div.text-center.px-1.pt-1(class="sm:px-2 sm:pt-2")
              div.text-white.font-bold.truncate(class="text-[10px] sm:text-xs") {{ part.label }}
              div.text-yellow-400.font-bold(
                v-if="topLevel(part.id) > 0"
                class="text-[8px] sm:text-[10px]"
              ) Lv.{{ topLevel(part.id) }}
              div.mt-1(class="text-[9px] sm:text-[11px]")
                div.flex.items-center.justify-center.text-red-400(class="gap-0.5")
                  IconAttack.inline-block(class="w-2.5 h-2.5 sm:w-3 sm:h-3")
                  span {{ topDamage(part) }}x
                div.flex.items-center.justify-center.text-blue-400(class="gap-0.5")
                  IconDefense.inline-block(class="w-2.5 h-2.5 sm:w-3 sm:h-3")
                  span {{ topDefense(part) }}x
                div.flex.items-center.justify-center.text-green-400(class="gap-0.5" v-if="topHp(part) > 0")
                  IconHp.inline-block(class="w-2.5 h-2.5 sm:w-3 sm:h-3")
                  span +{{ topHp(part) }}
            //- Upgrade button integrated at card bottom
            button.w-full.rounded-b-lg.font-bold.transition-all.mt-auto(
              class="text-[8px] sm:text-[10px] py-0.5"
              :class="coins >= upgradeCost(topLevel(part.id) + 1) \
                ? 'bg-yellow-500 hover:bg-yellow-400 text-white cursor-pointer' \
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'"
              @click.stop="buyTopUpgrade(part.id)"
            )
              span.flex.items-center.justify-center(class="gap-0.5")
                span.game-text ⬆
                IconCoin(class="w-2.5 h-2.5 text-yellow-300")
                span.game-text {{ upgradeCost(topLevel(part.id) + 1) }}

      //- ── Bottom Parts ─────────────────────────────────────────────────────
      div
        h3.text-yellow-300.font-black.uppercase.italic.mb-2(
          class="text-xs sm:text-sm tracking-wider"
        ) Bottom Part
        div.grid.grid-cols-3.gap-2
          div(
            v-for="part in BOTTOM_PARTS_LIST"
            :key="part.id"
            @click="setBottom(part.id)"
            class="cursor-pointer rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 flex flex-col"
            :class="currentConfig.bottomPartId === part.id \
            ? 'bg-gradient-to-b from-yellow-500 to-yellow-600 border-2 border-yellow-300' \
            : 'bg-slate-700 border-2 border-slate-600 hover:border-slate-400'"
          )
            div.text-center.px-1.pt-1(class="sm:px-2 sm:pt-2")
              div.text-white.font-bold(class="text-[10px] sm:text-xs") {{ part.label }}
              div.text-yellow-400.font-bold(
                v-if="bottomLevel(part.id) > 0"
                class="text-[8px] sm:text-[10px]"
              ) Lv.{{ bottomLevel(part.id) }}
              div.mt-1(class="text-[9px] sm:text-[11px]")
                div.flex.items-center.justify-center.text-cyan-400(class="gap-0.5")
                  IconSpeed.inline-block(class="w-2.5 h-2.5 sm:w-3 sm:h-3")
                  span {{ bottomSpeed(part) }}x
                div.flex.items-center.justify-center.text-gray-300(class="gap-0.5")
                  IconWeight.inline-block(class="w-2.5 h-2.5 sm:w-3 sm:h-3")
                  span {{ part.weight }}
                div.flex.items-center.justify-center.text-green-400(class="gap-0.5" v-if="bottomHp(part) > 0")
                  IconHp.inline-block(class="w-2.5 h-2.5 sm:w-3 sm:h-3")
                  span +{{ bottomHp(part) }}
            //- Upgrade button integrated at card bottom
            button.w-full.rounded-b-lg.font-bold.transition-all.mt-auto.game-text(
              class="text-[8px] sm:text-[10px] py-0.5"
              :class="coins >= upgradeCost(bottomLevel(part.id) + 1) \
                ? 'bg-yellow-500 hover:bg-yellow-400 text-white cursor-pointer' \
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'"
              @click.stop="buyBottomUpgrade(part.id)"
            )
              span.flex.items-center.justify-center(class="gap-0.5")
                | ⬆
                IconCoin(class="w-2.5 h-2.5 text-yellow-300")
                | {{ upgradeCost(bottomLevel(part.id) + 1) }}

      //- ── Stats Summary ────────────────────────────────────────────────────
      div(class="border-t border-slate-500/50 pt-3")
        h3.text-yellow-300.font-black.uppercase.italic.mb-2(
          class="text-xs sm:text-sm tracking-wider"
        ) Total Stats
        div.grid.grid-cols-2.gap-x-4.gap-y-1(class="text-[10px] sm:text-xs")
          div.flex.justify-between.items-center
            span.flex.items-center.gap-1.text-gray-400
              IconHp(class="w-3 h-3 text-green-400")
              | HP
            span.text-green-400.font-bold {{ stats.maxHp }}
          div.flex.justify-between.items-center
            span.flex.items-center.gap-1.text-gray-400
              IconWeight(class="w-3 h-3 text-gray-300")
              | Weight
            span.text-blue-400.font-bold {{ stats.totalWeight }}
          div.flex.justify-between.items-center
            span.flex.items-center.gap-1.text-gray-400
              IconAttack(class="w-3 h-3 text-red-400")
              | ATK
            span.text-red-400.font-bold {{ stats.damageMultiplier.toFixed(1) }}x
          div.flex.justify-between.items-center
            span.flex.items-center.gap-1.text-gray-400
              IconDefense(class="w-3 h-3 text-purple-400")
              | DEF
            span.text-purple-400.font-bold {{ stats.defenseMultiplier.toFixed(1) }}x
          div.flex.justify-between.items-center
            span.flex.items-center.gap-1.text-gray-400
              IconSpeed(class="w-3 h-3 text-cyan-400")
              | SPD
            span.text-cyan-400.font-bold {{ stats.speedMultiplier.toFixed(1) }}x

</template>

<style scoped lang="sass">
</style>
