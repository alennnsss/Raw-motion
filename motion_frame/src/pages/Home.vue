<script setup lang="ts">
import { useHead, useSeoMeta } from '@unhead/vue'
import Hero from '@/components/sections/Hero.vue'
import Partners from '@/components/sections/Partners.vue'
import Services from '@/components/sections/Services.vue'
import Portfolio from '@/components/sections/Portfolio.vue'
import Process from '@/components/sections/Process.vue'
import Pricing from '@/components/sections/Pricing.vue'
import Faq from '@/components/sections/Faq.vue'
import LeadForm from '@/components/sections/LeadForm.vue'
import { INSTAGRAM_URL, SITE_NAME, SITE_URL } from '@/config'
import { portfolio } from '@/data/portfolio'
import { pricing } from '@/data/pricing'

const title = 'Монтаж видео, Reels и рекламных роликов | Raw Motion Frame'
const description =
  'Студия видеомонтажа Raw Motion Frame: монтаж Reels, TikTok и Shorts, субтитры для видео, монтаж рекламных роликов и YouTube. 100+ смонтированных роликов. Цены от 3 000 ₸.'
const url = `${SITE_URL}/`
const orgId = `${SITE_URL}/#organization`

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: SITE_NAME,
      url,
      description,
      sameAs: [INSTAGRAM_URL],
    },
    ...pricing.map((item) => ({
      '@type': 'Service',
      name: item.service,
      serviceType: 'Видеомонтаж',
      provider: { '@id': orgId },
      areaServed: { '@type': 'Country', name: 'Казахстан' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'KZT',
        priceSpecification: { '@type': 'PriceSpecification', minPrice: item.price, priceCurrency: 'KZT' },
      },
    })),
    // VideoObject появится автоматически, когда у работ будут полные видео, постер и дата
    ...portfolio
      .filter((item) => item.full && item.poster && item.uploadDate)
      .map((item) => ({
        '@type': 'VideoObject',
        name: item.title,
        description: `${item.category}: ${item.title}`,
        thumbnailUrl: `${SITE_URL}${item.poster}`,
        contentUrl: `${SITE_URL}${item.full}`,
        uploadDate: item.uploadDate,
      })),
  ],
}

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url,
  ogLocale: 'ru_RU',
  ogSiteName: SITE_NAME,
  ogImage: { url: `${SITE_URL}/og-image.png`, width: 1080, height: 1080, alt: 'Логотип Raw Motion Frame' },
  twitterImage: `${SITE_URL}/og-image.png`,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  link: [{ rel: 'canonical', href: url }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
})
</script>

<template>
  <main id="main">
    <Hero />
    <Partners />
    <Services />
    <Portfolio />
    <Process />
    <Pricing />
    <Faq />
    <LeadForm />
  </main>
</template>
