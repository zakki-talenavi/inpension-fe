import { describe, it, expect } from 'vitest'
import { formatCurrency, parseCurrency } from '../currency'

describe('formatCurrency', () => {
    it('should format cents to USD currency string', () => {
        expect(formatCurrency(1999)).toBe('$19.99')
        expect(formatCurrency(100)).toBe('$1.00')
        expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle large amounts', () => {
        expect(formatCurrency(123456789)).toBe('$1,234,567.89')
    })

    it('should handle single cent amounts', () => {
        expect(formatCurrency(1)).toBe('$0.01')
        expect(formatCurrency(99)).toBe('$0.99')
    })

    it('should handle negative amounts', () => {
        expect(formatCurrency(-1999)).toBe('-$19.99')
    })

    it('should round to 2 decimal places', () => {
        expect(formatCurrency(1234)).toBe('$12.34')
        expect(formatCurrency(5678)).toBe('$56.78')
    })
})

describe('parseCurrency', () => {
    it('should parse currency string with dollar sign to cents', () => {
        expect(parseCurrency('$19.99')).toBe(1999)
        expect(parseCurrency('$1.00')).toBe(100)
        expect(parseCurrency('$0.00')).toBe(0)
    })

    it('should parse currency string without dollar sign', () => {
        expect(parseCurrency('19.99')).toBe(1999)
        expect(parseCurrency('1.00')).toBe(100)
    })

    it('should handle currency with commas', () => {
        expect(parseCurrency('$1,234.56')).toBe(123456)
        expect(parseCurrency('1,000.00')).toBe(100000)
    })

    it('should handle currency with spaces', () => {
        expect(parseCurrency('$ 19.99')).toBe(1999)
        expect(parseCurrency('19 .99')).toBe(1999)
    })

    it('should round to nearest cent', () => {
        expect(parseCurrency('19.995')).toBe(2000) // rounds up
        expect(parseCurrency('19.994')).toBe(1999) // rounds down
    })

    it('should handle whole dollar amounts', () => {
        expect(parseCurrency('$20')).toBe(2000)
        expect(parseCurrency('100')).toBe(10000)
    })
})

describe('formatCurrency and parseCurrency round trip', () => {
    it('should maintain value through format and parse cycle', () => {
        const testValues = [0, 1, 99, 100, 1999, 123456, 999999]

        for (const cents of testValues) {
            const formatted = formatCurrency(cents)
            const parsed = parseCurrency(formatted)
            expect(parsed).toBe(cents)
        }
    })
})
