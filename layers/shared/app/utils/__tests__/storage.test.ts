import { describe, it, expect, beforeEach, vi } from 'vitest'
import { z } from 'zod'
import { getItem, getValidatedItem, setItem, removeItem, clear } from '../storage'

describe('storage utilities', () => {
    // Create a fresh localStorage mock for each test
    beforeEach(() => {
        const localStorageMock = (() => {
            let store: Record<string, string> = {}

            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => {
                    store[key] = value
                },
                removeItem: (key: string) => {
                    delete store[key]
                },
                clear: () => {
                    store = {}
                },
            }
        })()

        vi.stubGlobal('localStorage', localStorageMock)
    })

    describe('getItem', () => {
        it('should get and parse JSON from localStorage', () => {
            const testData = { name: 'Test', value: 123 }
            localStorage.setItem('test', JSON.stringify(testData))

            const result = getItem<typeof testData>('test')
            expect(result).toEqual(testData)
        })

        it('should return null for non-existent key', () => {
            const result = getItem('nonexistent')
            expect(result).toBeNull()
        })

        it('should return null for empty string', () => {
            localStorage.setItem('empty', '')
            const result = getItem('empty')
            expect(result).toBeNull()
        })

        it('should return null for invalid JSON', () => {
            localStorage.setItem('invalid', 'not valid json{')
            const result = getItem('invalid')
            expect(result).toBeNull()
        })
    })

    describe('getValidatedItem', () => {
        const TestSchema = z.object({
            id: z.string(),
            count: z.number(),
        })

        it('should get and validate data with Zod schema', () => {
            const testData = { id: 'test-123', count: 42 }
            localStorage.setItem('validated', JSON.stringify(testData))

            const result = getValidatedItem('validated', TestSchema)
            expect(result).toEqual(testData)
        })

        it('should return null for invalid data and remove it', () => {
            const invalidData = { id: 'test', count: 'not a number' }
            localStorage.setItem('invalid', JSON.stringify(invalidData))

            const result = getValidatedItem('invalid', TestSchema)
            expect(result).toBeNull()
            expect(localStorage.getItem('invalid')).toBeNull()
        })

        it('should call onError callback for validation errors', () => {
            const invalidData = { id: 123, count: 'invalid' }
            localStorage.setItem('invalid', JSON.stringify(invalidData))

            const onError = vi.fn()
            const result = getValidatedItem('invalid', TestSchema, onError)

            expect(result).toBeNull()
            expect(onError).toHaveBeenCalledOnce()
            expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(z.ZodError)
        })

        it('should return null for non-existent key', () => {
            const result = getValidatedItem('nonexistent', TestSchema)
            expect(result).toBeNull()
        })

        it('should handle array schemas', () => {
            const ArraySchema = z.array(TestSchema)
            const testData = [
                { id: 'test-1', count: 1 },
                { id: 'test-2', count: 2 },
            ]
            localStorage.setItem('array', JSON.stringify(testData))

            const result = getValidatedItem('array', ArraySchema)
            expect(result).toEqual(testData)
        })
    })

    describe('setItem', () => {
        it('should save data as JSON string', () => {
            const testData = { name: 'Test', value: 123 }
            setItem('test', testData)

            const stored = localStorage.getItem('test')
            expect(stored).toBe(JSON.stringify(testData))
        })

        it('should handle primitive values', () => {
            setItem('string', 'hello')
            setItem('number', 42)
            setItem('boolean', true)

            expect(getItem('string')).toBe('hello')
            expect(getItem('number')).toBe(42)
            expect(getItem('boolean')).toBe(true)
        })

        it('should handle arrays', () => {
            const testArray = [1, 2, 3, 4, 5]
            setItem('array', testArray)

            expect(getItem('array')).toEqual(testArray)
        })

        it('should overwrite existing values', () => {
            setItem('test', 'first')
            setItem('test', 'second')

            expect(getItem('test')).toBe('second')
        })
    })

    describe('removeItem', () => {
        it('should remove item from localStorage', () => {
            localStorage.setItem('test', 'value')
            removeItem('test')

            expect(localStorage.getItem('test')).toBeNull()
        })

        it('should not throw error for non-existent key', () => {
            expect(() => removeItem('nonexistent')).not.toThrow()
        })
    })

    describe('clear', () => {
        it('should clear all items from localStorage', () => {
            localStorage.setItem('key1', 'value1')
            localStorage.setItem('key2', 'value2')
            localStorage.setItem('key3', 'value3')

            clear()

            expect(localStorage.getItem('key1')).toBeNull()
            expect(localStorage.getItem('key2')).toBeNull()
            expect(localStorage.getItem('key3')).toBeNull()
        })
    })
})
