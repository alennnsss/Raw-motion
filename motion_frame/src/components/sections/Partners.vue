<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import Marquee from '@/components/animations/Marquee.vue'
import { partners } from '@/data/partners'
</script>

<template>
  <section id="partners" class="partners" aria-labelledby="partners-title">
    <div class="container">
      <h2 id="partners-title" class="partners__title">С нами сотрудничают</h2>
    </div>
    <Marquee class="partners__marquee" :items="partners" label="карточки партнёров" :min-items="6" :duration="70">
      <template #default="{ item, hidden }">
        <component
          :is="item.url ? 'a' : 'div'"
          class="partner"
          :href="item.url"
          :target="item.url ? '_blank' : undefined"
          :rel="item.url ? 'noopener noreferrer' : undefined"
          :tabindex="item.url && hidden ? -1 : undefined"
        >
          <div class="partner__top">
            <img v-if="item.logo" :src="item.logo" :alt="`Логотип ${item.name}`" width="56" height="56" class="partner__logo" loading="lazy" />
            <span v-if="item.tag" class="partner__tag">{{ item.tag }}</span>
          </div>
          <h3 class="partner__name">{{ item.name }}</h3>
          <p v-if="item.description" class="partner__text">{{ item.description }}</p>
          <span v-if="item.url" class="partner__cta">
            На сайт <ArrowUpRight :size="16" aria-hidden="true" />
          </span>
        </component>
      </template>
    </Marquee>
  </section>
</template>

<style scoped>
.partners { padding-block: 56px 40px; }

.partners__title {
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  color: var(--muted);
}

/* Без затухания по краям: на тёмных карточках оно даёт серое пятно, карточки просто уходят за край */
.partners__marquee { --marquee-gap: 12px; --marquee-mask: none; }

/* Тёмная карточка на светлом фоне, как тёмные блоки сайта */
.partner {
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 280px;
  padding: 20px;
  border-radius: var(--radius-lg);
  background: var(--color-bg);
  color: var(--color-text);
  text-decoration: none;
  transition: transform 0.4s var(--ease);
}

.partner__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: auto;
}

/* Иконки партнёров в одной логике: одинаковый размер и скругление, как у иконок приложений */
.partner__logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
}

.partner__tag {
  padding: 4px 12px;
  border: 1px solid var(--gray-2);
  border-radius: 999px;
  color: var(--color-muted);
  font-size: 13px;
  white-space: nowrap;
}

.partner__name {
  margin-top: 20px;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.partner__text {
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  color: var(--color-muted);
  font-size: 14px;
  line-height: 1.45;
  white-space: normal;
}

.partner__cta {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 16px;
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  background: var(--color-light);
  color: var(--color-ink);
  font-size: 14px;
  font-weight: 500;
}

a.partner:hover,
a.partner:focus-visible { transform: translateY(-4px); }

@media (min-width: 1024px) {
  .partners__marquee { --marquee-gap: 16px; }
  .partner { width: 340px; height: 300px; padding: 24px; }
  .partner__name { font-size: 30px; }
}

@media (prefers-reduced-motion: reduce) {
  .partner { transition: none; }
  a.partner:hover,
  a.partner:focus-visible { transform: none; }
}
</style>
