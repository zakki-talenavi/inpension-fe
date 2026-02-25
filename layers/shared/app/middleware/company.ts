import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    if (!authStore.hasRole('COMPANY')) {
        return navigateTo('/')
    }
})
