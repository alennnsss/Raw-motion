<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PortfolioItem } from '@/types'

const props = defineProps<{ item: PortfolioItem | null }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement | null>(null)

// Нативный <dialog>: фокус внутри, Esc закрывает, фон недоступен с клавиатуры
watch(
  () => props.item,
  (item) => {
    if (item) dialog.value?.showModal()
    else dialog.value?.close()
  },
)
</script>

<template>
  <dialog ref="dialog" class="modal" :aria-label="item?.title" @close="emit('close')" @click.self="dialog?.close()">
    <div v-if="item" class="modal__body">
      <button class="modal__close" type="button" aria-label="Закрыть видео" @click="dialog?.close()">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" /></svg>
      </button>
      <video
        class="modal__video"
        :src="item.full"
        :poster="item.poster"
        :width="item.width"
        :height="item.height"
        controls
        autoplay
        playsinline
      ></video>
      <p class="modal__title">{{ item.title }}</p>
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  width: min(100vw - 32px, 520px);
  max-height: calc(100dvh - 32px);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
}

.modal::backdrop { background: rgb(10 10 10 / 0.88); }

.modal[open] { animation: modal-in 0.35s var(--ease); }

.modal__body { position: relative; display: grid; gap: 12px; }

/* Ролик показываем целиком, без обрезки */
.modal__video {
  width: 100%;
  height: auto;
  max-height: calc(100dvh - 120px);
  object-fit: contain;
  background: #000;
}

.modal__close {
  justify-self: end;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--gray-3);
  background: var(--color-bg);
  color: var(--color-text);
  cursor: pointer;
}

.modal__title { font-weight: 700; }

@keyframes modal-in {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
}

@media (prefers-reduced-motion: reduce) {
  .modal[open] { animation: none; }
}
</style>
