import { defineNuxtRouteMiddleware, navigateTo, useCookie } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth/useAuthStore'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const token = useCookie('auth_token')

  // All routes that unauthenticated users can access
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(to.path)

  // AUTHENTICATED user trying to access public pages → redirect to dashboard
  if (token.value && isPublicRoute) {
    return navigateTo('/dashboard')
  }

  // UNAUTHENTICATED user trying to access protected pages → redirect to home
  if (!token.value && !isPublicRoute) {
    return navigateTo('/')
  }

  // AUTHENTICATED user on protected page → ensure user data is loaded
  if (token.value && !isPublicRoute && !authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch {
      token.value = null
      return navigateTo('/')
    }
  }
})

