<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SiteLogo from '@/components/ui/SiteLogo.vue'
import { INSTAGRAM_URL, navLinks } from '@/config'

// Год из пререндера мог устареть, поэтому обновляем в браузере
const year = ref(new Date().getFullYear())
onMounted(() => {
  year.value = new Date().getFullYear()
})
</script>

<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <RouterLink to="/" aria-label="Raw Motion Frame, на главную" class="footer__logo"><SiteLogo :size="112" /></RouterLink>
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
.footer {
  padding-block: 56px 32px;
  border-top: 1px solid var(--gray-1);
}

.footer__inner {
  display: grid;
  gap: 32px;
}

.footer__logo { text-decoration: none; }

.footer__text { margin-top: 16px; max-width: 26em; color: var(--color-muted); font-size: 14px; }

.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  font-size: 14px;
}

.footer__nav a { text-decoration: none; }
.footer__nav a:hover { text-decoration: underline; }

.footer__instagram {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
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
  border-top: 1px solid var(--gray-1);
  font-size: 13px;
  color: var(--color-muted);
}

@media (min-width: 900px) {
  .footer__inner { grid-template-columns: 1.4fr 2fr auto; align-items: start; }
  .footer__bottom { grid-column: 1 / -1; }
}

@media (prefers-reduced-motion: reduce) {
  .footer__instagram, .footer__instagram:hover { transition: none; transform: none; }
}
</style>
