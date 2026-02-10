
import { useAuthStore } from '#layers/shared/app/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.hasRole('PERSONAL')) {
        return navigateTo('/')
    }
})
