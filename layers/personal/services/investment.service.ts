import { apiClient } from '~/services/api/client'
import type { Investment, InvestmentHistory } from '../app/types'

export class InvestmentService {
    private baseUrl = '/personal/investment'

    async getInvestments(): Promise<Investment[]> {
        const response = await apiClient.get(this.baseUrl)
        return response.data.data
    }

    async getInvestmentHistory(packageId: string): Promise<InvestmentHistory[]> {
        const response = await apiClient.get(`${this.baseUrl}/${packageId}/history`)
        return response.data.data
    }

    async changeAllocation(allocations: Array<{ packageId: string, percentage: number }>): Promise<void> {
        await apiClient.post(`${this.baseUrl}/change-allocation`, { allocations })
    }
}

export const investmentService = new InvestmentService()
