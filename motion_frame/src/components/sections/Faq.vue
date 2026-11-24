<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { INSTAGRAM_URL } from '@/config'
import { faq } from '@/data/faq'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="faq" ref="root" class="section faq" aria-labelledby="faq-title">
    <div class="container faq__inner">
      <div class="section-head">
        <SplitHeading id="faq-title" class="section-title" text="Вопросы и ответы" />
        <div class="faq__help" data-reveal>
          <p class="faq__help-title">Не нашли ответ?</p>
          <p class="faq__help-text">Опишите задачу в заявке или напишите в Instagram, ответим лично.</p>
          <div class="faq__help-actions">
            <AppButton href="#lead" arrow>Оставить заявку</AppButton>
            <AppButton :href="INSTAGRAM_URL" variant="dark" target="_blank" rel="noopener noreferrer">Instagram</AppButton>
          </div>
        </div>
      </div>

      <div class="faq__list">
        <details v-for="(item, i) in faq" :key="item.question" class="faq__item" data-reveal>
          <summary class="faq__question">
            <span class="faq__num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="faq__q">{{ item.question }}</span>
            <span class="faq__icon" aria-hidden="true"><Plus :size="20" /></span>
          </summary>
          <p class="faq__answer">{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq { padding-top: 0; }

.faq__list { border-top: 1px solid var(--line); }

.faq__item { border-bottom: 1px solid var(--line); }

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  list-style: none;
  cursor: pointer;
}

.faq__question::-webkit-details-marker { display: none; }

/* Нумерация 01, 02… как в перечислениях: помогает глазу держать место в списке */
.faq__num {
  flex: none;
  width: 2.2em;
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.faq__q { flex: 1; }

.faq__answer { padding-left: calc(15px * 2.2 + 16px); }

.faq__help {
  margin-top: 32px;
  padding: 28px;
  border-radius: var(--radius);
  background: var(--color-card);
}

.faq__help-title { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }

.faq__help-text { margin-top: 8px; color: var(--muted); }

.faq__help-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }

.faq__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: var(--color-card);
  transition: transform 0.3s var(--ease), background-color 0.2s;
}

.faq__item[open] .faq__icon { transform: rotate(45deg); background: var(--color-accent); }

.faq__answer {
  padding-bottom: 24px;
  max-width: 40em;
  font-size: 17px;
  color: var(--muted);
}

.faq__item[open] .faq__answer { animation: faq-open 0.35s var(--ease); }

@keyframes faq-open {
  from { opacity: 0; transform: translateY(-6px); }
}

@media (min-width: 960px) {
  .faq__inner { display: grid; grid-template-columns: 1fr 1.3fr; gap: 64px; align-items: start; }
}

@media (prefers-reduced-motion: reduce) {
  .faq__item[open] .faq__answer { animation: none; }
  .faq__icon { transition: none; }
}
</style>
