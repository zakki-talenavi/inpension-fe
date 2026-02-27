import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookie } from 'nuxt/app'
import { UserSchema, type User } from '~/schemas/user'
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getAccessToken,
} from '~/services/api/interceptors'
import { authLogin, authRegister, authMe } from '~/services/api/auth'
import type { ApiError } from '~/services/api/client'

interface LoginCredentials {
  email: string
  password: string
  captchaKey?: string
  captcha?: string
}

interface RegisterData {
  email: string
  password?: string
  name: string
  role: string
  identityNumber?: string
}

/** Map API user to schema User. Tolerates various backend property namings. */
function toSchemaUser(apiUser: Record<string, any>): User {
  const fullName = apiUser.fullName ?? apiUser.name ?? apiUser.username ?? 'Unknown'
  const role = apiUser.role ?? apiUser.role_code ?? apiUser.role_name ?? 'UNKNOWN'

  return UserSchema.parse({
    id: apiUser.id,
    email: apiUser.email,
    fullName,
    role,
  })
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role)
  const hasRole = (role: string) => user.value?.role === role

  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const res = await authLogin({
        email: credentials.email,
        password: credentials.password,
        captchaKey: credentials.captchaKey,
        captcha: credentials.captcha,
      })
      const { user: apiUser, access_token, refresh_token } = res.data
      const validated = toSchemaUser(apiUser)
      setAccessToken(access_token)
      if (refresh_token) setRefreshToken(refresh_token)
      user.value = validated
      token.value = access_token
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = access_token
      return { user: validated, token: access_token }
    } catch (err: unknown) {
      const apiErr = err as ApiError
      error.value = apiErr?.message ?? (err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    try {
      const res = await authRegister({
        name: data.name,
        email: data.email,
        password: data.password || '',
        role: data.role,
        identityNumber: data.identityNumber,
      })
      const { user: apiUser, access_token, refresh_token } = res.data
      const validated = toSchemaUser(apiUser)
      setAccessToken(access_token)
      if (refresh_token) setRefreshToken(refresh_token)
      user.value = validated
      token.value = access_token
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = access_token
      return { user: validated, token: access_token }
    } catch (err: unknown) {
      const apiErr = err as ApiError
      error.value = apiErr?.message ?? (err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    loading.value = true
    error.value = null
    try {
      const tokenCookie = useCookie('auth_token')
      const storedToken = getAccessToken() ?? tokenCookie.value
      if (!storedToken) return
      const res = await authMe()
      const validated = toSchemaUser(res.data.user)
      user.value = validated
      token.value = storedToken
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user'
      clearTokens()
      user.value = null
      token.value = null
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    clearTokens()
    user.value = null
    token.value = null
    error.value = null
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = null
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    hasRole,
    login,
    register,
    fetchCurrentUser,
    logout,
  }
})
