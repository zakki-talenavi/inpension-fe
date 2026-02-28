import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth/useAuthStore'
import { clearTokens } from '~/services/api/interceptors'

// Define route sets outside the middleware for O(1) lookup and 1-time initialization
const guestOnlyRoutes = new Set(['/login', '/register', '/forgot-password'])
const publicRoutes = new Set(['/', '/verification', ...guestOnlyRoutes])

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth_token')

  const isPublicRoute = publicRoutes.has(to.path)
  const isGuestOnly = guestOnlyRoutes.has(to.path)

  // AUTHENTICATED user on guest-only pages (login/register) → redirect to dashboard
  if (token.value && isGuestOnly) {
    return navigateTo('/dashboard')
  }

  // Public route (including /) → allow through without checking token validity
  if (isPublicRoute) return

  // UNAUTHENTICATED user on protected page → redirect to home
  if (!token.value) {
    return navigateTo('/')
  }

  if (!authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch {
      clearTokens()
      token.value = null
      return navigateTo('/')
    }
  }
})
