<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import AppButton from '@/components/ui/AppButton.vue'
import FormField from '@/components/ui/FormField.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { LIMITS, useLeadForm } from '@/composables/useLeadForm'
import { prefersReducedMotion } from '@/composables/useAnimation'
import { useReveal } from '@/composables/useReveal'

const root = ref<HTMLElement | null>(null)
const form = ref<HTMLFormElement | null>(null)
const success = ref<HTMLElement | null>(null)
const { fields, errors, status, submit } = useLeadForm()

useReveal(root)

async function onSubmit() {
  if (await submit()) return
  await nextTick()
  form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}

watch(status, async (value) => {
  if (value !== 'success') return
  await nextTick()
  if (!success.value) return
  success.value.focus()
  if (!prefersReducedMotion()) {
    gsap.from(success.value.children, { opacity: 0, y: 16, scale: 0.96, duration: 0.6, stagger: 0.1, ease: 'back.out(1.6)' })
  }
})
</script>

<template>
  <section id="lead" ref="root" class="section lead" aria-labelledby="lead-title">
    <div class="container lead__inner">
      <div class="lead__intro">
        <p class="eyebrow">Заявка</p>
        <SplitHeading id="lead-title" class="section-title" text="Обсудим ваш ролик" accent="ролик" />
        <p class="lead__text">Оставьте контакты: ответим, уточним задачу и назовём точную стоимость.</p>
      </div>

      <div class="lead__card frame" data-reveal>
        <div v-if="status === 'success'" ref="success" class="lead__success" tabindex="-1" role="status">
          <span class="lead__check" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.5" /></svg>
          </span>
          <p class="lead__success-title">Заявка отправлена</p>
          <p class="lead__text">Скоро свяжемся с вами.</p>
          <AppButton variant="ghost" @click="status = 'idle'">Отправить ещё одну</AppButton>
        </div>

        <form v-else ref="form" class="lead__form" novalidate @submit.prevent="onSubmit">
          <FormField id="lead-name" v-slot="{ id, describedby, invalid }" label="Имя" :error="errors.name" required>
            <input :id="id" v-model="fields.name" name="name" type="text" autocomplete="name" :maxlength="LIMITS.name" required :aria-invalid="invalid" :aria-describedby="describedby" />
          </FormField>

          <FormField id="lead-company" v-slot="{ id, describedby, invalid }" label="Компания" hint="Название компании или «частное лицо»" :error="errors.company" required>
            <input :id="id" v-model="fields.company" name="company" type="text" autocomplete="organization" :maxlength="LIMITS.company" required :aria-invalid="invalid" :aria-describedby="describedby" />
          </FormField>

          <FormField id="lead-contact" v-slot="{ id, describedby, invalid }" label="Контакты" hint="Телефон, Telegram или Instagram: +7 777 123 45 67, @username" :error="errors.contact" required>
            <input :id="id" v-model="fields.contact" name="contact" type="text" autocomplete="tel" :maxlength="LIMITS.contact" required :aria-invalid="invalid" :aria-describedby="describedby" />
          </FormField>

          <FormField id="lead-message" v-slot="{ id, describedby, invalid }" label="Описание задачи" :error="errors.message">
            <textarea :id="id" v-model="fields.message" name="message" :maxlength="LIMITS.message" :aria-invalid="invalid" :aria-describedby="describedby"></textarea>
          </FormField>

          <!-- Honeypot: скрыт от людей, боты заполняют -->
          <div class="lead__hp" aria-hidden="true">
            <label for="lead-website">Сайт</label>
            <input id="lead-website" v-model="fields.website" name="website" type="text" tabindex="-1" autocomplete="off" />
          </div>

          <div class="lead__consent">
            <input
              id="lead-consent"
              v-model="fields.consent"
              type="checkbox"
              name="consent"
              required
              :aria-invalid="!!errors.consent"
              :aria-describedby="errors.consent ? 'lead-consent-error' : undefined"
            />
            <label for="lead-consent">
              Согласен на обработку персональных данных согласно
              <RouterLink to="/privacy">политике конфиденциальности</RouterLink>
            </label>
            <p v-if="errors.consent" id="lead-consent-error" class="lead__field-error">{{ errors.consent }}</p>
          </div>

          <AppButton type="submit" :disabled="status === 'loading'" class="lead__submit">
            {{ status === 'loading' ? 'Отправляем…' : 'Отправить заявку' }}
          </AppButton>

          <p v-if="status === 'error'" class="lead__error" role="alert">
            Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в Instagram.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lead__inner { display: grid; gap: 40px; }

.lead__text { margin-top: 16px; color: var(--color-muted); max-width: 30em; }

.lead__card { padding: 28px 20px; }

.lead__form { display: grid; gap: 20px; }

.lead__hp {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.lead__consent {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  align-items: start;
  font-size: 14px;
  color: var(--color-muted);
}

.lead__consent input {
  width: 20px;
  height: 20px;
  margin: 1px 0 0;
  accent-color: var(--color-accent);
}

.lead__consent a { color: var(--color-text); }

.lead__field-error { grid-column: 2; font-size: 13px; color: var(--color-error); }

.lead__submit { width: 100%; }

.lead__error { color: var(--color-error); font-size: 14px; }

.lead__success {
  display: grid;
  justify-items: start;
  gap: 8px;
  outline: none;
}

.lead__check {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 8px;
  background: var(--color-accent);
  color: var(--color-ink);
}

.lead__success-title { font-size: 28px; font-weight: 800; }

.lead__success .btn { margin-top: 16px; }

@media (min-width: 960px) {
  .lead__inner { grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: start; }
  .lead__card { padding: 48px; }
}
</style>
