<script setup lang="ts">
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // Redirect based on user role
  if (authStore.user) {
    const role = authStore.user.role

    switch (role) {
      case 'DPLK':
        router.push('/scope/dplk')
        break
      case 'COMPANY':
        router.push('/scope/company')
        break
      case 'PERSONAL':
        router.push('/scope/personal')
        break
      case 'ADMINISTRATOR':
        router.push('/scope/admin')
        break
      default:
        router.push('/login')
    }
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div class="home-page">
    <div class="flex items-center justify-center min-h-screen">
      <ProgressSpinner />
    </div>
  </div>
</template>
