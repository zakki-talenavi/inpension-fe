import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { ref } from 'vue'

vi.mock('nuxt/app', () => ({
  useCookie: () => ref<string | null>(null),
}))

import { useAuthStore } from '~/stores/auth/useAuthStore'
import type { User } from '~/schemas/user'

const mockUser: User = {
  id: '1',
  fullName: 'Test User',
  email: 'test@example.com',
  role: 'PERSONAL'
}

const mockToken = 'mock-jwt-token'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // mock nuxt composables if needed, but here we just test store logic
    // useCookie is mocked by nuxt test utils usually, or we might need to mock it if running in pure vitest without nuxt context
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useAuthStore()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const store = useAuthStore()

      // We are not mocking $fetch globally here because the store implementation uses a timeout mock
      // validation. If we wanted to test real API call we would mock $fetch.
      // But currently the store has MOCKED implementation inside it (setTimeout).
      // So we just call it.

      const result = await store.login({ email: 'test@example.com', password: 'password123' })

      expect(result.token).toBeDefined()
      expect(store.user).toBeDefined()
      expect(store.token).toBeDefined()
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
      expect(store.user?.role).toBe('PERSONAL')
    })

    it('should set loading state during login', async () => {
      const store = useAuthStore()

      const loginPromise = store.login({ email: 'test@example.com', password: 'password123' })

      expect(store.loading).toBe(true)

      await loginPromise

      expect(store.loading).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear user data and token on logout', async () => {
      const store = useAuthStore()

      await store.login({ email: 'test@example.com', password: 'password' })
      expect(store.isAuthenticated).toBe(true)

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })
  })
})
