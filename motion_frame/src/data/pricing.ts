import type { PriceItem } from '@/types'

// Первые две цены задал владелец, остальные выставлены по рынку и могут меняться
export const pricing: PriceItem[] = [
  { service: 'Монтаж видео (Reels / TikTok / Shorts до 60 сек)', price: 5000 },
  { service: 'Добавление субтитров', price: 3000 },
  { service: 'Монтаж + субтитры + графика и звук', price: 8000 },
  { service: 'Рекламный ролик (моушн, цветокоррекция, саунд-дизайн)', price: 15000 },
  { service: 'Монтаж длинного видео (YouTube)', price: 10000 },
  { service: 'Пакет 10 роликов', price: 45000 },
]

export const formatPrice = (price: number) => `от ${new Intl.NumberFormat('ru-RU').format(price)} ₸`
