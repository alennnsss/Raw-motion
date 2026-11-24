<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { Check } from 'lucide-vue-next'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import AppButton from '@/components/ui/AppButton.vue'
import FormField from '@/components/ui/FormField.vue'
import SplitHeading from '@/components/animations/SplitHeading.vue'
import { INSTAGRAM_URL } from '@/config'
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
  <section id="lead" ref="root" class="section lead dark" data-rise aria-labelledby="lead-title">
    <div class="container lead__inner">
      <div class="lead__intro">
        <SplitHeading id="lead-title" class="lead__title" text="Оставить заявку" />
        <p class="section-intro">Расскажите, что нужно смонтировать. Мы ответим, уточним детали и назовём точную стоимость.</p>
        <p class="lead__alt">
          Удобнее в директ? Пишите в
          <a :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer">Instagram</a>.
        </p>
      </div>

      <div class="lead__card" data-reveal>
        <div v-if="status === 'success'" ref="success" class="lead__success" tabindex="-1" role="status">
          <span class="lead__check" aria-hidden="true"><Check :size="28" :stroke-width="2.5" /></span>
          <p class="lead__success-title">Заявка отправлена</p>
          <p class="lead__success-text">Скоро свяжемся с вами.</p>
          <AppButton variant="dark" @click="status = 'idle'">Отправить ещё одну</AppButton>
        </div>

        <form v-else ref="form" class="lead__form" novalidate @submit.prevent="onSubmit">
          <div class="lead__row">
            <FormField id="lead-name" v-slot="{ id, describedby, invalid }" label="Имя" :error="errors.name" required>
              <InputText :id="id" v-model="fields.name" name="name" autocomplete="name" :maxlength="LIMITS.name" required fluid :invalid="invalid" :aria-invalid="invalid || undefined" :aria-describedby="describedby" />
            </FormField>

            <FormField id="lead-company" v-slot="{ id, describedby, invalid }" label="Компания" :error="errors.company" required>
              <InputText :id="id" v-model="fields.company" name="company" autocomplete="organization" :maxlength="LIMITS.company" required fluid :invalid="invalid" :aria-invalid="invalid || undefined" :aria-describedby="describedby" />
            </FormField>
          </div>

          <FormField id="lead-contact" v-slot="{ id, describedby, invalid }" label="Контакты" hint="Телефон, Telegram или Instagram: +7 777 123 45 67, @username" :error="errors.contact" required>
            <InputText :id="id" v-model="fields.contact" name="contact" autocomplete="tel" :maxlength="LIMITS.contact" required fluid :invalid="invalid" :aria-invalid="invalid || undefined" :aria-describedby="describedby" />
          </FormField>

          <FormField id="lead-message" v-slot="{ id, describedby, invalid }" label="Описание задачи" :error="errors.message">
            <Textarea :id="id" v-model="fields.message" name="message" :maxlength="LIMITS.message" rows="4" auto-resize fluid :invalid="invalid" :aria-invalid="invalid || undefined" :aria-describedby="describedby" />
          </FormField>

          <!-- Honeypot: скрыт от людей, боты заполняют -->
          <div class="lead__hp" aria-hidden="true">
            <label for="lead-website">Сайт</label>
            <input id="lead-website" v-model="fields.website" name="website" type="text" tabindex="-1" autocomplete="off" />
          </div>

          <div class="lead__consent">
            <Checkbox
              v-model="fields.consent"
              input-id="lead-consent"
              name="consent"
              binary
              required
              :invalid="!!errors.consent"
              :pt="{ input: { 'aria-describedby': errors.consent ? 'lead-consent-error' : undefined } }"
            />
            <label for="lead-consent">
              Согласен на обработку персональных данных согласно
              <RouterLink to="/privacy">политике конфиденциальности</RouterLink>
            </label>
            <p v-if="errors.consent" id="lead-consent-error" class="lead__field-error">{{ errors.consent }}</p>
          </div>

          <AppButton type="submit" arrow :disabled="status === 'loading'" class="lead__submit">
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
.lead { border-radius: var(--radius-lg) var(--radius-lg) 0 0; }

.lead__inner { display: grid; gap: 40px; }

.lead__title { font-size: clamp(44px, 9vw, 104px); line-height: 1; }

.lead__alt { margin-top: 24px; color: var(--muted); }
.lead__alt a { color: var(--color-text); text-underline-offset: 4px; }

.lead__card {
  padding: 24px 20px;
  border-radius: var(--radius);
  background: var(--color-surface);
}

.lead__form { display: grid; gap: 20px; }

.lead__row { display: grid; gap: 20px; }

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
  color: var(--muted);
}

.lead__consent a { color: var(--color-text); text-underline-offset: 3px; }

.lead__field-error { grid-column: 2; font-size: 13px; color: var(--color-error); }

.lead__submit { width: 100%; }

.lead__error { color: var(--color-error); font-size: 14px; }

.lead__success { display: grid; justify-items: start; gap: 8px; outline: none; }

.lead__check {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 8px;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-ink);
}

.lead__success-title { font-size: 30px; font-weight: 600; letter-spacing: -0.03em; }

.lead__success-text { margin-bottom: 16px; color: var(--muted); }

@media (min-width: 640px) {
  .lead__row { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 960px) {
  .lead__inner { grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  .lead__card { padding: 40px; }
}
</style>
