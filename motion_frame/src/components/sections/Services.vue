<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { services } from '@/data/services'
import { chooseTopic } from '@/composables/useLeadForm'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
const tablist = ref<HTMLElement | null>(null)
const active = ref(0)

useReveal(root)

// Вкладки по шаблону WAI-ARIA: стрелки переключают, Home/End прыгают к краям
function onKeydown(event: KeyboardEvent) {
  const last = services.length - 1
  const moves: Record<string, number> = {
    ArrowDown: active.value === last ? 0 : active.value + 1,
    ArrowRight: active.value === last ? 0 : active.value + 1,
    ArrowUp: active.value === 0 ? last : active.value - 1,
    ArrowLeft: active.value === 0 ? last : active.value - 1,
    Home: 0,
    End: last,
  }
  if (!(event.key in moves)) return
  event.preventDefault()
  active.value = moves[event.key]
  nextTick(() => tablist.value?.querySelectorAll<HTMLElement>('[role="tab"]')[active.value]?.focus())
}
</script>

<template>
  <section id="services" ref="root" class="section services dark" data-rise aria-labelledby="services-title">
    <div class="container">
      <div class="section-head">
        <SplitHeading id="services-title" class="section-title" text="Услуги" />
        <p class="section-intro">Монтируем видео для соцсетей, YouTube и рекламы. Можно заказать что-то одно или всё сразу.</p>
      </div>

      <div class="services__layout" data-reveal>
        <div ref="tablist" class="services__tabs" role="tablist" aria-label="Услуги" @keydown="onKeydown">
          <button
            v-for="(service, i) in services"
            :id="`service-tab-${i}`"
            :key="service.title"
            type="button"
            role="tab"
            class="services__tab"
            :aria-selected="active === i"
            :aria-controls="`service-panel-${i}`"
            :tabindex="active === i ? 0 : -1"
            @click="active = i"
          >
            {{ service.title }}
          </button>
        </div>

        <!-- v-show, а не v-if: все панели попадают в пререндер и видны поисковикам -->
        <div
          v-for="(service, i) in services"
          v-show="active === i"
          :id="`service-panel-${i}`"
          :key="service.title"
          class="panel"
          role="tabpanel"
          :aria-labelledby="`service-tab-${i}`"
          tabindex="0"
        >
          <div class="panel__head">
            <h3 class="panel__title">{{ service.title }}</h3>
            <p class="panel__text">{{ service.description }}</p>
          </div>
          <ul class="panel__grid">
            <li v-for="(item, j) in service.includes" :key="item" class="panel__item" :style="{ '--i': j }">
              <Check :size="20" class="panel__check" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>
          <AppButton href="#lead" arrow class="panel__cta" @click="chooseTopic(service.title)">Заказать</AppButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services { border-radius: var(--radius-lg); }

.services__layout { display: grid; gap: 32px; }

/* Мобильный: вкладки лентой с прокруткой */
.services__tabs {
  display: flex;
  gap: 8px;
  margin-inline: calc(-1 * var(--gutter));
  padding-inline: var(--gutter);
  overflow-x: auto;
  scrollbar-width: none;
}

.services__tab {
  flex: none;
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid var(--gray-2);
  border-radius: 999px;
  background: transparent;
  color: var(--color-muted);
  font: inherit;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

.services__tab[aria-selected='true'] {
  background: var(--color-light);
  border-color: var(--color-light);
  color: var(--color-ink);
}

.panel { display: grid; gap: 32px; animation: panel-in 0.45s var(--ease); }

.panel__head { display: grid; gap: 16px; max-width: 40em; }

.panel__title {
  font-family: var(--font-display);
  font-size: clamp(26px, 3.6vw, 44px);
  font-weight: 700;
  letter-spacing: -0.03em;
}

.panel__text { font-size: 18px; color: var(--muted); }

.panel__grid {
  display: grid;
  border-top: 1px solid var(--line);
}

.panel__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  font-size: 18px;
  font-weight: 500;
  /* Пункты приходят каскадом вслед за панелью; backwards держит их скрытыми до старта */
  animation: panel-in 0.45s var(--ease) backwards;
  animation-delay: calc(80ms + var(--i, 0) * 40ms);
}

.panel__check { flex: none; color: var(--color-accent); }

.panel__cta { justify-self: start; }

@keyframes panel-in {
  from { opacity: 0; transform: translateY(12px); }
}

@media (min-width: 640px) {
  .panel__grid { grid-template-columns: 1fr 1fr; }
  .panel__item:nth-child(odd) { padding-right: 24px; border-right: 1px solid var(--line); }
  .panel__item:nth-child(even) { padding-left: 24px; }
}

/* Десктоп: вертикальный список слева, как оглавление */
@media (min-width: 1024px) {
  .services__layout { grid-template-columns: 320px 1fr; gap: 64px; align-items: start; }

  .services__tabs {
    position: sticky;
    top: calc(var(--header-h) + 32px);
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding: 0;
    overflow: visible;
  }

  .services__tab {
    padding: 6px 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    text-align: left;
    white-space: normal;
    color: var(--gray-3);
  }

  .services__tab:hover { color: var(--color-muted); }

  .services__tab[aria-selected='true'] { background: transparent; color: var(--color-text); }
}

@media (prefers-reduced-motion: reduce) {
  .panel, .panel__item { animation: none; }
}
</style>
