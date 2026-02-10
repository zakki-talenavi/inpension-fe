<script setup lang="ts">
definePageMeta({
  layout: 'personal',
  middleware: ['auth', 'personal']
})

const balanceStore = useBalanceStore()
const selectedYear = ref(new Date().getFullYear())

onMounted(async () => {
  await balanceStore.fetchBalance()
  await balanceStore.fetchHistory(selectedYear.value)
  await balanceStore.fetchTransactions()
})

watch(selectedYear, async (newYear) => {
  await balanceStore.fetchHistory(newYear)
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
  <div class="balance-page">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Saldo & Transaksi</h1>
      <p class="text-gray-600">Lihat detail saldo dan riwayat transaksi</p>
    </div>
    
    <!-- Current Balance -->
    <Card v-if="balanceStore.balance" class="mb-6">
      <template #title>Saldo Saat Ini</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Saldo</p>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(balanceStore.balance.totalBalance) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Iuran Karyawan</p>
            <p class="text-xl font-semibold">
              {{ formatCurrency(balanceStore.balance.employeeContribution) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Iuran Perusahaan</p>
            <p class="text-xl font-semibold">
              {{ formatCurrency(balanceStore.balance.employerContribution) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-1">Hasil Investasi</p>
            <p class="text-xl font-semibold text-green-600">
              {{ formatCurrency(balanceStore.balance.investmentReturn) }}
            </p>
          </div>
        </div>
      </template>
    </Card>
    
    <!-- Balance History -->
    <Card class="mb-6">
      <template #title>
        <div class="flex justify-between items-center">
          <span>Riwayat Saldo</span>
          <Dropdown
            v-model="selectedYear"
            :options="[2024, 2023, 2022, 2021, 2020]"
            placeholder="Pilih Tahun"
          />
        </div>
      </template>
      <template #content>
        <DataTable
          :value="balanceStore.history"
          :loading="balanceStore.loading"
          striped-rows
          responsive-layout="scroll"
        >
          <Column field="period" header="Periode" />
          <Column field="openingBalance" header="Saldo Awal">
            <template #body="{ data }">
              {{ formatCurrency(data.openingBalance) }}
            </template>
          </Column>
          <Column field="contribution" header="Iuran">
            <template #body="{ data }">
              {{ formatCurrency(data.contribution) }}
            </template>
          </Column>
          <Column field="investmentReturn" header="Hasil Investasi">
            <template #body="{ data }">
              <span :class="data.investmentReturn >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(data.investmentReturn) }}
              </span>
            </template>
          </Column>
          <Column field="closingBalance" header="Saldo Akhir">
            <template #body="{ data }">
              {{ formatCurrency(data.closingBalance) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
    
    <!-- Recent Transactions -->
    <Card>
      <template #title>Transaksi Terbaru</template>
      <template #content>
        <DataTable
          :value="balanceStore.transactions"
          :loading="balanceStore.loading"
          paginator
          :rows="10"
          striped-rows
          responsive-layout="scroll"
        >
          <Column field="date" header="Tanggal" />
          <Column field="type" header="Tipe">
            <template #body="{ data }">
              <span class="badge">{{ data.type }}</span>
            </template>
          </Column>
          <Column field="description" header="Deskripsi" />
          <Column field="amount" header="Jumlah">
            <template #body="{ data }">
              <span :class="data.amount >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatCurrency(Math.abs(data.amount)) }}
              </span>
            </template>
          </Column>
          <Column field="balance" header="Saldo">
            <template #body="{ data }">
              {{ formatCurrency(data.balance) }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.balance-page {
  padding: 2rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1e40af;
}
</style>
