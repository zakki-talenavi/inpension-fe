<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/useAuthStore'

defineEmits<{
  toggleSidebar: []
}>()

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="dashboard-header flex items-center justify-between h-[56px] px-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
    <div class="flex items-center gap-3">
      <button
        class="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
        @click="$emit('toggleSidebar')"
      >
        <i class="pi pi-bars text-gray-600 text-sm" />
      </button>
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-semibold text-gray-700 uppercase">{{ authStore.user?.role ?? 'DPLK' }}</span>
        <span class="text-[0.7rem] text-gray-400 uppercase">HOME</span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Notification -->
      <button class="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
        <i class="pi pi-bell text-gray-500 text-sm" />
        <span class="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-[#52629d] text-white text-[0.55rem] font-bold rounded-full">
          10
        </span>
      </button>

      <!-- User info -->
      <div v-if="authStore.user" class="hidden sm:flex items-center gap-2">
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#52629d] text-white text-xs font-bold">
          {{ (authStore.user.fullName ?? 'U').charAt(0).toUpperCase() }}
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-xs font-semibold text-gray-700 truncate max-w-[120px]">{{ authStore.user.fullName }}</span>
          <span class="text-[0.65rem] text-gray-400">{{ authStore.user.role }}</span>
        </div>
      </div>

      <!-- Logout -->
      <button
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        @click="handleLogout"
      >
        <i class="pi pi-sign-out text-xs" />
        <span class="hidden sm:inline">Keluar</span>
      </button>
    </div>
  </header>
</template>
