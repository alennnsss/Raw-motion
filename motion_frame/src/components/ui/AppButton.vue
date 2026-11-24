<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    type?: 'button' | 'submit'
    variant?: 'primary' | 'dark' | 'light' | 'ghost'
    arrow?: boolean
    disabled?: boolean
  }>(),
  { to: undefined, href: undefined, type: 'button', variant: 'primary', arrow: false, disabled: false },
)
</script>

<template>
  <RouterLink v-if="to" :to="to" class="btn" :class="`btn--${variant}`">
    <slot /><ArrowRight v-if="arrow" class="btn__arrow" :size="18" aria-hidden="true" />
  </RouterLink>
  <a v-else-if="href" :href="href" class="btn" :class="`btn--${variant}`">
    <slot /><ArrowRight v-if="arrow" class="btn__arrow" :size="18" aria-hidden="true" />
  </a>
  <button v-else :type="type" :disabled="disabled" class="btn" :class="`btn--${variant}`">
    <slot /><ArrowRight v-if="arrow" class="btn__arrow" :size="18" aria-hidden="true" />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 14px 24px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font: inherit;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.25s var(--ease), background-color 0.2s, opacity 0.2s;
}

.btn--primary { background: var(--color-accent); color: var(--color-ink); }
.btn--dark { background: var(--color-raise); color: var(--color-text); }
.btn--light { background: var(--color-light); color: var(--color-ink); }
.btn--ghost { background: transparent; color: inherit; border-color: currentColor; }

.btn__arrow { transition: transform 0.25s var(--ease); }

@media (hover: hover) {
  .btn:hover .btn__arrow { transform: translateX(4px); }
  .btn--dark:hover { background: var(--gray-1); }
}

.btn:active { transform: scale(0.97); }

.btn:disabled {
  opacity: 0.6;
  cursor: progress;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .btn, .btn__arrow { transition: none; }
  .btn:active, .btn:hover .btn__arrow { transform: none; }
}
</style>
