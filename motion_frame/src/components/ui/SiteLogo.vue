<script setup lang="ts">
// Логотип из брендбука, без перерисовки. full — версия со слоганом «Visuals that move»
const props = withDefaults(defineProps<{ height?: number; full?: boolean }>(), { height: 40, full: false })

// Пропорции исходных файлов: logo.png 509×120, logo-full.png 814×192
const width = Math.round(props.height * (props.full ? 814 / 192 : 509 / 120))
</script>

<template>
  <img
    class="logo"
    :src="full ? '/logo/logo-full.png' : '/logo/logo.png'"
    :width="width"
    :height="height"
    alt="Raw Motion Frame"
  />
</template>

<style scoped>
.logo { display: block; }
</style>
