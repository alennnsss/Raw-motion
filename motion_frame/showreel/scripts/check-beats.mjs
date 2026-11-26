// Проверка готового файла по дорожке из итогового mp4 (то, что слышит зритель):
// 1) дорожка не сдвинута относительно исходной музыки (взаимная корреляция огибающих, допуск 1 кадр);
// 2) на каждой доле основной части (такты 2…предпоследний) есть удар в пределах 1 кадра от сетки beat.json.
// Бас играет восьмыми, поэтому лишние онсеты между долями — норма; проверяем, что ни одна доля не пропала.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const { bpm, fps, beatsPerBar, bars } = JSON.parse(readFileSync(new URL('../beat.json', import.meta.url)))
const SR = 8000
const HOP = 0.005
const beat = 60 / bpm
const tol = 1 / fps

const envelope = (file) => {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-af', 'lowpass=f=150', '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 26 })
  const x = new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4)
  const win = SR * HOP
  const env = []
  for (let i = 0; i + win <= x.length; i += win) {
    let s = 0
    for (let k = 0; k < win; k++) s += x[i + k] * x[i + k]
    env.push(Math.sqrt(s / win))
  }
  return env
}

const ref = envelope(new URL('../public/music.wav', import.meta.url).pathname)

let failed = false
for (const file of process.argv.slice(2)) {
  const env = envelope(file)

  // 1. Сдвиг дорожки: ищем лаг с максимальной корреляцией в пределах ±0.5 с
  let best = 0, bestLag = 0
  for (let lag = -100; lag <= 100; lag++) {
    let s = 0
    for (let i = 0; i < ref.length; i++) {
      const j = i + lag
      if (j >= 0 && j < env.length) s += ref[i] * env[j]
    }
    if (s > best) [best, bestLag] = [s, lag]
  }
  const shift = bestLag * HOP

  // 2. Онсеты = резкий рост огибающей
  const peak = Math.max(...env)
  const onsets = []
  for (let i = 2; i < env.length; i++) {
    if (env[i] > peak * 0.2 && env[i] > env[i - 2] * 2 && (!onsets.length || i * HOP - onsets.at(-1) > 0.08)) onsets.push(i * HOP)
  }
  const expected = []
  for (let n = beatsPerBar; n < (bars - 1) * beatsPerBar; n++) expected.push(n * beat)
  const devs = expected.map((t) => Math.min(...onsets.map((o) => Math.abs(o - t))))
  const missed = devs.filter((d) => d > tol).length
  const worst = Math.max(...devs)

  const ok = Math.abs(shift) <= tol && missed === 0
  if (!ok) failed = true
  console.log(
    `${file.split('/').pop()}: сдвиг дорожки ${(shift * 1000).toFixed(0)} мс; долей ${expected.length}, ` +
      `без удара ${missed}, худшее отклонение ${(worst * 1000).toFixed(0)} мс — ${ok ? 'OK' : 'МИМО СЕТКИ'}`,
  )
}
if (failed) process.exit(1)
