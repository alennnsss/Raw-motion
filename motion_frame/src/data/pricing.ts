import type { PriceItem } from '@/types'

// Первые две цены задал владелец, остальные выставлены по рынку и могут меняться
export const pricing: PriceItem[] = [
  { service: 'Монтаж Reels / TikTok / Shorts', note: 'Вертикальное видео до 60 секунд', price: 5000 },
  { service: 'Субтитры', note: 'Анимированные субтитры к готовому ролику', price: 3000 },
  { service: 'Монтаж под ключ', note: 'Монтаж, субтитры, графика и звук', price: 8000 },
  { service: 'Рекламный ролик', note: 'Моушн, цветокоррекция, саунд-дизайн', price: 15000 },
  { service: 'Видео для YouTube', note: 'Монтаж длинного горизонтального видео', price: 10000 },
  { service: 'Пакет 10 роликов', note: 'Для тех, кто публикуется регулярно', price: 45000, units: 10 },
]

const amount = (price: number) => new Intl.NumberFormat('ru-RU').format(price)

export const formatPrice = (price: number) => `от ${amount(price)} ₸`
export const formatAmount = (price: number) => `${amount(price)} ₸`
