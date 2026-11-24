import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import 'vite-ssg'

const routes = ['/', '/privacy']

export default defineConfig(({ mode }) => {
  // Домен ещё не куплен: без VITE_SITE_URL ставим заглушку, чтобы сборка не падала
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || 'https://example.com').replace(/\/$/, '')
  if (!env.VITE_SITE_URL && mode === 'production') {
    console.warn('[raw-motion-frame] VITE_SITE_URL не задан: canonical и sitemap ведут на https://example.com')
  }

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
    ssgOptions: {
      includedRoutes: () => routes,
      onFinished() {
        const dist = resolve(process.cwd(), 'dist')
        const today = new Date().toISOString().slice(0, 10)
        const urls = routes
          .map((path) => `  <url><loc>${siteUrl}${path}</loc><lastmod>${today}</lastmod></url>`)
          .join('\n')
        writeFileSync(
          resolve(dist, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        )
        writeFileSync(
          resolve(dist, 'robots.txt'),
          `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
        )
      },
    },
  }
})
