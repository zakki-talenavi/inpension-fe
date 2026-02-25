<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { definePageMeta } from 'nuxt/app'

definePageMeta({
  layout: 'dplk',
  middleware: ['auth', 'dplk']
})

const { participants, loading, fetchParticipants, setFilters } = useParticipant()

const filters = reactive({
  status: '',
  type: '',
  search: ''
})

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Verified', value: 'VERIFIED' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' }
]

const typeOptions = [
  { label: 'Semua Tipe', value: '' },
  { label: 'Personal', value: 'PERSONAL' },
  { label: 'Company', value: 'COMPANY' }
]

function applyFilters() {
  setFilters(filters)
  fetchParticipants()
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
          <p class="text-gray-600">Kelola data peserta DPLK</p>
        </div>
        <div class="flex gap-2">
          <Button
            label="Registrasi Personal"
            icon="pi pi-user-plus"
            @click="$router.push('/scope/dplk/participants/registration/personal')"
          />
          <Button
            label="Registrasi Company"
            icon="pi pi-building"
            severity="secondary"
            @click="$router.push('/scope/dplk/participants/registration/company')"
          />
        </div>
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
              placeholder="Cari nama, NIK, email..."
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
          
          <div class="field flex items-end">
            <Button
              label="Filter"
              icon="pi pi-search"
              class="w-full"
              @click="applyFilters"
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
          <Column field="email" header="Email" sortable />
          <Column field="phone" header="Telepon" />
          <Column field="type" header="Tipe">
            <template #body="{ data }">
              <span
                :class="{
                  'badge-personal': data.type === 'PERSONAL',
                  'badge-company': data.type === 'COMPANY'
                }"
                class="badge"
              >
                {{ data.type }}
              </span>
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <span
                :class="{
                  'badge-pending': data.status === 'PENDING',
                  'badge-verified': data.status === 'VERIFIED',
                  'badge-active': data.status === 'ACTIVE'
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
                @click="$router.push(`/scope/dplk/participants/${data.id}`)"
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

.badge-personal {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-company {
  background-color: #fef3c7;
  color: #92400e;
}

.badge-pending {
  background-color: #fed7aa;
  color: #9a3412;
}

.badge-verified {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-active {
  background-color: #dcfce7;
  color: #166534;
}
</style>
