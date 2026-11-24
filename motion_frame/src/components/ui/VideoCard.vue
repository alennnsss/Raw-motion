<script setup lang="ts">
import { ref, toRef } from 'vue'
import type { PortfolioItem } from '@/types'
import { useInViewAutoplay } from '@/composables/useInViewAutoplay'

const props = defineProps<{ item: PortfolioItem; paused: boolean }>()
const emit = defineEmits<{ open: [item: PortfolioItem] }>()

const video = ref<HTMLVideoElement | null>(null)
useInViewAutoplay(video, toRef(props, 'paused'))
</script>

<template>
  <article class="card">
    <button
      v-if="item.full"
      type="button"
      class="card__media"
      :style="{ aspectRatio: `${item.width} / ${item.height}` }"
      :aria-label="`Смотреть: ${item.title}`"
      @click="emit('open', item)"
    >
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
        preload="none"
        aria-hidden="true"
      ></video>
      <img v-else-if="item.poster" class="card__video" :src="item.poster" :width="item.width" :height="item.height" alt="" loading="lazy" />
      <span class="card__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </span>
    </button>
    <div v-else class="card__media card__media--placeholder" :style="{ aspectRatio: `${item.width} / ${item.height}` }">
      <span class="card__soon">Работа скоро появится</span>
    </div>
    <p class="card__category">{{ item.category }}</p>
    <h3 class="card__title">{{ item.title }}</h3>
  </article>
</template>

<style scoped>
.card { display: grid; gap: 10px; }

.card__media {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  overflow: hidden;
  background: var(--color-surface);
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
.card__media:focus-visible::after {
  opacity: 1;
  transform: scale(1);
}

/* Чужой ролик показываем целиком, без кадрирования */
.card__video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.card__play {
  position: absolute;
  left: 16px;
  bottom: 16px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: var(--color-accent);
  color: var(--color-ink);
}

.card__media--placeholder {
  display: grid;
  place-items: center;
  cursor: default;
  border: 1px dashed var(--gray-2);
}

.card__media--placeholder::after { display: none; }

.card__soon { font-size: 13px; color: var(--color-muted); }

.card__category {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.card__title { font-size: 20px; font-weight: 700; letter-spacing: -0.01em; }

@media (prefers-reduced-motion: reduce) {
  .card__media::after { transition: none; transform: none; }
}
</style>
