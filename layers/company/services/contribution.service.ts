import { apiClient } from '~/services/api/client'
import type { Contribution, ContributionUpload } from '../app/types'

export class ContributionService {
    private baseUrl = '/company/contributions'

    async getContributions(filters?: {
        status?: string
        period?: string
    }): Promise<Contribution[]> {
        const response = await apiClient.get(this.baseUrl, { params: filters })
        return response.data.data
    }

    async getContributionById(id: string): Promise<Contribution> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`)
        return response.data.data
    }

    async uploadContribution(data: ContributionUpload): Promise<Contribution> {
        const formData = new FormData()
        formData.append('period', data.period)
        formData.append('file', data.file)

        const response = await apiClient.post(this.baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.data
    }

    async downloadTemplate(): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/template`, {
            responseType: 'blob'
        })
        return response.data
    }

    async getHistory(year?: number): Promise<Contribution[]> {
        const response = await apiClient.get(`${this.baseUrl}/history`, {
            params: { year }
        })
        return response.data.data
    }
}

export const contributionService = new ContributionService()
