import { beforeEach } from 'vitest'

// Store for localStorage mock
let store: Record<string, string> = {}

const localStorageMock = {
  getItem: (key: string): string | null => store[key] ?? null,
  setItem: (key: string, value: string): void => {
    store[key] = value.toString()
  },
  removeItem: (key: string): void => {
    delete store[key]
  },
  clear: (): void => {
    store = {}
  },
  get length(): number {
    return Object.keys(store).length
  },
  key: (index: number): string | null => Object.keys(store)[index] ?? null,
}

  // Mock window and localStorage for Node.js environment
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  ; (global as Record<string, unknown>).window = global.window ?? {}
  ; (global as Record<string, unknown>).localStorage = localStorageMock
  ; (global.window as Record<string, unknown>).localStorage = localStorageMock

// Mock import.meta.client for Nuxt SSR guards
// In Vitest, import.meta is extensible, but we need to define it properly
Object.defineProperty(import.meta, 'client', {
  value: true,
  writable: true,
  configurable: true,
})

Object.defineProperty(import.meta, 'server', {
  value: false,
  writable: true,
  configurable: true,
})

// Reset localStorage before each test
beforeEach(() => {
  store = {}
})


