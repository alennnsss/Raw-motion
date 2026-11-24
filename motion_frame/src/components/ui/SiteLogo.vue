<script setup lang="ts">
// Логотип из файла владельца, без перерисовки. Квадратный, поэтому задаём один размер
withDefaults(defineProps<{ size?: number }>(), { size: 56 })
</script>

<template>
  <img class="logo" src="/logo/raw-motion-frame.png" :width="size" :height="size" alt="Raw Motion Frame" />
</template>

<style scoped>
.logo { display: block; }
</style>
