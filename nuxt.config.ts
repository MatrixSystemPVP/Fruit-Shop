// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  compatibilityDate: '2024-12-06',
  ssr: false,
  nitro: {
    preset: 'cloudflare-pages-static',
    prerender: {
      autoSubfolderIndex: false
    }
  }
})
