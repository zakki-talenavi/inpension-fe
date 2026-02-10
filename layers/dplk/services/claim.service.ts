import { apiClient } from '~/services/api/client'
import type { Claim, ClaimRequest } from '../app/types'

export class ClaimService {
    private baseUrl = '/dplk/claims'

    async getClaims(filters?: {
        status?: string
        claimType?: string
        search?: string
        page?: number
        pageSize?: number
    }): Promise<{ data: Claim[], total: number }> {
        const response = await apiClient.get(this.baseUrl, { params: filters })
        return response.data
    }

    async getClaimById(id: string): Promise<Claim> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`)
        return response.data.data
    }

    async createClaim(data: ClaimRequest): Promise<Claim> {
        const formData = new FormData()

        formData.append('participantId', data.participantId)
        formData.append('claimType', data.claimType)
        formData.append('amount', data.amount.toString())
        formData.append('reason', data.reason)
        formData.append('bankAccount', data.bankAccount)
        formData.append('bankName', data.bankName)

        data.documents.forEach((file, index) => {
            formData.append(`documents[${index}]`, file)
        })

        const response = await apiClient.post(this.baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.data
    }

    async approveClaim(id: string, notes: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/approve`, { notes })
    }

    async rejectClaim(id: string, reason: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/reject`, { reason })
    }

    async processPay(id: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/pay`)
    }
}

export const claimService = new ClaimService()
