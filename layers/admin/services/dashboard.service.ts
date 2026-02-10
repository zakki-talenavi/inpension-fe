import { apiClient } from '~/services/api/client'
import type { AdminDashboardStats } from '../app/types'

export class DashboardService {
    private baseUrl = '/admin/dashboard'

    async getStats(): Promise<AdminDashboardStats> {
        const response = await apiClient.get(`${this.baseUrl}/stats`)
        return response.data.data
    }
}

export const dashboardService = new DashboardService()
