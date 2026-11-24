<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import SiteLogo from '@/components/ui/SiteLogo.vue'
import { navLinks } from '@/config'
import { onMounted, onUnmounted, ref } from 'vue'

// Прячем шапку, когда листают вниз (больше места под контент на телефоне), и возвращаем при прокрутке вверх
const hidden = ref(false)
let lastY = 0

function onScroll() {
  const y = window.scrollY
  if (Math.abs(y - lastY) < 8) return
  hidden.value = y > lastY && y > 160
  lastY = y
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header dark" :class="{ 'header--hidden': hidden }">
    <div class="container header__inner">
      <RouterLink to="/" class="header__logo" aria-label="Raw Motion Frame, на главную"><SiteLogo :height="40" /></RouterLink>
      <nav class="header__nav" aria-label="Основная навигация">
        <ul>
          <li v-for="link in navLinks" :key="link.hash">
            <RouterLink :to="{ path: '/', hash: link.hash }" class="header__link">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>
      <AppButton :to="{ path: '/', hash: '#lead' }" variant="light" arrow class="header__cta">Заявка</AppButton>
    </div>
  </header>
</template>

<style scoped>
/* Сплошной фон в цвет фона PNG-логотипа, иначе над светлыми блоками виден его квадрат */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  transition: transform 0.3s var(--ease);
}

/* С клавиатуры шапка всегда на месте: фокус не должен уходить за экран */
.header--hidden:not(:focus-within) { transform: translateY(-100%); }

@media (prefers-reduced-motion: reduce) {
  .header { transition: none; }
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 100%;
}

.header__logo { text-decoration: none; border-radius: 4px; }

.header__nav { display: none; }

.header__nav ul { display: flex; gap: 4px; }

.header__link {
  display: block;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s;
}

.header__link:hover { color: var(--color-text); background: var(--color-raise); }

.header__cta { min-height: 44px; padding: 10px 18px; }

@media (min-width: 960px) {
  .header__nav { display: block; }
}
</style>
