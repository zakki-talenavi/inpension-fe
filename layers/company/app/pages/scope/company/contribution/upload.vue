<script setup lang="ts">
definePageMeta({
  layout: 'company',
  middleware: ['auth', 'company']
})

const contributionStore = useContributionStore()
const { showSuccess, showError } = useNotification()
const router = useRouter()

const period = ref('')
const file = ref<File | null>(null)
const uploading = ref(false)

function onFileSelect(event: any) {
  file.value = event.files[0]
}

async function handleUpload() {
  if (!period.value || !file.value) {
    showError('Error', 'Periode dan file harus diisi')
    return
  }
  
  uploading.value = true
  
  try {
    await contributionStore.uploadContribution({
      period: period.value,
      file: file.value
    })
    
    showSuccess('Berhasil', 'Iuran berhasil diupload')
    await router.push('/scope/company/contribution')
  } catch (error: any) {
    showError('Gagal', error.message || 'Gagal upload iuran')
  } finally {
    uploading.value = false
  }
}

async function downloadTemplate() {
  try {
    await contributionStore.downloadTemplate()
    showSuccess('Berhasil', 'Template berhasil didownload')
  } catch (error) {
    showError('Gagal', 'Gagal download template')
  }
}
</script>

<template>
  <div class="upload-page">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Upload Iuran</h1>
      <p class="text-gray-600">Upload data iuran bulanan</p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Upload Form -->
      <div class="lg:col-span-2">
        <Card>
          <template #title>Form Upload</template>
          <template #content>
            <div class="space-y-4">
              <!-- Period -->
              <div class="field">
                <label for="period" class="block mb-2">Periode *</label>
                <Calendar
                  id="period"
                  v-model="period"
                  view="month"
                  date-format="mm/yy"
                  class="w-full"
                  show-icon
                />
                <small class="text-gray-600">Pilih bulan dan tahun iuran</small>
              </div>
              
              <!-- File Upload -->
              <div class="field">
                <label for="file" class="block mb-2">File Excel *</label>
                <FileUpload
                  mode="basic"
                  accept=".xlsx,.xls"
                  :max-file-size="5000000"
                  choose-label="Pilih File"
                  @select="onFileSelect"
                />
                <small class="text-gray-600">Format: .xlsx atau .xls (Max 5MB)</small>
              </div>
              
              <!-- Submit Button -->
              <div class="flex gap-2">
                <Button
                  label="Upload"
                  icon="pi pi-upload"
                  :loading="uploading"
                  :disabled="!period || !file"
                  @click="handleUpload"
                />
                <Button
                  label="Batal"
                  icon="pi pi-times"
                  severity="secondary"
                  @click="$router.push('/scope/company/contribution')"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      
      <!-- Instructions -->
      <div>
        <Card>
          <template #title>Panduan Upload</template>
          <template #content>
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold mb-2">1. Download Template</h4>
                <p class="text-sm text-gray-600 mb-2">
                  Download template Excel terlebih dahulu
                </p>
                <Button
                  label="Download Template"
                  icon="pi pi-download"
                  size="small"
                  severity="success"
                  @click="downloadTemplate"
                />
              </div>
              
              <div>
                <h4 class="font-semibold mb-2">2. Isi Data</h4>
                <p class="text-sm text-gray-600">
                  Isi data iuran sesuai format template yang telah disediakan
                </p>
              </div>
              
              <div>
                <h4 class="font-semibold mb-2">3. Upload File</h4>
                <p class="text-sm text-gray-600">
                  Pilih periode dan upload file yang sudah diisi
                </p>
              </div>
              
              <div class="bg-yellow-50 p-3 rounded">
                <p class="text-sm text-yellow-800">
                  <i class="pi pi-info-circle mr-2"></i>
                  Pastikan data sudah benar sebelum upload. Data yang sudah diupload akan diverifikasi oleh DPLK.
                </p>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload-page {
  padding: 2rem;
}
</style>
