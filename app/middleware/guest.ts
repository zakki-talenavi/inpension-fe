import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { isAuthenticated, getAccessToken } from '~/services/api/interceptors'

/**
 * Guest middleware
 * 
 * Protects routes that should only be accessible by unauthenticated users (e.g., login, register).
 * Redirects authenticated users to the home page or dashboard.
 * 
 * Usage:
 * - Add to page meta: definePageMeta({ middleware: 'guest' })
 */
export default defineNuxtRouteMiddleware((to, from) => {
    // Check if user is already authenticated
    const token = getAccessToken()
    const isAuth = isAuthenticated()

    if (isAuth && token) {
        // User is already authenticated, redirect to home or dashboard
        // You can customize the redirect path based on user role
        const redirectPath = to.query.redirect as string || '/dashboard'

        return navigateTo(redirectPath)
    }
})

/**
 * Guest-only middleware with custom redirect
 * 
 * Use this to redirect authenticated users to a specific page
 * 
 * @param redirectPath - The path to redirect authenticated users to
 */
export function defineGuestMiddleware(redirectPath: string = '/') {
    return defineNuxtRouteMiddleware(() => {
        const isAuth = isAuthenticated()

        if (isAuth) {
            return navigateTo(redirectPath)
        }
    })
}
