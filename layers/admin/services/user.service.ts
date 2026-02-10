import { apiClient } from '~/services/api/client'
import type { User, UserCreate, UserUpdate } from '../app/types'

export class UserService {
    private baseUrl = '/admin/users'

    async getUsers(filters?: {
        role?: string
        status?: string
        search?: string
    }): Promise<User[]> {
        const response = await apiClient.get(this.baseUrl, { params: filters })
        return response.data.data
    }

    async getUserById(id: string): Promise<User> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`)
        return response.data.data
    }

    async createUser(data: UserCreate): Promise<User> {
        const response = await apiClient.post(this.baseUrl, data)
        return response.data.data
    }

    async updateUser(id: string, data: UserUpdate): Promise<User> {
        const response = await apiClient.put(`${this.baseUrl}/${id}`, data)
        return response.data.data
    }

    async deleteUser(id: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${id}`)
    }

    async activateUser(id: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/activate`)
    }

    async deactivateUser(id: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/deactivate`)
    }

    async resetPassword(id: string): Promise<{ temporaryPassword: string }> {
        const response = await apiClient.post(`${this.baseUrl}/${id}/reset-password`)
        return response.data.data
    }
}

export const userService = new UserService()
