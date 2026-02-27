import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth/useAuthStore'
import { clearTokens } from '~/services/api/interceptors'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth_token')

  // Pages that require NO authentication (guest-only)
  const guestOnlyRoutes = ['/login', '/register', '/forgot-password']
  // Pages accessible by anyone (no redirect)
  const publicRoutes = ['/', ...guestOnlyRoutes]
  const isPublicRoute = publicRoutes.includes(to.path)
  const isGuestOnly = guestOnlyRoutes.includes(to.path)

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
