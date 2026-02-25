<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { definePageMeta } from 'nuxt/app'
import { dashboardService } from '#layers/dplk/services/dashboard.service'
import type { DashboardStats } from '#layers/dplk/app/types'

definePageMeta({
  layout: 'dplk',
  middleware: ['auth', 'dplk']
})

const stats = ref<DashboardStats | null>(null)
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
  <div class="dplk-dashboard">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard DPLK</h1>
      <p class="text-gray-600">Ringkasan dan statistik Dana Pensiun</p>
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
      
      <!-- Pending Verification -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Pending Verifikasi</p>
              <p class="text-3xl font-bold text-orange-600">
                {{ stats.pendingVerification.toLocaleString() }}
              </p>
            </div>
            <i class="pi pi-clock text-4xl text-orange-200"></i>
          </div>
        </template>
      </Card>
      
      <!-- Total AUM -->
      <Card>
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total AUM</p>
              <p class="text-2xl font-bold text-purple-600">
                Rp {{ (stats.totalAUM / 1000000000).toFixed(2) }}M
              </p>
            </div>
            <i class="pi pi-wallet text-4xl text-purple-200"></i>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Quick Actions -->
    <Card class="mb-6">
      <template #title>Quick Actions</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            label="Registrasi Peserta Personal"
            icon="pi pi-user-plus"
            class="p-button-lg"
            @click="$router.push('/scope/dplk/participants/registration/personal')"
          />
          <Button
            label="Registrasi Peserta Company"
            icon="pi pi-building"
            class="p-button-lg p-button-secondary"
            @click="$router.push('/scope/dplk/participants/registration/company')"
          />
          <Button
            label="Verifikasi PPIP"
            icon="pi pi-verified"
            class="p-button-lg p-button-success"
            @click="$router.push('/scope/dplk/participants/verification/ppip')"
          />
        </div>
      </template>
    </Card>
    
    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <template #title>Klaim Terbaru</template>
        <template #content>
          <p class="text-gray-600">{{ stats.totalClaims }} total klaim</p>
          <p class="text-orange-600 font-semibold">
            {{ stats.pendingClaims }} pending approval
          </p>
        </template>
      </Card>
      
      <Card>
        <template #title>Invoice</template>
        <template #content>
          <p class="text-gray-600">{{ stats.totalInvoices }} total invoice</p>
          <p class="text-red-600 font-semibold">
            {{ stats.unpaidInvoices }} belum dibayar
          </p>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.dplk-dashboard {
  padding: 2rem;
}
</style>
