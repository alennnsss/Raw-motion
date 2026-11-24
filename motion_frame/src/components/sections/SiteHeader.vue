<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import SiteLogo from '@/components/ui/SiteLogo.vue'
import { navLinks } from '@/config'
</script>

<template>
  <header class="header">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo" aria-label="Raw Motion Frame, на главную"><SiteLogo /></RouterLink>
      <nav class="header__nav" aria-label="Основная навигация">
        <ul>
          <li v-for="link in navLinks" :key="link.hash">
            <RouterLink :to="{ path: '/', hash: link.hash }" class="header__link">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>
      <AppButton :to="{ path: '/', hash: '#lead' }" class="header__cta">Заявка</AppButton>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  background: rgb(10 10 10 / 0.86);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-1);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 100%;
}

.header__logo { text-decoration: none; }

.header__nav { display: none; }

.header__nav ul { display: flex; gap: 28px; }

.header__link {
  position: relative;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.header__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease);
}

.header__link:hover::after { transform: scaleX(1); }

.header__cta { min-height: 40px; padding: 8px 16px; font-size: 14px; }

@media (min-width: 900px) {
  .header__nav { display: block; }
}
</style>
