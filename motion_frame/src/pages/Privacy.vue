<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import { INSTAGRAM_URL, SITE_NAME, SITE_URL } from '@/config'

const title = 'Политика конфиденциальности | Raw Motion Frame'
const description = 'Как студия видеомонтажа Raw Motion Frame обрабатывает данные, которые вы оставляете в форме заявки.'
const url = `${SITE_URL}/privacy`

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url,
  ogLocale: 'ru_RU',
  ogSiteName: SITE_NAME,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({ link: [{ rel: 'canonical', href: url }] })
</script>

<!-- Черновик. Итоговый текст должен утвердить владелец -->
<template>
  <main id="main" class="section privacy">
    <div class="container privacy__inner">
      <p class="eyebrow">Документ</p>
      <h1 class="privacy__title">Политика конфиденциальности</h1>

      <h2>Какие данные мы собираем</h2>
      <p>
        Через форму заявки вы передаёте имя, название компании (или пометку «частное лицо»), контакт для связи
        (телефон, Telegram или Instagram) и, по желанию, описание задачи.
      </p>

      <h2>Зачем</h2>
      <p>Только чтобы связаться с вами, обсудить задачу и рассчитать стоимость монтажа.</p>

      <h2>Как хранятся данные</h2>
      <p>
        Заявка передаётся в закрытый Telegram-чат студии. Мы не продаём данные и не передаём их третьим лицам, кроме
        случаев, предусмотренных законодательством Республики Казахстан.
      </p>

      <h2>Cookie и аналитика</h2>
      <p>Сайт не использует cookie для отслеживания и не подключает системы аналитики.</p>

      <h2>Ваши права</h2>
      <p>
        Вы можете попросить уточнить, изменить или удалить ваши данные. Напишите нам в
        <a :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer">Instagram</a>.
      </p>

      <p class="privacy__back"><RouterLink to="/">← На главную</RouterLink></p>
    </div>
  </main>
</template>

<style scoped>
.privacy__inner { max-width: 760px; }

.privacy__title {
  margin-bottom: 40px;
  font-size: clamp(36px, 9vw, 64px);
}

.privacy h2 {
  margin: 32px 0 12px;
  font-size: 22px;
}

.privacy p { color: var(--color-muted); }

.privacy a { color: var(--color-text); }

.privacy__back { margin-top: 48px; }
</style>
