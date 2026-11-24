<script setup lang="ts">
import { ref } from 'vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { processSteps } from '@/data/process'
import { useAnimation } from '@/composables/useAnimation'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)

useReveal(root)

// Десктоп: секция закрепляется (pin), шаги едут влево вместе со скроллом (scrub), плейхед бежит по таймлайну
useAnimation(
  root,
  (gsap) => {
    const el = root.value
    const track = el?.querySelector<HTMLElement>('.process__track')
    if (!el || !track) return

    el.classList.add('is-horizontal')
    const distance = () => Math.max(0, track.scrollWidth - (track.parentElement?.clientWidth ?? 0))

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      })
      .to(track, { x: () => -distance(), ease: 'none' }, 0)
      .fromTo('.process__playhead', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)

    return () => el.classList.remove('is-horizontal')
  },
  '(min-width: 960px) and (prefers-reduced-motion: no-preference)',
)
</script>

<template>
  <section id="process" ref="root" class="section process" aria-labelledby="process-title">
    <div class="container">
      <div class="section-head">
        <SplitHeading id="process-title" class="section-title" text="Как проходит заказ" />
        <p class="section-intro">Пять шагов от заявки до готового файла.</p>
      </div>

      <div class="process__timeline" aria-hidden="true">
        <span class="process__playhead"></span>
      </div>

      <div class="process__viewport">
        <ol class="process__track">
          <li v-for="(step, i) in processSteps" :key="step.title" class="process__step" data-reveal>
            <div class="process__meta">
              <span class="process__icon"><component :is="step.icon" :size="22" :stroke-width="1.75" aria-hidden="true" /></span>
              <span class="process__index">Шаг {{ i + 1 }}</span>
            </div>
            <h3 class="process__name">{{ step.title }}</h3>
            <p class="process__text">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process { overflow: hidden; }

.process__timeline {
  position: relative;
  height: 2px;
  margin-bottom: 32px;
  background: var(--gray-1);
}

.process__playhead {
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  transform-origin: left;
}

.process__track {
  display: grid;
  gap: 32px;
}

.process__step {
  position: relative;
  display: grid;
  gap: 10px;
  padding-left: 24px;
  border-left: 2px solid var(--gray-2);
}

.process__meta { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }

.process__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--gray-2);
}

.process__index { font-size: 14px; font-weight: 500; color: var(--color-muted); }

.process__name { font-size: 26px; }

.process__text { font-size: 16px; color: var(--color-muted); max-width: 26em; }

@media (min-width: 960px) {
  .process__track { grid-template-columns: repeat(5, 1fr); gap: 24px; }
  .process__step { padding: 24px 0 0; border-left: 0; border-top: 2px solid var(--gray-2); }

  /* Горизонтальный режим включается только вместе с анимацией */
  .is-horizontal .process__track {
    display: flex;
    width: max-content;
    gap: 64px;
  }

  .is-horizontal .process__step { width: 380px; }
  .is-horizontal .process__name { font-size: 40px; }
}
</style>
