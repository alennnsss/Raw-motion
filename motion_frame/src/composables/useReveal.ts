import type { Ref } from 'vue'
import { useAnimation } from './useAnimation'

/**
 * Появление при скролле внутри секции:
 * [data-split] заголовки выезжают по словам, [data-reveal] блоки каскадом.
 */
export function useReveal(root: Ref<HTMLElement | null>) {
  useAnimation(root, (gsap, ScrollTrigger) => {
    const el = root.value
    if (!el) return

    el.querySelectorAll<HTMLElement>('[data-split]').forEach((heading) => {
      gsap.from(heading.querySelectorAll('[data-word]'), {
        yPercent: 110,
        duration: 0.8,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
      })
    })

    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!items.length) return
    gsap.set(items, { opacity: 0, y: 24 })
    ScrollTrigger.batch(items, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' }),
    })
  })
}
