/**
 * Utility functions for handling JSON Web Tokens (JWT)
 */

export function decodeJwtExp(token: string): number | null {
    try {
        const base64Url = token.split('.')[1]
        if (!base64Url) return null
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = typeof atob === 'function'
            ? atob(base64)
            : Buffer.from(base64, 'base64').toString('utf-8')
        const payload = JSON.parse(jsonPayload)
        return payload.exp ? payload.exp : null
    } catch (e) {
        return null
    }
}

/**
 * Returns the remaining max age in seconds based on the token's exp claim.
 * @param token JWT token string
 * @param fallbackDays Default fallback if exp cannot be read
 */
export function getJwtMaxAge(token: string, fallbackDays = 7): number {
    const exp = decodeJwtExp(token)
    if (!exp) return 60 * 60 * 24 * fallbackDays
    const now = Math.floor(Date.now() / 1000)
    const maxAge = exp - now
    return maxAge > 0 ? maxAge : 60 * 60 * 24 * fallbackDays
}
