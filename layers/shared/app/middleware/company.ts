export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.hasRole('COMPANY')) {
        return navigateTo('/')
    }
})
