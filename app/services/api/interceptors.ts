/**
 * Token storage and auth helpers for API client.
 * Used by client.ts ($fetch) for Bearer token and refresh logic.
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// In-memory fallback for SSR (server-side) where localStorage is unavailable
let _memoryToken: string | null = null

function isClient(): boolean {
    return typeof window !== 'undefined'
}

export function getAccessToken(): string | null {
    if (isClient()) {
        return localStorage.getItem(TOKEN_KEY) || null
    }
    return _memoryToken
}

export function getRefreshToken(): string | null {
    if (isClient()) {
        return localStorage.getItem(REFRESH_TOKEN_KEY) || null
    }
    return null
}

export function setAccessToken(token: string): void {
    _memoryToken = token
    if (isClient()) {
        localStorage.setItem(TOKEN_KEY, token)
    }
}

export function setRefreshToken(token: string): void {
    if (isClient()) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token)
    }
}

export function clearTokens(): void {
    if (isClient()) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
}

export function isAuthenticated(): boolean {
    return getAccessToken() !== null
}

export const tokenStorage = {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearTokens,
    isAuthenticated,
}
