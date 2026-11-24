<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    to?: RouteLocationRaw
    href?: string
    type?: 'button' | 'submit'
    variant?: 'primary' | 'ghost'
    disabled?: boolean
  }>(),
  { to: undefined, href: undefined, type: 'button', variant: 'primary', disabled: false },
)
</script>

<template>
  <RouterLink v-if="to" :to="to" class="btn" :class="`btn--${variant}`"><slot /></RouterLink>
  <a v-else-if="href" :href="href" class="btn" :class="`btn--${variant}`"><slot /></a>
  <button v-else :type="type" :disabled="disabled" class="btn" :class="`btn--${variant}`"><slot /></button>
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
  border-radius: 0;
  font: inherit;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.02em;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.25s var(--ease), opacity 0.2s;
}

.btn--primary {
  background: var(--color-accent);
  color: var(--color-ink);
}

.btn--ghost {
  background: transparent;
  color: inherit;
  border-color: currentColor;
}

@media (hover: hover) {
  .btn:hover { transform: translateY(-2px); }
}

.btn:active { transform: scale(0.97); }

.btn:disabled {
  opacity: 0.6;
  cursor: progress;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .btn, .btn:hover, .btn:active { transition: none; transform: none; }
}
</style>
