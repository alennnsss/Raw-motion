<script setup lang="ts">
import Marquee from '@/components/animations/Marquee.vue'
import { partners } from '@/data/partners'
</script>

<template>
  <section id="partners" class="partners" aria-labelledby="partners-title">
    <div class="container">
      <h2 id="partners-title" class="eyebrow partners__title">С нами сотрудничают</h2>
    </div>
    <Marquee :items="partners" label="логотипы партнёров" :duration="28">
      <template #default="{ item, hidden }">
        <a
          class="partners__link"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          :tabindex="hidden ? -1 : undefined"
        >
          <img v-if="item.logo" :src="item.logo" :alt="item.name" height="32" class="partners__logo" />
          <span v-else class="partners__wordmark">{{ item.name }}</span>
        </a>
      </template>
    </Marquee>
  </section>
</template>

<style scoped>
.partners {
  padding-block: 40px;
  border-block: 1px solid var(--gray-1);
}

.partners__title { text-align: center; font-weight: 500; }

.partners__link {
  display: block;
  padding: 8px 0;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.partners__link:hover,
.partners__link:focus-visible { opacity: 1; }

/* Одна высота и монохром для всех логотипов */
.partners__logo {
  height: 32px;
  width: auto;
  filter: grayscale(1) brightness(1.6);
}

.partners__wordmark {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.01em;
  white-space: nowrap;
}
</style>
