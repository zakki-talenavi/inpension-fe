<script setup lang="ts">
import { useAuthStore } from '#layers/shared/app/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/scope/admin'
  },
  {
    label: 'User Management',
    icon: 'pi pi-users',
    to: '/scope/admin/users'
  },
  {
    label: 'Master Data',
    icon: 'pi pi-database',
    items: [
      { label: 'Companies', to: '/scope/admin/master-data/companies' },
      { label: 'Investment Packages', to: '/scope/admin/master-data/packages' },
      { label: 'Banks', to: '/scope/admin/master-data/banks' }
    ]
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    to: '/scope/admin/settings'
  },
  {
    label: 'Audit Logs',
    icon: 'pi pi-list',
    to: '/scope/admin/audit-logs'
  }
]

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="admin-layout">
    <!-- Header -->
    <header class="layout-header">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-white">InPension Admin</h1>
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
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
