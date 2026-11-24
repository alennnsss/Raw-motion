import { ViteSSG } from 'vite-ssg'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import { RawPreset } from './theme/primevue'
import './assets/styles/main.css'

// vite-ssg сам создаёт роутер (history mode) и head, а при сборке пререндерит каждую страницу в HTML
export const createApp = ViteSSG(App, { routes, scrollBehavior, base: import.meta.env.BASE_URL }, ({ app }) => {
  app.use(PrimeVue, {
    theme: {
      preset: RawPreset,
      // Стили PrimeVue в CSS-слое primeui: наши обычные стили всегда сильнее
      options: { darkModeSelector: 'none', cssLayer: true },
    },
  })
})
