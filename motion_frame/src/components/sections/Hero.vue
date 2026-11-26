<script setup lang="ts">
import { ref } from 'vue'
import { Pause, Play, Volume2, VolumeX } from 'lucide-vue-next'
import AppButton from '@/components/ui/AppButton.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import Marquee from '@/components/animations/Marquee.vue'
import { stats } from '@/data/stats'
import { services } from '@/data/services'
import { useAnimation } from '@/composables/useAnimation'
import { useInViewAutoplay } from '@/composables/useInViewAutoplay'

const root = ref<HTMLElement | null>(null)

// Две версии шоурила: CSS показывает одну, скрытая не попадает в зону видимости и не играет
const reelMobile = ref<HTMLVideoElement | null>(null)
const reelDesktop = ref<HTMLVideoElement | null>(null)
const reelPaused = ref(false)
// Автозапуск браузеры разрешают только без звука: музыку посетитель включает сам
const reelSound = ref(false)
useInViewAutoplay(reelMobile, reelPaused)
useInViewAutoplay(reelDesktop, reelPaused)
const counted = stats.find((stat) => stat.countTo)
// В пререндере сразу итоговое число: его видят поисковик и пользователь без JS
const count = ref(counted?.countTo ?? 0)

useAnimation(root, (gsap) => {
  const counter = { value: 0 }
  const target = counted?.countTo ?? 0

  const tl = gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('[data-word]', { yPercent: 110, duration: 0.9, stagger: 0.06 })
    .from('.plate__bg', { scaleX: 0, transformOrigin: 'left center', duration: 0.6 }, '-=0.5')
    .from('.hero__actions', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
    .from('.hero__reel', { opacity: 0, y: 40, duration: 0.9 }, '-=0.4')
    .from('.hero__corner', { scale: 0, duration: 0.5, stagger: 0.06 }, '-=0.5')
    .from('.hero__bars span:nth-child(2)', { scaleX: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.3')
    .from('.hero__aside > *', { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, '-=0.8')

  // Уходя со скроллом, сетка с шоурилом обгоняет заголовок: лёгкая глубина
  gsap.to('.hero__grid', {
    yPercent: -10,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true },
  })

  if (target) {
    count.value = 0
    tl.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        count.value = Math.round(counter.value)
      },
    }, '-=0.6')
  }

  return () => {
    count.value = target
  }
})
</script>

<template>
  <section id="top" ref="root" class="hero dark" aria-labelledby="hero-title">
    <div class="container">
      <SplitHeading id="hero-title" tag="h1" class="hero__title" text="Монтаж видео для соцсетей и рекламы" accent="видео" />

      <div class="hero__actions">
        <AppButton href="#lead" arrow>Оставить заявку</AppButton>
        <AppButton href="#portfolio" variant="dark" arrow>Смотреть работы</AppButton>
      </div>

      <div class="hero__grid">
        <div class="hero__reel">
          <video
            ref="reelMobile"
            class="hero__video hero__video--mobile"
            src="/videos/showreel/showreel-mobile.mp4"
            poster="/videos/showreel/showreel-mobile.jpg"
            width="864"
            height="1080"
            :muted="!reelSound"
            playsinline
            loop
            preload="none"
            aria-hidden="true"
          ></video>
          <video
            ref="reelDesktop"
            class="hero__video hero__video--desktop"
            src="/videos/showreel/showreel-desktop.mp4"
            poster="/videos/showreel/showreel-desktop.jpg"
            width="1440"
            height="1080"
            :muted="!reelSound"
            playsinline
            loop
            preload="none"
            aria-hidden="true"
          ></video>
          <span class="hero__corner hero__corner--tl" aria-hidden="true"></span>
          <span class="hero__corner hero__corner--tr" aria-hidden="true"></span>
          <span class="hero__corner hero__corner--bl" aria-hidden="true"></span>
          <span class="hero__corner hero__corner--br" aria-hidden="true"></span>
          <span class="hero__bars" aria-hidden="true"><span></span><span></span></span>
          <a href="#portfolio" class="hero__reel-label">
            <Play :size="16" fill="currentColor" aria-hidden="true" />
            Шоурил и работы
          </a>
          <button
            type="button"
            class="hero__reel-pause"
            :aria-pressed="reelPaused"
            :aria-label="reelPaused ? 'Запустить шоурил' : 'Остановить шоурил'"
            @click="reelPaused = !reelPaused"
          >
            <Play v-if="reelPaused" :size="16" fill="currentColor" aria-hidden="true" />
            <Pause v-else :size="16" fill="currentColor" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="hero__reel-pause hero__reel-sound"
            :aria-pressed="reelSound"
            :aria-label="reelSound ? 'Выключить звук шоурила' : 'Включить звук шоурила'"
            @click="reelSound = !reelSound"
          >
            <Volume2 v-if="reelSound" :size="18" aria-hidden="true" />
            <VolumeX v-else :size="18" aria-hidden="true" />
          </button>
        </div>

        <div class="hero__aside">
          <p class="hero__lead">
            Монтируем Reels, TikTok, Shorts, YouTube и рекламу. Делаем субтитры, графику и звук. Вы присылаете исходники,
            мы возвращаем готовый ролик.
          </p>
          <dl class="hero__stats">
            <div v-for="stat in stats" :key="stat.label" class="hero__stat">
              <dt class="hero__value">{{ stat.countTo ? `${count}+` : stat.value }}</dt>
              <dd class="hero__label">{{ stat.label }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <Marquee :items="services" label="список услуг" :duration="40" class="hero__ticker">
      <template #default="{ item }">
        <span class="hero__ticker-item">{{ item.title }}</span>
      </template>
    </Marquee>
  </section>
</template>

<style scoped>
.hero {
  padding-block: 40px 72px;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.hero__title {
  max-width: 13em;
  font-size: clamp(44px, 9.5vw, 112px);
  line-height: 1;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}

.hero__actions > * { flex: 1 1 220px; }

.hero__grid {
  display: grid;
  gap: 32px;
  margin-top: 48px;
}

/* Пропорция блока = пропорция видео: шоурил виден целиком, без обрезки */
.hero__reel {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-bg);
  color: var(--color-text);
}

.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__video--desktop { display: none; }

/* Подпись и пауза стоят внутри нижних уголков видоискателя, не поверх линий */
.hero__reel-pause {
  position: absolute;
  right: 32px;
  bottom: 32px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--gray-2);
  border-radius: 999px;
  background: rgb(10 10 10 / 0.7);
  color: var(--color-text);
  cursor: pointer;
}

.hero__reel-sound { top: 32px; bottom: auto; }

.hero__corner {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 0 solid var(--color-light);
}

.hero__corner--tl { top: 20px; left: 20px; border-top-width: 3px; border-left-width: 3px; transform-origin: top left; }
.hero__corner--tr { top: 20px; right: 20px; border-top-width: 3px; border-right-width: 3px; transform-origin: top right; }
.hero__corner--bl { bottom: 20px; left: 20px; border-bottom-width: 3px; border-left-width: 3px; transform-origin: bottom left; }
.hero__corner--br { bottom: 20px; right: 20px; border-bottom-width: 3px; border-right-width: 3px; transform-origin: bottom right; }

/* Мотив из символа: серая полоса — движение, лаймовая — плейхед */
.hero__bars {
  position: absolute;
  left: 50%;
  top: 22px;
  display: flex;
  gap: 8px;
  height: 10px;
  transform: translateX(-50%);
}

.hero__bars span:nth-child(1) { width: 36px; background: var(--gray-2); }
.hero__bars span:nth-child(2) { width: 120px; background: var(--color-accent); transform-origin: left; }

.hero__reel-label {
  position: absolute;
  left: 32px;
  bottom: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 14px;
  font-size: 15px;
  border-radius: 999px;
  background: rgb(10 10 10 / 0.7);
  color: inherit;
  font-weight: 600;
  text-decoration: none;
  box-shadow: inset 0 -2px 0 var(--color-light);
}

.hero__reel-label:hover,
.hero__reel-label:focus-visible { box-shadow: inset 0 -2px 0 var(--color-accent); }

@media (prefers-reduced-motion: reduce) {
  .hero__reel-pause { display: none; }
}

.hero__lead {
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.35;
  letter-spacing: -0.015em;
}

/* Перечисление без сетки и линий: крупная цифра, под ней подпись */
.hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 32px 40px;
  margin-top: 40px;
}

.hero__stat {
  display: grid;
  gap: 8px;
  align-content: start;
  flex: 1 1 140px;
}

.hero__value {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  /* «от 3 000 ₸» не должно разваливаться на две строки */
  white-space: nowrap;
}

.hero__label { font-size: 15px; line-height: 1.35; color: var(--muted); }

/* Бегущая строка с услугами внизу Hero, разделитель — лаймовая звёздочка */
.hero__ticker { margin-top: 56px; }

.hero__ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 48px;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 600;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.hero__ticker-item::after { content: '✦'; color: var(--color-accent); font-size: 0.6em; }

@media (min-width: 768px) {
  .hero { padding-block: 72px 96px; }
  .hero__actions > * { flex: 0 0 auto; }
}

@media (min-width: 1024px) {
  .hero__grid { grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 72px; }
  .hero__reel { aspect-ratio: 4 / 3; }
  .hero__video--mobile { display: none; }
  .hero__video--desktop { display: block; }
}
</style>
