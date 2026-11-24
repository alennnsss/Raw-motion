import type { PortfolioItem } from '@/types'

// Заглушки до реальных роликов. Файлы класть в public/videos/ по схеме:
//   <id>-preview.mp4 (без звука, ~2–3 МБ), <id>.mp4 (полное), <id>-poster.webp
// и заполнить preview / full / poster / uploadDate.
export const portfolio: PortfolioItem[] = [
  { id: 'reels-01', title: 'Reels для эксперта', category: 'Reels', width: 1080, height: 1920 },
  { id: 'ad-01', title: 'Рекламный ролик студии', category: 'Реклама', width: 1080, height: 1920 },
  { id: 'subtitles-01', title: 'Ролик с субтитрами', category: 'Субтитры', width: 1080, height: 1920 },
  { id: 'reels-02', title: 'Reels для бренда', category: 'Reels', width: 1080, height: 1920 },
]
