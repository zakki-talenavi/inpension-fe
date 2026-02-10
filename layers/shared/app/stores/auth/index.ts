import { defineStore } from 'pinia'

export interface User {
    id: string
    email: string
    name: string
    role: 'DPLK' | 'COMPANY' | 'PERSONAL' | 'ADMINISTRATOR'
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    name: string
    role: string
}

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
                // Mock authentication - replace with real API call later
                await new Promise(resolve => setTimeout(resolve, 500))

                // Mock user data based on email
                const mockUser: User = {
                    id: '1',
                    email: credentials.email,
                    name: 'Test User',
                    role: credentials.email.includes('dplk') ? 'DPLK' :
                        credentials.email.includes('company') ? 'COMPANY' :
                            credentials.email.includes('admin') ? 'ADMINISTRATOR' : 'PERSONAL'
                }

                const mockToken = 'mock-jwt-token-' + Date.now()

                this.user = mockUser
                this.token = mockToken

                // Store token in cookie
                const tokenCookie = useCookie('auth_token')
                tokenCookie.value = mockToken

                return { user: mockUser, token: mockToken }
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
                // Mock registration
                await new Promise(resolve => setTimeout(resolve, 500))

                const mockUser: User = {
                    id: '1',
                    email: data.email,
                    name: data.name,
                    role: data.role as any
                }

                const mockToken = 'mock-jwt-token-' + Date.now()

                this.user = mockUser
                this.token = mockToken

                const tokenCookie = useCookie('auth_token')
                tokenCookie.value = mockToken

                return { user: mockUser, token: mockToken }
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
                // Mock fetch - in real app, fetch from API using token
                if (this.user) {
                    return
                }

                // If no user but has token, create mock user
                const tokenCookie = useCookie('auth_token')
                if (tokenCookie.value) {
                    this.user = {
                        id: '1',
                        email: 'test@example.com',
                        name: 'Test User',
                        role: 'PERSONAL'
                    }
                }
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

