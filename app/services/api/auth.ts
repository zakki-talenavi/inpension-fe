/**
 * Auth API service – single place for all auth-related API calls.
 * Uses shared API client; paths from app/config/api.ts.
 */
import { api } from './client'
import { AUTH_ENDPOINTS } from '~/config/api'
import type { ApiResponse } from './client'
import type { User } from '~/types/api'

// --- Request/response types for auth endpoints ---

export interface LoginRequest {
    email: string
    password: string
    captchaKey?: string
    captcha?: string
}

export interface LoginResponse {
    user: User
    access_token: string
    refresh_token?: string
}

export interface RegisterRequest {
    name: string
    email: string
    password?: string
    role: string
    /** Optional: identity number / NIK */
    identityNumber?: string
}

export interface RegisterResponse {
    user: User
    access_token: string
    refresh_token?: string
}

export interface MeResponse {
    id: string
    username: string
    email: string
    role_id: string
    role_name: string
    role_code: string
    master_role_id: string
    master_role_name: string
    master_role_code: string
    permissions: string[]
}

export interface RefreshRequest {
    refreshToken: string
}

export interface RefreshResponse {
    accessToken: string
    refreshToken?: string
}

export interface CaptchaResponse {
    captcha_id: string
    image_base64: string
    image_type: string
}

/** Login */
export function authLogin(payload: LoginRequest) {
    return api.post<LoginResponse>(AUTH_ENDPOINTS.login, {
        username: payload.email,
        password: payload.password,
        captcha_id: payload.captchaKey,
        captcha_answer: payload.captcha?.toUpperCase()
    })
}

/** Register */
export function authRegister(payload: RegisterRequest) {
    return api.post<RegisterResponse>(AUTH_ENDPOINTS.register, payload)
}

/** Get current user (requires Bearer token) */
export function authMe() {
    return api.get<MeResponse>(AUTH_ENDPOINTS.me)
}

/** Refresh access token */
export function authRefresh(payload: RefreshRequest) {
    return api.post<RefreshResponse>(AUTH_ENDPOINTS.refresh, payload)
}

/** Validate token (optional) */
export function authValidate() {
    return api.get<{ valid: boolean }>(AUTH_ENDPOINTS.validate)
}

/** Get captcha (key + image URL or base64) */
export function authCaptcha(): Promise<ApiResponse<CaptchaResponse>> {
    return api.get<CaptchaResponse>(AUTH_ENDPOINTS.captcha)
}
