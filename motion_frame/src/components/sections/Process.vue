<script setup lang="ts">
import { ref } from 'vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { processSteps } from '@/data/process'
import { useAnimation } from '@/composables/useAnimation'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)

useReveal(root)

// Плейхед монтажного таймлайна: заполняется, пока секция проезжает через экран
useAnimation(root, (gsap) => {
  gsap.fromTo(
    '.process__playhead',
    { scaleX: 0 },
    { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.process__grid', start: 'top 85%', end: 'bottom 60%', scrub: 0.5 } },
  )
})
</script>

<template>
  <section id="process" ref="root" class="section process" aria-labelledby="process-title">
    <div class="container">
      <div class="section-head">
        <SplitHeading id="process-title" class="section-title" text="Как проходит заказ" />
        <p class="section-intro">Пять шагов от заявки до готового файла.</p>
      </div>

      <div class="process__timeline" aria-hidden="true"><span class="process__playhead"></span></div>

      <ol class="process__grid">
        <li v-for="(step, i) in processSteps" :key="step.title" class="process__step" data-reveal>
          <div class="process__meta">
            <span class="process__num">{{ i + 1 }}</span>
            <component :is="step.icon" :size="24" :stroke-width="1.75" aria-hidden="true" />
          </div>
          <div class="process__body">
            <h3 class="process__name">{{ step.title }}</h3>
            <p class="process__text">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.process__timeline {
  position: relative;
  height: 3px;
  border-radius: 3px;
  background: var(--line);
  overflow: hidden;
}

.process__playhead {
  position: absolute;
  inset: 0;
  background: var(--color-ink);
  transform-origin: left;
}

.process__grid { display: grid; }

.process__step {
  display: grid;
  gap: 32px;
  padding: 28px 0;
  border-bottom: 1px solid var(--line);
}

.process__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
}

.process__num { font-size: 15px; font-weight: 500; font-variant-numeric: tabular-nums; }

.process__body { display: grid; gap: 8px; }

.process__name { font-size: 26px; letter-spacing: -0.025em; }

.process__text { color: var(--muted); max-width: 28em; }

@media (min-width: 960px) {
  .process__grid { grid-template-columns: repeat(5, 1fr); }

  .process__step {
    gap: 96px;
    padding: 28px 24px 32px;
    border-bottom: 0;
    border-right: 1px solid var(--line);
  }

  .process__step:first-child { padding-left: 0; }
  .process__step:last-child { border-right: 0; }
}
</style>
