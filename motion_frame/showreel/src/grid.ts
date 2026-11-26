import beat from '../beat.json'

// Та же сетка, что в scripts/music.mjs: удары музыки и события анимации считаются по одной формуле
export const FPS = beat.fps
export const BEAT = Math.round((60 / beat.bpm) * beat.fps)
export const BAR = BEAT * beat.beatsPerBar
export const BARS = beat.bars
export const DURATION = BAR * BARS

/** Кадр доли n от начала такта */
export const onBeat = (n: number) => n * BEAT
