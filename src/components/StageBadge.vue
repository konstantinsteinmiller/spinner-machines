<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  stageId: string
  name: string
  isBoss?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isBoss: false
})

const { t, te } = useI18n()
const localizedName = computed(() => {
  const key = `stageNames.${props.stageId}`
  return te(key) ? t(key) : props.name
})

const shortId = computed(() => {
  const m = props.stageId.match(/(\d+)/)
  return m ? m[1] : props.stageId
})

const theme = computed(() => {
  if (props.isBoss) {
    return {
      from: 'from-red-600',
      to: 'to-red-900',
      border: 'border-red-300',
      shadowBase: 'bg-red-950',
      number: 'text-red-100',
      numberShadow: 'bg-red-950/70',
      accent: 'text-red-200',
      glow: 'shadow-red-500/60'
    }
  }
  return {
    from: 'from-slate-500',
    to: 'to-slate-800',
    border: 'border-slate-300',
    shadowBase: 'bg-slate-950',
    number: 'text-slate-50',
    numberShadow: 'bg-slate-950/70',
    accent: 'text-slate-200',
    glow: 'shadow-slate-500/50'
  }
})
</script>

<template lang="pug">
  div.stage-badge.relative
    div.absolute.inset-0.translate-y-1.rounded-xl.opacity-80(:class="theme.shadowBase")
    div.relative.flex.items-center.gap-2.rounded-xl.border-2.shadow-lg.overflow-hidden(
      :class="['bg-gradient-to-b', theme.from, theme.to, theme.border, theme.glow]"
      class="pl-1.5 pr-3 py-1"
    )
      div.relative.flex.items-center.justify-center.rounded-lg.border(
        :class="[theme.numberShadow, theme.border]"
        class="min-w-7 h-7 sm:min-w-8 sm:h-8 px-1"
      )
        span.font-black.game-text.leading-none(
          :class="theme.number"
          class="text-sm sm:text-base"
        ) {{ isBoss ? `💀${shortId}` : shortId }}
      div.flex.flex-col.leading-tight
        span.font-black.uppercase.tracking-wider.game-text.text-white(
          class="text-[9px] sm:text-[11px] opacity-90"
        ) {{ isBoss ? 'BOSS STAGE' : 'STAGE ' + shortId }}
        span.font-bold.italic.game-text(
          :class="theme.accent"
          class="text-[10px] sm:text-xs"
        ) {{ localizedName }}
</template>
