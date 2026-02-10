<script setup lang="ts">
import { dashboardService } from '#layers/admin/services/dashboard.service'
import type { AdminDashboardStats } from '#layers/admin/app/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const stats = ref<AdminDashboardStats | null>(null)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    stats.value = await dashboardService.getStats()
  } catch (error) {
    console.error('Failed to load dashboard stats', error)
  } finally {
    loading.value = false
  }
})

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<template>
  <div class="admin-dashboard">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600">System overview and statistics</p>
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="stats" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Total Users -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Users</p>
                <p class="text-3xl font-bold text-blue-600">
                  {{ stats.totalUsers.toLocaleString() }}
                </p>
                <p class="text-sm text-green-600 mt-1">
                  {{ stats.activeUsers }} active
                </p>
              </div>
              <i class="pi pi-users text-4xl text-blue-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Total Companies -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Companies</p>
                <p class="text-3xl font-bold text-purple-600">
                  {{ stats.totalCompanies.toLocaleString() }}
                </p>
              </div>
              <i class="pi pi-building text-4xl text-purple-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Total Participants -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Participants</p>
                <p class="text-3xl font-bold text-green-600">
                  {{ stats.totalParticipants.toLocaleString() }}
                </p>
              </div>
              <i class="pi pi-user text-4xl text-green-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Total AUM -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total AUM</p>
                <p class="text-2xl font-bold text-orange-600">
                  {{ formatCurrency(stats.totalAUM) }}
                </p>
              </div>
              <i class="pi pi-wallet text-4xl text-orange-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Pending Verifications -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Pending Verifications</p>
                <p class="text-3xl font-bold text-red-600">
                  {{ stats.pendingVerifications }}
                </p>
              </div>
              <i class="pi pi-clock text-4xl text-red-200"></i>
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Quick Actions -->
      <Card>
        <template #title>Quick Actions</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button
              label="Manage Users"
              icon="pi pi-users"
              class="p-button-lg"
              @click="$router.push('/scope/admin/users')"
            />
            <Button
              label="Master Data"
              icon="pi pi-database"
              class="p-button-lg p-button-secondary"
              @click="$router.push('/scope/admin/master-data')"
            />
            <Button
              label="Settings"
              icon="pi pi-cog"
              class="p-button-lg p-button-help"
              @click="$router.push('/scope/admin/settings')"
            />
            <Button
              label="Audit Logs"
              icon="pi pi-list"
              class="p-button-lg p-button-warning"
              @click="$router.push('/scope/admin/audit-logs')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}
</style>
