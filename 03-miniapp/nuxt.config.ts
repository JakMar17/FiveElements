// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [["@nuxtjs/google-fonts", {
    families: {
      PublicSans: true
    }
  }]],
})