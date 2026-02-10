import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { setupInterceptors } from './interceptors'

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

/**
 * Create and configure axios instance
 */
function createApiClient(config: ApiClientConfig = {}): AxiosInstance {
    // Get base URL from config or use default
    const baseURL = config.baseURL ||
        (typeof process !== 'undefined' ? process.env.NUXT_PUBLIC_API_BASE_URL : null) ||
        '/api'

    const instance = axios.create({
        baseURL,
        timeout: config.timeout || 30000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...config.headers,
        },
    })

    // Setup interceptors
    setupInterceptors(instance)

    return instance
}

/**
 * API Client singleton
 */
let apiClientInstance: AxiosInstance | null = null

export function getApiClient(): AxiosInstance {
    if (!apiClientInstance) {
        apiClientInstance = createApiClient()
    }
    return apiClientInstance
}

/**
 * Reset API client (useful for testing or logout)
 */
export function resetApiClient(): void {
    apiClientInstance = null
}

/**
 * Typed API methods
 */
export class ApiClient {
    private client: AxiosInstance

    constructor(client?: AxiosInstance) {
        this.client = client || getApiClient()
    }

    /**
     * GET request
     */
    async get<T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.get<
            ApiResponse<T>
        >(url, config)
        return response.data
    }

    /**
     * POST request
     */
    async post<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.post<
            ApiResponse<T>
        >(url, data, config)
        return response.data
    }

    /**
     * PUT request
     */
    async put<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.put<
            ApiResponse<T>
        >(url, data, config)
        return response.data
    }

    /**
     * PATCH request
     */
    async patch<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.patch<
            ApiResponse<T>
        >(url, data, config)
        return response.data
    }

    /**
     * DELETE request
     */
    async delete<T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const response: AxiosResponse<ApiResponse<T>> = await this.client.delete<
            ApiResponse<T>
        >(url, config)
        return response.data
    }

    /**
     * File upload
     */
    async upload<T = unknown>(
        url: string,
        file: File | Blob,
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const formData = new FormData()
        formData.append('file', file)

        const response: AxiosResponse<ApiResponse<T>> = await this.client.post<
            ApiResponse<T>
        >(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        })
        return response.data
    }

    /**
     * Multiple files upload
     */
    async uploadMultiple<T = unknown>(
        url: string,
        files: File[] | Blob[],
        config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
        })

        const response: AxiosResponse<ApiResponse<T>> = await this.client.post<
            ApiResponse<T>
        >(url, formData, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers,
            },
        })
        return response.data
    }
}

/**
 * Export default API client instance
 */
export const apiClient = new ApiClient()

/**
 * Export convenience functions
 */
export const api = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<T>(url, config),
    post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        apiClient.post<T>(url, data, config),
    put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        apiClient.put<T>(url, data, config),
    patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        apiClient.patch<T>(url, data, config),
    delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
        apiClient.delete<T>(url, config),
    upload: <T = unknown>(url: string, file: File | Blob, config?: AxiosRequestConfig) =>
        apiClient.upload<T>(url, file, config),
    uploadMultiple: <T = unknown>(
        url: string,
        files: File[] | Blob[],
        config?: AxiosRequestConfig
    ) => apiClient.uploadMultiple<T>(url, files, config),
}
