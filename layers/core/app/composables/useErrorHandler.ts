import type { FetchError } from 'ofetch'

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public data?: unknown,
    ) {
        super(message)
        this.name = 'ApiError'
    }
}

/**
 * Validation Error class for Zod validation failures
 */
export class ValidationError extends Error {
    constructor(
        message: string,
        public errors: Array<{ path: string; message: string }>,
    ) {
        super(message)
        this.name = 'ValidationError'
    }
}

/**
 * Centralized error handler composable
 */
export function useErrorHandler() {
    /**
     * Handle API errors from fetch/ofetch
     */
    function handleApiError(error: unknown): ApiError {
        if (isFetchError(error)) {
            return new ApiError(
                error.message || 'API request failed',
                error.statusCode,
                error.data,
            )
        }

        if (error instanceof Error) {
            return new ApiError(error.message)
        }

        return new ApiError('An unknown error occurred')
    }

    /**
     * Handle validation errors
     */
    function handleValidationError(error: unknown): ValidationError {
        // Check if it's a Zod error
        if (error && typeof error === 'object' && 'issues' in error) {
            const zodError = error as { issues: Array<{ path: Array<string | number>; message: string }> }
            const errors = zodError.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            }))
            return new ValidationError('Validation failed', errors)
        }

        return new ValidationError('Validation failed', [])
    }

    /**
     * Log error to console (can be extended to send to logging service)
     */
    function logError(error: Error, context?: Record<string, unknown>): void {
        console.error('[Error]', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            context,
        })
    }

    /**
     * Show user-friendly error message
     */
    function showErrorToast(error: Error): void {
        // This can be integrated with a toast notification library
        // For now, just log to console
        console.error('[User Error]', error.message)
    }

    return {
        handleApiError,
        handleValidationError,
        logError,
        showErrorToast,
    }
}

/**
 * Type guard for FetchError
 */
function isFetchError(error: unknown): error is FetchError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        'data' in error
    )
}
