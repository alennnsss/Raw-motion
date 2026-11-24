<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { useAnimation } from '@/composables/useAnimation'

const root = ref<HTMLElement | null>(null)
// В пререндере сразу 100: поисковик и пользователь без JS видят итоговое число
const count = ref(100)

useAnimation(root, (gsap) => {
  const counter = { value: 0 }
  count.value = 0

  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero__corner', { scale: 0, opacity: 0, duration: 0.6, stagger: 0.08 })
    .from('[data-word]', { yPercent: 110, duration: 0.9, stagger: 0.07 }, '-=0.3')
    .from('.plate__bg', { scaleX: 0, transformOrigin: 'left center', duration: 0.6 }, '-=0.5')
    .from('.hero__bar', { opacity: 0, scaleY: 0, transformOrigin: 'bottom', duration: 0.4, stagger: 0.12 }, '-=0.3')
    .from('.hero__lead, .hero__actions', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.4')
    .to(
      counter,
      {
        value: 100,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          count.value = Math.round(counter.value)
        },
      },
      '-=0.8',
    )

  return () => {
    count.value = 100
  }
})
</script>

<template>
  <section id="top" ref="root" class="hero" aria-labelledby="hero-title">
    <div class="container">
      <div class="hero__inner">
        <span class="hero__corner hero__corner--tl" aria-hidden="true"></span>
        <span class="hero__corner hero__corner--tr" aria-hidden="true"></span>
        <span class="hero__corner hero__corner--bl" aria-hidden="true"></span>
        <span class="hero__corner hero__corner--br" aria-hidden="true"></span>

        <p class="eyebrow">Студия видеомонтажа</p>
        <SplitHeading id="hero-title" tag="h1" class="hero__title" text="Монтаж видео, который досматривают" accent="досматривают" />
        <p class="hero__lead">
          Монтируем Reels, TikTok, Shorts, YouTube и рекламные ролики. Субтитры, графика и звук под ключ.
        </p>
        <div class="hero__actions">
          <AppButton href="#lead">Оставить заявку</AppButton>
          <AppButton href="#portfolio" variant="ghost">Смотреть работы</AppButton>
        </div>

        <div class="hero__stat">
          <div class="hero__bars" aria-hidden="true">
            <span class="hero__bar"></span>
            <span class="hero__bar"></span>
            <span class="hero__bar"></span>
          </div>
          <p>
            <span class="hero__count">{{ count }}+</span>
            <span class="hero__count-label">смонтированных роликов</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-block: 24px 56px; }

.hero__inner {
  position: relative;
  padding: 48px 20px 40px;
}

.hero__corner {
  position: absolute;
  width: 28px;
  height: 28px;
  border: 0 solid var(--color-light);
}

.hero__corner--tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; transform-origin: top left; }
.hero__corner--tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; transform-origin: top right; }
.hero__corner--bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; transform-origin: bottom left; }
.hero__corner--br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; transform-origin: bottom right; }

.hero__title {
  max-width: 11em;
  font-size: clamp(40px, 11vw, 104px);
}

.hero__lead {
  max-width: 34em;
  margin-top: 24px;
  font-size: 17px;
  color: var(--color-muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.hero__actions > * { flex: 1 1 200px; }

.hero__stat {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-top: 48px;
}

.hero__bars { display: flex; align-items: flex-end; gap: 4px; height: 48px; }
.hero__bar { width: 8px; }
.hero__bar:nth-child(1) { height: 60%; background: var(--gray-1); }
.hero__bar:nth-child(2) { height: 80%; background: var(--gray-2); }
.hero__bar:nth-child(3) { height: 100%; background: var(--gray-3); }

.hero__count {
  display: block;
  min-width: 3.2ch;
  font-size: 48px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hero__count-label {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-muted);
}

@media (min-width: 768px) {
  .hero { padding-block: 48px 96px; }
  .hero__inner { padding: 80px 64px 64px; }
  .hero__actions > * { flex: 0 0 auto; }
}
</style>
