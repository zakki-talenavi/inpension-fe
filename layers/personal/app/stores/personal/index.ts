import { defineStore } from 'pinia'
import { personalService } from '#layers/personal/services/personal.service'
import type { PersonalProfile } from '#layers/personal/app/types'

interface PersonalState {
    profile: PersonalProfile | null
    loading: boolean
    error: string | null
}

export const usePersonalStore = defineStore('personal', {
    state: (): PersonalState => ({
        profile: null,
        loading: false,
        error: null
    }),

    getters: {
        isActive: (state) => state.profile?.employmentStatus === 'ACTIVE',
        isRetired: (state) => state.profile?.employmentStatus === 'RETIRED',
        age: (state) => {
            if (!state.profile?.birthDate) return 0
            const birthDate = new Date(state.profile.birthDate)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            return age
        }
    },

    actions: {
        async fetchProfile() {
            this.loading = true
            this.error = null

            try {
                this.profile = await personalService.getProfile()
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil profil'
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateProfile(data: Partial<PersonalProfile>) {
            this.loading = true
            this.error = null

            try {
                this.profile = await personalService.updateProfile(data)
            } catch (error: any) {
                this.error = error.message || 'Gagal update profil'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
