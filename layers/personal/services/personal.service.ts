import { apiClient } from '~/services/api/client'
import type { PersonalProfile } from '../app/types'

export class PersonalService {
    private baseUrl = '/personal'

    async getProfile(): Promise<PersonalProfile> {
        const response = await apiClient.get(`${this.baseUrl}/profile`)
        return response.data.data
    }

    async updateProfile(data: Partial<PersonalProfile>): Promise<PersonalProfile> {
        const response = await apiClient.put(`${this.baseUrl}/profile`, data)
        return response.data.data
    }

    async uploadPhoto(file: File): Promise<string> {
        const formData = new FormData()
        formData.append('photo', file)

        const response = await apiClient.post(`${this.baseUrl}/profile/photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.data.photoUrl
    }
}

export const personalService = new PersonalService()
