// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  components: {
    dirs: [
      {
        path: '~/app/components',
        pathPrefix: false,
      }
    ]
  },

  devtools: { enabled: true },

  imports: {
    dirs: [
      'app/composables',
      'app/stores',
      'app/utils'
    ]
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api-inpension.codeline.id/api',
    }
  },

  extends: [
    './layers/shared',
    './layers/dplk',
    './layers/company',
    './layers/personal',
    './layers/admin',
  ],

  modules: [
    '@primevue/nuxt-module',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt'
  ],

  primevue: {
    options: {
      theme: 'lara-light-blue',
      ripple: true
    },
    components: {
      include: '*'
    }
  },

  css: [
    'primeicons/primeicons.css'
  ]
})