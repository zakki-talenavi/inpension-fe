import { defineStore } from 'pinia'
import { claimService } from '#layers/dplk/services/claim.service'
import type { Claim, ClaimRequest } from '#layers/dplk/app/types'

interface ClaimState {
    claims: Claim[]
    selectedClaim: Claim | null
    loading: boolean
    error: string | null
    filters: {
        status?: string
        claimType?: string
        search?: string
    }
    pagination: {
        page: number
        pageSize: number
        total: number
    }
}

export const useClaimStore = defineStore('dplk-claim', {
    state: (): ClaimState => ({
        claims: [],
        selectedClaim: null,
        loading: false,
        error: null,
        filters: {},
        pagination: {
            page: 1,
            pageSize: 10,
            total: 0
        }
    }),

    getters: {
        pendingClaims: (state) =>
            state.claims.filter(c => c.status === 'PENDING'),

        approvedClaims: (state) =>
            state.claims.filter(c => c.status === 'APPROVED'),

        paidClaims: (state) =>
            state.claims.filter(c => c.status === 'PAID'),

        stats: (state) => ({
            total: state.claims.length,
            pending: state.claims.filter(c => c.status === 'PENDING').length,
            approved: state.claims.filter(c => c.status === 'APPROVED').length,
            paid: state.claims.filter(c => c.status === 'PAID').length,
            totalAmount: state.claims.reduce((sum, c) => sum + c.amount, 0)
        })
    },

    actions: {
        async fetchClaims() {
            this.loading = true
            this.error = null

            try {
                const response = await claimService.getClaims({
                    ...this.filters,
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize
                })

                this.claims = response.data
                this.pagination.total = response.total
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data klaim'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchClaimById(id: string) {
            this.loading = true
            this.error = null

            try {
                this.selectedClaim = await claimService.getClaimById(id)
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil detail klaim'
                throw error
            } finally {
                this.loading = false
            }
        },

        async createClaim(data: ClaimRequest) {
            this.loading = true
            this.error = null

            try {
                const claim = await claimService.createClaim(data)
                this.claims.unshift(claim)
                return claim
            } catch (error: any) {
                this.error = error.message || 'Gagal membuat klaim'
                throw error
            } finally {
                this.loading = false
            }
        },

        async approveClaim(id: string, notes: string) {
            this.loading = true
            this.error = null

            try {
                await claimService.approveClaim(id, notes)

                const index = this.claims.findIndex(c => c.id === id)
                if (index !== -1) {
                    this.claims[index].status = 'APPROVED'
                    this.claims[index].approvedDate = new Date().toISOString()
                }
            } catch (error: any) {
                this.error = error.message || 'Gagal approve klaim'
                throw error
            } finally {
                this.loading = false
            }
        },

        async rejectClaim(id: string, reason: string) {
            this.loading = true
            this.error = null

            try {
                await claimService.rejectClaim(id, reason)

                const index = this.claims.findIndex(c => c.id === id)
                if (index !== -1) {
                    this.claims[index].status = 'REJECTED'
                    this.claims[index].rejectionReason = reason
                }
            } catch (error: any) {
                this.error = error.message || 'Gagal reject klaim'
                throw error
            } finally {
                this.loading = false
            }
        },

        setFilters(filters: any) {
            this.filters = { ...this.filters, ...filters }
            this.pagination.page = 1
        },

        clearFilters() {
            this.filters = {}
            this.pagination.page = 1
        }
    }
})
