import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { prefersReducedMotion } from './useAnimation'

const MAX_PLAYING = 2
const playing = new Set<HTMLVideoElement>()

/**
 * Превью играет, только когда видно на экране, и не больше двух одновременно.
 * shortcut: если третье видео вошло в зону, пока играют два, оно запустится только при следующем входе.
 */
export function useInViewAutoplay(video: Ref<HTMLVideoElement | null>, paused: Ref<boolean>) {
  let observer: IntersectionObserver | undefined
  let visible = false

  const stop = (el: HTMLVideoElement) => {
    el.pause()
    playing.delete(el)
  }

  const tryPlay = (el: HTMLVideoElement) => {
    if (paused.value || !visible || playing.size >= MAX_PLAYING || prefersReducedMotion()) return
    playing.add(el)
    el.play().catch(() => playing.delete(el))
  }

  onMounted(() => {
    const el = video.value
    if (!el) return
    observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) tryPlay(el)
        else stop(el)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
  })

  watch(paused, (isPaused) => {
    const el = video.value
    if (!el) return
    if (isPaused) stop(el)
    else tryPlay(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    if (video.value) playing.delete(video.value)
  })
}
