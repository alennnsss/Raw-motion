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

const reel = ref<HTMLVideoElement | null>(null)
const reelPaused = ref(false)
// Автозапуск браузеры разрешают только без звука: музыку посетитель включает сам
const reelSound = ref(false)
useInViewAutoplay(reel, reelPaused)
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
    .from('.hero__lead, .hero__actions, .hero__proof', { opacity: 0, y: 16, duration: 0.6, stagger: 0.08 }, '-=0.4')
    .from('.hero__reel', { opacity: 0, y: 40, duration: 0.9 }, '-=0.8')
    .from('.hero__corner', { scale: 0, duration: 0.5, stagger: 0.06 }, '-=0.5')
    .from('.hero__bars span:nth-child(2)', { scaleX: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.3')

  // Уходя со скроллом, шоурил обгоняет заголовок: лёгкая глубина
  gsap.to('.hero__reel', {
    yPercent: -8,
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
    <div class="container hero__grid">
      <div class="hero__copy">
        <SplitHeading id="hero-title" tag="h1" class="hero__title" text="Монтаж видео для соцсетей и рекламы" accent="видео" />

        <p class="hero__lead">
          Reels, TikTok, Shorts, YouTube и реклама. Вы присылаете исходники, мы возвращаем готовый ролик с субтитрами,
          графикой и звуком.
        </p>

        <div class="hero__actions">
          <AppButton href="#lead" arrow>Оставить заявку</AppButton>
          <AppButton href="#portfolio" variant="ghost">Смотреть работы</AppButton>
        </div>

        <ul class="hero__proof">
          <li v-for="stat in stats" :key="stat.label">
            <b class="hero__value">{{ stat.countTo ? `${count}+` : stat.value }}</b> {{ stat.label }}
          </li>
        </ul>
      </div>

      <div class="hero__reel">
        <video
          ref="reel"
          class="hero__video"
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
        <span class="hero__corner hero__corner--tl" aria-hidden="true"></span>
        <span class="hero__corner hero__corner--tr" aria-hidden="true"></span>
        <span class="hero__corner hero__corner--bl" aria-hidden="true"></span>
        <span class="hero__corner hero__corner--br" aria-hidden="true"></span>
        <span class="hero__bars" aria-hidden="true"><span></span><span></span></span>
        <button
          type="button"
          class="hero__reel-btn"
          :aria-pressed="reelPaused"
          :aria-label="reelPaused ? 'Запустить шоурил' : 'Остановить шоурил'"
          @click="reelPaused = !reelPaused"
        >
          <Play v-if="reelPaused" :size="16" fill="currentColor" aria-hidden="true" />
          <Pause v-else :size="16" fill="currentColor" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="hero__reel-btn hero__reel-sound"
          :aria-pressed="reelSound"
          :aria-label="reelSound ? 'Выключить звук шоурила' : 'Включить звук шоурила'"
          @click="reelSound = !reelSound"
        >
          <Volume2 v-if="reelSound" :size="18" aria-hidden="true" />
          <VolumeX v-else :size="18" aria-hidden="true" />
        </button>
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
  padding-block: 32px 64px;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  overflow: hidden;
}

.hero__grid { display: grid; gap: 40px; }

.hero__title { font-size: clamp(38px, 5.4vw, 76px); text-wrap: balance; }

.hero__lead {
  max-width: 30em;
  margin-top: 24px;
  font-size: clamp(17px, 1.5vw, 20px);
  line-height: 1.45;
  color: var(--muted);
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 32px;
}

.hero__actions > * { flex: 1 1 200px; }

/* Одна строка фактов вместо ряда больших цифр: цифра в голосе заголовков, подпись обычным текстом */
.hero__proof {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
  margin-top: 32px;
  font-size: 15px;
  color: var(--muted);
}

.hero__value {
  margin-right: 4px;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  /* «от 3 000 ₸» не должно разваливаться на две строки */
  white-space: nowrap;
}

/* Пропорция блока = пропорция видео (4:5): шоурил виден целиком, без обрезки */
.hero__reel {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-surface);
  color: var(--color-text);
}

.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Кнопки стоят внутри уголков видоискателя, не поверх линий */
.hero__reel-btn {
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

/* Звук наверху: внизу у шоурила свои титры, кнопка не должна их перекрывать */
.hero__reel-sound { top: 32px; bottom: auto; }

.hero__corner {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 0 solid var(--color-light);
}

.hero__corner--tl { top: 16px; left: 16px; border-top-width: 3px; border-left-width: 3px; transform-origin: top left; }
.hero__corner--tr { top: 16px; right: 16px; border-top-width: 3px; border-right-width: 3px; transform-origin: top right; }
.hero__corner--bl { bottom: 16px; left: 16px; border-bottom-width: 3px; border-left-width: 3px; transform-origin: bottom left; }
.hero__corner--br { bottom: 16px; right: 16px; border-bottom-width: 3px; border-right-width: 3px; transform-origin: bottom right; }

/* Мотив из символа: серая полоса — движение, лаймовая — плейхед */
.hero__bars {
  position: absolute;
  left: 50%;
  top: 18px;
  display: flex;
  gap: 8px;
  height: 10px;
  transform: translateX(-50%);
}

.hero__bars span:nth-child(1) { width: 36px; background: var(--gray-2); }
.hero__bars span:nth-child(2) { width: 96px; background: var(--color-accent); transform-origin: left; }

@media (prefers-reduced-motion: reduce) {
  .hero__reel-btn:not(.hero__reel-sound) { display: none; }
}

/* Бегущая строка с услугами внизу Hero, разделитель — серая полоса из символа */
.hero__ticker { margin-top: 56px; }

.hero__ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 40px;
  font-family: var(--font-display);
  font-size: clamp(20px, 2.6vw, 32px);
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.hero__ticker-item::after {
  content: '';
  width: 28px;
  height: 6px;
  background: var(--gray-2);
}

@media (min-width: 768px) {
  .hero { padding-block: 48px 80px; }
  .hero__actions > * { flex: 0 0 auto; }
}

/* Десктоп: заголовок слева, шоурил справа во весь рост первого экрана */
@media (min-width: 1024px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
    gap: 64px;
    align-items: center;
  }

  /* Ширину считаем от высоты экрана, чтобы 4:5 не ломалось и шоурил целиком влезал в первый экран */
  .hero__reel {
    width: min(100%, calc((100svh - var(--header-h) - 140px) * 0.8));
    justify-self: end;
  }
}
</style>
