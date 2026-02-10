import { defineStore } from 'pinia'
import { authService } from '~/services/modules/auth/auth.service'
import type { LoginCredentials, RegisterData, User } from '~/services/modules/auth/auth.types'

interface AuthState {
    user: User | null
    token: string | null
    loading: boolean
    error: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        userRole: (state) => state.user?.role,
        hasRole: (state) => (role: string) => state.user?.role === role
    },

    actions: {
        async login(credentials: LoginCredentials) {
            this.loading = true
            this.error = null

            try {
                const response = await authService.login(credentials)
                this.user = response.user
                this.token = response.token

                // Store token in cookie
                const tokenCookie = useCookie('auth_token')
                tokenCookie.value = response.token

                return response
            } catch (error: any) {
                this.error = error.message || 'Login failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async register(data: RegisterData) {
            this.loading = true
            this.error = null

            try {
                const response = await authService.register(data)
                this.user = response.user
                this.token = response.token

                // Store token in cookie
                const tokenCookie = useCookie('auth_token')
                tokenCookie.value = response.token

                return response
            } catch (error: any) {
                this.error = error.message || 'Registration failed'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchCurrentUser() {
            this.loading = true
            this.error = null

            try {
                this.user = await authService.getCurrentUser()
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch user'
                throw error
            } finally {
                this.loading = false
            }
        },

        async logout() {
            this.user = null
            this.token = null

            // Clear token cookie
            const tokenCookie = useCookie('auth_token')
            tokenCookie.value = null
        }
    }
})
