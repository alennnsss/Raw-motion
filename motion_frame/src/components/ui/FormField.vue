<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
}>()

defineSlots<{
  default(props: { id: string; describedby: string | undefined; invalid: boolean }): unknown
}>()

const describedby = computed(
  () => [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div class="field" :class="{ 'field--invalid': error }">
    <label class="field__label" :for="id">
      {{ label }}<span v-if="required" class="field__required" aria-hidden="true"> *</span>
    </label>
    <slot :id="id" :describedby="describedby" :invalid="!!error" />
    <p v-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.field { display: grid; gap: 8px; }

.field__label {
  font-size: 15px;
  font-weight: 500;
}

.field__required { color: var(--color-accent); }

.field :slotted(input),
.field :slotted(textarea) {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--gray-2);
  border-radius: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;
  transition: border-color 0.2s;
}

.field :slotted(textarea) { min-height: 120px; resize: vertical; }

.field :slotted(input:focus-visible),
.field :slotted(textarea:focus-visible) {
  outline: none;
  border-color: var(--color-accent);
}

.field--invalid :slotted(input),
.field--invalid :slotted(textarea) { border-color: var(--color-error); }

.field__hint { font-size: 13px; color: var(--color-muted); }

.field__error {
  font-size: 13px;
  color: var(--color-error);
  animation: field-error 0.3s var(--ease);
}

@keyframes field-error {
  from { opacity: 0; transform: translateY(-4px); }
}

@media (prefers-reduced-motion: reduce) {
  .field__error { animation: none; }
}
</style>
