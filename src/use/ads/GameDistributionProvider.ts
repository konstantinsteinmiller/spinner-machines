// GameDistribution.com ad provider — wraps the lazy-loaded
// `gameDistributionPlugin` in the cross-platform `AdProvider` surface
// consumed by `useAds`.
//
// `gameDistributionPlugin()` is awaited from `init()` AND fired from
// `main.ts` in parallel. The plugin caches its init promise, so the
// second call is a no-op that resolves to the same result — by the time
// `useAds.initAds()` runs post-mount the SDK is typically already up.

import { computed } from 'vue'
import {
  gameDistributionPlugin,
  isGdAdsBlocked,
  isGdSdkActive,
  showMidgameAdGD,
  showRewardedAdGD
} from '@/utils/gameDistributionPlugin'
import type { AdProvider } from './types'

export const createGameDistributionProvider = (): AdProvider => {
  const isReady = computed(() => isGdSdkActive.value)
  return {
    name: 'gameDistribution',
    isReady,
    isRewardedReady: isReady,
    isInterstitialReady: isReady,
    isAdsBlocked: isGdAdsBlocked,
    init: async () => {
      try {
        await gameDistributionPlugin()
      } catch (e) {
        console.warn('[ads/gd] plugin init failed', e)
      }
    },
    showRewardedAd: () => showRewardedAdGD(),
    showMidgameAd: () => showMidgameAdGD()
  }
}
