<script setup lang="ts">
interface Props {
  lit: boolean
  gid: string
}

const props = defineProps<Props>()
</script>

<template lang="pug">
  svg.star-gem(viewBox="-70 -70 140 140" xmlns="http://www.w3.org/2000/svg")
    defs
      //- Bright gold facet tone
      linearGradient(:id="`gem-gold-light-${gid}`" x1="0%" y1="0%" x2="0%" y2="100%")
        stop(offset="0%" stop-color="#fff6c4")
        stop(offset="55%" stop-color="#ffd94a")
        stop(offset="100%" stop-color="#e69a00")
      //- Deep gold shadow facet tone
      linearGradient(:id="`gem-gold-dark-${gid}`" x1="0%" y1="0%" x2="0%" y2="100%")
        stop(offset="0%" stop-color="#c47a00")
        stop(offset="60%" stop-color="#8a4a00")
        stop(offset="100%" stop-color="#4b2500")
      //- Grey variants for unlit
      linearGradient(:id="`gem-grey-light-${gid}`" x1="0%" y1="0%" x2="0%" y2="100%")
        stop(offset="0%" stop-color="#e5e7eb")
        stop(offset="100%" stop-color="#9ca3af")
      linearGradient(:id="`gem-grey-dark-${gid}`" x1="0%" y1="0%" x2="0%" y2="100%")
        stop(offset="0%" stop-color="#6b7280")
        stop(offset="100%" stop-color="#1f2937")
      //- Warm halo blur filter
      filter(:id="`halo-${gid}`" x="-75%" y="-75%" width="250%" height="250%")
        feGaussianBlur(in="SourceGraphic" stdDeviation="9")

    //- Per-star halo bloom — only on lit stars
    g(v-if="lit" :filter="`url(#halo-${gid})`" opacity="0.9")
      circle(cx="0" cy="0" r="52" fill="#fbbf24")
      circle(cx="0" cy="0" r="36" fill="#fff3a0")

    //- 10 facet triangles, alternating light/dark
    g.facets
      polygon(points="0,0 0,-50 11.22,-15.45" :fill="lit ? `url(#gem-gold-light-${gid})` : `url(#gem-grey-light-${gid})`")
      polygon(points="0,0 11.22,-15.45 47.55,-15.45" :fill="lit ? `url(#gem-gold-dark-${gid})` : `url(#gem-grey-dark-${gid})`")
      polygon(points="0,0 47.55,-15.45 18.17,5.9" :fill="lit ? `url(#gem-gold-light-${gid})` : `url(#gem-grey-light-${gid})`")
      polygon(points="0,0 18.17,5.9 29.39,40.45" :fill="lit ? `url(#gem-gold-dark-${gid})` : `url(#gem-grey-dark-${gid})`")
      polygon(points="0,0 29.39,40.45 0,19.1" :fill="lit ? `url(#gem-gold-light-${gid})` : `url(#gem-grey-light-${gid})`")
      polygon(points="0,0 0,19.1 -29.39,40.45" :fill="lit ? `url(#gem-gold-dark-${gid})` : `url(#gem-grey-dark-${gid})`")
      polygon(points="0,0 -29.39,40.45 -18.17,5.9" :fill="lit ? `url(#gem-gold-light-${gid})` : `url(#gem-grey-light-${gid})`")
      polygon(points="0,0 -18.17,5.9 -47.55,-15.45" :fill="lit ? `url(#gem-gold-dark-${gid})` : `url(#gem-grey-dark-${gid})`")
      polygon(points="0,0 -47.55,-15.45 -11.22,-15.45" :fill="lit ? `url(#gem-gold-light-${gid})` : `url(#gem-grey-light-${gid})`")
      polygon(points="0,0 -11.22,-15.45 0,-50" :fill="lit ? `url(#gem-gold-dark-${gid})` : `url(#gem-grey-dark-${gid})`")

      //- Outer silhouette stroke
      path(
        d="M0 -50 L11.22 -15.45 L47.55 -15.45 L18.17 5.9 L29.39 40.45 L0 19.1 L-29.39 40.45 L-18.17 5.9 L-47.55 -15.45 L-11.22 -15.45 Z"
        fill="none"
        :stroke="lit ? '#3b1a00' : '#111827'"
        stroke-width="2.5"
        stroke-linejoin="round"
      )

      //- Central facet bright specular highlight + small reflection dot
      g(v-if="lit")
        circle(cx="-16" cy="-24" r="2.5" fill="rgba(255,255,255,0.85)")
</template>

<style scoped lang="sass">
.star-gem
  width: 100%
  height: 100%
  overflow: visible

  .facets
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))
</style>
