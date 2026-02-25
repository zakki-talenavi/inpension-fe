<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, definePageMeta } from 'nuxt/app'

definePageMeta({
  layout: 'dplk',
  middleware: ['auth', 'dplk']
})

const { registerPersonal } = useParticipant()
const router = useRouter()

// Stepper
const activeStep = ref(0)
const steps = [
  { label: 'Identitas' },
  { label: 'Dana' },
  { label: 'Investasi' },
  { label: 'Ahli Waris' },
  { label: 'Privasi' },
  { label: 'Syarat & Ketentuan' }
]

// Form data
const formData = reactive({
  identity: {
    nik: '',
    fullName: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    province: '',
    city: '',
    district: '',
    postalCode: ''
  },
  funds: {
    initialDeposit: 0,
    monthlyContribution: 0,
    paymentMethod: '',
    bankAccount: '',
    bankName: ''
  },
  investment: {
    investmentProfile: '',
    riskTolerance: '',
    investmentGoal: '',
    investmentPackage: ''
  },
  heir: {
    heirs: []
  },
  privacy: {
    agreedToPrivacy: false,
    agreedToDataSharing: false
  },
  terms: {
    agreedToTerms: false,
    signature: '',
    signedAt: ''
  },
  documents: {
    ktp: null,
    npwp: null,
    familyCard: null,
    bankStatement: null
  }
})

const loading = ref(false)

function nextStep() {
  if (activeStep.value < steps.length - 1) {
    activeStep.value++
  }
}

function prevStep() {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

async function handleSubmit() {
  loading.value = true
  
  try {
    await registerPersonal(formData)
    await router.push('/scope/dplk/participants')
  } catch (error) {
    console.error('Registration failed', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="registration-page">
    <div class="page-header mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Registrasi Peserta Personal</h1>
      <p class="text-gray-600">Lengkapi formulir registrasi peserta baru</p>
    </div>
    
    <Card>
      <template #content>
        <!-- Stepper -->
        <Steps :model="steps" :active-step="activeStep" class="mb-6" />
        
        <!-- Step Content -->
        <div class="step-content min-h-[400px]">
          <!-- Step 1: Identity -->
          <div v-if="activeStep === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="nik" class="block mb-2">NIK *</label>
              <InputText
                id="nik"
                v-model="formData.identity.nik"
                class="w-full"
                required
              />
            </div>
            
            <div class="field">
              <label for="fullName" class="block mb-2">Nama Lengkap *</label>
              <InputText
                id="fullName"
                v-model="formData.identity.fullName"
                class="w-full"
                required
              />
            </div>
            
            <div class="field">
              <label for="birthDate" class="block mb-2">Tanggal Lahir *</label>
              <Calendar
                id="birthDate"
                v-model="formData.identity.birthDate"
                date-format="dd/mm/yy"
                class="w-full"
                show-icon
              />
            </div>
            
            <div class="field">
              <label for="gender" class="block mb-2">Jenis Kelamin *</label>
              <Dropdown
                id="gender"
                v-model="formData.identity.gender"
                :options="[
                  { label: 'Laki-laki', value: 'M' },
                  { label: 'Perempuan', value: 'F' }
                ]"
                option-label="label"
                option-value="value"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="email" class="block mb-2">Email *</label>
              <InputText
                id="email"
                v-model="formData.identity.email"
                type="email"
                class="w-full"
                required
              />
            </div>
            
            <div class="field">
              <label for="phone" class="block mb-2">No. Telepon *</label>
              <InputText
                id="phone"
                v-model="formData.identity.phone"
                class="w-full"
                required
              />
            </div>
          </div>
          
          <!-- Step 2: Funds -->
          <div v-if="activeStep === 1" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="field">
              <label for="initialDeposit" class="block mb-2">Setoran Awal *</label>
              <InputNumber
                id="initialDeposit"
                v-model="formData.funds.initialDeposit"
                mode="currency"
                currency="IDR"
                locale="id-ID"
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="monthlyContribution" class="block mb-2">Iuran Bulanan *</label>
              <InputNumber
                id="monthlyContribution"
                v-model="formData.funds.monthlyContribution"
                mode="currency"
                currency="IDR"
                locale="id-ID"
                class="w-full"
              />
            </div>
          </div>
          
          <!-- Other steps... -->
          <div v-if="activeStep > 1" class="text-center text-gray-600">
            <p>Form step {{ activeStep + 1 }} content here...</p>
          </div>
        </div>
        
        <!-- Navigation -->
        <div class="flex justify-between mt-6">
          <Button
            v-if="activeStep > 0"
            label="Sebelumnya"
            icon="pi pi-arrow-left"
            severity="secondary"
            @click="prevStep"
          />
          
          <div class="ml-auto flex gap-2">
            <Button
              v-if="activeStep < steps.length - 1"
              label="Selanjutnya"
              icon="pi pi-arrow-right"
              icon-pos="right"
              @click="nextStep"
            />
            
            <Button
              v-else
              label="Submit"
              icon="pi pi-check"
              :loading="loading"
              @click="handleSubmit"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.registration-page {
  padding: 2rem;
}
</style>
