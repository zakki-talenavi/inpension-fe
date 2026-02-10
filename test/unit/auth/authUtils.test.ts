import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getUser, setUser, getToken, setToken, clearAuth, isAuthenticated } from '#layers/auth/app/utils/auth'
import type { User } from '#layers/auth/app/schemas/auth'

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('Auth Utils', () => {
  beforeEach(() => {
    clearAuth()
  })

  afterEach(() => {
    clearAuth()
  })

  describe('getUser and setUser', () => {
    it('should return null when no user is stored', () => {
      const result = getUser()
      expect(result).toBeNull()
    })

    it('should store and retrieve user', () => {
      setUser(mockUser)
      const result = getUser()
      expect(result).toEqual(mockUser)
    })

    it('should return null for corrupted user data', () => {
      localStorage.setItem('auth-user', 'invalid-json')
      const result = getUser()
      expect(result).toBeNull()
    })
  })

  describe('getToken and setToken', () => {
    it('should return null when no token is stored', () => {
      const result = getToken()
      expect(result).toBeNull()
    })

    it('should store and retrieve token', () => {
      const mockToken = 'mock-jwt-token'
      setToken(mockToken)
      const result = getToken()
      expect(result).toBe(mockToken)
    })
  })

  describe('clearAuth', () => {
    it('should clear user and token from storage', () => {
      setUser(mockUser)
      setToken('mock-token')
      
      expect(getUser()).toEqual(mockUser)
      expect(getToken()).toBe('mock-token')
      
      clearAuth()
      
      expect(getUser()).toBeNull()
      expect(getToken()).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no token is stored', () => {
      expect(isAuthenticated()).toBe(false)
    })

    it('should return true when token is stored', () => {
      setToken('mock-token')
      expect(isAuthenticated()).toBe(true)
    })
  })
})
