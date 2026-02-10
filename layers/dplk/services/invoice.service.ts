import { apiClient } from '~/services/api/client'
import type { Invoice } from '../app/types'

export class InvoiceService {
    private baseUrl = '/dplk/invoices'

    async getInvoices(filters?: {
        status?: string
        companyId?: string
        period?: string
        page?: number
        pageSize?: number
    }): Promise<{ data: Invoice[], total: number }> {
        const response = await apiClient.get(this.baseUrl, { params: filters })
        return response.data
    }

    async getInvoiceById(id: string): Promise<Invoice> {
        const response = await apiClient.get(`${this.baseUrl}/${id}`)
        return response.data.data
    }

    async generateInvoice(companyId: string, period: string): Promise<Invoice> {
        const response = await apiClient.post(`${this.baseUrl}/generate`, {
            companyId,
            period
        })
        return response.data.data
    }

    async markAsPaid(id: string, paidAmount: number, paymentDate: string): Promise<void> {
        await apiClient.post(`${this.baseUrl}/${id}/pay`, {
            paidAmount,
            paymentDate
        })
    }

    async downloadInvoice(id: string): Promise<Blob> {
        const response = await apiClient.get(`${this.baseUrl}/${id}/download`, {
            responseType: 'blob'
        })
        return response.data
    }
}

export const invoiceService = new InvoiceService()
