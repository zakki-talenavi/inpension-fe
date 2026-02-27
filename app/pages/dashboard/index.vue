<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/useAuthStore'

definePageMeta({
  layout: 'dashboard',
})

const authStore = useAuthStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})
</script>

<template>
  <div class="dashboard-home">
    <!-- Welcome Card -->
    <div class="bg-gradient-to-r from-[#52629d] to-[#3f4a7c] rounded-xl p-6 text-white mb-6 shadow-md">
      <h1 class="text-xl font-bold mb-1">
        {{ greeting }}, {{ authStore.user?.fullName ?? 'Pengguna' }}! 👋
      </h1>
      <p class="text-white/70 text-sm">
        Anda masuk sebagai <span class="font-semibold text-white/90 uppercase">{{ authStore.user?.role ?? '-' }}</span>
      </p>
    </div>

    <!-- Placeholder for future Page Builder canvas -->
    <div class="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
      <i class="pi pi-objects-column text-5xl text-gray-300 mb-4 block" />
      <h3 class="text-lg font-semibold text-gray-500 mb-2">
        Area Page Builder
      </h3>
      <p class="text-sm text-gray-400 max-w-md mx-auto">
        Area ini akan digunakan sebagai canvas untuk Page Builder custom Anda.
        Konten halaman akan di-render secara dinamis berdasarkan konfigurasi yang tersimpan di database.
      </p>
    </div>
  </div>
</template>
