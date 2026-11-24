<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { formatAmount, formatPrice, pricing } from '@/data/pricing'
import { chooseTopic } from '@/composables/useLeadForm'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="pricing" ref="root" class="section section--light pricing" aria-labelledby="pricing-title">
    <div class="container">
      <div class="section-head">
        <SplitHeading id="pricing-title" class="section-title" text="Цены" />
        <p class="section-intro">
          Указана минимальная стоимость. Итоговая зависит от длительности и сложности. Напишите, и мы назовём точную цену.
        </p>
      </div>

      <ul class="pricing__grid">
        <li v-for="item in pricing" :key="item.service" class="price" :class="{ 'price--featured': item.units }" data-reveal>
          <div class="price__head">
            <h3 class="price__name">{{ item.service }}</h3>
            <p class="price__note">{{ item.note }}</p>
          </div>
          <div class="price__foot">
            <p class="price__value">{{ formatPrice(item.price) }}</p>
            <p v-if="item.units" class="price__unit">{{ formatAmount(item.price / item.units) }} за ролик</p>
            <a href="#lead" class="price__cta" @click="chooseTopic(item.service)">
              Заказать
              <ArrowRight :size="18" aria-hidden="true" />
              <span class="visually-hidden">: {{ item.service }}</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.pricing__grid {
  display: grid;
  gap: 12px;
}

.price {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  padding: 24px;
  border: 1px solid rgb(10 10 10 / 0.12);
  background: #fbfbf8;
  transition: border-color 0.25s;
}

.price:hover { border-color: rgb(10 10 10 / 0.4); }

.price__head { display: grid; gap: 8px; }

.price__name { font-size: 22px; line-height: 1.15; letter-spacing: -0.01em; }

.price__note { color: var(--color-ink-muted); }

.price__foot { display: grid; gap: 16px; }

.price__value {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.price__unit { margin-top: -8px; font-weight: 500; color: var(--color-ink-muted); }

.price__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 12px 20px;
  border: 1px solid var(--color-ink);
  color: var(--color-ink);
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.price__cta:hover { background: var(--color-ink); color: var(--color-light); }

.price__cta svg { transition: transform 0.25s var(--ease); }
.price__cta:hover svg { transform: translateX(4px); }

/* Пакет: тёмная карточка, единственный лайм в секции */
.price--featured {
  background: var(--color-ink);
  border-color: var(--color-ink);
  color: var(--color-light);
}

.price--featured:hover { border-color: var(--color-ink); }

.price--featured .price__note,
.price--featured .price__unit { color: var(--color-muted); }

.price--featured .price__cta {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-ink);
}

.price--featured .price__cta:focus-visible { outline-color: var(--color-accent); }

@media (min-width: 640px) {
  .pricing__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .pricing__grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .price { padding: 32px; min-height: 300px; }
}

@media (prefers-reduced-motion: reduce) {
  .price__cta svg { transition: none; }
  .price__cta:hover svg { transform: none; }
}
</style>
