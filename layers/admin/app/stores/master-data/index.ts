import { defineStore } from 'pinia'
import { masterDataService } from '#layers/admin/services/master-data.service'
import type { Company, InvestmentPackage, Bank } from '#layers/admin/app/types'

interface MasterDataState {
    companies: Company[]
    investmentPackages: InvestmentPackage[]
    banks: Bank[]
    loading: boolean
    error: string | null
}

export const useMasterDataStore = defineStore('admin-master-data', {
    state: (): MasterDataState => ({
        companies: [],
        investmentPackages: [],
        banks: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchCompanies() {
            this.loading = true
            this.error = null

            try {
                this.companies = await masterDataService.getCompanies()
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data perusahaan'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchInvestmentPackages() {
            this.loading = true
            this.error = null

            try {
                this.investmentPackages = await masterDataService.getInvestmentPackages()
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data paket investasi'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchBanks() {
            this.loading = true
            this.error = null

            try {
                this.banks = await masterDataService.getBanks()
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data bank'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
