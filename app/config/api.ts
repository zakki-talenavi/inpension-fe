/**
 * API configuration and path constants.
 * Base URL is set via NUXT_PUBLIC_API_BASE_URL (see nuxt.config.ts runtimeConfig.public.apiBaseUrl).
 */

/** API version prefix (e.g. /v1) */
export const API_VERSION = 'v1'

/** Auth routes prefix: /v1/auth */
export const AUTH_PREFIX = `/${API_VERSION}/auth`

/** Auth endpoint paths (relative to base URL) */
export const AUTH_ENDPOINTS = {
    login: `${AUTH_PREFIX}/login`,
    register: `${AUTH_PREFIX}/register`,
    me: `${AUTH_PREFIX}/me`,
    refresh: `${AUTH_PREFIX}/refresh`,
    validate: `${AUTH_PREFIX}/validate`,
    captcha: `${AUTH_PREFIX}/captcha`,
    forgotPassword: `${AUTH_PREFIX}/forgot-password`,
    verifyEmail: `${AUTH_PREFIX}/verify-email`,
    sendVerification: `${AUTH_PREFIX}/send-verification`,
} as const
