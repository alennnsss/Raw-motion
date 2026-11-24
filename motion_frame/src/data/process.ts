import { CircleCheck, FolderUp, MessageSquareText, Scissors, Send } from 'lucide-vue-next'
import type { ProcessStep } from '@/types'

export const processSteps: ProcessStep[] = [
  { title: 'Заявка', text: 'Вы пишете, что нужно. Мы уточняем задачу, сроки и называем цену.', icon: Send },
  { title: 'Материалы', text: 'Присылаете исходники и примеры, которые нравятся.', icon: FolderUp },
  { title: 'Монтаж', text: 'Собираем ролик: ритм, субтитры, графика, музыка и звук.', icon: Scissors },
  { title: 'Правки', text: 'Показываем черновик и правим по вашим комментариям.', icon: MessageSquareText },
  { title: 'Готовый ролик', text: 'Отдаём файл в нужном формате, можно сразу публиковать.', icon: CircleCheck },
]
