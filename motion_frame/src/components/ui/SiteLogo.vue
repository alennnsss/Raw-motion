<!-- Временный текстовый вордмарк. Когда владелец даст SVG, заменить на <img src="/logo/logo.svg"> без изменений пропорций -->
<template>
  <span class="logo">
    <span class="logo__caps">Raw</span>
    <span class="logo__motion">Motion</span>
    <span class="logo__caps">Frame</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  line-height: 1;
}

.logo__caps {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.logo__motion {
  padding: 4px 6px;
  background: var(--color-accent);
  color: var(--color-ink);
  font-size: 15px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
