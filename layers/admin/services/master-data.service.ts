import { apiClient } from '~/services/api/client'
import type { Company, InvestmentPackage, Bank } from '../app/types'

export class MasterDataService {
    // Companies
    async getCompanies(): Promise<Company[]> {
        const response = await apiClient.get('/admin/master-data/companies')
        return response.data.data
    }

    async createCompany(data: Partial<Company>): Promise<Company> {
        const response = await apiClient.post('/admin/master-data/companies', data)
        return response.data.data
    }

    async updateCompany(id: string, data: Partial<Company>): Promise<Company> {
        const response = await apiClient.put(`/admin/master-data/companies/${id}`, data)
        return response.data.data
    }

    async deleteCompany(id: string): Promise<void> {
        await apiClient.delete(`/admin/master-data/companies/${id}`)
    }

    // Investment Packages
    async getInvestmentPackages(): Promise<InvestmentPackage[]> {
        const response = await apiClient.get('/admin/master-data/investment-packages')
        return response.data.data
    }

    async createInvestmentPackage(data: Partial<InvestmentPackage>): Promise<InvestmentPackage> {
        const response = await apiClient.post('/admin/master-data/investment-packages', data)
        return response.data.data
    }

    async updateInvestmentPackage(id: string, data: Partial<InvestmentPackage>): Promise<InvestmentPackage> {
        const response = await apiClient.put(`/admin/master-data/investment-packages/${id}`, data)
        return response.data.data
    }

    async deleteInvestmentPackage(id: string): Promise<void> {
        await apiClient.delete(`/admin/master-data/investment-packages/${id}`)
    }

    // Banks
    async getBanks(): Promise<Bank[]> {
        const response = await apiClient.get('/admin/master-data/banks')
        return response.data.data
    }

    async createBank(data: Partial<Bank>): Promise<Bank> {
        const response = await apiClient.post('/admin/master-data/banks', data)
        return response.data.data
    }

    async updateBank(id: string, data: Partial<Bank>): Promise<Bank> {
        const response = await apiClient.put(`/admin/master-data/banks/${id}`, data)
        return response.data.data
    }

    async deleteBank(id: string): Promise<void> {
        await apiClient.delete(`/admin/master-data/banks/${id}`)
    }
}

export const masterDataService = new MasterDataService()
