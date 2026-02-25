import { setPageLayout, defineNuxtRouteMiddleware } from 'nuxt/app'

/**
 * Global middleware: set layout for login page (no layout wrapper).
 * Done in middleware to avoid hydration warnings from setPageLayout in components.
 */
export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login' || to.path === '/scope') {
    setPageLayout(false)
  }
})
