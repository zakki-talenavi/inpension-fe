import { DateFormat, Currency, NumberFormat } from './constants'

/**
 * Formatters Utility
 * 
 * Provides common formatting functions for dates, numbers, currencies, etc.
 */

// ============================================
// Date Formatters
// ============================================

/**
 * Format date to display format
 * 
 * @param date - Date to format (string, Date, or number)
 * @param format - Format string (default: DISPLAY)
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2024-01-10') // '10 Jan 2024'
 * formatDate(new Date(), 'ISO') // '2024-01-10'
 */
export function formatDate(
    date: string | Date | number | null | undefined,
    format: keyof typeof DateFormat = 'DISPLAY'
): string {
    if (!date) return '-'

    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'

    const day = d.getDate().toString().padStart(2, '0')
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const hours = d.getHours().toString().padStart(2, '0')
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')

    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const monthName = monthNames[month - 1]

    const formatValue = DateFormat[format]

    const formats: Record<string, string> = {
        [DateFormat.DISPLAY]: `${day} ${monthName} ${year}`,
        [DateFormat.DISPLAY_WITH_TIME]: `${day} ${monthName} ${year} ${hours}:${minutes}`,
        [DateFormat.ISO]: `${year}-${month.toString().padStart(2, '0')}-${day}`,
        [DateFormat.ISO_WITH_TIME]: `${year}-${month.toString().padStart(2, '0')}-${day} ${hours}:${minutes}:${seconds}`,
        [DateFormat.MONTH_YEAR]: `${monthName} ${year}`,
        [DateFormat.YEAR]: `${year}`,
        [DateFormat.SHORT]: `${day}/${month.toString().padStart(2, '0')}/${year}`,
    }

    return formats[formatValue] ?? formats[DateFormat.DISPLAY] ?? '-'
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @returns Relative time string
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export function formatRelativeTime(date: string | Date | number): string {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'

    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffSecs < 60) return 'just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
}

/**
 * Format duration in milliseconds to human-readable format
 * 
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 * 
 * @example
 * formatDuration(3661000) // '1h 1m 1s'
 */
export function formatDuration(ms: number): string {
    if (ms < 0) return '-'

    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const parts: string[] = []

    if (days > 0) parts.push(`${days}d`)
    if (hours % 24 > 0) parts.push(`${hours % 24}h`)
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`)
    if (seconds % 60 > 0) parts.push(`${seconds % 60}s`)

    return parts.length > 0 ? parts.join(' ') : '0s'
}

// ============================================
// Number & Currency Formatters
// ============================================

/**
 * Format number with thousands separator
 * 
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1000000) // '1.000.000'
 * formatNumber(1234.56, 2) // '1.234,56'
 */
export function formatNumber(
    value: number | null | undefined,
    decimals: number = NumberFormat.DECIMAL_PLACES
): string {
    if (value === null || value === undefined) return '-'
    if (isNaN(value)) return '-'

    return value.toLocaleString('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })
}

/**
 * Format currency (IDR)
 * 
 * @param value - Amount to format
 * @param currency - Currency code (default: IDR)
 * @param showSymbol - Show currency symbol (default: true)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1000000) // 'Rp 1.000.000'
 * formatCurrency(1234.56) // 'Rp 1.235'
 * formatCurrency(100, 'USD') // '$100'
 */
export function formatCurrency(
    value: number | null | undefined,
    currency: keyof typeof Currency = 'IDR',
    showSymbol: boolean = true
): string {
    if (value === null || value === undefined) return '-'
    if (isNaN(value)) return '-'

    const locale = currency === 'IDR' ? 'id-ID' : 'en-US'
    const formatted = value.toLocaleString(locale, {
        style: showSymbol ? 'currency' : 'decimal',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })

    return formatted
}

/**
 * Format percentage
 * 
 * @param value - Value to format (0-100 or 0-1)
 * @param decimals - Number of decimal places
 * @param isFraction - Input is fraction (0-1) instead of percentage (0-100)
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(0.756, 1, true) // '75.6%'
 * formatPercentage(75.6, 1, false) // '75.6%'
 */
export function formatPercentage(
    value: number | null | undefined,
    decimals: number = 1,
    isFraction: boolean = true
): string {
    if (value === null || value === undefined) return '-'
    if (isNaN(value)) return '-'

    const percentage = isFraction ? value * 100 : value
    return `${percentage.toFixed(decimals)}%`
}

// ============================================
// String Formatters
// ============================================

/**
 * Truncate text to specified length
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 * 
 * @example
 * truncateText('Hello world', 5) // 'Hello...'
 */
export function truncateText(
    text: string | null | undefined,
    maxLength: number,
    suffix: string = '...'
): string {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + suffix
}

/**
 * Capitalize first letter of string
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 * 
 * @example
 * capitalize('hello world') // 'Hello world'
 */
export function capitalize(text: string | null | undefined): string {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

/**
 * Convert string to title case
 * 
 * @param text - Text to convert
 * @returns Title case text
 * 
 * @example
 * toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(text: string | null | undefined): string {
    if (!text) return ''
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

/**
 * Convert string to slug
 * 
 * @param text - Text to convert
 * @returns Slug string
 * 
 * @example
 * toSlug('Hello World!') // 'hello-world'
 */
export function toSlug(text: string | null | undefined): string {
    if (!text) return ''
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

/**
 * Mask sensitive data (e.g., email, phone)
 * 
 * @param value - Value to mask
 * @param type - Type of masking
 * @returns Masked value
 * 
 * @example
 * maskSensitive('user@example.com', 'email') // 'u***@example.com'
 * maskSensitive('1234567890', 'phone') // '123****890'
 */
export function maskSensitive(
    value: string | null | undefined,
    type: 'email' | 'phone' | 'card' = 'email'
): string {
    if (!value) return ''

    switch (type) {
        case 'email':
            const [username, domain] = value.split('@')
            if (username && domain) {
                const maskedUsername = username.charAt(0) + '***'
                return `${maskedUsername}@${domain}`
            }
            return value

        case 'phone':
            if (value.length >= 6) {
                const start = value.substring(0, 3)
                const end = value.substring(value.length - 3)
                return `${start}****${end}`
            }
            return value

        case 'card':
            if (value.length >= 8) {
                const start = value.substring(0, 4)
                const end = value.substring(value.length - 4)
                return `${start} **** **** ${end}`
            }
            return value

        default:
            return value
    }
}

// ============================================
// File Size Formatters
// ============================================

/**
 * Format file size in bytes to human-readable format
 * 
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places
 * @returns Formatted file size
 * 
 * @example
 * formatFileSize(1536) // '1.5 KB'
 * formatFileSize(1048576) // '1 MB'
 */
export function formatFileSize(bytes: number | null | undefined, decimals: number = 2): string {
    if (bytes === null || bytes === undefined) return '-'
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

// ============================================
// Array/List Formatters
// ============================================

/**
 * Format array as comma-separated list
 * 
 * @param items - Array of items
 * @param separator - Separator (default: ', ')
 * @param lastSeparator - Separator for last item (default: ' and ')
 * @returns Formatted list
 * 
 * @example
 * formatList(['a', 'b', 'c']) // 'a, b and c'
 */
export function formatList(
    items: string[],
    separator: string = ', ',
    lastSeparator: string = ' and '
): string {
    if (items.length === 0) return ''
    if (items.length === 1) return items[0] ?? ''
    if (items.length === 2) return items.join(lastSeparator)

    return items.slice(0, -1).join(separator) + lastSeparator + (items[items.length - 1] ?? '')
}

// ============================================
// Export all formatters
// ============================================

export const formatters = {
    formatDate,
    formatRelativeTime,
    formatDuration,
    formatNumber,
    formatCurrency,
    formatPercentage,
    truncateText,
    capitalize,
    toTitleCase,
    toSlug,
    maskSensitive,
    formatFileSize,
    formatList,
}
