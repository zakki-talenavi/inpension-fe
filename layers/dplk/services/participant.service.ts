import { apiClient } from '~/services/api/client'
import type {
    Participant,
    ParticipantRegistrationPersonal,
    ParticipantRegistrationCompany,
    ParticipantVerification
} from '../app/types'

export class ParticipantService {
    private baseUrl = '/dplk/participants'

    // Get participants with filters
    async getParticipants(filters?: {
        status?: string
        type?: string
        search?: string
        page?: number
        pageSize?: number
    }): Promise<{ data: Participant[], total: number }> {
        const response = await apiClient.get(this.baseUrl, { params: filters })
        return response.data
    }

    // Get participant by ID
    async getParticipantById(id: string): Promise<Participant> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`)
        return response.data.data
    }

    // Register personal participant
    async registerPersonal(data: ParticipantRegistrationPersonal): Promise<Participant> {
        const formData = new FormData()

        // Append JSON data
        formData.append('data', JSON.stringify({
            identity: data.identity,
            funds: data.funds,
            investment: data.investment,
            heir: data.heir,
            privacy: data.privacy,
            terms: data.terms
        }))

        // Append files
        if (data.documents.ktp) formData.append('ktp', data.documents.ktp)
        if (data.documents.npwp) formData.append('npwp', data.documents.npwp)
        if (data.documents.familyCard) formData.append('familyCard', data.documents.familyCard)
        if (data.documents.bankStatement) formData.append('bankStatement', data.documents.bankStatement)

        const response = await apiClient.post(`${this.baseUrl}/register/personal`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.data
    }

    // Register company participants (bulk)
    async registerCompany(data: ParticipantRegistrationCompany): Promise<Participant[]> {
        const response = await apiClient.post(`${this.baseUrl}/register/company`, data)
        return response.data.data
    }

    // Verify PPIP
    async verifyPPIP(data: ParticipantVerification): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${data.participantId}/verify/ppip`, data)
    }

    // Verify DKP
    async verifyDKP(data: ParticipantVerification): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${data.participantId}/verify/dkp`, data)
    }

    // Update participant
    async updateParticipant(id: string, data: Partial<Participant>): Promise<Participant> {
        const response = await apiClient.put(`${this.baseUrl}/${id}`, data)
        return response.data.data
    }

    // Delete participant
    async deleteParticipant(id: string): Promise<void> {
        await apiClient.delete(`${this.baseUrl}/${id}`)
    }

    // Get pending verifications
    async getPendingVerifications(type: 'PPIP' | 'DKP'): Promise<Participant[]> {
        const response = await apiClient.get(`${this.baseUrl}/pending/${type.toLowerCase()}`)
        return response.data.data
    }

    // Export participants
    async exportParticipants(filters?: any): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/export`, {
            params: filters,
            responseType: 'blob'
        })
        return response.data
    }
}

export const participantService = new ParticipantService()
