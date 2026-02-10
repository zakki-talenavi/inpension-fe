import { defineStore } from 'pinia'
import { companyService } from '#layers/company/services/company.service'
import type { CompanyProfile } from '#layers/company/app/types'

interface CompanyState {
    profile: CompanyProfile | null
    loading: boolean
    error: string | null
}

export const useCompanyStore = defineStore('company', {
    state: (): CompanyState => ({
        profile: null,
        loading: false,
        error: null
    }),

    getters: {
        isVerified: (state) => state.profile?.status === 'ACTIVE',
        isPending: (state) => state.profile?.status === 'PENDING_VERIFICATION'
    },

    actions: {
        async fetchProfile() {
            this.loading = true
            this.error = null

            try {
                this.profile = await companyService.getProfile()
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil profil perusahaan'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateProfile(data: Partial<CompanyProfile>) {
            this.loading = true
            this.error = null

            try {
                this.profile = await companyService.updateProfile(data)
            } catch (error: any) {
                this.error = error.message || 'Gagal update profil perusahaan'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
