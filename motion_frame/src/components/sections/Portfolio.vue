<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import VideoCard from '@/components/ui/VideoCard.vue'
import VideoModal from '@/components/ui/VideoModal.vue'
import { portfolio } from '@/data/portfolio'
import { useReveal } from '@/composables/useReveal'
import type { PortfolioItem } from '@/types'

const root = ref<HTMLElement | null>(null)
const rail = ref<HTMLElement | null>(null)
const active = ref<PortfolioItem | null>(null)
const paused = ref(false)
const hasPreviews = computed(() => portfolio.some((item) => item.preview))
const atStart = ref(true)
const atEnd = ref(false)

useReveal(root)

// Лента листается пальцем; стрелки нужны тем, у кого мышь без горизонтальной прокрутки
function scrollRail(dir: 1 | -1) {
  const el = rail.value
  const card = el?.querySelector('li')
  if (!el || !card) return
  el.scrollBy({ left: dir * (card.clientWidth + 16), behavior: 'smooth' })
}

function onRailScroll() {
  const el = rail.value
  if (!el) return
  atStart.value = el.scrollLeft < 4
  atEnd.value = el.scrollLeft + el.clientWidth > el.scrollWidth - 4
}
</script>

<template>
  <section id="portfolio" ref="root" class="section portfolio" aria-labelledby="portfolio-title">
    <div class="container portfolio__head">
      <div class="section-head">
        <SplitHeading id="portfolio-title" class="section-title" text="Наши работы" />
        <p class="section-intro">Мы смонтировали больше 100 роликов. Здесь некоторые из них, нажмите, чтобы посмотреть со звуком.</p>
      </div>
      <div class="portfolio__controls">
        <button v-if="hasPreviews" type="button" class="portfolio__pause" :aria-pressed="paused" @click="paused = !paused">
          {{ paused ? 'Включить превью' : 'Остановить превью' }}
        </button>
        <button type="button" class="portfolio__arrow" aria-label="Предыдущие работы" :disabled="atStart" @click="scrollRail(-1)">
          <ArrowLeft :size="20" aria-hidden="true" />
        </button>
        <button type="button" class="portfolio__arrow" aria-label="Следующие работы" :disabled="atEnd" @click="scrollRail(1)">
          <ArrowRight :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>

    <ul ref="rail" class="portfolio__rail" aria-label="Работы" @scroll.passive="onRailScroll">
      <li v-for="item in portfolio" :key="item.id" data-reveal>
        <VideoCard :item="item" :paused="paused" @open="active = $event" />
      </li>
    </ul>

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

.portfolio__controls {
  display: flex;
  gap: 8px;
  margin-bottom: 48px;
}

.portfolio__pause,
.portfolio__arrow {
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, opacity 0.2s;
}

.portfolio__arrow {
  display: none;
  place-items: center;
  width: 44px;
  padding: 0;
}

.portfolio__arrow:not(:disabled):hover { background: var(--color-ink); color: var(--color-light); }
.portfolio__arrow:disabled { opacity: 0.35; cursor: default; }

/* Лента во всю ширину экрана, первая карточка на линии контейнера */
.portfolio__rail {
  --rail-pad: max(var(--gutter), (100% - var(--container)) / 2);
  display: flex;
  gap: 12px;
  padding-inline: var(--rail-pad);
  scroll-padding-inline: var(--rail-pad);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
}

.portfolio__rail::-webkit-scrollbar { display: none; }

.portfolio__rail > li {
  flex: 0 0 min(68vw, 300px);
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .portfolio__arrow { display: grid; }
  .portfolio__rail { gap: 16px; }
  .portfolio__rail > li { flex-basis: clamp(260px, 26vw, 360px); }
}
</style>
