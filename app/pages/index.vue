<script setup lang="ts">
import { useRouter } from 'nuxt/app'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

function goToLogin() {
  router.push('/login')
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-page p-6">
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-2xl font-bold">Starter</h1>
      <p class="text-gray-600">
        Selamat datang. Layer auth & shared aktif.
      </p>
      <div v-if="authStore.user" class="space-y-2">
        <p>
          <strong>Logged in:</strong> {{ authStore.user.fullName }} ({{ authStore.user.role }})
        </p>
        <button
          type="button"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          @click="logout"
        >
          Logout
        </button>
      </div>
      <div v-else>
        <button
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
          @click="goToLogin"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>
