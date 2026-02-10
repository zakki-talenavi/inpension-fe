import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'
import type { User } from '#layers/auth/app/schemas/auth'

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
}

const mockToken = 'mock-jwt-token'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useAuthStore()
      
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.userEmail).toBe('')
      expect(store.userName).toBe('')
    })
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const store = useAuthStore()
      
      global.$fetch = vi.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
      })

      const result = await store.login('test@example.com', 'password123')

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
    })

    it('should handle login failure', async () => {
      const store = useAuthStore()
      
      global.$fetch = vi.fn().mockRejectedValue(new Error('Invalid credentials'))

      const result = await store.login('test@example.com', 'wrong-password')

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.error).toBe('Invalid credentials')
    })

    it('should set loading state during login', async () => {
      const store = useAuthStore()
      
      let resolveFetch: (value: any) => void
      const fetchPromise = new Promise((resolve) => {
        resolveFetch = resolve
      })
      
      global.$fetch = vi.fn().mockReturnValue(fetchPromise)

      const loginPromise = store.login('test@example.com', 'password123')
      
      expect(store.isLoading).toBe(true)
      
      resolveFetch!({ user: mockUser, token: mockToken })
      await loginPromise
      
      expect(store.isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const store = useAuthStore()
      
      global.$fetch = vi.fn().mockResolvedValue({
        user: mockUser,
        token: mockToken,
      })

      const result = await store.register('Test User', 'test@example.com', 'password123')

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isAuthenticated).toBe(true)
    })

    it('should handle registration failure', async () => {
      const store = useAuthStore()
      
      global.$fetch = vi.fn().mockRejectedValue(new Error('Email already exists'))

      const result = await store.register('Test User', 'test@example.com', 'password123')

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.error).toBe('Email already exists')
    })
  })

  describe('logout', () => {
    it('should clear user data and token on logout', async () => {
      const store = useAuthStore()
      
      store.user = mockUser
      store.token = mockToken
      
      global.$fetch = vi.fn().mockResolvedValue({ success: true })

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should handle logout API error gracefully', async () => {
      const store = useAuthStore()
      
      store.user = mockUser
      store.token = mockToken
      
      global.$fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })
  })

  describe('computed properties', () => {
    it('should compute userEmail correctly', () => {
      const store = useAuthStore()
      
      expect(store.userEmail).toBe('')
      
      store.user = mockUser
      expect(store.userEmail).toBe('test@example.com')
    })

    it('should compute userName correctly', () => {
      const store = useAuthStore()
      
      expect(store.userName).toBe('')
      
      store.user = mockUser
      expect(store.userName).toBe('Test User')
    })

    it('should compute isAuthenticated correctly', () => {
      const store = useAuthStore()
      
      expect(store.isAuthenticated).toBe(false)
      
      store.token = mockToken
      expect(store.isAuthenticated).toBe(true)
    })
  })
})
