import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes, scrollBehavior } from './router'
import './assets/styles/main.css'

// vite-ssg сам создаёт роутер (history mode) и head, а при сборке пререндерит каждую страницу в HTML
export const createApp = ViteSSG(App, { routes, scrollBehavior, base: import.meta.env.BASE_URL })
