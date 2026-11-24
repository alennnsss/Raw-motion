export interface Service {
  title: string
  description: string
}

export interface PortfolioItem {
  id: string
  title: string
  category: string
  /** Короткое превью без звука, ~2–3 МБ */
  preview?: string
  /** Полное видео для модалки */
  full?: string
  poster?: string
  width: number
  height: number
  /** YYYY-MM-DD, нужен для VideoObject в JSON-LD */
  uploadDate?: string
}

export interface PriceItem {
  service: string
  price: number
}

export interface Partner {
  name: string
  url: string
  /** Путь в public/partners. Пока файла нет, показываем текстовый вордмарк */
  logo?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ProcessStep {
  title: string
  text: string
}

export interface NavLink {
  hash: string
  label: string
}
