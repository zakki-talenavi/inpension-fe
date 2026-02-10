/**
 * Format number as Indonesian Rupiah currency
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date

    if (format === 'long') {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long'
        }).format(d)
    }

    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(d)
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date

    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(d)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`
}

/**
 * Abbreviate large numbers (e.g., 1000000 -> 1M)
 */
export function abbreviateNumber(value: number): string {
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}M`
    }
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}jt`
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}rb`
    }
    return value.toString()
}
