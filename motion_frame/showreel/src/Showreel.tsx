import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame } from 'remotion'
import { Audio, Video } from '@remotion/media'
import { loadFont } from '@remotion/google-fonts/Inter'
import { BAR, BARS, BEAT, FPS, onBeat } from './grid'

export const { fontFamily } = loadFont('normal', { weights: ['500', '600'], subsets: ['latin', 'cyrillic'] })

type Format = 'desktop' | 'mobile'
type SceneProps = { f: Format }

// Цвета из брендбука. Лайм только у плейхеда: одно акцентное место на кадр
export const C = {
  bg: '#0A0A0A',
  light: '#F2F0EA',
  accent: '#C6FF00',
  ghost: '#504F4D',
  gray: '#757570',
  raise: '#1D1D1B',
  muted: '#B4B3AB',
  inkMuted: '#56554F',
}

export const WORKS = {
  ad: 'montazh_ad_ru_1080x1920.mp4',
  findy: 'findy-job-ad.mp4',
  siteless: 'brag-v2-vertical.mp4',
  morent: 'morent-reel-final.mp4',
}
type Clip = { work: keyof typeof WORKS; at: number } // at — секунда в исходнике

// Появление на доле: быстрая пружина без перелёта
const useEnter = (start: number) =>
  spring({ frame: useCurrentFrame() - start, fps: FPS, config: { damping: 22, stiffness: 220, mass: 0.6 } })

// Толчок на каждый удар бочки: сцены начинаются ровно на сильную долю, поэтому frame % BEAT = время от удара
const usePulse = () => 1 + 0.014 * Math.exp(-(useCurrentFrame() % BEAT) / 3)

/** Работа клиента целиком: карточка ровно 9:16, без обрезки, подписи только снаружи */
const Card = ({ clip, h, x, y, enter = 0, from = 'up' }: { clip: Clip; h: number; x: number; y: number; enter?: number; from?: 'up' | 'right' | 'none' }) => {
  const p = useEnter(enter)
  const pulse = usePulse()
  const w = Math.round((h * 9) / 16)
  const shift = from === 'none' ? '' : from === 'right' ? `translateX(${(1 - p) * 160}px)` : `translateY(${(1 - p) * 80}px)`
  return (
    <Sequence from={enter} layout="none">
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 16,
          overflow: 'hidden',
          background: C.raise,
          opacity: from === 'none' ? 1 : Math.min(1, p * 1.5),
          transform: `${shift} scale(${pulse})`,
        }}
      >
        <Video src={staticFile(WORKS[clip.work])} trimBefore={Math.round(clip.at * FPS)} muted objectFit="cover" style={{ width: '100%', height: '100%' }} />
      </div>
    </Sequence>
  )
}

const Word = ({ children, enter, size, color = C.light, weight = 600, style }: { children: ReactNode; enter: number; size: number; color?: string; weight?: number; style?: CSSProperties }) => {
  const p = useEnter(enter)
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.035em',
        lineHeight: 1.04,
        color,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * size * 0.35}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const Text = ({ children, style }: { children: ReactNode; style: CSSProperties }) => (
  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', gap: 8, ...style }}>{children}</div>
)

// 1. Вступление: слоган встаёт по словам на доли 1–3, на 4-й вытягивается плейхед — следом сбивка и «дроп»
const Intro = ({ f }: SceneProps) => {
  const d = f === 'desktop'
  const frame = useCurrentFrame()
  const sweep = interpolate(frame, [onBeat(3), onBeat(3) + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const size = d ? 168 : 128
  return (
    <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: d ? 150 : 90 }}>
      <Word enter={0} size={size}>Visuals</Word>
      <Word enter={onBeat(1)} size={size}>that</Word>
      <Word enter={onBeat(2)} size={size}>move</Word>
      <div style={{ display: 'flex', gap: 12, height: 18, marginTop: 48 }}>
        <div style={{ width: 80, background: C.ghost, opacity: sweep > 0 ? 1 : 0 }} />
        <div style={{ width: d ? 320 : 240, background: C.accent, transform: `scaleX(${sweep})`, transformOrigin: 'left' }} />
      </div>
    </AbsoluteFill>
  )
}

// 2. Одна работа слева, подпись справа по словам
const Ads = ({ f }: SceneProps) =>
  f === 'desktop' ? (
    <AbsoluteFill>
      <Card clip={{ work: 'morent', at: 0.5 }} h={860} x={200} y={110} />
      <Text style={{ left: 780, top: '50%', transform: 'translateY(-50%)' }}>
        <Word enter={onBeat(1)} size={104}>Рекламные</Word>
        <Word enter={onBeat(2)} size={104}>ролики</Word>
      </Text>
    </AbsoluteFill>
  ) : (
    <AbsoluteFill>
      <Card clip={{ work: 'morent', at: 0.5 }} h={760} x={218} y={60} />
      <Text style={{ left: 90, top: 860, flexDirection: 'row', gap: 16 }}>
        <Word enter={onBeat(1)} size={60}>Рекламные</Word>
        <Word enter={onBeat(2)} size={60}>ролики</Word>
      </Text>
    </AbsoluteFill>
  )

// 3. Две работы: вторая въезжает справа на третью долю, подпись снизу
const Reels = ({ f }: SceneProps) => {
  const d = f === 'desktop'
  const h = d ? 780 : 700
  const w = Math.round((h * 9) / 16)
  const gap = d ? 40 : 24
  const x0 = Math.round(((d ? 1440 : 864) - (w * 2 + gap)) / 2)
  return (
    <AbsoluteFill>
      <Card clip={{ work: 'findy', at: 1.5 }} h={h} x={x0} y={60} />
      <Card clip={{ work: 'ad', at: 2 }} h={h} x={x0 + w + gap} y={60} enter={onBeat(2)} from="right" />
      <Text style={{ left: x0, top: d ? 880 : 810 }}>
        <Word enter={onBeat(1)} size={d ? 80 : 60}>Reels и Shorts</Word>
      </Text>
    </AbsoluteFill>
  )
}

// 4. Монтаж в ритм: на десктопе три работы по одной на долю, на телефоне склейка на каждую долю
const Rhythm = ({ f }: SceneProps) => {
  if (f === 'mobile') {
    const clips: Clip[] = [
      { work: 'siteless', at: 0.5 },
      { work: 'findy', at: 7.5 },
      { work: 'morent', at: 5.5 },
      { work: 'ad', at: 14 },
    ]
    return (
      <AbsoluteFill>
        {clips.map((clip, i) => (
          <Sequence key={i} from={onBeat(i)} durationInFrames={BEAT} premountFor={BEAT}>
            <Card clip={clip} h={800} x={207} y={50} from="none" />
          </Sequence>
        ))}
        <Text style={{ left: 90, top: 900 }}>
          <Word enter={0} size={60}>Монтаж в ритм</Word>
        </Text>
      </AbsoluteFill>
    )
  }
  const clips: Clip[] = [
    { work: 'siteless', at: 0.5 },
    { work: 'findy', at: 7.5 },
    { work: 'morent', at: 5.5 },
  ]
  return (
    <AbsoluteFill>
      {clips.map((clip, i) => (
        <Card key={i} clip={clip} h={700} x={105 + i * (394 + 24)} y={70} enter={onBeat(i)} />
      ))}
      <Text style={{ left: 105, top: 850 }}>
        <Word enter={onBeat(3)} size={80}>Монтаж в ритм</Word>
      </Text>
    </AbsoluteFill>
  )
}

// 5. Светлый такт (как светлые блоки сайта): крупное слово и работа с субтитрами
const Subtitles = ({ f }: SceneProps) => {
  const d = f === 'desktop'
  return (
    <AbsoluteFill style={{ background: C.light }}>
      {d ? (
        <>
          <Text style={{ left: 150, top: '50%', transform: 'translateY(-50%)' }}>
            <Word enter={0} size={128} color={C.bg}>Субтитры</Word>
            <Word enter={onBeat(1)} size={56} color={C.inkMuted} weight={500}>и чистая речь</Word>
          </Text>
          <Card clip={{ work: 'ad', at: 4.5 }} h={860} x={840} y={110} from="right" />
        </>
      ) : (
        <>
          <Card clip={{ work: 'ad', at: 4.5 }} h={720} x={230} y={50} />
          <Text style={{ left: 90, top: 800 }}>
            <Word enter={0} size={84} color={C.bg}>Субтитры</Word>
            <Word enter={onBeat(1)} size={40} color={C.inkMuted} weight={500}>и чистая речь</Word>
          </Text>
        </>
      )}
    </AbsoluteFill>
  )
}

const timecode = (frame: number) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const s = Math.floor(frame / FPS)
  return `00:00:${pad(s)}:${pad(frame % FPS)}`
}

// 6. Склейка на каждую долю и бегущий таймкод — инструмент монтажёра вместо иконок
const Cuts = ({ f }: SceneProps) => {
  const d = f === 'desktop'
  const frame = useCurrentFrame()
  const clips: Clip[] = [
    { work: 'siteless', at: 3.5 },
    { work: 'findy', at: 19.5 },
    { work: 'morent', at: 12.5 },
    { work: 'ad', at: 20 },
  ]
  return (
    <AbsoluteFill>
      {clips.map((clip, i) => (
        <Sequence key={i} from={onBeat(i)} durationInFrames={BEAT} premountFor={BEAT}>
          <Card clip={clip} h={d ? 860 : 780} x={d ? 200 : 212} y={d ? 110 : 50} from="none" />
        </Sequence>
      ))}
      <Text style={d ? { left: 780, top: '50%', transform: 'translateY(-50%)' } : { left: 90, top: 870 }}>
        <div style={{ fontSize: d ? 96 : 64, fontWeight: 600, letterSpacing: '-0.02em', color: C.light, fontVariantNumeric: 'tabular-nums' }}>
          {timecode(frame + 5 * BAR)}
        </div>
        <Word enter={onBeat(1)} size={d ? 40 : 30} color={C.muted} weight={500}>Склейка на каждую долю</Word>
      </Text>
    </AbsoluteFill>
  )
}

// 7. Таймлайн монтажа: плейхед проходит дорожку за такт, пройденные клипы светлеют
const Timeline = ({ f }: SceneProps) => {
  const d = f === 'desktop'
  const frame = useCurrentFrame()
  const h = d ? 700 : 620
  const w = Math.round((h * 9) / 16)
  const gap = d ? 40 : 24
  const x0 = Math.round(((d ? 1440 : 864) - (w * 2 + gap)) / 2)
  const track = d ? { x: 120, y: 810, w: 1200, h: 120 } : { x: 60, y: 750, w: 744, h: 110 }
  const blocks = [140, 90, 180, 120, 160, 100, 150, 110]
  const total = blocks.reduce((a, b) => a + b, 0)
  const head = interpolate(frame, [0, BAR], [0, 1], { extrapolateRight: 'clamp' })
  let acc = 0
  return (
    <AbsoluteFill>
      <Card clip={{ work: 'morent', at: 10.5 }} h={h} x={x0} y={50} />
      <Card clip={{ work: 'siteless', at: 17.5 }} h={h} x={x0 + w + gap} y={50} enter={onBeat(1)} />
      <div style={{ position: 'absolute', left: track.x, top: track.y, width: track.w, height: track.h, borderRadius: 16, background: C.raise, padding: 16, display: 'flex', gap: 8 }}>
        {blocks.map((b, i) => {
          const start = acc / total
          acc += b
          return <div key={i} style={{ flex: b, borderRadius: 8, background: head > start ? C.gray : C.ghost }} />
        })}
      </div>
      <div style={{ position: 'absolute', left: track.x + head * track.w - 2, top: track.y - 16, width: 4, height: track.h + 32, borderRadius: 2, background: C.accent }} />
    </AbsoluteFill>
  )
}

// 8. Логотип на финальный удар, подпись на вторую долю, в конце уход в фон для бесшовной петли
const End = ({ f }: SceneProps) => {
  const d = f === 'desktop'
  const frame = useCurrentFrame()
  const p = useEnter(0)
  const out = interpolate(frame, [BAR - 12, BAR - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 40, opacity: out }}>
      <Img src={staticFile('logo-full.png')} style={{ width: d ? 760 : 620, opacity: Math.min(1, p * 1.5), transform: `scale(${0.94 + 0.06 * p})` }} />
      <Word enter={onBeat(1)} size={d ? 36 : 30} color={C.muted} weight={500}>Монтаж видео для соцсетей и рекламы</Word>
    </AbsoluteFill>
  )
}

const SCENES = [Intro, Ads, Reels, Rhythm, Subtitles, Cuts, Timeline, End]
if (SCENES.length !== BARS) throw new Error(`Сцен ${SCENES.length}, а тактов в beat.json ${BARS}`)

const Scenes = ({ f }: SceneProps) => (
  <>
    {SCENES.map((Scene, i) => (
      <Sequence key={i} from={i * BAR} durationInFrames={BAR} premountFor={BEAT}>
        <Scene f={f} />
      </Sequence>
    ))}
  </>
)

// Reels 9:16: мобильная раскладка 4:5, увеличенная в 1.25 раза (864×1080 → 1080×1350).
// Сверху отступ под интерфейс Instagram, подписи остаются выше нижней зоны с подписью и кнопками (~1500 px)
const REELS_TOP = 220
const REELS_SCALE = 1.25

// Фон на весь кадр 9:16: в светлом такте («Субтитры») светлый, иначе тёмный
const ReelsBackground = () => {
  const light = Math.floor(useCurrentFrame() / BAR) === SCENES.indexOf(Subtitles)
  return <AbsoluteFill style={{ background: light ? C.light : C.bg }} />
}

// Ник Instagram под логотипом на финальной заставке: зритель Reels сразу видит, куда писать
const Handle = () => {
  const frame = useCurrentFrame()
  const out = interpolate(frame, [BAR - 12, BAR - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ alignItems: 'center', top: 1140, opacity: out }}>
      <Word enter={onBeat(2)} size={48} color={C.light}>@raw_motionframe</Word>
    </AbsoluteFill>
  )
}

export const Showreel = ({ format }: { format: Format | 'reels' }) => (
  <AbsoluteFill style={{ background: C.bg, fontFamily }}>
    {format === 'reels' ? (
      <>
        <ReelsBackground />
        <div style={{ position: 'absolute', left: 0, top: REELS_TOP, width: 864, height: 1080, transform: `scale(${REELS_SCALE})`, transformOrigin: 'top left' }}>
          <Scenes f="mobile" />
        </div>
        <Sequence from={(BARS - 1) * BAR} durationInFrames={BAR}>
          <Handle />
        </Sequence>
      </>
    ) : (
      <Scenes f={format} />
    )}
    <Audio src={staticFile('music.wav')} />
  </AbsoluteFill>
)
