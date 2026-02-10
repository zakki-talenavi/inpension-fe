import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { ApiErrorResponse } from './client'

/**
 * Token storage keys
 */
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Check if running on client side
 */
function isClient(): boolean {
    return typeof window !== 'undefined'
}

/**
 * Check if running in development mode
 */
function isDev(): boolean {
    return typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
    if (isClient()) {
        return localStorage.getItem(TOKEN_KEY) || null
    }
    return null
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
    if (isClient()) {
        return localStorage.getItem(REFRESH_TOKEN_KEY) || null
    }
    return null
}

/**
 * Store access token
 */
export function setAccessToken(token: string): void {
    if (isClient()) {
        localStorage.setItem(TOKEN_KEY, token)
    }
}

/**
 * Store refresh token
 */
export function setRefreshToken(token: string): void {
    if (isClient()) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token)
    }
}

/**
 * Clear stored tokens
 */
export function clearTokens(): void {
    if (isClient()) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getAccessToken() !== null
}

/**
 * Setup request interceptor - Add auth token to requests
 */
function setupRequestInterceptor(instance: AxiosInstance): void {
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Add auth token if available
            const token = getAccessToken()
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`
            }

            // Add request timestamp for debugging
            if (isDev()) {
                ; (config as any).metadata = { ...(config as any).metadata, startTime: Date.now() }
            }

            return config
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        }
    )
}

/**
 * Setup response interceptor - Handle errors and token refresh
 */
function setupResponseInterceptor(instance: AxiosInstance): void {
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Log request duration in development
            if (isDev()) {
                const startTime = (response.config as any).metadata?.startTime
                if (startTime) {
                    const duration = Date.now() - startTime
                    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
                }
            }

            return response
        },
        async (error: AxiosError<ApiErrorResponse>) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & {
                _retry?: boolean
            }

            // Handle 401 Unauthorized - try to refresh token
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const refreshToken = getRefreshToken()
                    if (refreshToken) {
                        // Attempt to refresh token
                        const response = await instance.post('/auth/refresh', {
                            refreshToken,
                        })

                        const { accessToken, refreshToken: newRefreshToken } = response.data.data

                        // Store new tokens
                        setAccessToken(accessToken)
                        if (newRefreshToken) {
                            setRefreshToken(newRefreshToken)
                        }

                        // Retry original request with new token
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${accessToken}`
                        }

                        return instance(originalRequest)
                    }
                } catch (refreshError) {
                    // Refresh failed - clear tokens
                    clearTokens()

                    // Note: Router redirect should be handled by the calling code
                    // or through a global event system, not directly in interceptor

                    return Promise.reject(refreshError)
                }
            }

            // Handle other errors
            const apiError: ApiErrorResponse = {
                message: error.response?.data?.message || error.message || 'An error occurred',
                errors: error.response?.data?.errors,
                code: error.response?.data?.code,
                status: error.response?.status,
            }

            // Log error in development
            if (isDev()) {
                console.error('[API Error]', {
                    url: originalRequest.url,
                    method: originalRequest.method,
                    status: error.response?.status,
                    error: apiError,
                })
            }

            return Promise.reject(apiError)
        }
    )
}

/**
 * Setup all interceptors
 */
export function setupInterceptors(instance: AxiosInstance): void {
    setupRequestInterceptor(instance)
    setupResponseInterceptor(instance)
}

/**
 * Export token utilities for use in auth composables
 */
export const tokenStorage = {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearTokens,
    isAuthenticated,
}
