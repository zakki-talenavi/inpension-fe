import { useUserStore } from "../stores/users"

export function useAdmin() {
    const userStore = useUserStore()
    const { showSuccess, showError } = useNotification()

    const fetchUsers = async (filters?: any) => {
        try {
            await userStore.fetchUsers(filters)
        } catch (error) {
            showError('Error', 'Failed to fetch users')
        }
    }

    const createUser = async (data: any) => {
        try {
            await userStore.createUser(data)
            showSuccess('Success', 'User created successfully')
        } catch (error) {
            showError('Error', 'Failed to create user')
            throw error
        }
    }

    return {
        users: computed(() => userStore.users),
        loading: computed(() => userStore.loading),
        activeUsers: computed(() => userStore.activeUsers),
        fetchUsers,
        createUser
    }
}
