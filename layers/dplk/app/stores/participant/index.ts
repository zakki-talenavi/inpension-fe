import { defineStore } from 'pinia'
import { participantService } from '#layers/dplk/services/participant.service'
import type { Participant, ParticipantRegistrationPersonal } from '#layers/dplk/app/types'

interface ParticipantState {
    participants: Participant[]
    selectedParticipant: Participant | null
    loading: boolean
    error: string | null
    filters: {
        status?: string
        type?: string
        search?: string
    }
    pagination: {
        page: number
        pageSize: number
        total: number
    }
}

export const useParticipantStore = defineStore('dplk-participant', {
    state: (): ParticipantState => ({
        participants: [],
        selectedParticipant: null,
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
        // Filter by status
        pendingParticipants: (state) =>
            state.participants.filter(p => p.status === 'PENDING'),

        verifiedParticipants: (state) =>
            state.participants.filter(p => p.status === 'VERIFIED'),

        activeParticipants: (state) =>
            state.participants.filter(p => p.status === 'ACTIVE'),

        // Filter by type
        personalParticipants: (state) =>
            state.participants.filter(p => p.type === 'PERSONAL'),

        companyParticipants: (state) =>
            state.participants.filter(p => p.type === 'COMPANY'),

        // Statistics
        stats: (state) => ({
            total: state.participants.length,
            pending: state.participants.filter(p => p.status === 'PENDING').length,
            verified: state.participants.filter(p => p.status === 'VERIFIED').length,
            active: state.participants.filter(p => p.status === 'ACTIVE').length,
            personal: state.participants.filter(p => p.type === 'PERSONAL').length,
            company: state.participants.filter(p => p.type === 'COMPANY').length
        })
    },

    actions: {
        async fetchParticipants() {
            this.loading = true
            this.error = null

            try {
                const response = await participantService.getParticipants({
                    ...this.filters,
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize
                })

                this.participants = response.data
                this.pagination.total = response.total
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil data peserta'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchParticipantById(id: string) {
            this.loading = true
            this.error = null

            try {
                this.selectedParticipant = await participantService.getParticipantById(id)
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil detail peserta'
                throw error
            } finally {
                this.loading = false
            }
        },

        async registerPersonal(data: ParticipantRegistrationPersonal) {
            this.loading = true
            this.error = null

            try {
                const participant = await participantService.registerPersonal(data)
                this.participants.unshift(participant)
                return participant
            } catch (error: any) {
                this.error = error.message || 'Gagal mendaftarkan peserta'
                throw error
            } finally {
                this.loading = false
            }
        },

        async verifyPPIP(participantId: string, verificationData: any) {
            this.loading = true
            this.error = null

            try {
                await participantService.verifyPPIP({
                    participantId,
                    ...verificationData
                })

                // Update local state
                const index = this.participants.findIndex(p => p.id === participantId)
                if (index !== -1) {
                    this.participants[index].status = 'VERIFIED'
                    this.participants[index].verifiedAt = new Date().toISOString()
                }
            } catch (error: any) {
                this.error = error.message || 'Gagal verifikasi PPIP'
                throw error
            } finally {
                this.loading = false
            }
        },

        async verifyDKP(participantId: string, verificationData: any) {
            this.loading = true
            this.error = null

            try {
                await participantService.verifyDKP({
                    participantId,
                    ...verificationData
                })

                // Update local state
                const index = this.participants.findIndex(p => p.id === participantId)
                if (index !== -1) {
                    this.participants[index].status = 'VERIFIED'
                    this.participants[index].verifiedAt = new Date().toISOString()
                }
            } catch (error: any) {
                this.error = error.message || 'Gagal verifikasi DKP'
                throw error
            } finally {
                this.loading = false
            }
        },

        setFilters(filters: any) {
            this.filters = { ...this.filters, ...filters }
            this.pagination.page = 1 // Reset to first page
        },

        clearFilters() {
            this.filters = {}
            this.pagination.page = 1
        },

        setPage(page: number) {
            this.pagination.page = page
        },

        setPageSize(pageSize: number) {
            this.pagination.pageSize = pageSize
            this.pagination.page = 1
        }
    }
})
