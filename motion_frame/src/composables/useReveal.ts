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

    // Тёмный блок «наезжает» на светлый фон: дорастает до полной ширины, пока въезжает в экран
    if (el.hasAttribute('data-rise')) {
      gsap.fromTo(el, { scale: 0.94, transformOrigin: 'center top' }, {
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 35%', scrub: true },
      })
    }

    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!items.length) return
    gsap.set(items, { opacity: 0, y: 24 })
    ScrollTrigger.batch(items, {
      start: 'top 92%',
      once: true,
      // clearProps: после появления убираем инлайн-transform, иначе он перебьёт CSS-hover карточек
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out', clearProps: 'opacity,transform' }),
    })
  })
}
