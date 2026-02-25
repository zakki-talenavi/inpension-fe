<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { definePageMeta } from 'nuxt/app'
import { dashboardService } from '#layers/personal/services/dashboard.service'
import type { PersonalDashboardStats } from '#layers/personal/app/types'

definePageMeta({
  layout: 'personal',
  middleware: ['auth', 'personal']
})

const stats = ref<PersonalDashboardStats | null>(null)
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
  <div class="personal-dashboard">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Selamat datang di portal peserta</p>
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="stats" class="space-y-6">
      <!-- Main Balance Card -->
      <Card class="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <template #content>
          <div class="py-4">
            <p class="text-sm opacity-90 mb-2">Total Saldo</p>
            <h2 class="text-4xl font-bold mb-4">
              {{ formatCurrency(stats.totalBalance) }}
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm opacity-90">Iuran Bulanan</p>
                <p class="text-lg font-semibold">
                  {{ formatCurrency(stats.monthlyContribution) }}
                </p>
              </div>
              <div>
                <p class="text-sm opacity-90">Total Return</p>
                <p class="text-lg font-semibold">
                  {{ formatCurrency(stats.totalReturn) }}
                  <span class="text-sm">({{ stats.returnPercentage.toFixed(2) }}%)</span>
                </p>
              </div>
            </div>
          </div>
        </template>
      </Card>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Years to Retirement -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Tahun Menuju Pensiun</p>
                <p class="text-3xl font-bold text-orange-600">
                  {{ stats.yearsToRetirement }} tahun
                </p>
              </div>
              <i class="pi pi-calendar text-4xl text-orange-200"></i>
            </div>
          </template>
        </Card>
        
        <!-- Projected Balance -->
        <Card>
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Proyeksi Saldo Pensiun</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ formatCurrency(stats.projectedBalance) }}
                </p>
              </div>
              <i class="pi pi-chart-line text-4xl text-green-200"></i>
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
              label="Lihat Saldo"
              icon="pi pi-wallet"
              class="p-button-lg"
              @click="$router.push('/scope/personal/balance')"
            />
            <Button
              label="Investasi"
              icon="pi pi-chart-line"
              class="p-button-lg p-button-secondary"
              @click="$router.push('/scope/personal/investment')"
            />
            <Button
              label="Ajukan Klaim"
              icon="pi pi-file"
              class="p-button-lg p-button-success"
              @click="$router.push('/scope/personal/claims/new')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.personal-dashboard {
  padding: 2rem;
}
</style>
