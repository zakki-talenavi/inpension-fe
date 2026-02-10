import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'
import type { User } from '#layers/auth/app/schemas/auth'
import { getUser, setUser, getToken, setToken, clearAuth, isAuthenticated as checkAuth } from '#layers/auth/app/utils/auth'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const user = ref<User | null>(getUser())
  const token = ref<string | null>(getToken())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userEmail = computed(() => user.value?.email ?? '')
  const userName = computed(() => user.value?.name ?? '')

  async function login(email: string, password: string, role: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBaseUrl}/auth/login`, {
        method: 'POST',
        body: { email, password, role },
      })

      user.value = response.user
      token.value = response.token
      setUser(response.user)
      setToken(response.token)

      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ user: User; token: string }>(`${config.public.apiBaseUrl}/auth/register`, {
        method: 'POST',
        body: { name, email, password },
      })

      user.value = response.user
      token.value = response.token
      setUser(response.user)
      setToken(response.token)

      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`${config.public.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    } catch {
    } finally {
      user.value = null
      token.value = null
      clearAuth()
      isLoading.value = false
    }
  }

  function checkAuthentication() {
    if (checkAuth() && !user.value) {
      user.value = getUser()
      token.value = getToken()
    }
    return isAuthenticated.value
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    userEmail,
    userName,
    login,
    register,
    logout,
    checkAuthentication,
  }
})
