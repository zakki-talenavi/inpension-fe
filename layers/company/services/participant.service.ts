import { apiClient } from '~/services/api/client'
import type { CompanyParticipant } from '../app/types'

export class ParticipantService {
    private baseUrl = '/company/participants'

    async getParticipants(filters?: {
        type?: 'DKP' | 'PPIP'
        status?: string
        search?: string
    }): Promise<CompanyParticipant[]> {
        const response = await apiClient.get(this.baseUrl, { params: filters })
        return response.data.data
    }

    async getParticipantById(id: string): Promise<CompanyParticipant> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`)
        return response.data.data
    }

    async updateParticipant(id: string, data: Partial<CompanyParticipant>): Promise<CompanyParticipant> {
        const response = await apiClient.put(`${this.baseUrl}/${id}`, data)
        return response.data.data
    }

    async deactivateParticipant(id: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/deactivate`)
    }

    async activateParticipant(id: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/activate`)
    }

    async exportParticipants(filters?: any): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/export`, {
            params: filters,
            responseType: 'blob'
        })
        return response.data
    }
}

export const participantService = new ParticipantService()
