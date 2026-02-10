import { useRuntimeConfig } from '#app'
import { useErrorHandler } from './useErrorHandler'

/**
 * API client composable with centralized error handling
 * 
 * Wraps Nuxt's $fetch with:
 * - Automatic error handling
 * - Request/response logging
 * - Base URL configuration
 * - Type-safe responses
 */
export function useApi() {
    const config = useRuntimeConfig()
    const { handleApiError, logError } = useErrorHandler()

    /**
     * Make a GET request
     */
    async function get<T>(url: string, options?: Record<string, unknown>) {
        try {
            const response = await $fetch<T>(url, {
                method: 'GET' as const,
                baseURL: config.public.apiBaseUrl,
                ...options,
            })
            return response
        }
        catch (error) {
            const apiError = handleApiError(error)
            logError(apiError, { url, method: 'GET' })
            throw apiError
        }
    }

    /**
     * Make a POST request
     */
    async function post<T>(url: string, body?: Record<string, unknown>, options?: Record<string, unknown>) {
        try {
            const response = await $fetch<T>(url, {
                method: 'POST' as const,
                baseURL: config.public.apiBaseUrl,
                body: body as Record<string, unknown>,
                ...options,
            })
            return response
        }
        catch (error) {
            const apiError = handleApiError(error)
            logError(apiError, { url, method: 'POST', body })
            throw apiError
        }
    }

    /**
     * Make a PUT request
     */
    async function put<T>(url: string, body?: Record<string, unknown>, options?: Record<string, unknown>) {
        try {
            const response = await $fetch<T>(url, {
                method: 'PUT' as const,
                baseURL: config.public.apiBaseUrl,
                body: body as Record<string, unknown>,
                ...options,
            })
            return response
        }
        catch (error) {
            const apiError = handleApiError(error)
            logError(apiError, { url, method: 'PUT', body })
            throw apiError
        }
    }

    /**
     * Make a DELETE request
     */
    async function del<T>(url: string, options?: Record<string, unknown>) {
        try {
            const response = await $fetch<T>(url, {
                method: 'DELETE' as const,
                baseURL: config.public.apiBaseUrl,
                ...options,
            })
            return response
        }
        catch (error) {
            const apiError = handleApiError(error)
            logError(apiError, { url, method: 'DELETE' })
            throw apiError
        }
    }

    return {
        get,
        post,
        put,
        delete: del,
    }
}
