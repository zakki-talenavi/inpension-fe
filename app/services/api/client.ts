import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearTokens,
} from './interceptors'
import { AUTH_ENDPOINTS } from '~/config/api'

/**
 * API Client Configuration
 */
export interface ApiClientConfig {
    baseURL?: string
    timeout?: number
    headers?: Record<string, string>
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T = unknown> {
    data: T
    message?: string
    success?: boolean
    meta?: {
        page?: number
        limit?: number
        total?: number
        totalPages?: number
    }
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
    message: string
    errors?: Record<string, string[]>
    code?: string
    status?: number
}

/**
 * Custom API Error Class
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
        public errors?: Record<string, string[]>
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

function isDev(): boolean {
    return typeof process !== 'undefined' && process.env.NODE_ENV === 'development'
}

function getBaseURL(): string {
    if (typeof process !== 'undefined' && process.env.NUXT_PUBLIC_API_BASE_URL) {
        return process.env.NUXT_PUBLIC_API_BASE_URL
    }
    return 'https://inpension-remake.codeline.id/api'
}

type FetchOptions = Parameters<typeof $fetch>[1] & { _retry?: boolean }

type ApiFetchFn = <T = unknown>(url: string, options?: FetchOptions) => Promise<T>

function setAuthHeader(
    options: { headers?: Headers | Record<string, string> },
    token: string
): void {
    if (options.headers instanceof Headers) {
        options.headers.set('Authorization', `Bearer ${token}`)
    } else if (options.headers && typeof options.headers === 'object' && !Array.isArray(options.headers)) {
        (options.headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
}

async function tryRefreshAndRetry(
    request: Request | string,
    opts: FetchOptions,
    baseURL: string,
    defaultHeaders: Record<string, string>,
    apiFetch: ApiFetchFn
): Promise<unknown> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) throw null
    const refreshed = await $fetch<ApiResponse<{ access_token: string; refresh_token?: string }>>(
        `${baseURL}${AUTH_ENDPOINTS.refresh}`,
        { method: 'POST', body: { refresh_token: refreshToken }, headers: { ...defaultHeaders } }
    )
    const accessToken = refreshed.data?.access_token
    if (!accessToken) throw null
    setAccessToken(accessToken)
    if (refreshed.data?.refresh_token) setRefreshToken(refreshed.data.refresh_token)
    opts._retry = true
    if (opts.headers && typeof opts.headers === 'object' && !Array.isArray(opts.headers)) {
        (opts.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`
    } else if (opts.headers instanceof Headers) {
        opts.headers.set('Authorization', `Bearer ${accessToken}`)
    }
    const url = typeof request === 'string' ? request : request.url
    return apiFetch(url, opts) as Promise<void>
}

/**
 * Create the API fetch instance (Nuxt $fetch / ofetch)
 */
function createApiFetch(config: ApiClientConfig = {}): ApiFetchFn {
    const baseURL = config.baseURL || getBaseURL()
    const timeout = config.timeout ?? 30000
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...config.headers,
    }

    const apiFetch: ApiFetchFn = $fetch.create({
        baseURL,
        timeout,
        retry: 0,
        headers: defaultHeaders,
        async onRequest({ options }) {
            const token = getAccessToken()
            if (token) setAuthHeader(options as { headers?: Headers | Record<string, string> }, token)
            if (isDev()) {
                ; (options as unknown as { _startTime?: number })._startTime = Date.now()
            }
        },
        onResponse({ response, options }) {
            if (isDev()) {
                const start = (options as unknown as { _startTime?: number })._startTime
                if (start) {
                    const duration = Date.now() - start
                    const method = (options.method as string) || 'GET'
                    // eslint-disable-next-line no-console -- dev logging
                    console.log(`[API] ${method} ${response.url} - ${duration}ms`)
                }
            }
        },
        async onResponseError({ request, response, options }) {
            const opts = options as FetchOptions
            const status = response.status
            const body = response._data as ApiErrorResponse | undefined

            if (status === 401 && !opts._retry) {
                try {
                    return await tryRefreshAndRetry(
                        request,
                        opts,
                        baseURL,
                        defaultHeaders,
                        apiFetch
                    ) as Promise<void>
                } catch {
                    clearTokens()
                }
            }

            const apiError: ApiErrorResponse = {
                message: body?.message || response.statusText || 'An error occurred',
                errors: body?.errors,
                code: body?.code,
                status: status,
            }
            if (isDev()) {
                // eslint-disable-next-line no-console -- dev error logging
                console.error('[API Error]', { status, error: apiError })
            }
            throw new ApiError(
                apiError.message,
                apiError.status,
                apiError.code,
                apiError.errors
            )
        },
    })

    return apiFetch
}

let apiFetchInstance: ReturnType<typeof createApiFetch> | null = null

function getApiFetch() {
    if (!apiFetchInstance) {
        apiFetchInstance = createApiFetch()
    }
    return apiFetchInstance
}

/**
 * Reset API client (useful for testing or logout)
 */
export function resetApiClient(): void {
    apiFetchInstance = null
}

/**
 * Typed API methods (same interface as before for minimal caller changes)
 */
export class ApiClient {
    private fetch: ApiFetchFn = getApiFetch()

    async get<T = unknown>(url: string, config?: FetchOptions): Promise<ApiResponse<T>> {
        return this.fetch<ApiResponse<T>>(url, { ...config, method: 'GET' })
    }

    async post<T = unknown>(
        url: string,
        data?: unknown,
        config?: FetchOptions
    ): Promise<ApiResponse<T>> {
        return this.fetch<ApiResponse<T>>(url, { ...config, method: 'POST', body: data as BodyInit | Record<string, unknown> })
    }

    async put<T = unknown>(
        url: string,
        data?: unknown,
        config?: FetchOptions
    ): Promise<ApiResponse<T>> {
        return this.fetch<ApiResponse<T>>(url, { ...config, method: 'PUT', body: data as BodyInit | Record<string, unknown> })
    }

    async patch<T = unknown>(
        url: string,
        data?: unknown,
        config?: FetchOptions
    ): Promise<ApiResponse<T>> {
        return this.fetch<ApiResponse<T>>(url, { ...config, method: 'PATCH', body: data as BodyInit | Record<string, unknown> })
    }

    async delete<T = unknown>(url: string, config?: FetchOptions): Promise<ApiResponse<T>> {
        return this.fetch<ApiResponse<T>>(url, { ...config, method: 'DELETE' })
    }

    async upload<T = unknown>(
        url: string,
        file: File | Blob,
        config?: FetchOptions
    ): Promise<ApiResponse<T>> {
        const formData = new FormData()
        formData.append('file', file)
        return this.fetch<ApiResponse<T>>(url, {
            ...config,
            method: 'POST',
            body: formData,
            headers: {
                ...(config?.headers as Record<string, string>),
                'Content-Type': 'multipart/form-data',
            },
        })
    }

    async uploadMultiple<T = unknown>(
        url: string,
        files: File[] | Blob[],
        config?: FetchOptions
    ): Promise<ApiResponse<T>> {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
        })
        return this.fetch<ApiResponse<T>>(url, {
            ...config,
            method: 'POST',
            body: formData,
            headers: {
                ...(config?.headers as Record<string, string>),
                'Content-Type': 'multipart/form-data',
            },
        })
    }
}

export const apiClient = new ApiClient()

export const api = {
    get: <T = unknown>(url: string, config?: FetchOptions) => apiClient.get<T>(url, config),
    post: <T = unknown>(url: string, data?: unknown, config?: FetchOptions) =>
        apiClient.post<T>(url, data, config),
    put: <T = unknown>(url: string, data?: unknown, config?: FetchOptions) =>
        apiClient.put<T>(url, data, config),
    patch: <T = unknown>(url: string, data?: unknown, config?: FetchOptions) =>
        apiClient.patch<T>(url, data, config),
    delete: <T = unknown>(url: string, config?: FetchOptions) => apiClient.delete<T>(url, config),
    upload: <T = unknown>(url: string, file: File | Blob, config?: FetchOptions) =>
        apiClient.upload<T>(url, file, config),
    uploadMultiple: <T = unknown>(
        url: string,
        files: File[] | Blob[],
        config?: FetchOptions
    ) => apiClient.uploadMultiple<T>(url, files, config),
}
