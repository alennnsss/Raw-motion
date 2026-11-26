import { Composition } from 'remotion'
import { Cover } from './Cover'
import { Showreel } from './Showreel'
import { DURATION, FPS } from './grid'

// Две версии под блок в Hero: десктоп 4:3, телефон 4:5
export const Root = () => (
  <>
    <Composition id="desktop" component={Showreel} durationInFrames={DURATION} fps={FPS} width={1440} height={1080} defaultProps={{ format: 'desktop' as const }} />
    <Composition id="mobile" component={Showreel} durationInFrames={DURATION} fps={FPS} width={864} height={1080} defaultProps={{ format: 'mobile' as const }} />
    {/* Для публикации в Instagram Reels / TikTok / Shorts */}
    <Composition id="reels" component={Showreel} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{ format: 'reels' as const }} />
    {/* Обложка — композиция, а не Still: видео в Still длиной 1 кадр не перематывается к trimBefore */}
    <Composition id="cover" component={Cover} durationInFrames={FPS} fps={FPS} width={1080} height={1920} />
  </>
)
