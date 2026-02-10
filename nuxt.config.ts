// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  css: [
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
    '~/app/assets/css/main.css',
  ],

  components: [
    {
      path: '~/app/components',
      pathPrefix: false,
    },
    {
      path: '~/app/components/ui',
      prefix: 'App',
      pathPrefix: false,
    }
  ],

  devtools: { enabled: true },

  imports: {
    autoImport: true,
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

  build: {
    transpile: ['primevue']
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt'
  ]
})