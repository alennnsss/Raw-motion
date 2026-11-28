<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { formatAmount, formatPrice, pricing } from '@/data/pricing'
import { chooseTopic } from '@/composables/useLeadForm'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="pricing" ref="root" class="section pricing" aria-labelledby="pricing-title">
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
            <div>
              <p class="price__value">{{ formatPrice(item.price) }}</p>
              <p v-if="item.units" class="price__unit">{{ formatAmount(item.price / item.units) }} за ролик</p>
            </div>
            <AppButton href="#lead" variant="dark" arrow class="price__cta" @click="chooseTopic(item.service)">
              Заказать<span class="visually-hidden">: {{ item.service }}</span>
            </AppButton>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.pricing { padding-top: 0; }

.pricing__grid { display: grid; gap: 8px; }

.price {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--color-card);
}

.price__head { display: grid; gap: 8px; }

.price__name { font-size: 24px; line-height: 1.15; letter-spacing: -0.025em; }

.price__note { color: var(--muted); }

.price__foot { display: grid; gap: 20px; }

.price__value {
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.price__unit { margin-top: 8px; color: var(--muted); }

/* На светлой и на лаймовой карточке кнопка чёрная, а не серая */
.price__cta { background: var(--color-ink); }

/* Пакет — единственная лаймовая карточка: на лайме только чёрный текст */
.price--featured { background: var(--color-accent); --muted: var(--color-ink); }

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .price { transition: transform 0.25s var(--ease); }
  .price:hover { transform: translateY(-6px); }
}

@media (min-width: 640px) {
  .pricing__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .pricing__grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .price { padding: 32px; min-height: 340px; }
}
</style>
