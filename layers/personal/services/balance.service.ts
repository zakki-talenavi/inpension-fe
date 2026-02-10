import { apiClient } from '~/services/api/client'
import type { Balance, BalanceDetail, Transaction } from '../app/types'

export class BalanceService {
    private baseUrl = '/personal/balance'

    async getBalance(): Promise<Balance> {
        const response = await apiClient.get(this.baseUrl)
        return response.data.data
    }

    async getBalanceHistory(year?: number): Promise<BalanceDetail[]> {
        const response = await apiClient.get(`${this.baseUrl}/history`, {
            params: { year }
        })
        return response.data.data
    }

    async getTransactions(filters?: {
        type?: string
        startDate?: string
        endDate?: string
    }): Promise<Transaction[]> {
        const response = await apiClient.get(`${this.baseUrl}/transactions`, {
            params: filters
        })
        return response.data.data
    }

    async downloadStatement(year: number, month: number): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/statement`, {
            params: { year, month },
            responseType: 'blob'
        })
        return response.data
    }
}

export const balanceService = new BalanceService()
