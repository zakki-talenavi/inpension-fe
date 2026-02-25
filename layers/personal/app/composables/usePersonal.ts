import { computed } from 'vue'

export function usePersonal() {
    const personalStore = usePersonalStore()
    const { showSuccess, showError } = useNotification()

    const fetchProfile = async () => {
        try {
            await personalStore.fetchProfile()
        } catch (error) {
            showError('Error', 'Gagal mengambil profil')
        }
    }

    const updateProfile = async (data: any) => {
        try {
            await personalStore.updateProfile(data)
            showSuccess('Berhasil', 'Profil berhasil diupdate')
        } catch (error) {
            showError('Gagal', 'Gagal update profil')
            throw error
        }
    }

    return {
        profile: computed(() => personalStore.profile),
        loading: computed(() => personalStore.loading),
        age: computed(() => personalStore.age),
        isActive: computed(() => personalStore.isActive),
        isRetired: computed(() => personalStore.isRetired),
        fetchProfile,
        updateProfile
    }
}
