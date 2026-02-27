<script setup lang="ts">
import { useAuthStore } from '~/stores/auth/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(true)

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="dashboard-root flex h-screen overflow-hidden bg-gray-50">
    <!-- Sidebar -->
    <aside
      class="dashboard-sidebar flex flex-col bg-[#2c3357] text-white transition-all duration-300"
      :class="sidebarOpen ? 'w-[250px]' : 'w-[60px]'"
    >
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 border-b border-white/10 px-3">
        <img
          v-if="sidebarOpen"
          src="/assets/layout/images/logo/logo-inpension-white.png"
          alt="Inpension"
          class="h-8 w-auto object-contain"
        >
        <img
          v-else
          src="/assets/layout/images/logo/logo-inpension-white.png"
          alt="Inpension"
          class="h-6 w-auto object-contain"
        >
      </div>

      <!-- Toggle -->
      <button
        class="flex items-center justify-center h-10 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        aria-label="Toggle sidebar"
        @click="sidebarOpen = !sidebarOpen"
      >
        <i :class="['pi', sidebarOpen ? 'pi-angle-left' : 'pi-angle-right', 'text-sm']" />
      </button>

      <!-- Nav Menu -->
      <nav class="flex-1 overflow-y-auto py-3">
        <ul class="space-y-1 px-2">
          <li>
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              active-class="!bg-white/15 !text-white"
            >
              <i class="pi pi-home text-base" />
              <span v-if="sidebarOpen">Dashboard</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Sidebar Footer -->
      <div class="border-t border-white/10 p-3">
        <div v-if="sidebarOpen" class="text-[0.65rem] text-white/40 text-center">
          © 2026 Opsitech
        </div>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="dashboard-header flex items-center justify-between h-16 px-5 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center gap-3">
          <button
            class="lg:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            @click="sidebarOpen = !sidebarOpen"
          >
            <i class="pi pi-bars text-gray-600" />
          </button>
          <h2 class="text-base font-semibold text-gray-700 truncate">
            Dashboard
          </h2>
        </div>

        <div class="flex items-center gap-4">
          <!-- User info -->
          <div v-if="authStore.user" class="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <i class="pi pi-user text-[#52629d]" />
            <span class="font-medium truncate max-w-[160px]">{{ authStore.user.fullName }}</span>
            <span class="text-xs text-gray-400 uppercase">({{ authStore.user.role }})</span>
          </div>

          <!-- Logout -->
          <Button
            icon="pi pi-sign-out"
            label="Keluar"
            severity="secondary"
            text
            size="small"
            class="!text-gray-500 hover:!text-red-500 hover:!bg-red-50 transition-colors"
            @click="handleLogout"
          />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-5">
        <slot />
      </main>
    </div>
  </div>
</template>
