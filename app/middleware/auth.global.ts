import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth/useAuthStore'

/**
 * Global auth middleware: protect private routes, redirect to login when no token.
 * Auth lives in app (see docs/READINESS.md).
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth_token')

  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  if (publicRoutes.includes(to.path)) return

  if (!token.value) {
    return navigateTo('/login')
  }

  if (!authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch {
      token.value = null
      return navigateTo('/login')
    }
  }
})
