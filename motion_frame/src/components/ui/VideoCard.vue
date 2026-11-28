<script setup lang="ts">
import { ref, toRef } from 'vue'
import { Play } from 'lucide-vue-next'
import type { PortfolioItem } from '@/types'
import { useInViewAutoplay } from '@/composables/useInViewAutoplay'

const props = defineProps<{ item: PortfolioItem; paused: boolean }>()
const emit = defineEmits<{ open: [item: PortfolioItem] }>()

const video = ref<HTMLVideoElement | null>(null)
useInViewAutoplay(video, toRef(props, 'paused'))
</script>

<template>
  <article class="card">
    <button v-if="item.preview" type="button" class="card__media" :aria-label="`Смотреть: ${item.title}`" @click="emit('open', item)">
      <video
        v-if="item.preview"
        ref="video"
        class="card__video"
        :src="item.preview"
        :poster="item.poster"
        :width="item.width"
        :height="item.height"
        muted
        playsinline
        loop
        preload="metadata"
        aria-hidden="true"
      ></video>
      <img v-else-if="item.poster" class="card__video" :src="item.poster" :width="item.width" :height="item.height" alt="" loading="lazy" />
      <span class="card__play" aria-hidden="true"><Play :size="18" fill="currentColor" /></span>
    </button>

    <div v-else class="card__media card__media--placeholder">
      <span class="card__placeholder frame">
        <Play :size="26" :stroke-width="1.5" aria-hidden="true" />
        <span class="card__soon">Скоро здесь будет ролик</span>
      </span>
    </div>

    <footer class="card__caption">
      <h3 class="card__title">{{ item.title }}</h3>
      <span class="card__tag">{{ item.category }}</span>
    </footer>
  </article>
</template>

<style scoped>
.card { display: grid; gap: 14px; }

.card__caption { display: grid; gap: 2px; padding-inline: 2px; }

.card__title { font-size: 17px; font-weight: 600; letter-spacing: -0.015em; line-height: 1.25; }

.card__tag { font-size: 14px; color: var(--muted); }

.card__media {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 9 / 16;
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
}

/* Лаймовая рамка-видоискатель при наведении */
.card__media::after {
  content: '';
  position: absolute;
  inset: 10px;
  --frame-color: var(--color-accent);
  --frame-len: 22px;
  --frame-w: 2px;
  background:
    linear-gradient(var(--frame-color), var(--frame-color)) top left / var(--frame-len) var(--frame-w),
    linear-gradient(var(--frame-color), var(--frame-color)) top left / var(--frame-w) var(--frame-len),
    linear-gradient(var(--frame-color), var(--frame-color)) top right / var(--frame-len) var(--frame-w),
    linear-gradient(var(--frame-color), var(--frame-color)) top right / var(--frame-w) var(--frame-len),
    linear-gradient(var(--frame-color), var(--frame-color)) bottom left / var(--frame-len) var(--frame-w),
    linear-gradient(var(--frame-color), var(--frame-color)) bottom left / var(--frame-w) var(--frame-len),
    linear-gradient(var(--frame-color), var(--frame-color)) bottom right / var(--frame-len) var(--frame-w),
    linear-gradient(var(--frame-color), var(--frame-color)) bottom right / var(--frame-w) var(--frame-len);
  background-repeat: no-repeat;
  opacity: 0;
  transform: scale(1.06);
  transition: opacity 0.3s, transform 0.4s var(--ease);
  pointer-events: none;
}

.card__media:hover::after,
.card__media:focus-visible::after { opacity: 1; transform: scale(1); }

/* Чужой ролик показываем целиком, без кадрирования */
.card__video { width: 100%; height: 100%; object-fit: contain; }

.card__play {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-ink);
}

.card__media--placeholder {
  display: grid;
  cursor: default;
  background: linear-gradient(170deg, #1d1d1b, var(--color-bg));
}

.card__media--placeholder::after { display: none; }

.card__placeholder {
  --frame-color: var(--gray-3);
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  margin: 12px;
  padding: 16px;
  color: var(--color-muted);
  text-align: center;
}

.card__soon { font-size: 14px; }

@media (prefers-reduced-motion: reduce) {
  .card__media::after { transition: none; transform: none; }
}
</style>
