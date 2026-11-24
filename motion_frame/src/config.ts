import type { NavLink } from '@/types'

export const SITE_URL = import.meta.env.VITE_SITE_URL
export const SITE_NAME = 'Raw Motion Frame'
export const INSTAGRAM_URL = 'https://www.instagram.com/raw_motionframe/'

export const navLinks: NavLink[] = [
  { hash: '#services', label: 'Услуги' },
  { hash: '#portfolio', label: 'Работы' },
  { hash: '#process', label: 'Этапы' },
  { hash: '#pricing', label: 'Цены' },
  { hash: '#faq', label: 'FAQ' },
]
