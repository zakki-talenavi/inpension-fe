import { defineConfig } from 'vitest/config'
import { defineVitestConfig } from '@nuxt/test-utils/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    projects: [
      // Unit tests - pure functions, utils, reducers
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: [
            'layers/**/app/utils/**/*.test.ts',
            'layers/**/app/stores/**/*Update.test.ts',
            'layers/**/app/stores/**/*Effects.test.ts',
            'layers/**/app/composables/**/*.test.ts',
            'test/unit/**/*.test.ts',
          ],
          globals: true,
          setupFiles: ['./test/setup.ts'],
        },
        resolve: {
          alias: {
            '~': resolve(__dirname, './app'),
            '#layers': resolve(__dirname, './layers'),
            '#app': resolve(__dirname, './.nuxt'),
          },
        },
        // Define import.meta.client/server for Nuxt SSR guards
        define: {
          'import.meta.client': true,
          'import.meta.server': false,
        },
      },
      // Integration tests - components, pages with Nuxt runtime
      defineVitestConfig({
        test: {
          name: 'nuxt',
          environment: 'nuxt',
          include: [
            'layers/**/app/components/**/*.nuxt.test.ts',
            'layers/**/app/pages/**/*.nuxt.test.ts',
            'test/nuxt/**/*.nuxt.test.ts',
          ],
          environmentOptions: {
            nuxt: {
              domEnvironment: 'happy-dom',
              mock: {
                intersectionObserver: true,
                indexedDb: false,
              },
            },
          },
          globals: true,
        },
      }),
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['layers/**/app/**/*.{ts,vue}'],
      exclude: [
        '**/node_modules/**',
        '**/__tests__/**',
        '**/nuxt.config.ts',
        '**/*.d.ts',
        '**/test/**',
      ],
    },
  },
})
