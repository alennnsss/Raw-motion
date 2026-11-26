import type { Partner } from '@/types'

// Иконки взяты с сайтов партнёров (favicon), отдельного вордмарка у них нет: показываем иконку + название.
// Описания пересказывают сайты партнёров, своего не добавляем
export const partners: Partner[] = [
  {
    name: 'Findy Job',
    url: 'https://findy-job.com',
    logo: '/partners/findy-job.png',
    tag: 'Найм',
    description: 'База резюме для найма в Казахстане: поиск по специальности и городу.',
  },
  {
    name: 'Siteless',
    url: 'https://geoapify-bot.vercel.app/',
    logo: '/partners/siteless.svg',
    tag: 'Лиды',
    description: 'Telegram-бот находит компании без сайта, но с телефоном. Готовые лиды для веб-студий и фрилансеров.',
  },
  {
    name: 'Morent',
    url: 'https://morent-car-rental.vercel.app/',
    logo: '/partners/morent.png',
    tag: 'Аренда авто',
    description: 'Платформа аренды автомобилей: выбор машины, города и дат прямо на сайте.',
  },
  // Сайта ArtBoard пока нет: показываем без ссылки
  {
    name: 'ArtBoard',
    logo: '/partners/artboard.png',
    tag: 'Искусство',
    description: 'Галерея картин.',
  },
]
