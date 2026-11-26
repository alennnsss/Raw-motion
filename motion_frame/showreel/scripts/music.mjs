// Синтез фоновой музыки для шоурила. Без сэмплов и чужих треков: всё генерируется кодом, лицензия не нужна.
// Сетка битов общая с анимацией (beat.json), поэтому удары и склейки совпадают по построению.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const { bpm, beatsPerBar, bars } = JSON.parse(readFileSync(new URL('../beat.json', import.meta.url)))
const SR = 48000
const BEAT = 60 / bpm
const DUR = bars * beatsPerBar * BEAT
const N = Math.round(DUR * SR)
const beatTime = (n) => n * BEAT

// Детерминированный шум: одинаковый трек при каждом запуске
let seed = 1
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 2147483648 - 1
}

const drums = [new Float32Array(N), new Float32Array(N)]
const music = [new Float32Array(N), new Float32Array(N)]

const add = (bus, i, l, r = l) => {
  if (i < 0 || i >= N) return
  bus[0][i] += l
  bus[1][i] += r
}

// RBJ biquad: фильтрует массив на месте
function biquad(x, type, freq, q = 0.707) {
  const w = (2 * Math.PI * freq) / SR
  const cos = Math.cos(w)
  const alpha = Math.sin(w) / (2 * q)
  let b0, b1, b2
  if (type === 'lp') [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2]
  else if (type === 'hp') [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2]
  else [b0, b1, b2] = [alpha, 0, -alpha] // bp
  const a0 = 1 + alpha
  const a1 = -2 * cos
  const a2 = 1 - alpha
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0
  for (let i = 0; i < x.length; i++) {
    const y = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y
    x[i] = y
  }
  return x
}

const kicks = []

function kick(t, gain = 1) {
  kicks.push(t)
  const s = Math.round(t * SR)
  let phase = 0
  for (let k = 0; k < 0.45 * SR; k++) {
    const u = k / SR
    const f = 45 + 110 * Math.exp(-u / 0.028)
    phase += (2 * Math.PI * f) / SR
    const click = k < 0.002 * SR ? noise() * 0.4 : 0
    const v = (Math.sin(phase) * Math.exp(-u / 0.16) + click) * 0.9 * gain
    add(drums, s + k, v)
  }
}

function burst(t, len, decay, filter, freq, gain, pan = 0) {
  const s = Math.round(t * SR)
  const n = Math.round(len * SR)
  const buf = new Float32Array(n)
  for (let k = 0; k < n; k++) buf[k] = noise() * Math.exp(-k / SR / decay)
  biquad(buf, filter, freq, filter === 'bp' ? 1.2 : 0.707)
  for (let k = 0; k < n; k++) add(drums, s + k, buf[k] * gain * (1 - pan), buf[k] * gain * (1 + pan))
}

const clap = (t, gain = 0.9) => {
  // Хлопок = три коротких всплеска шума подряд
  for (const d of [0, 0.011, 0.022]) burst(t + d, d === 0.022 ? 0.25 : 0.02, d === 0.022 ? 0.09 : 0.008, 'bp', 1400, gain)
}
const hat = (t, open = false, gain = 0.28, pan = 0.15) => burst(t, open ? 0.25 : 0.06, open ? 0.08 : 0.018, 'hp', 7500, gain, pan)
const crash = (t, gain = 0.35) => burst(t, 1.8, 0.55, 'hp', 4500, gain)

const midi = (m) => 440 * 2 ** ((m - 69) / 12)

// Пила, сглаженная фильтром ниже. cutoff задаёт тембр
function synth(bus, t, dur, freqs, { gain, cutoff, attack = 0.005, release = 0.08, detune = [0], spread = 0 }) {
  const s = Math.round(t * SR)
  const n = Math.round((dur + release) * SR)
  const out = [new Float32Array(n), new Float32Array(n)]
  freqs.forEach((f0, fi) =>
    detune.forEach((cents, di) => {
      const f = f0 * 2 ** (cents / 1200)
      let ph = (fi * 0.37 + di * 0.21) % 1
      const side = detune.length > 1 ? (di / (detune.length - 1)) * 2 - 1 : 0
      for (let k = 0; k < n; k++) {
        ph += f / SR
        ph -= Math.floor(ph)
        const u = k / SR
        const env = Math.min(1, u / attack) * (u > dur ? Math.exp(-(u - dur) / (release / 4)) : 1)
        const v = (ph * 2 - 1) * env
        out[0][k] += v * (1 - side * spread)
        out[1][k] += v * (1 + side * spread)
      }
    }),
  )
  const norm = gain / (freqs.length * detune.length)
  for (const ch of [0, 1]) {
    biquad(out[ch], 'lp', cutoff)
    for (let k = 0; k < n; k++) if (s + k < N) bus[ch][s + k] += out[ch][k] * norm
  }
}

// Аккорды по тактам: Am F C G Am F, вступление и финал на Am
const chords = [
  { root: 33, pad: [57, 60, 64] }, // Am
  { root: 29, pad: [53, 57, 60] }, // F
  { root: 36, pad: [55, 60, 64] }, // C
  { root: 31, pad: [55, 59, 62] }, // G
]
const chordOfBar = (bar) => (bar === 0 || bar === bars - 1 ? chords[0] : chords[(bar - 1) % 4])

for (let bar = 0; bar < bars; bar++) {
  const b0 = bar * beatsPerBar
  const chord = chordOfBar(bar)
  const intro = bar === 0
  const outro = bar === bars - 1

  // Пэд держит аккорд весь такт
  synth(music, beatTime(b0), beatsPerBar * BEAT, chord.pad.map(midi), {
    gain: intro || outro ? 0.32 : 0.22,
    cutoff: intro ? 900 : 1600,
    attack: intro ? 0.6 : 0.05,
    release: outro ? 1.2 : 0.3,
    detune: [-9, 0, 9],
    spread: 0.5,
  })

  if (intro) {
    // Вступление: хэты на восьмых, мягкая бочка на 1 и 3, на последней доле нарастающий ролл хлопков
    for (let e = 0; e < 8; e++) hat(beatTime(b0 + e / 2), false, 0.18)
    kick(beatTime(b0), 0.6)
    kick(beatTime(b0 + 2), 0.6)
    for (let s16 = 0; s16 < 4; s16++) clap(beatTime(b0 + 3 + s16 / 4), 0.25 + s16 * 0.15)
    continue
  }

  if (outro) {
    // Финал: удар на сильную долю под логотип, дальше только пэд и бас затухают к петле
    kick(beatTime(b0), 1)
    crash(beatTime(b0), 0.3)
    synth(music, beatTime(b0), 2 * BEAT, [midi(chord.root)], { gain: 0.5, cutoff: 300, release: 0.6 })
    continue
  }

  if (bar === 1 || bar === 4) crash(beatTime(b0))
  for (let b = 0; b < beatsPerBar; b++) {
    kick(beatTime(b0 + b))
    if (b % 2 === 1) clap(beatTime(b0 + b))
    hat(beatTime(b0 + b + 0.5), true, 0.2, -0.15)
    // Во второй половине работ хэты гуще: шестнадцатые
    if (bar >= 5) for (const s16 of [0.25, 0.75]) hat(beatTime(b0 + b + s16), false, 0.12)
  }
  // Бас восьмыми на корне аккорда, последняя восьмая такта на октаву выше
  for (let e = 0; e < 8; e++) {
    const note = chord.root + (e === 7 ? 12 : 0)
    synth(music, beatTime(b0 + e / 2), BEAT / 2 - 0.02, [midi(note)], { gain: 0.55, cutoff: 420, release: 0.03 })
  }
}

// Сайдчейн: бас и пэд приседают на каждой бочке, отсюда «качает»
const sorted = [...kicks].sort((a, b) => a - b)
let ki = 0
for (let i = 0; i < N; i++) {
  const t = i / SR
  while (ki + 1 < sorted.length && sorted[ki + 1] <= t) ki++
  const since = t - sorted[ki]
  const duck = since >= 0 ? 1 - 0.65 * Math.exp(-since / 0.09) : 1
  for (const ch of [0, 1]) music[ch][i] *= duck
}

// Сведение и мягкое ограничение. Громкость до -14 LUFS доводит render.sh (усиление + лимитер)
const out = Buffer.alloc(N * 4)
for (let i = 0; i < N; i++) {
  for (const ch of [0, 1]) {
    const v = Math.tanh((drums[ch][i] + music[ch][i]) * 0.8)
    out.writeInt16LE(Math.round(v * 32000), i * 4 + ch * 2)
  }
}
const header = Buffer.alloc(44)
header.write('RIFF', 0)
header.writeUInt32LE(36 + out.length, 4)
header.write('WAVEfmt ', 8)
header.writeUInt32LE(16, 16)
header.writeUInt16LE(1, 20)
header.writeUInt16LE(2, 22)
header.writeUInt32LE(SR, 24)
header.writeUInt32LE(SR * 4, 28)
header.writeUInt16LE(4, 32)
header.writeUInt16LE(16, 34)
header.write('data', 36)
header.writeUInt32LE(out.length, 40)

mkdirSync(new URL('../public/', import.meta.url), { recursive: true })
writeFileSync(new URL('../public/music-raw.wav', import.meta.url), Buffer.concat([header, out]))
console.log(`music-raw.wav: ${DUR}s, ${bars} тактов по ${beatsPerBar} долей, ${bpm} BPM, бочек: ${kicks.length}`)
