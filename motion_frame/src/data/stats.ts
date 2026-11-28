// Только факты из брифа. Новые цифры добавлять только с подтверждения владельца
export interface Stat {
  value: string
  label: string
  /** Если задано, число анимируется count-up до этого значения */
  countTo?: number
}

export const stats: Stat[] = [
  { value: '100+', label: 'смонтированных роликов', countTo: 100 },
  { value: 'от 3 000 ₸', label: 'стоимость работ' },
]
