import { onMounted, reactive, ref, watch } from 'vue'

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

// Выбор тарифа в «Ценах» подставляется в описание задачи, чтобы не печатать его заново
const TOPIC_PREFIX = 'Интересует: '
const leadTopic = ref('')
export const chooseTopic = (topic: string) => {
  leadTopic.value = topic
}
type FieldName = 'name' | 'company' | 'contact' | 'message' | 'consent'

// Те же лимиты и проверка контакта продублированы на сервере в api/lead.ts
export const LIMITS = { name: 80, company: 120, contact: 100, message: 2000 } as const

export function isValidContact(value: string): boolean {
  const s = value.trim()
  if (/^\+?[\d\s()-]+$/.test(s)) {
    const digits = s.replace(/\D/g, '').length
    return digits >= 10 && digits <= 15
  }
  return /^@[\w.]{3,32}$/.test(s) || /^(https?:\/\/)?(www\.)?(t\.me|instagram\.com)\/[\w.]{3,32}\/?$/i.test(s)
}

export function useLeadForm() {
  const fields = reactive({
    name: '',
    company: '',
    contact: '',
    message: '',
    consent: false,
    website: '', // honeypot: человек его не видит, бот заполняет
  })
  const errors = reactive<Partial<Record<FieldName, string>>>({})
  const status = ref<FormStatus>('idle')
  let startedAt = 0

  onMounted(() => {
    startedAt = Date.now()
  })

  watch(leadTopic, (topic) => {
    const message = fields.message.trim()
    if (topic && (!message || message.startsWith(TOPIC_PREFIX))) fields.message = TOPIC_PREFIX + topic
  })

  function validate(): boolean {
    const name = fields.name.trim()
    const company = fields.company.trim()
    const contact = fields.contact.trim()

    errors.name = !name ? 'Укажите имя' : name.length < 2 ? 'Имя слишком короткое' : name.length > LIMITS.name ? 'Имя слишком длинное' : undefined
    errors.company = company.length < 2 ? 'Укажите компанию или «частное лицо»' : company.length > LIMITS.company ? 'Слишком длинное название' : undefined
    errors.contact = !contact
      ? 'Укажите телефон, Telegram или Instagram'
      : contact.length > LIMITS.contact || !isValidContact(contact)
        ? 'Проверьте формат: +7 777 123 45 67, @username или instagram.com/username'
        : undefined
    errors.message = fields.message.trim().length > LIMITS.message ? `Не больше ${LIMITS.message} символов` : undefined
    errors.consent = fields.consent ? undefined : 'Нужно согласие на обработку данных'

    return !Object.values(errors).some(Boolean)
  }

  /** Возвращает false, если форма не прошла проверку на клиенте */
  async function submit(): Promise<boolean> {
    if (status.value === 'loading') return true
    if (!validate()) return false

    status.value = 'loading'
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name.trim(),
          company: fields.company.trim(),
          contact: fields.contact.trim(),
          message: fields.message.trim(),
          consent: fields.consent,
          website: fields.website,
          elapsedMs: Date.now() - startedAt,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      status.value = 'success'
      Object.assign(fields, { name: '', company: '', contact: '', message: '', consent: false })
      startedAt = Date.now()
    } catch {
      status.value = 'error'
    }
    return true
  }

  return { fields, errors, status, submit }
}
