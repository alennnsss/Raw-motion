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
      <div class="portfolio__head">
        <div class="section-head">
          <SplitHeading id="portfolio-title" class="section-title" text="Наши работы" />
          <p class="section-intro">Мы смонтировали больше 100 роликов. Здесь собраны некоторые из них.</p>
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
  gap: 0 24px;
}

.portfolio__pause {
  margin-bottom: 48px;
  padding: 10px 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}

.portfolio__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

@media (min-width: 1024px) {
  .portfolio__grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
}
</style>
