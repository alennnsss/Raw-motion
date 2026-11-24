<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import Marquee from '@/components/animations/Marquee.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { services } from '@/data/services'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
useReveal(root)

const lastIndex = services.length - 1
</script>

<template>
  <section id="services" ref="root" class="section services" aria-labelledby="services-title">
    <div class="container">
      <div class="section-head">
        <SplitHeading id="services-title" class="section-title" text="Услуги" />
        <p class="section-intro">
          Монтируем видео для соцсетей, YouTube и рекламы. Можно заказать что-то одно или всё сразу.
        </p>
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
        <li
          v-for="(service, i) in services"
          :key="service.title"
          class="card"
          :class="{ 'card--featured': i === 0, 'card--wide': i === lastIndex }"
          data-reveal
        >
          <span class="card__icon">
            <component :is="service.icon" :size="i === 0 ? 28 : 24" :stroke-width="1.75" aria-hidden="true" />
          </span>
          <div class="card__body">
            <h3 class="card__title">{{ service.title }}</h3>
            <p class="card__text">{{ service.description }}</p>
            <ul v-if="service.tags" class="card__tags" aria-label="Площадки и формат">
              <li v-for="tag in service.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
          <a v-if="i === lastIndex" href="#pricing" class="card__link">
            Смотреть цены
            <ArrowRight :size="18" aria-hidden="true" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.services__ticker { margin-bottom: 40px; }

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
  gap: 12px;
}

.card {
  display: grid;
  gap: 20px;
  align-content: start;
  padding: 24px;
  border: 1px solid var(--gray-1);
  background: var(--color-surface);
  transition: border-color 0.25s;
}

.card:hover { border-color: var(--gray-2); }

.card__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--gray-2);
  color: var(--color-light);
  transition: transform 0.3s var(--ease);
}

.card:hover .card__icon { transform: translateY(-3px); }

.card__body { display: grid; gap: 10px; }

.card__title { font-size: 22px; line-height: 1.15; letter-spacing: -0.01em; }

.card__text { font-size: 16px; color: var(--color-muted); max-width: 34em; }

/* Главная услуга: светлая карточка, крупнее, с площадками */
.card--featured {
  gap: 28px;
  padding: 28px 24px;
  background: var(--color-light);
  border-color: var(--color-light);
  color: var(--color-ink);
}

.card--featured:hover { border-color: var(--color-light); }

.card--featured .card__icon {
  width: 56px;
  height: 56px;
  border: 0;
  background: var(--color-accent);
  color: var(--color-ink);
}

.card--featured .card__title { font-size: clamp(28px, 7vw, 40px); }

.card--featured .card__text { font-size: 17px; color: var(--color-ink-muted); }

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.card__tags li {
  padding: 6px 12px;
  border: 1px solid rgb(10 10 10 / 0.18);
  font-size: 14px;
  font-weight: 500;
}

.card__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-self: start;
  min-height: 44px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 6px;
  text-decoration-color: var(--color-accent);
}

.card__link svg { transition: transform 0.25s var(--ease); }
.card__link:hover svg { transform: translateX(4px); }

@media (min-width: 768px) {
  .services__grid { grid-template-columns: repeat(6, 1fr); }
  .card { grid-column: span 3; }
  .card--featured { grid-column: span 6; padding: 40px; }

  .card--wide {
    grid-column: span 6;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 24px;
  }
}

@media (min-width: 1024px) {
  .card { grid-column: span 2; padding: 32px; }
  .card--featured { grid-column: span 4; grid-row: span 2; align-content: space-between; padding: 48px; }
  .card:nth-child(4), .card:nth-child(5) { grid-column: span 3; }
  .card--wide { grid-column: span 6; }
}

@media (prefers-reduced-motion: reduce) {
  .card__icon, .card__link svg { transition: none; }
  .card:hover .card__icon, .card__link:hover svg { transform: none; }
}
</style>
