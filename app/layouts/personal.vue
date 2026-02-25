<script setup lang="ts">
import { useRouter } from 'nuxt/app'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/scope/personal'
  },
  {
    label: 'Profil',
    icon: 'pi pi-user',
    to: '/scope/personal/profile'
  },
  {
    label: 'Saldo',
    icon: 'pi pi-wallet',
    to: '/scope/personal/balance'
  },
  {
    label: 'Investasi',
    icon: 'pi pi-chart-line',
    to: '/scope/personal/investment'
  },
  {
    label: 'Klaim',
    icon: 'pi pi-file',
    items: [
      { label: 'Ajukan Klaim', to: '/scope/personal/claims/new' },
      { label: 'Riwayat Klaim', to: '/scope/personal/claims' }
    ]
  }
]

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="personal-layout">
    <!-- Header -->
    <header class="layout-header">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-white">InPension Personal</h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-white">{{ authStore.user?.fullName }}</span>
          <Button icon="pi pi-sign-out" label="Logout" severity="secondary" @click="handleLogout" />
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <div class="layout-container">
      <!-- Sidebar -->
      <aside class="layout-sidebar">
        <PanelMenu :model="menuItems" class="w-full" />
      </aside>

      <!-- Main Content -->
      <main class="layout-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.personal-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.layout-container {
  display: flex;
  flex: 1;
}

.layout-sidebar {
  width: 280px;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
}

.layout-content {
  flex: 1;
  background: #ffffff;
  overflow-y: auto;
}
</style>
