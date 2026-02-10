import { apiClient } from '~/services/api/client'
import type { CompanyProfile } from '../app/types'

export class CompanyService {
    private baseUrl = '/company'

    async getProfile(): Promise<CompanyProfile> {
        const response = await apiClient.get(`${this.baseUrl}/profile`)
        return response.data.data
    }

    async updateProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
        const response = await apiClient.put(`${this.baseUrl}/profile`, data)
        return response.data.data
    }

    async uploadDocument(type: string, file: File): Promise<void> {
        const formData = new FormData()
        formData.append('type', type)
        formData.append('file', file)

        await apiClient.post(`${this.baseUrl}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}

export const companyService = new CompanyService()
