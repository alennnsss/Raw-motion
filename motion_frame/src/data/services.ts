import { AudioWaveform, Captions, Clapperboard, Layers, MonitorPlay, Smartphone } from 'lucide-vue-next'
import type { Service } from '@/types'

// Порядок важен: первая услуга крупная, последняя растянута на всю ширину
export const services: Service[] = [
  {
    title: 'Монтаж Reels, TikTok и Shorts',
    description: 'Вертикальные ролики до 60 секунд. Режем паузы, держим темп и делаем сильное начало, чтобы видео не пролистывали.',
    icon: Smartphone,
    tags: ['Reels', 'TikTok', 'Shorts', '9:16'],
  },
  {
    title: 'Субтитры',
    description: 'Крупные читаемые субтитры. Ролик понятен даже без звука.',
    icon: Captions,
  },
  {
    title: 'Рекламные ролики',
    description: 'Моушн-графика, цветокоррекция и саунд-дизайн для рекламы товаров и услуг.',
    icon: Clapperboard,
  },
  {
    title: 'Видео для YouTube',
    description: 'Длинные ролики: собираем структуру, держим темп, чистим звук.',
    icon: MonitorPlay,
  },
  {
    title: 'Графика и звук',
    description: 'Титры, плашки, подбор музыки и чистка голоса.',
    icon: AudioWaveform,
  },
  {
    title: 'Пакеты роликов',
    description: 'Несколько роликов по фиксированной цене. Удобно, если вы публикуетесь регулярно.',
    icon: Layers,
  },
]
