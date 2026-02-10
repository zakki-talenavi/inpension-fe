<script setup lang="ts">
import { dashboardService } from '#layers/company/services/dashboard.service'
import type { CompanyDashboardStats } from '#layers/company/app/types'

definePageMeta({
  layout: 'company',
  middleware: ['auth', 'company']
})

const stats = ref<CompanyDashboardStats | null>(null)
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
</script>

<template>
  <div class="company-dashboard">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard Company</h1>
      <p class="text-gray-600">Ringkasan dan statistik perusahaan</p>
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="stats" class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Participants -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Peserta</p>
                <p class="text-3xl font-bold text-blue-600">
                  {{ stats.totalParticipants.toLocaleString() }}
                </p>
              </div>
              <i class="pi pi-users text-4xl text-blue-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Active Participants -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Peserta Aktif</p>
                <p class="text-3xl font-bold text-green-600">
                  {{ stats.activeParticipants.toLocaleString() }}
                </p>
              </div>
              <i class="pi pi-check-circle text-4xl text-green-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Monthly Contribution -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Iuran Bulan Ini</p>
                <p class="text-2xl font-bold text-purple-600">
                  Rp {{ (stats.monthlyContribution / 1000000).toFixed(1) }}jt
                </p>
              </div>
              <i class="pi pi-money-bill text-4xl text-purple-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Total Balance -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Saldo</p>
                <p class="text-2xl font-bold text-orange-600">
                  Rp {{ (stats.totalBalance / 1000000000).toFixed(2) }}M
                </p>
              </div>
              <i class="pi pi-wallet text-4xl text-orange-200"></i>
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Quick Actions -->
      <Card>
        <template #title>Quick Actions</template>
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              label="Upload Iuran"
              icon="pi pi-upload"
              class="p-button-lg"
              @click="$router.push('/scope/company/contribution/upload')"
            />
            <Button
              label="Lihat Peserta"
              icon="pi pi-users"
              class="p-button-lg p-button-secondary"
              @click="$router.push('/scope/company/participants')"
            />
            <Button
              label="Ajukan Klaim"
              icon="pi pi-file"
              class="p-button-lg p-button-success"
              @click="$router.push('/scope/company/claims/new')"
            />
          </div>
        </template>
      </Card>
      
      <!-- Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <template #title>Iuran</template>
          <template #content>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Total Iuran</span>
                <span class="font-semibold">
                  Rp {{ (stats.totalContribution / 1000000000).toFixed(2) }}M
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Pending Upload</span>
                <span class="font-semibold text-orange-600">
                  {{ stats.pendingContributions }}
                </span>
              </div>
            </div>
          </template>
        </Card>
        
        <Card>
          <template #title>Klaim</template>
          <template #content>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Pending Klaim</span>
                <span class="font-semibold text-orange-600">
                  {{ stats.pendingClaims }}
                </span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-dashboard {
  padding: 2rem;
}
</style>
