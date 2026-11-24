import type { Partner } from '@/types'

// Иконки взяты с сайтов партнёров (favicon), отдельного вордмарка у них нет: показываем иконку + название
export const partners: Partner[] = [
  { name: 'Findy Job', url: 'https://findy-job.com', logo: '/partners/findy-job.png' },
  { name: 'Siteless', url: 'https://geoapify-bot.vercel.app/', logo: '/partners/siteless.svg' },
  { name: 'Morent', url: 'https://morent-car-rental.vercel.app/', logo: '/partners/morent.png' },
  // Сайта ArtBoard пока нет: показываем без ссылки
  { name: 'ArtBoard', logo: '/partners/artboard.png' },
]
