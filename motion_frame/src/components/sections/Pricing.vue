<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { formatPrice, pricing } from '@/data/pricing'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="pricing" ref="root" class="section section--light pricing" aria-labelledby="pricing-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Цены</p>
        <SplitHeading id="pricing-title" class="section-title" text="Прозрачные цены на монтаж" />
      </div>

      <table class="pricing__table">
        <caption class="visually-hidden">Стоимость услуг видеомонтажа</caption>
        <thead class="visually-hidden">
          <tr><th scope="col">Услуга</th><th scope="col">Цена</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in pricing" :key="item.service" class="pricing__row" data-reveal>
            <th scope="row" class="pricing__service">{{ item.service }}</th>
            <td class="pricing__price">{{ formatPrice(item.price) }}</td>
          </tr>
        </tbody>
      </table>

      <p class="pricing__note">
        Итоговая цена зависит от длительности и сложности. Напишите, и мы назовём точную стоимость.
      </p>
      <AppButton href="#lead" class="pricing__cta">Узнать точную цену</AppButton>
    </div>
  </section>
</template>

<style scoped>
.pricing__table {
  width: 100%;
  border-collapse: collapse;
}

.pricing__row { border-bottom: 1px solid rgb(10 10 10 / 0.14); }
.pricing__row:first-child { border-top: 1px solid rgb(10 10 10 / 0.14); }

.pricing__service,
.pricing__price {
  padding: 20px 0;
  text-align: left;
  vertical-align: baseline;
}

.pricing__service { padding-right: 16px; font-weight: 500; font-size: 16px; }

.pricing__price {
  font-weight: 800;
  font-size: 20px;
  white-space: nowrap;
  text-align: right;
}

.pricing__note {
  max-width: 36em;
  margin-top: 24px;
  color: var(--color-ink-muted);
}

.pricing__cta { margin-top: 32px; }

@media (min-width: 768px) {
  .pricing__service { font-size: 19px; }
  .pricing__price { font-size: 26px; }
}
</style>
