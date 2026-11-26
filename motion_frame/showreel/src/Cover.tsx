import { AbsoluteFill, Img, OffthreadVideo, staticFile } from 'remotion'
import { C, WORKS, fontFamily } from './Showreel'
import { FPS } from './grid'

// Обложка Reels 1080×1920. В сетке профиля Instagram видна центральная часть 3:4 (y ≈ 240…1680),
// поэтому логотип, заголовок и работы стоят внутри неё
type Shot = { work: keyof typeof WORKS; at: number }

const SHOTS: Shot[] = [
  { work: 'findy', at: 2.5 },
  { work: 'ad', at: 3 },
  { work: 'morent', at: 1.2 },
]

const CARD_H = 560
const CARD_W = Math.round((CARD_H * 9) / 16)
const GAP = 22
const X0 = Math.round((1080 - (CARD_W * 3 + GAP * 2)) / 2)

export const Cover = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily, color: C.light }}>
    <Img src={staticFile('logo.png')} style={{ position: 'absolute', left: 90, top: 300, width: 340 }} />

    <div style={{ position: 'absolute', left: 90, top: 450, fontSize: 176, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1 }}>
      <div>Монтаж</div>
      {/* Лаймовая плашка под одним ключевым словом — как в Hero сайта, единственный акцент кадра */}
      <div style={{ display: 'inline-block', marginTop: 12, padding: '0 0.12em 0.06em', borderRadius: 14, background: C.accent, color: C.bg }}>видео</div>
    </div>

    <div style={{ position: 'absolute', left: 90, top: 860, fontSize: 44, fontWeight: 500, color: C.muted, letterSpacing: '-0.01em' }}>
      Reels, реклама, субтитры
    </div>

    {/* Работы целиком: карточки ровно 9:16, средняя чуть выше для ритма */}
    {SHOTS.map((shot, i) => (
      <div
        key={shot.work}
        style={{
          position: 'absolute',
          left: X0 + i * (CARD_W + GAP),
          top: i === 1 ? 950 : 990,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 16,
          overflow: 'hidden',
          background: C.raise,
        }}
      >
        <OffthreadVideo src={staticFile(WORKS[shot.work])} trimBefore={Math.round(shot.at * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    ))}
  </AbsoluteFill>
)
