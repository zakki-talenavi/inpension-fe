import { computed } from 'vue'

export function useCompany() {
    const companyStore = useCompanyStore()
    const { showSuccess, showError } = useNotification()

    const fetchProfile = async () => {
        try {
            await companyStore.fetchProfile()
        } catch (error) {
            showError('Error', 'Gagal mengambil profil perusahaan')
        }
    }

    const updateProfile = async (data: any) => {
        try {
            await companyStore.updateProfile(data)
            showSuccess('Berhasil', 'Profil perusahaan berhasil diupdate')
        } catch (error) {
            showError('Gagal', 'Gagal update profil perusahaan')
            throw error
        }
    }

    return {
        profile: computed(() => companyStore.profile),
        loading: computed(() => companyStore.loading),
        isVerified: computed(() => companyStore.isVerified),
        isPending: computed(() => companyStore.isPending),
        fetchProfile,
        updateProfile
    }
}
