import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookie } from '#app'
import { UserSchema, type User } from '../../schemas/user'

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
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    const userRole = computed(() => user.value?.role)
    const hasRole = (role: string) => user.value?.role === role

    // Actions
    async function login(credentials: LoginCredentials) {
        loading.value = true
        error.value = null

        try {
            // Mock authentication - replace with real API call later
            await new Promise(resolve => setTimeout(resolve, 500))

            // Mock user data based on email
            const mockUser: User = {
                id: '1',
                email: credentials.email,
                fullName: 'Test User',
                role: credentials.email.includes('dplk') ? 'DPLK' :
                    credentials.email.includes('company') ? 'COMPANY' :
                        credentials.email.includes('admin') ? 'ADMINISTRATOR' : 'PERSONAL'
            }

            const mockToken = 'mock-jwt-token-' + Date.now()

            // Validate with Zod (good practice even with mocks)
            const validated = UserSchema.parse(mockUser)

            user.value = validated
            token.value = mockToken

            // Store token in cookie
            const tokenCookie = useCookie('auth_token')
            tokenCookie.value = mockToken

            return { user: validated, token: mockToken }
        } catch (err: any) {
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
            // Mock registration
            await new Promise(resolve => setTimeout(resolve, 500))

            const mockUser: User = {
                id: '1',
                email: data.email,
                fullName: data.name,
                role: data.role as any // In real app, validate role against schema enum
            }

            const mockToken = 'mock-jwt-token-' + Date.now()

            // Validate with Zod
            const validated = UserSchema.parse(mockUser)

            user.value = validated
            token.value = mockToken

            const tokenCookie = useCookie('auth_token')
            tokenCookie.value = mockToken

            return { user: validated, token: mockToken }
        } catch (err: any) {
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
            if (user.value) {
                return
            }

            // If no user but has token, create mock user
            const tokenCookie = useCookie('auth_token')
            if (tokenCookie.value) {
                // Mock fetch - in real app, fetch from API using token
                const mockUser: User = {
                    id: '1',
                    email: 'test@example.com',
                    fullName: 'Test User',
                    role: 'PERSONAL'
                }

                user.value = UserSchema.parse(mockUser)
                token.value = tokenCookie.value || null
            }
        } catch (err: any) {
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

        // Clear token cookie
        const tokenCookie = useCookie('auth_token')
        tokenCookie.value = null
    }

    // Public API
    return {
        // State
        user,
        token,
        loading,
        error,
        // Getters
        isAuthenticated,
        userRole,
        hasRole,
        // Actions
        login,
        register,
        fetchCurrentUser,
        logout,
    }
})
