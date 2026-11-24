<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import SiteLogo from '@/components/ui/SiteLogo.vue'
import { INSTAGRAM_URL, navLinks } from '@/config'

const route = useRoute()

// Год из пререндера мог устареть, поэтому обновляем в браузере
const year = ref(new Date().getFullYear())
onMounted(() => {
  year.value = new Date().getFullYear()
})
</script>

<template>
  <!-- На главной подвал продолжает тёмный блок формы; на других страницах сам скругляет верх -->
  <footer class="footer dark" :class="{ 'footer--standalone': route.path !== '/' }">
    <div class="container footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" aria-label="Raw Motion Frame, на главную" class="footer__logo"><SiteLogo :height="64" full /></RouterLink>
        <p class="footer__text">Студия видеомонтажа: Reels, TikTok, Shorts, YouTube и рекламные ролики.</p>
      </div>

      <nav aria-label="Навигация в подвале">
        <ul class="footer__nav">
          <li v-for="link in navLinks" :key="link.hash">
            <RouterLink :to="{ path: '/', hash: link.hash }">{{ link.label }}</RouterLink>
          </li>
          <li><RouterLink :to="{ path: '/', hash: '#lead' }">Заявка</RouterLink></li>
        </ul>
      </nav>

      <a class="footer__instagram" :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer" aria-label="Instagram Raw Motion Frame">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
      </a>

      <div class="footer__bottom">
        <p>© {{ year }} Raw Motion Frame</p>
        <RouterLink to="/privacy">Политика конфиденциальности</RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { padding-block: 24px 32px; }

.footer--standalone {
  margin-top: 40px;
  padding-top: 64px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.footer__inner {
  display: grid;
  gap: 32px;
  padding-top: 48px;
  border-top: 1px solid var(--line);
}

.footer__logo { display: inline-block; border-radius: 4px; text-decoration: none; }

.footer__text { margin-top: 16px; max-width: 24em; color: var(--muted); }

.footer__nav {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 12px 40px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.footer__nav a { text-decoration: none; transition: color 0.2s; }
.footer__nav a:hover { color: var(--color-accent); }

.footer__instagram {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 1px solid var(--gray-2);
  transition: transform 0.25s var(--ease), color 0.2s, border-color 0.2s;
}

.footer__instagram:hover,
.footer__instagram:focus-visible {
  color: var(--color-accent);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  font-size: 14px;
  color: var(--muted);
}

.footer__bottom a { text-underline-offset: 3px; }

@media (min-width: 900px) {
  .footer__inner { grid-template-columns: 1.3fr 1.5fr auto; align-items: start; }
  .footer__nav { grid-template-columns: repeat(3, max-content); }
  .footer__bottom { grid-column: 1 / -1; }
}

@media (prefers-reduced-motion: reduce) {
  .footer__instagram, .footer__instagram:hover { transition: none; transform: none; }
}
</style>
