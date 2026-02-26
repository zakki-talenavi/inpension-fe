// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import Aura from '@primeuix/themes/aura'

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

  devtools: { enabled: false },

  nitro: {
    logLevel: 3
  },

  imports: {
    dirs: [
      'app/composables',
      'app/stores',
      'app/utils'
    ]
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://inpension-remake.codeline.id/api',
      /** Role IDs only (key -> roleId). Definitions in app/config/scopeRoles.ts. Override via NUXT_PUBLIC_SCOPE_ROLE_IDS (JSON object). */
      scopeRoleIds: (() => {
        const raw = process.env.NUXT_PUBLIC_SCOPE_ROLE_IDS
        if (raw && typeof raw === 'string') {
          try {
            const parsed = JSON.parse(raw) as Record<string, string>
            if (parsed && typeof parsed === 'object') return parsed
          } catch {
            /* fallback to default */
          }
        }
        return {
          dplk: '351c138d-176a-4f5b-b0b1-8c188adf731e',
          company: '4b7a0c38-2877-4c7a-a6a8-5db07938207b',
          personal: 'b0572a75-cb24-496a-991a-255399efafcb',
        }
      })(),
    }
  },

  extends: [
    './layers/shared',
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
      ripple: true,
      theme: {
        preset: Aura,
      },
    },
    components: {
      include: ['Card', 'Button', 'Toast', 'InputText', 'Password', 'InputGroup', 'InputGroupAddon'],
    },
  },

  css: [
    './app/assets/css/main.css',
    'primeicons/primeicons.css'
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})