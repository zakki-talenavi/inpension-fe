export function useParticipant() {
    const participantStore = useParticipantStore()
    const { showSuccess, showError } = useNotification()

    const fetchParticipants = async () => {
        try {
            await participantStore.fetchParticipants()
        } catch (error) {
            showError('Error', 'Gagal mengambil data peserta')
        }
    }

    const registerPersonal = async (data: any) => {
        try {
            await participantStore.registerPersonal(data)
            showSuccess('Berhasil', 'Peserta berhasil didaftarkan')
        } catch (error) {
            showError('Gagal', 'Gagal mendaftarkan peserta')
            throw error
        }
    }

    const verifyPPIP = async (participantId: string, verificationData: any) => {
        try {
            await participantStore.verifyPPIP(participantId, verificationData)
            showSuccess('Berhasil', 'Verifikasi PPIP berhasil')
        } catch (error) {
            showError('Gagal', 'Verifikasi PPIP gagal')
            throw error
        }
    }

    const verifyDKP = async (participantId: string, verificationData: any) => {
        try {
            await participantStore.verifyDKP(participantId, verificationData)
            showSuccess('Berhasil', 'Verifikasi DKP berhasil')
        } catch (error) {
            showError('Gagal', 'Verifikasi DKP gagal')
            throw error
        }
    }

    return {
        // State
        participants: computed(() => participantStore.participants),
        selectedParticipant: computed(() => participantStore.selectedParticipant),
        loading: computed(() => participantStore.loading),
        stats: computed(() => participantStore.stats),

        // Actions
        fetchParticipants,
        registerPersonal,
        verifyPPIP,
        verifyDKP,
        setFilters: participantStore.setFilters,
        clearFilters: participantStore.clearFilters
    }
}
