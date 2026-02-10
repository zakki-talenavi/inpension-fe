import type { User } from '#layers/auth/app/schemas/auth'

const STORAGE_KEY = 'auth-user'
const TOKEN_KEY = 'auth-token'

export function getUser(): User | null {
  if (import.meta.client) {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      try {
        return JSON.parse(data) as User
      } catch {
        return null
      }
    }
  }
  return null
}

export function setUser(user: User): void {
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  }
}

export function getToken(): string | null {
  if (import.meta.client) {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export function setToken(token: string): void {
  if (import.meta.client) {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function clearAuth(): void {
  if (import.meta.client) {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}
