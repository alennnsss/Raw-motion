<script setup lang="ts">
import { computed, ref } from 'vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import VideoCard from '@/components/ui/VideoCard.vue'
import VideoModal from '@/components/ui/VideoModal.vue'
import { portfolio } from '@/data/portfolio'
import { useReveal } from '@/composables/useReveal'
import type { PortfolioItem } from '@/types'

const root = ref<HTMLElement | null>(null)
const active = ref<PortfolioItem | null>(null)
const paused = ref(false)
const hasPreviews = computed(() => portfolio.some((item) => item.preview))

useReveal(root)
</script>

<template>
  <section id="portfolio" ref="root" class="section portfolio" aria-labelledby="portfolio-title">
    <div class="container">
      <div class="section-head portfolio__head">
        <div>
          <p class="eyebrow">Портфолио</p>
          <SplitHeading id="portfolio-title" class="section-title" text="Работы, которые смотрят" accent="смотрят" />
          <p class="portfolio__lead">Больше 100 смонтированных роликов для экспертов, брендов и бизнеса.</p>
        </div>
        <button v-if="hasPreviews" type="button" class="portfolio__pause" :aria-pressed="paused" @click="paused = !paused">
          {{ paused ? 'Включить превью' : 'Остановить превью' }}
        </button>
      </div>

      <ul class="portfolio__grid">
        <li v-for="item in portfolio" :key="item.id" data-reveal>
          <VideoCard :item="item" :paused="paused" @open="active = $event" />
        </li>
      </ul>
    </div>

    <VideoModal :item="active" @close="active = null" />
  </section>
</template>

<style scoped>
.portfolio__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  max-width: none;
}

.portfolio__lead { margin-top: 20px; color: var(--color-muted); max-width: 32em; }

.portfolio__pause {
  padding: 10px 16px;
  border: 1px solid var(--gray-2);
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.portfolio__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 12px;
}

@media (min-width: 1024px) {
  .portfolio__grid { grid-template-columns: repeat(4, 1fr); gap: 32px 24px; }
}
</style>
