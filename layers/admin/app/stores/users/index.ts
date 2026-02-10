import { defineStore } from 'pinia'
import { userService } from '#layers/admin/services/user.service'
import type { User, UserCreate, UserUpdate } from '#layers/admin/app/types'

interface UserState {
    users: User[]
    selectedUser: User | null
    loading: boolean
    error: string | null
}

export const useUserStore = defineStore('admin-users', {
    state: (): UserState => ({
        users: [],
        selectedUser: null,
        loading: false,
        error: null
    }),

    getters: {
        activeUsers: (state) => state.users.filter(u => u.status === 'ACTIVE'),
        inactiveUsers: (state) => state.users.filter(u => u.status === 'INACTIVE'),

        usersByRole: (state) => (role: string) =>
            state.users.filter(u => u.role === role)
    },

    actions: {
        async fetchUsers(filters?: any) {
            this.loading = true
            this.error = null

            try {
                this.users = await userService.getUsers(filters)
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data user'
                throw error
            } finally {
                this.loading = false
            }
        },

        async createUser(data: UserCreate) {
            this.loading = true
            this.error = null

            try {
                const user = await userService.createUser(data)
                this.users.unshift(user)
                return user
            } catch (error: any) {
                this.error = error.message || 'Gagal membuat user'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateUser(id: string, data: UserUpdate) {
            this.loading = true
            this.error = null

            try {
                const user = await userService.updateUser(id, data)
                const index = this.users.findIndex(u => u.id === id)
                if (index !== -1) {
                    this.users[index] = user
                }
                return user
            } catch (error: any) {
                this.error = error.message || 'Gagal update user'
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id: string) {
            this.loading = true
            this.error = null

            try {
                await userService.deleteUser(id)
                this.users = this.users.filter(u => u.id !== id)
            } catch (error: any) {
                this.error = error.message || 'Gagal delete user'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
