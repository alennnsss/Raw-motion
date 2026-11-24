<script setup lang="ts">
import { ref } from 'vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { faq } from '@/data/faq'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="faq" ref="root" class="section faq" aria-labelledby="faq-title">
    <div class="container faq__inner">
      <div class="section-head">
        <p class="eyebrow">FAQ</p>
        <SplitHeading id="faq-title" class="section-title" text="Частые вопросы" />
      </div>

      <div class="faq__list">
        <details v-for="item in faq" :key="item.question" class="faq__item" data-reveal>
          <summary class="faq__question">
            <span>{{ item.question }}</span>
            <span class="faq__icon" aria-hidden="true"></span>
          </summary>
          <p class="faq__answer">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq__list { border-top: 1px solid var(--gray-1); }

.faq__item { border-bottom: 1px solid var(--gray-1); }

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 0;
  font-size: 18px;
  font-weight: 700;
  list-style: none;
  cursor: pointer;
}

.faq__question::-webkit-details-marker { display: none; }

.faq__icon {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
}

.faq__icon::before,
.faq__icon::after {
  content: '';
  position: absolute;
  top: 7px;
  left: 0;
  width: 16px;
  height: 2px;
  background: currentColor;
  transition: transform 0.3s var(--ease);
}

.faq__icon::after { transform: rotate(90deg); }

.faq__item[open] .faq__icon::after { transform: rotate(0deg); }

.faq__answer {
  padding-bottom: 22px;
  max-width: 40em;
  color: var(--color-muted);
}

.faq__item[open] .faq__answer { animation: faq-open 0.35s var(--ease); }

@keyframes faq-open {
  from { opacity: 0; transform: translateY(-6px); }
}

@media (min-width: 960px) {
  .faq__inner { display: grid; grid-template-columns: 1fr 1.4fr; gap: 64px; }
}

@media (prefers-reduced-motion: reduce) {
  .faq__item[open] .faq__answer { animation: none; }
  .faq__icon::before, .faq__icon::after { transition: none; }
}
</style>
