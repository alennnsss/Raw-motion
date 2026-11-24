<script setup lang="ts">
import { ref } from 'vue'
import Marquee from '@/components/animations/Marquee.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { services } from '@/data/services'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="services" ref="root" class="section services" aria-labelledby="services-title">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">Услуги</p>
        <SplitHeading id="services-title" class="section-title" text="Монтаж под любую площадку" accent="любую" />
      </div>
    </div>

    <div class="services__ticker" aria-hidden="true">
      <Marquee :items="services" label="услуги" :min-items="6" :duration="40">
        <template #default="{ item }">
          <span class="services__tick">{{ item.title }}</span>
        </template>
      </Marquee>
    </div>

    <div class="container">
      <ul class="services__grid">
        <li v-for="(service, i) in services" :key="service.title" class="services__card" data-reveal>
          <span class="services__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="services__name">{{ service.title }}</h3>
          <p class="services__text">{{ service.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.services__ticker { margin-bottom: 48px; }

/* Лента декоративная, полный список услуг ниже, поэтому кнопку паузы прячем вместе с ней */
.services__ticker :deep(.marquee__toggle) { display: none; }

.services__tick {
  font-size: clamp(24px, 6vw, 44px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px var(--gray-3);
  white-space: nowrap;
}

.services__grid {
  display: grid;
  gap: 1px;
  background: var(--gray-1);
  border: 1px solid var(--gray-1);
}

.services__card {
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 28px 20px;
  background: var(--color-bg);
}

.services__num {
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--color-muted);
}

.services__name { font-size: 22px; letter-spacing: -0.01em; }

.services__text { color: var(--color-muted); }

@media (min-width: 640px) {
  .services__grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .services__grid { grid-template-columns: repeat(3, 1fr); }
  .services__card { padding: 40px 32px; }
}
</style>
