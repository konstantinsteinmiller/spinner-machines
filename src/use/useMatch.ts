import { ref } from 'vue'

// Cross-cutting flags shared across the app. Most of this module's
// original arena/PvP surface area has been removed; the reactive
// signals below are still referenced from `main.ts` and scattered
// settings stores.

const debugSaved = localStorage.getItem('debug') || 'false'
const campaignTestSaved = localStorage.getItem('campaign-test') || 'false'
export const isDebug = ref(!!JSON.parse(debugSaved))
export const isCrazyGamesFullRelease = import.meta.env.VITE_APP_CRAZY_GAMES_FULL_RELEASE === 'true'
export const isCampaignTest = ref(!!JSON.parse(campaignTestSaved))

export const isSplashScreenVisible = ref<boolean>(false)
export const isDbInitialized = ref<boolean>(false)
