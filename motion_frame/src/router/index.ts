import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/Home.vue') },
  { path: '/privacy', name: 'privacy', component: () => import('@/pages/Privacy.vue') },
]

const HEADER_OFFSET = 80

export const scrollBehavior: RouterScrollBehavior = (to, from, saved) => {
  if (saved) return saved
  if (!to.hash) return { top: 0 }

  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  const target = { el: to.hash, top: HEADER_OFFSET, behavior } as const
  if (to.path === from.path) return target
  // Ждём, пока закончится переход между страницами, иначе якоря ещё нет в DOM
  return new Promise((resolve) => setTimeout(() => resolve(target), 350))
}
