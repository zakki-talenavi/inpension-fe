// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  css: ['~/assets/css/main.css'],

  // Disable component auto-imports
  components: {
    dirs: []
  },

  devtools: { enabled: true },

  // Disable all auto-imports
  imports: {
    autoImport: false
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api-inpension.codeline.id/api',
    }
  },

  extends: [
    './layers/core',
    './layers/shared',
    './layers/products',
    './layers/cart',
    './layers/auth',
    './layers/checkout',
    './layers/reviews',
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt'
  ]
})