<script setup lang="ts" generic="T">
import { computed, ref } from 'vue'

// Бесконечная лента на CSS. Группа дублируется для бесшовной петли, копии скрыты от скринридеров
const props = withDefaults(defineProps<{ items: T[]; label: string; minItems?: number; duration?: number }>(), {
  minItems: 8,
  duration: 30,
})

defineSlots<{ default(props: { item: T; hidden: boolean }): unknown }>()

const paused = ref(false)

const group = computed(() => {
  const repeat = Math.max(1, Math.ceil(props.minItems / Math.max(1, props.items.length)))
  return Array.from({ length: repeat }, () => props.items).flat()
})
</script>

<template>
  <div class="marquee" :class="{ 'is-paused': paused }" :style="{ '--duration': `${duration}s` }">
    <div class="marquee__viewport">
      <div class="marquee__track">
        <ul v-for="copy in 2" :key="copy" class="marquee__group" :aria-hidden="copy === 2 ? 'true' : undefined">
          <li
            v-for="(item, i) in group"
            :key="i"
            class="marquee__item"
            :aria-hidden="copy === 1 && i >= items.length ? 'true' : undefined"
          >
            <slot :item="item" :hidden="copy === 2 || i >= items.length" />
          </li>
        </ul>
      </div>
    </div>
    <button type="button" class="marquee__toggle" :aria-pressed="paused" @click="paused = !paused">
      {{ paused ? 'Запустить' : 'Пауза' }}<span class="visually-hidden">: {{ label }}</span>
    </button>
  </div>
</template>

<style scoped>
.marquee { position: relative; }

.marquee__viewport {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee var(--duration) linear infinite;
}

.marquee__group {
  display: flex;
  align-items: center;
  gap: 48px;
  padding-right: 48px;
}

.marquee__item { flex: none; }

.marquee:hover .marquee__track,
.marquee:focus-within .marquee__track,
.marquee.is-paused .marquee__track { animation-play-state: paused; }

.marquee__toggle {
  display: block;
  margin: 16px auto 0;
  padding: 6px 12px;
  border: 1px solid var(--gray-2);
  background: transparent;
  color: var(--color-muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

/* Без движения: статичный ряд только из оригинальных элементов */
@media (prefers-reduced-motion: reduce) {
  .marquee__viewport { mask-image: none; }
  .marquee__track { animation: none; width: auto; justify-content: center; }
  .marquee__group { flex-wrap: wrap; justify-content: center; padding: 0 16px; }
  .marquee [aria-hidden='true'],
  .marquee__toggle { display: none; }
}
</style>
