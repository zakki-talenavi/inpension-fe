import { useToast } from 'primevue/usetoast'

export function useFormat() {
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
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

    const formatNumber = (value: number, decimals: number = 0): string => {
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value)
    }

    return {
        formatCurrency,
        formatDate,
        formatNumber
    }
}
