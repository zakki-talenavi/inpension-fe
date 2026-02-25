import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookie } from 'nuxt/app'
import { UserSchema, type User } from '~/schemas/user'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: string
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
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        fullName: 'Test User',
        role: credentials.email.includes('dplk') ? 'DPLK' :
          credentials.email.includes('company') ? 'COMPANY' :
            credentials.email.includes('admin') ? 'ADMINISTRATOR' : 'PERSONAL'
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      const validated = UserSchema.parse(mockUser)
      user.value = validated
      token.value = mockToken
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = mockToken
      return { user: validated, token: mockToken }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterData) {
    loading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const mockUser: User = {
        id: '1',
        email: data.email,
        fullName: data.name,
        role: data.role as User['role']
      }
      const mockToken = 'mock-jwt-token-' + Date.now()
      const validated = UserSchema.parse(mockUser)
      user.value = validated
      token.value = mockToken
      const tokenCookie = useCookie('auth_token')
      tokenCookie.value = mockToken
      return { user: validated, token: mockToken }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    loading.value = true
    error.value = null
    try {
      if (user.value) return
      const tokenCookie = useCookie('auth_token')
      if (tokenCookie.value) {
        const mockUser: User = {
          id: '1',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'PERSONAL'
        }
        user.value = UserSchema.parse(mockUser)
        token.value = tokenCookie.value || null
      }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch user'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
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
