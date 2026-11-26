import type { Component } from 'vue'

export interface Service {
  title: string
  description: string
  icon: Component
  /** Что входит: короткие пункты для сетки в панели услуги */
  includes: string[]
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
  note: string
  price: number
  /** Сколько роликов в пакете: показываем цену за один */
  units?: number
}

export interface Partner {
  name: string
  /** Без url логотип показывается без ссылки */
  url?: string
  /** Путь в public/partners. Пока файла нет, показываем текстовый вордмарк */
  logo?: string
  /** Чем занимается компания, 1–2 предложения */
  description?: string
  /** Сфера: плашка в углу карточки */
  tag?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ProcessStep {
  title: string
  text: string
  icon: Component
}

export interface NavLink {
  hash: string
  label: string
}
