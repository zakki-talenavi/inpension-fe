import { defineStore } from 'pinia'
import { contributionService } from '#layers/company/services/contribution.service'
import type { Contribution, ContributionUpload } from '#layers/company/app/types'

interface ContributionState {
    contributions: Contribution[]
    selectedContribution: Contribution | null
    loading: boolean
    error: string | null
}

export const useContributionStore = defineStore('company-contribution', {
    state: (): ContributionState => ({
        contributions: [],
        selectedContribution: null,
        loading: false,
        error: null
    }),

    getters: {
        pendingContributions: (state) =>
            state.contributions.filter(c => c.status === 'PENDING'),

        verifiedContributions: (state) =>
            state.contributions.filter(c => c.status === 'VERIFIED'),

        totalAmount: (state) =>
            state.contributions.reduce((sum, c) => sum + c.totalAmount, 0)
    },

    actions: {
        async fetchContributions(filters?: any) {
            this.loading = true
            this.error = null

            try {
                this.contributions = await contributionService.getContributions(filters)
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data iuran'
                throw error
            } finally {
                this.loading = false
            }
        },

        async uploadContribution(data: ContributionUpload) {
            this.loading = true
            this.error = null

            try {
                const contribution = await contributionService.uploadContribution(data)
                this.contributions.unshift(contribution)
                return contribution
            } catch (error: any) {
                this.error = error.message || 'Gagal upload iuran'
                throw error
            } finally {
                this.loading = false
            }
        },

        async downloadTemplate() {
            try {
                const blob = await contributionService.downloadTemplate()
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'template-iuran.xlsx'
                link.click()
                window.URL.revokeObjectURL(url)
            } catch (error: any) {
                this.error = error.message || 'Gagal download template'
                throw error
            }
        }
    }
})
