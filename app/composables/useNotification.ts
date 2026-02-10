import { useToast } from 'primevue/usetoast'

/**
 * Notification types
 */
export type NotificationType = 'success' | 'info' | 'warn' | 'error'

/**
 * Notification options
 */
export interface NotificationOptions {
    type?: NotificationType
    title?: string
    message: string
    life?: number // Duration in milliseconds
    closable?: boolean
    detail?: string
    group?: string
}

/**
 * Notification composable
 * 
 * Provides a simple interface for showing toast notifications
 * using PrimeVue Toast service.
 * 
 * @example
 * ```ts
 * const notification = useNotification()
 * notification.success('Operation completed successfully')
 * notification.error('Something went wrong', { detail: 'Please try again' })
 * ```
 */
export function useNotification() {
    const toast = useToast()

    /**
     * Show a success notification
     */
    function success(message: string, options: Partial<NotificationOptions> = {}) {
        show({
            type: 'success',
            message,
            ...options,
        })
    }

    /**
     * Show an info notification
     */
    function info(message: string, options: Partial<NotificationOptions> = {}) {
        show({
            type: 'info',
            message,
            ...options,
        })
    }

    /**
     * Show a warning notification
     */
    function warn(message: string, options: Partial<NotificationOptions> = {}) {
        show({
            type: 'warn',
            message,
            ...options,
        })
    }

    /**
     * Show an error notification
     */
    function error(message: string, options: Partial<NotificationOptions> = {}) {
        show({
            type: 'error',
            message,
            life: 5000, // Errors stay longer
            ...options,
        })
    }

    /**
     * Show a notification with custom type
     */
    function show(options: NotificationOptions) {
        const {
            type = 'info',
            title,
            message,
            detail,
            life = 3000,
            closable = true,
            group,
        } = options

        // Map notification types to PrimeVue severity
        const severityMap: Record<NotificationType, string> = {
            success: 'success',
            info: 'info',
            warn: 'warn',
            error: 'error',
        }

        toast.add({
            severity: severityMap[type],
            summary: title || type.charAt(0).toUpperCase() + type.slice(1),
            detail: detail || message,
            life,
            closable,
            group,
        })
    }

    /**
     * Clear all notifications
     */
    function clear(group?: string) {
        if (group) {
            toast.removeGroup(group)
        } else {
            // PrimeVue ToastService doesn't have removeAll, use removeAllGroups
            ; (toast as any).removeAllGroups?.() || toast.removeGroup('default')
        }
    }

    /**
     * Show API error notification
     * 
     * Convenience method for displaying API errors
     */
    function fromApiError(error: any, defaultMessage = 'An error occurred') {
        const message = error?.response?.data?.message || error?.message || defaultMessage
        const errors = error?.response?.data?.errors

        if (errors && Object.keys(errors).length > 0) {
            // Show validation errors
            const errorMessages = Object.entries(errors)
                .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
                .join('\n')

            error(message, { detail: errorMessages, life: 7000 })
        } else {
            error(message)
        }
    }

    /**
     * Show loading notification
     * 
     * Note: This requires manual removal with clear()
     */
    function loading(message = 'Loading...') {
        show({
            type: 'info',
            message,
            closable: false,
            life: 0, // No auto-dismiss
        })
    }

    return {
        success,
        info,
        warn,
        error,
        show,
        clear,
        fromApiError,
        loading,
    }
}

/**
 * Notification groups for different types of notifications
 * 
 * Use these to group notifications that should be displayed together
 * or cleared together.
 */
export const NotificationGroups = {
    DEFAULT: 'default',
    FORM: 'form',
    API: 'api',
    SYSTEM: 'system',
} as const

/**
 * Default notification durations (in milliseconds)
 */
export const NotificationDuration = {
    SHORT: 2000,
    DEFAULT: 3000,
    LONG: 5000,
    VERY_LONG: 7000,
    PERSISTENT: 0, // No auto-dismiss
} as const
