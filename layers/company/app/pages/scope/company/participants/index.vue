<script setup lang="ts">
import { participantService } from '#layers/company/services/participant.service'
import type { CompanyParticipant } from '#layers/company/app/types'

definePageMeta({
  layout: 'company',
  middleware: ['auth', 'company']
})

const participants = ref<CompanyParticipant[]>([])
const loading = ref(false)

const filters = reactive({
  type: '',
  status: '',
  search: ''
})

const typeOptions = [
  { label: 'Semua Tipe', value: '' },
  { label: 'DKP', value: 'DKP' },
  { label: 'PPIP', value: 'PPIP' }
]

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
]

async function fetchParticipants() {
  loading.value = true
  try {
    participants.value = await participantService.getParticipants(filters)
  } catch (error) {
    console.error('Failed to fetch participants', error)
  } finally {
    loading.value = false
  }
}

async function exportData() {
  try {
    const blob = await participantService.exportParticipants(filters)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'peserta.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export', error)
  }
}

onMounted(() => {
  fetchParticipants()
})
</script>

<template>
  <div class="participants-page">
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Daftar Peserta</h1>
          <p class="text-gray-600">Kelola data peserta perusahaan</p>
        </div>
        <Button
          label="Export Excel"
          icon="pi pi-download"
          severity="success"
          @click="exportData"
        />
      </div>
    </div>
    
    <!-- Filters -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="field">
            <label for="search" class="block mb-2">Cari</label>
            <InputText
              id="search"
              v-model="filters.search"
              placeholder="Cari nama, NIK..."
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label for="type" class="block mb-2">Tipe</label>
            <Dropdown
              id="type"
              v-model="filters.type"
              :options="typeOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          
          <div class="field">
            <label for="status" class="block mb-2">Status</label>
            <Dropdown
              id="status"
              v-model="filters.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          
          <div class="field flex items-end">
            <Button
              label="Filter"
              icon="pi pi-search"
              class="w-full"
              @click="fetchParticipants"
            />
          </div>
        </div>
      </template>
    </Card>
    
    <!-- Participants Table -->
    <Card>
      <template #content>
        <DataTable
          :value="participants"
          :loading="loading"
          paginator
          :rows="10"
          striped-rows
          responsive-layout="scroll"
        >
          <Column field="nik" header="NIK" sortable />
          <Column field="fullName" header="Nama Lengkap" sortable />
          <Column field="position" header="Jabatan" />
          <Column field="type" header="Tipe">
            <template #body="{ data }">
              <span
                :class="{
                  'badge-dkp': data.type === 'DKP',
                  'badge-ppip': data.type === 'PPIP'
                }"
                class="badge"
              >
                {{ data.type }}
              </span>
            </template>
          </Column>
          <Column field="balance" header="Saldo">
            <template #body="{ data }">
              Rp {{ data.balance.toLocaleString() }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <span
                :class="{
                  'badge-active': data.status === 'ACTIVE',
                  'badge-inactive': data.status === 'INACTIVE'
                }"
                class="badge"
              >
                {{ data.status }}
              </span>
            </template>
          </Column>
          <Column header="Actions">
            <template #body="{ data }">
              <Button
                icon="pi pi-eye"
                class="p-button-sm p-button-text"
                @click="$router.push(`/scope/company/participants/${data.id}`)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.participants-page {
  padding: 2rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-dkp {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-ppip {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-active {
  background-color: #dcfce7;
  color: #166534;
}

.badge-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>
