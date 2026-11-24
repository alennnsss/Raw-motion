import { onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Setup = (g: typeof gsap, st: typeof ScrollTrigger) => void | (() => void)

let registered = false

/**
 * Запускает GSAP-анимации компонента только в браузере (onMounted) и убирает их при размонтировании.
 * gsap.matchMedia() это тот же gsap.context(), но он ещё и следит за медиазапросом:
 * если пользователь включит «уменьшить движение», анимации откатятся сами.
 * Селекторы внутри setup ищутся только внутри root.
 */
export function useAnimation(
  root: Ref<HTMLElement | null>,
  setup: Setup,
  query = '(prefers-reduced-motion: no-preference)',
) {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger)
      registered = true
    }
    if (!root.value) return
    mm = gsap.matchMedia(root.value)
    mm.add(query, () => setup(gsap, ScrollTrigger))
  })

  onUnmounted(() => mm?.revert())
}

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
