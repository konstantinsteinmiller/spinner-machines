<template lang="pug">
  svg.icon-coin(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24")
    circle(cx="12" cy="12" r="11" fill="black")
    circle(cx="12" cy="12" r="10" fill="currentColor")
    text(x="12" y="18" text-anchor="middle" font-size="16" font-weight="bold" fill="#2f920e") $
</template>

<style scoped>
/* Ambient text-shadow from .game-text parents was bleeding onto the
   inner "$" glyph, producing a smeared black halo that looked like a
   broken drop-shadow. Reset any inherited shadow/filter on the svg and
   its children so the coin icon always renders cleanly. */
.icon-coin,
.icon-coin * {
  text-shadow: none !important;
  filter: none !important;
}
</style>
