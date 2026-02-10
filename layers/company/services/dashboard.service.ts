import { apiClient } from '~/services/api/client'
import type { CompanyDashboardStats } from '../app/types'

export class DashboardService {
    private baseUrl = '/company/dashboard'

    async getStats(): Promise<CompanyDashboardStats> {
        const response = await apiClient.get(`${this.baseUrl}/stats`)
        return response.data.data
    }

    async getChartData(type: string, period: string): Promise<any> {
        const response = await apiClient.get(`${this.baseUrl}/charts/${type}`, {
            params: { period }
        })
        return response.data.data
    }
}

export const dashboardService = new DashboardService()
