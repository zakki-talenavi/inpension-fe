<script setup lang="ts">
import { useRouter } from 'nuxt/app'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/scope/company'
  },
  {
    label: 'Profil Perusahaan',
    icon: 'pi pi-building',
    to: '/scope/company/profile'
  },
  {
    label: 'Peserta',
    icon: 'pi pi-users',
    to: '/scope/company/participants'
  },
  {
    label: 'Iuran',
    icon: 'pi pi-money-bill',
    items: [
      { label: 'Upload Iuran', to: '/scope/company/contribution/upload' },
      { label: 'Riwayat Iuran', to: '/scope/company/contribution/history' },
      { label: 'Pending', to: '/scope/company/contribution/pending' }
    ]
  },
  {
    label: 'Klaim',
    icon: 'pi pi-file',
    to: '/scope/company/claims'
  }
]

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="company-layout">
    <!-- Header -->
    <header class="layout-header">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-white">InPension Company</h1>
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
.company-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
