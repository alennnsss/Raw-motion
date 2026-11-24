import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// Тема Aura, перекрашенная в фирменные цвета из брендбука.
// shortcut: поля ввода есть только в тёмном блоке формы, поэтому одна схема без dark mode.
// PrimeVue считает переменные компонентов на :root, и переключение схемы внутри .dark до них не доходит.
// Если поля появятся на светлом фоне, понадобится вторая схема (или pass-through классы).
export const RawPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f9ffe5',
      100: '#f0ffbf',
      200: '#e4ff8a',
      300: '#d7ff4d',
      400: '#ceff1f',
      500: '#c6ff00',
      600: '#a3d100',
      700: '#7c9f00',
      800: '#5c7600',
      900: '#3d4f00',
      950: '#1f2800',
    },
    formField: {
      paddingX: '16px',
      paddingY: '14px',
      borderRadius: '10px',
      focusRing: { width: '0', style: 'none', color: 'transparent', offset: '0', shadow: 'none' },
    },
    colorScheme: {
      light: {
        primary: { color: '#c6ff00', contrastColor: '#0a0a0a', hoverColor: '#d7ff4d', activeColor: '#ceff1f' },
        formField: {
          background: '#0a0a0a',
          disabledBackground: '#141413',
          borderColor: '#504f4d',
          hoverBorderColor: '#757570',
          focusBorderColor: '#c6ff00',
          invalidBorderColor: '#ff8a7a',
          color: '#f2f0ea',
          placeholderColor: '#9a9992',
          shadow: 'none',
        },
      },
    },
  },
})
