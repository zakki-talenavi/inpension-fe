<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import { useAuthStore } from '~/stores/auth/useAuthStore'
import AuthSplitLayout from '~/components/AuthSplitLayout.vue'

defineOptions({ name: 'RegisterPage' })

const { roleKey } = useLoginRole()
const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const identityNumber = ref('')
const email = ref('')
const emailConfirm = ref('')
const password = ref('')
const passwordConfirm = ref('')
const submitted = ref(false)

const registerRoute = computed(() => ({ path: '/register', query: roleKey.value ? { access: roleKey.value } : undefined }))
const loginRoute = computed(() => ({ path: '/login', query: roleKey.value ? { access: roleKey.value } : undefined }))

const errors = computed(() => {
  const e: { fullName?: string; identityNumber?: string; email?: string; emailConfirm?: string; password?: string; passwordConfirm?: string } = {}
  if (submitted.value) {
    if (!fullName.value?.trim()) e.fullName = 'Nama lengkap tidak boleh kosong'
    if (!identityNumber.value?.trim()) e.identityNumber = 'No identitas tidak boleh kosong'
    if (!email.value?.trim()) e.email = 'Email tidak boleh kosong'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) e.email = 'Format email tidak valid'
    if (emailConfirm.value !== email.value) e.emailConfirm = 'Email tidak sama'
    if (!password.value?.trim()) e.password = 'Kata sandi tidak boleh kosong'
    if (passwordConfirm.value !== password.value) e.passwordConfirm = 'Kata sandi tidak sama'
  }
  return e
})

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

async function onSubmit() {
  submitted.value = true
  if (hasErrors.value) return
  try {
    await authStore.register({
      name: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: roleKey.value === 'dplk' ? 'DPLK' : roleKey.value === 'company' ? 'COMPANY' : 'PERSONAL',
    })
    await router.push(roleKey.value ? `/scope/${roleKey.value}` : '/')
  } catch {
    // Error shown by store / toast
  }
}
</script>

<template>
  <AuthSplitLayout>
    <div class="flex-1 flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-10">
      <div class="w-full max-w-md">
        <NuxtLink
          :to="loginRoute"
          class="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium mb-6"
        >
          <i class="pi pi-arrow-left" />
          Kembali
        </NuxtLink>

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 uppercase tracking-wide mb-1">
          Buat Akun
        </h1>
        <p class="text-base text-gray-600 mb-6 sm:mb-8">
          Selamat datang di portal DPLK
        </p>

        <form
          class="space-y-4 sm:space-y-5"
          @submit.prevent="onSubmit"
        >
          <div class="space-y-2">
            <label
              for="reg-fullName"
              class="block text-sm font-medium text-gray-800"
            >
              Nama Lengkap
            </label>
            <InputText
              id="reg-fullName"
              v-model="fullName"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              class="auth-input w-full"
              :class="{ 'p-invalid': errors.fullName }"
              autocomplete="name"
            />
            <small
              v-if="errors.fullName"
              class="p-error block text-sm"
            >{{ errors.fullName }}</small>
          </div>

          <div class="space-y-2">
            <label
              for="reg-identity"
              class="block text-sm font-medium text-gray-800"
            >
              No Identitas (NIK/KITAS)
            </label>
            <InputText
              id="reg-identity"
              v-model="identityNumber"
              type="text"
              placeholder="Masukkan nomor identitas Anda"
              class="auth-input w-full"
              :class="{ 'p-invalid': errors.identityNumber }"
            />
            <small
              v-if="errors.identityNumber"
              class="p-error block text-sm"
            >{{ errors.identityNumber }}</small>
          </div>

          <div class="space-y-2">
            <label
              for="reg-email"
              class="block text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <InputText
              id="reg-email"
              v-model="email"
              type="email"
              placeholder="Masukkan email Anda"
              class="auth-input w-full"
              :class="{ 'p-invalid': errors.email }"
              autocomplete="email"
            />
            <small
              v-if="errors.email"
              class="p-error block text-sm"
            >{{ errors.email }}</small>
          </div>

          <div class="space-y-2">
            <label
              for="reg-emailConfirm"
              class="block text-sm font-medium text-gray-800"
            >
              Ulangi Email Anda
            </label>
            <InputText
              id="reg-emailConfirm"
              v-model="emailConfirm"
              type="email"
              placeholder="Masukkan ulang email Anda"
              class="auth-input w-full"
              :class="{ 'p-invalid': errors.emailConfirm }"
              autocomplete="email"
            />
            <small
              v-if="errors.emailConfirm"
              class="p-error block text-sm"
            >{{ errors.emailConfirm }}</small>
          </div>

          <div class="space-y-2">
            <label
              for="reg-password"
              class="block text-sm font-medium text-gray-800"
            >
              Kata Sandi
            </label>
            <Password
              id="reg-password"
              v-model="password"
              placeholder="Masukkan kata sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              :class="{ 'p-invalid': errors.password }"
              class="auth-password w-full"
            />
            <small
              v-if="errors.password"
              class="p-error block text-sm"
            >{{ errors.password }}</small>
          </div>

          <div class="space-y-2">
            <label
              for="reg-passwordConfirm"
              class="block text-sm font-medium text-gray-800"
            >
              Ulangi Kata Sandi
            </label>
            <Password
              id="reg-passwordConfirm"
              v-model="passwordConfirm"
              placeholder="Masukkan ulang kata sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              :class="{ 'p-invalid': errors.passwordConfirm }"
              class="auth-password w-full"
            />
            <small
              v-if="errors.passwordConfirm"
              class="p-error block text-sm"
            >{{ errors.passwordConfirm }}</small>
          </div>

          <!-- Placeholder reCAPTCHA (nanti bisa diganti dengan komponen asli) -->
          <div class="flex items-center gap-2 py-1 text-sm text-gray-500">
            <i class="pi pi-shield" />
            <span>Saya bukan robot</span>
          </div>

          <Button
            type="submit"
            label="Daftar"
            class="auth-btn w-full justify-center py-3 text-base font-medium"
            :loading="authStore.loading"
            loading-icon="pi pi-spin pi-spinner"
          />
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Sudah Punya Account?
          <NuxtLink
            :to="loginRoute"
            class="text-primary font-medium hover:underline ml-1"
          >
            Masuk
          </NuxtLink>
        </p>
      </div>
    </div>
  </AuthSplitLayout>
</template>

<style scoped>
.auth-input :deep(input),
.auth-password :deep(input) {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.auth-btn :deep(.p-button) {
  background: var(--theme-primary) !important;
  border-color: var(--theme-primary) !important;
  color: #fff !important;
  border-radius: 0.5rem;
}

.auth-btn :deep(.p-button:hover:not(:disabled)) {
  background: var(--theme-primary-hover) !important;
  border-color: var(--theme-primary-hover) !important;
  color: #fff !important;
}
</style>
