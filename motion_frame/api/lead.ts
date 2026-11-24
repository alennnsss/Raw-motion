// Vercel Function: принимает заявку с сайта и пересылает её в Telegram.
// Токен бота живёт только здесь, в переменных окружения Vercel, и никогда не попадает во фронтенд.

// Те же лимиты и проверка контакта есть на клиенте в src/composables/useLeadForm.ts
const LIMITS = { name: 80, company: 120, contact: 100, message: 2000 } as const
const MIN_FILL_MS = 3000
const MAX_BODY_CHARS = 10_000

export interface Lead {
  name: string
  company: string
  contact: string
  message: string
}

function isValidContact(value: string): boolean {
  if (/^\+?[\d\s()-]+$/.test(value)) {
    const digits = value.replace(/\D/g, '').length
    return digits >= 10 && digits <= 15
  }
  return /^@[\w.]{3,32}$/.test(value) || /^(https?:\/\/)?(www\.)?(t\.me|instagram\.com)\/[\w.]{3,32}\/?$/i.test(value)
}

function readField(body: Record<string, unknown>, key: keyof typeof LIMITS, minLength: number): string | null {
  const value = body[key] ?? ''
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length >= minLength && trimmed.length <= LIMITS[key] ? trimmed : null
}

/** 'spam' — сработала ловушка для ботов, null — данные не прошли проверку */
export function parseLead(raw: unknown): Lead | 'spam' | null {
  if (typeof raw !== 'object' || raw === null) return null
  const body = raw as Record<string, unknown>

  if (body.website) return 'spam'
  if (typeof body.elapsedMs !== 'number' || body.elapsedMs < MIN_FILL_MS) return 'spam'
  if (body.consent !== true) return null

  const name = readField(body, 'name', 2)
  const company = readField(body, 'company', 2)
  const contact = readField(body, 'contact', 1)
  const message = readField(body, 'message', 0)
  if (name === null || company === null || contact === null || message === null) return null
  if (!isValidContact(contact)) return null

  return { name, company, contact, message }
}

export function formatLead(lead: Lead, now = new Date()): string {
  const time = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Almaty',
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(now)

  return [
    'Новая заявка с сайта',
    '',
    `Имя: ${lead.name}`,
    `Компания: ${lead.company}`,
    `Контакты: ${lead.contact}`,
    `Задача: ${lead.message || 'не указана'}`,
    `Время: ${time} (Алматы)`,
  ].join('\n')
}

const json = (status: number, data: Record<string, unknown>) => Response.json(data, { status })

export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('[lead] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы')
    return json(500, { error: 'not_configured' })
  }

  const text = await request.text()
  if (text.length > MAX_BODY_CHARS) return json(413, { error: 'too_large' })

  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return json(400, { error: 'bad_json' })
  }

  const lead = parseLead(raw)
  // Боту отвечаем «успехом», чтобы он не подбирал обход
  if (lead === 'spam') return json(200, { ok: true })
  if (!lead) return json(400, { error: 'invalid' })

  try {
    // Без parse_mode: текст уходит как есть, экранировать HTML/Markdown не нужно
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: formatLead(lead), disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) {
      console.error('[lead] Telegram ответил', res.status, await res.text())
      return json(502, { error: 'telegram' })
    }
  } catch (error) {
    console.error('[lead] Не удалось достучаться до Telegram', error)
    return json(502, { error: 'telegram' })
  }

  return json(200, { ok: true })
}
