import { createApp, watch } from 'vue'
import router from '@/router'
import '@/assets/css/tailwind.css'
import '@/assets/css/index.sass'
import { createI18n } from 'vue-i18n'
import {
  loadLocaleMessages,
  resolveInitialLocale,
  setI18nLocale,
  isSupportedLocale
} from '@/i18n'
import { GAME_USER_LANGUAGE } from '@/utils/constants.ts'
import { LANGUAGES } from '@/utils/enums'
import {
  createCrazyGamesSaveStrategy,
  crazyLocale,
  initCrazyGames
} from '@/use/useCrazyGames'
import { isDebug } from '@/use/useMatch.ts'
import useUser, {
  isCrazyWeb,
  isGameDistribution,
  isGlitch,
  isWaveDash
} from '@/use/useUser'
import { LocalStorageStrategy, SaveManager } from '@/utils/save'
import type { SaveStrategy } from '@/utils/save'
import { initAds } from '@/use/useAds'

const bootstrap = async () => {
  // 1. Platform SDK init that MUST happen before SaveManager hydrates.
  if (isCrazyWeb) {
    await initCrazyGames()
  } else if (isWaveDash) {
    try {
      const sdk = await (window as any).WavedashJS
      if (sdk) await sdk.init({ debug: isDebug.value })
    } catch (e) {
      console.warn('[Wavedash] SDK init failed:', e)
    }
  }

  // 2. Pick save strategy based on build flag. Plugin modules are
  // lazy-imported so non-relevant builds don't ship the SDK loader code.
  let strategy: SaveStrategy
  if (isGlitch) {
    const mod = await import('@/utils/glitchPlugin')
    strategy = mod.createGlitchSaveStrategy() ?? new LocalStorageStrategy()
  } else if (isCrazyWeb) {
    strategy = createCrazyGamesSaveStrategy()
  } else if (isGameDistribution) {
    const mod = await import('@/utils/gameDistributionPlugin')
    strategy = mod.createGameDistributionSaveStrategy() ?? new LocalStorageStrategy()
  } else {
    strategy = new LocalStorageStrategy()
  }

  const saveManager = new SaveManager(strategy)
  await saveManager.init()

  // 3. Fire-and-forget plugins. They're side-effecty but not on the boot
  // critical path; just kick them off.
  if (isGlitch) {
    const { glitchPlugin } = await import('@/utils/glitchPlugin')
    glitchPlugin()
  }
  if (isGameDistribution) {
    void import('@/utils/gameDistributionPlugin').then(({ gameDistributionPlugin }) => {
      gameDistributionPlugin()
    })
  }

  // If CrazyGames reported a supported player locale, persist it as the
  // session hint so resolveInitialLocale picks it up below and every
  // subsequent boot in this tab stays consistent with the portal's
  // preference rather than a stale browser default.
  const cgLocale = crazyLocale.value
  if (cgLocale && LANGUAGES.includes(cgLocale)) {
    sessionStorage.setItem(GAME_USER_LANGUAGE, cgLocale)
  }

  const { default: App } = await import('@/App.vue')

  // Resolve and LOAD just the initial locale bundle before creating the
  // i18n instance.
  const initial = resolveInitialLocale(GAME_USER_LANGUAGE)
  const needsFallback = initial !== 'en'
  const [initialMsgs, fallbackMsgs] = await Promise.all([
    loadLocaleMessages(initial).catch(() => ({})),
    needsFallback ? loadLocaleMessages('en').catch(() => ({})) : Promise.resolve(null)
  ])

  const i18n: any = createI18n({
    locale: initial,
    fallbackLocale: 'en',
    messages: needsFallback
      ? { [initial]: initialMsgs, en: fallbackMsgs ?? {} }
      : { en: initialMsgs },
    missingWarn: false,
    fallbackWarn: false
  })

  if (cgLocale && LANGUAGES.includes(cgLocale)) {
    const { userLanguage: storedLanguage, setSettingValue } = useUser()
    const { isDbInitialized } = await import('@/use/useMatch')
    const stop = watch(
      isDbInitialized,
      (ready) => {
        if (!ready) return
        stop()
        if (storedLanguage.value !== cgLocale) {
          setSettingValue('language', cgLocale)
        }
        setI18nLocale(i18n, cgLocale)
      },
      { immediate: true }
    )
  }

  if (!(cgLocale && LANGUAGES.includes(cgLocale))) {
    const { userLanguage: storedLang } = useUser()
    const { isDbInitialized: dbReady } = await import('@/use/useMatch')
    let stopLangSync: (() => void) | null = null
    stopLangSync = watch(
      dbReady,
      (ready) => {
        if (!ready) return
        stopLangSync?.()
        if (isSupportedLocale(storedLang.value)) {
          setI18nLocale(i18n, storedLang.value)
        }
      },
      { immediate: true }
    )
  }

  ;(window as any).__i18n = i18n

  const app = createApp(App)

  app.use(router)
  app.use(i18n)

  app.mount('#app')

  // 4. Post-mount: kick off ads (GameDistribution doesn't strictly need a
  // mounted app but the latency hides nicely behind the mount).
  void initAds().catch((e) => console.warn('[ads] init failed', e))

  // Signal to Wavedash that the game is fully loaded and ready
  if (isWaveDash) {
    try {
      const sdk = await (window as any).WavedashJS
      if (sdk) {
        sdk.updateLoadProgressZeroToOne?.(1)
        sdk.readyForEvents?.()
      }
    } catch (e) {
      console.warn('[Wavedash] ready signal failed:', e)
    }
  }
}

bootstrap()
