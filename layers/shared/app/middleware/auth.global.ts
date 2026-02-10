import { useAuthStore } from '#layers/shared/app/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    const token = useCookie('auth_token')

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/register', '/forgot-password']

    if (publicRoutes.includes(to.path)) {
        return
    }

    // Check if user has valid token
    if (!token.value) {
        return navigateTo('/login')
    }

    // Fetch user profile if not already loaded
    if (!authStore.user) {
        try {
            await authStore.fetchCurrentUser()
        } catch (error) {
            // If fetch fails, clear token and redirect to login
            token.value = null
            return navigateTo('/login')
        }
    }
})
