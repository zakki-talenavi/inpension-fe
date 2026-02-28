/**
 * Token storage and auth helpers for API client.
 * Used by client.ts ($fetch) for Bearer token and refresh logic.
 */

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
import { getJwtMaxAge } from '~/utils/jwt'
import { useCookie } from 'nuxt/app'

export function getAccessToken(): string | null {
    return useCookie<string | null>(TOKEN_KEY).value ?? null
}

export function getRefreshToken(): string | null {
    return useCookie<string | null>(REFRESH_TOKEN_KEY).value ?? null
}

export function setAccessToken(token: string): void {
    const maxAge = getJwtMaxAge(token)
    const cookie = useCookie<string | null>(TOKEN_KEY, { maxAge, path: '/' })
    cookie.value = token
}

export function setRefreshToken(token: string): void {
    const maxAge = getJwtMaxAge(token)
    const cookie = useCookie<string | null>(REFRESH_TOKEN_KEY, { maxAge, path: '/' })
    cookie.value = token
}

export function clearTokens(): void {
    useCookie<string | null>(TOKEN_KEY).value = null
    useCookie<string | null>(REFRESH_TOKEN_KEY).value = null
}

export function isAuthenticated(): boolean {
    return !!getAccessToken()
}

export const tokenStorage = {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearTokens,
    isAuthenticated,
}
