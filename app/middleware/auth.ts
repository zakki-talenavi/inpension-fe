import { computed } from 'vue'
import { defineNuxtRouteMiddleware, navigateTo, createError, useState } from 'nuxt/app'
import { isAuthenticated, getAccessToken } from '~/services/api/interceptors'
import type { User } from '~/types/models'

/**
 * Authentication middleware
 * 
 * Protects routes that require authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * Usage:
 * - Add to page meta: definePageMeta({ middleware: 'auth' })
 * - Or apply globally in nuxt.config.ts
 */
export default defineNuxtRouteMiddleware((to, from) => {
    // Check if user is authenticated
    const token = getAccessToken()
    const isAuth = isAuthenticated()

    if (!isAuth || !token) {
        // User is not authenticated, redirect to login
        return navigateTo({
            path: '/login',
            query: {
                redirect: to.fullPath, // Store original destination for redirect after login
            },
        })
    }

    // Optional: Validate token with API
    // This adds an extra API call but ensures the token is still valid
    // Uncomment if you want to validate token on every protected route
    /*
    const { data, error } = await useFetch('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  
    if (error.value || !data.value?.valid) {
      // Token is invalid, clear it and redirect to login
      clearTokens()
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
    */
})

/**
 * Type-safe authentication check composable
 * 
 * Use this in components to check authentication status
 */
export function useAuth() {
    const isAuthenticated = computed(() => {
        return getAccessToken() !== null
    })

    const user = useState<User | null>('user', () => null)

    /**
     * Logout and clear authentication
     */
    async function logout() {
        const { clearTokens } = await import('~/services/api/interceptors')
        clearTokens()
        user.value = null

        // Redirect to login
        await navigateTo('/login')
    }

    /**
     * Get current user from API
     */
    async function fetchUser() {
        if (!isAuthenticated.value) {
            return null
        }

        try {
            const { authMe } = await import('~/services/api/auth')
            const response = await authMe()
            user.value = response.data.user
            return user.value
        } catch (_error) {
            console.error('Failed to fetch user:', _error)
            return null
        }
    }

    return {
        isAuthenticated,
        user,
        logout,
        fetchUser,
    }
}

/**
 * Role-based authentication middleware
 * 
 * Use this to protect routes that require specific roles
 * 
 * @param allowedRoles - Array of roles that can access the route
 */
export function defineRoleMiddleware(allowedRoles: string[]) {
    return defineNuxtRouteMiddleware((to) => {
        const { user } = useAuth()

        if (!user.value) {
            return navigateTo({
                path: '/login',
                query: { redirect: to.fullPath },
            })
        }

        if (!allowedRoles.includes(user.value.role)) {
            // User doesn't have required role
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have permission to access this page',
            })
        }
    })
}

/**
 * Permission-based authentication middleware
 * 
 * Use this to protect routes that require specific permissions
 * 
 * @param requiredPermissions - Array of permissions required to access the route
 * @param requireAll - If true, user must have ALL permissions. If false, ANY permission is enough.
 */
export function definePermissionMiddleware(requiredPermissions: string[], requireAll = true) {
    return defineNuxtRouteMiddleware((to) => {
        const { user } = useAuth()

        if (!user.value) {
            return navigateTo({
                path: '/login',
                query: { redirect: to.fullPath },
            })
        }

        const userPermissions = user.value.permissions || []

        const hasPermission = requireAll
            ? requiredPermissions.every(p => userPermissions.includes(p))
            : requiredPermissions.some(p => userPermissions.includes(p))

        if (!hasPermission) {
            throw createError({
                statusCode: 403,
                statusMessage: 'You do not have permission to access this page',
            })
        }
    })
}
