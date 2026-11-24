<script setup lang="ts">
import Marquee from '@/components/animations/Marquee.vue'
import { partners } from '@/data/partners'
</script>

<template>
  <section id="partners" class="partners" aria-labelledby="partners-title">
    <div class="container">
      <h2 id="partners-title" class="partners__title">С нами сотрудничают</h2>
    </div>
    <Marquee :items="partners" label="логотипы партнёров" :duration="28">
      <template #default="{ item, hidden }">
        <component
          :is="item.url ? 'a' : 'span'"
          class="partners__link"
          :href="item.url"
          :target="item.url ? '_blank' : undefined"
          :rel="item.url ? 'noopener noreferrer' : undefined"
          :tabindex="item.url && hidden ? -1 : undefined"
        >
          <img v-if="item.logo" :src="item.logo" alt="" width="40" height="40" class="partners__logo" />
          <span class="partners__wordmark">{{ item.name }}</span>
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

.partners__link {
  display: flex;
  align-items: center;
  gap: 14px;
  color: inherit;
  padding: 8px 0;
  border-radius: 4px;
  text-decoration: none;
  opacity: 0.75;
  transition: opacity 0.2s;
}

.partners__link:hover,
.partners__link:focus-visible { opacity: 1; }

/* Иконки партнёров в одной логике: одинаковый размер и скругление, как у иконок приложений */
.partners__logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.partners__wordmark {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
</style>
