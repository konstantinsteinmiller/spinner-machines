// Provider-agnostic ad surface. Every platform-specific ad backend
// (CrazyGames SDK, GameDistribution SDK) implements this interface so the
// in-game ad placements never have to know which provider is active.
//
// Three reactive readiness gates:
//   • `isReady`             — SDK finished init AND we're in a build
//                             where ads are expected at all. Coarse gate.
//   • `isRewardedReady`     — a rewarded video is currently loaded.
//   • `isInterstitialReady` — an interstitial is currently loaded.
//
// Per-format readiness flips false the moment an ad is consumed (or
// fails to load) and flips back true on the next loaded event from the
// SDK. This is what guarantees buttons disappear when inventory runs out.
//
// Contract notes:
//   • `showRewardedAd` resolves `true` only if the video played all the
//     way through — callers grant the reward only on `true`.
//   • `showMidgameAd` resolves when the interstitial finished or
//     errored. It never rejects: callers `await` it and resume gameplay.
//   • `init` is idempotent and safe to call when the provider is inert
//     (e.g. Noop on unsupported platforms).
import type { Ref } from 'vue'

export interface AdProvider {
  readonly name: string
  readonly isReady: Ref<boolean>
  readonly isRewardedReady: Ref<boolean>
  readonly isInterstitialReady: Ref<boolean>
  /**
   * Reactive: true when the active SDK has detected that the player's
   * browser is blocking ad requests (uBlock, AdGuard, Brave Shields,
   * Pi-hole, etc.).
   *
   * IMPORTANT: granting rewards when ads were blocked is against most
   * platforms' TOS (and the publisher won't pay you).
   */
  readonly isAdsBlocked: Ref<boolean>
  init: () => Promise<void>
  showRewardedAd: () => Promise<boolean>
  showMidgameAd: () => Promise<void>
}
