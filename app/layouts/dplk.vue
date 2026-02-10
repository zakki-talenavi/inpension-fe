<script setup lang="ts">
import { useAuthStore } from '#layers/shared/app/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/scope/dplk'
  },
  {
    label: 'Peserta',
    icon: 'pi pi-users',
    items: [
      { label: 'Daftar Peserta', to: '/scope/dplk/participants' },
      { label: 'Registrasi Personal', to: '/scope/dplk/participants/registration/personal' },
      { label: 'Registrasi Perusahaan', to: '/scope/dplk/participants/registration/company' },
      { label: 'Verifikasi', to: '/scope/dplk/participants/verification' }
    ]
  },
  {
    label: 'Klaim',
    icon: 'pi pi-file',
    items: [
      { label: 'Daftar Klaim', to: '/scope/dplk/claims' },
      { label: 'Pending Approval', to: '/scope/dplk/claims/pending' }
    ]
  },
  {
    label: 'Invoice',
    icon: 'pi pi-money-bill',
    to: '/scope/dplk/invoices'
  }
]

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dplk-layout">
    <!-- Header -->
    <header class="layout-header">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-white">InPension DPLK</h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-white">{{ authStore.user?.fullName }}</span>
          <Button
            icon="pi pi-sign-out"
            label="Logout"
            severity="secondary"
            @click="handleLogout"
          />
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
.dplk-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
