import { setPageLayout, defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login' || to.path === '/register' || to.path === '/forgot-password' || to.path === '/scope') {
    setPageLayout(false)
  }
})
