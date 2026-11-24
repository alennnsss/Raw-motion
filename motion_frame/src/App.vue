<script setup lang="ts">
import { gsap } from 'gsap'
import SiteHeader from '@/components/sections/SiteHeader.vue'
import SiteFooter from '@/components/sections/SiteFooter.vue'
import { prefersReducedMotion } from '@/composables/useAnimation'

// Переход между страницами: старая гаснет, новая проявляется снизу
function onLeave(el: Element, done: () => void) {
  gsap.to(el, { opacity: 0, duration: prefersReducedMotion() ? 0 : 0.2, onComplete: done })
}

function onEnter(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: prefersReducedMotion() ? 0 : 0.4, ease: 'power2.out', clearProps: 'all', onComplete: done },
  )
}
</script>

<template>
  <a class="skip-link" href="#main">Перейти к содержимому</a>
  <SiteHeader />
  <RouterView v-slot="{ Component }">
    <Transition mode="out-in" :css="false" @leave="onLeave" @enter="onEnter">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <SiteFooter />
</template>
