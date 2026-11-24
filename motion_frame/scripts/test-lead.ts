// Самопроверка api/lead.ts без сети: npm test
import assert from 'node:assert/strict'
import { formatLead, parseLead, POST } from '../api/lead.ts'

const valid = {
  name: 'Иван',
  company: 'частное лицо',
  contact: '@ivan_test',
  message: '',
  consent: true,
  website: '',
  elapsedMs: 5000,
}

// Проверка полей
assert.deepEqual(parseLead(valid), { name: 'Иван', company: 'частное лицо', contact: '@ivan_test', message: '' })
assert.equal(parseLead({ ...valid, website: 'http://spam' }), 'spam')
assert.equal(parseLead({ ...valid, elapsedMs: 500 }), 'spam')
assert.equal(parseLead({ ...valid, consent: false }), null)
assert.equal(parseLead({ ...valid, name: ' ' }), null)
assert.equal(parseLead({ ...valid, contact: 'просто текст' }), null)
assert.equal(parseLead({ ...valid, contact: '12345' }), null)
assert.equal(parseLead({ ...valid, message: 'x'.repeat(2001) }), null)
assert.equal(parseLead('строка'), null)
for (const contact of ['+7 777 123 45 67', '8(777)1234567', 't.me/raw_motion', 'https://www.instagram.com/raw_motionframe/']) {
  assert.notEqual(parseLead({ ...valid, contact }), null, contact)
}
assert.match(formatLead({ ...valid }, new Date('2026-01-01T10:00:00Z')), /Задача: не указана/)

// Обработчик с подменённым fetch
process.env.TELEGRAM_BOT_TOKEN = 'test-token'
process.env.TELEGRAM_CHAT_ID = '42'
const sent: string[] = []
globalThis.fetch = async (_url, init) => {
  sent.push(String(init?.body))
  return new Response('{"ok":true}', { status: 200 })
}

const post = (body: unknown) =>
  POST(new Request('http://localhost/api/lead', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }))

assert.equal((await post(valid)).status, 200)
assert.equal(sent.length, 1)
assert.equal(JSON.parse(sent[0]).chat_id, '42')

assert.equal((await post({ ...valid, website: 'bot' })).status, 200)
assert.equal(sent.length, 1, 'спам не должен уходить в Telegram')

assert.equal((await post({ ...valid, contact: '' })).status, 400)
assert.equal((await post('{не json')).status, 400)
assert.equal((await post({ ...valid, message: 'x'.repeat(20_000) })).status, 413)

globalThis.fetch = async () => new Response('fail', { status: 500 })
assert.equal((await post(valid)).status, 502)

delete process.env.TELEGRAM_BOT_TOKEN
assert.equal((await post(valid)).status, 500)

console.log('api/lead.ts: все проверки пройдены')
