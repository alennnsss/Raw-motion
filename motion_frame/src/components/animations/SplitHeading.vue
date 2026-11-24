<script setup lang="ts">
import { computed } from 'vue'

// Заголовок, разбитый на слова для кинетической типографики. accent получает лаймовую плашку
const props = withDefaults(defineProps<{ text: string; accent?: string; tag?: 'h1' | 'h2' | 'h3' }>(), {
  accent: '',
  tag: 'h2',
})

const words = computed(() => props.text.split(' '))
</script>

<template>
  <component :is="tag" class="split" data-split>
    <template v-for="(word, i) in words" :key="i">
      <span class="split__mask"><span class="split__word" data-word>
        <template v-if="word === accent"><span class="plate"><span class="plate__bg" aria-hidden="true"></span><span class="plate__text">{{ word }}</span></span></template>
        <template v-else>{{ word }}</template>
      </span></span>{{ i < words.length - 1 ? ' ' : '' }}
    </template>
  </component>
</template>

<style scoped>
.split__mask {
  display: inline-block;
  overflow: hidden;
  padding-block: 0.08em;
  margin-block: -0.08em;
  vertical-align: top;
}

.split__word { display: inline-block; }

.plate {
  position: relative;
  display: inline-block;
  padding-inline: 0.12em;
  color: var(--color-ink);
}

.plate__bg {
  position: absolute;
  inset: 0.06em 0;
  background: var(--color-accent);
}

.plate__text { position: relative; }
</style>
