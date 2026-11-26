import { Composition } from 'remotion'
import { Showreel } from './Showreel'
import { DURATION, FPS } from './grid'

// Две версии под блок в Hero: десктоп 4:3, телефон 4:5
export const Root = () => (
  <>
    <Composition id="desktop" component={Showreel} durationInFrames={DURATION} fps={FPS} width={1440} height={1080} defaultProps={{ format: 'desktop' as const }} />
    <Composition id="mobile" component={Showreel} durationInFrames={DURATION} fps={FPS} width={864} height={1080} defaultProps={{ format: 'mobile' as const }} />
  </>
)
