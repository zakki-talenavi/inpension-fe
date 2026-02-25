<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import AuthSplitLayout from '~/components/AuthSplitLayout.vue'

defineOptions({ name: 'ForgotPasswordPage' })

const { roleKey } = useLoginRole()
const router = useRouter()
const notification = useNotification()

const emailOrId = ref('')
const submitted = ref(false)
const loading = ref(false)

const loginRoute = computed(() => ({ path: '/login', query: roleKey.value ? { access: roleKey.value } : undefined }))

const errorMessage = computed(() => {
  if (!submitted.value) return ''
  if (!emailOrId.value?.trim()) return 'Email atau ID Peserta tidak boleh kosong'
  return ''
})

async function onSubmit() {
  submitted.value = true
  if (errorMessage.value) return
  loading.value = true
  try {
    // TODO: panggil API forgot password saat backend siap
    await new Promise(r => setTimeout(r, 800))
    notification.success('Permintaan berhasil', {
      message: 'Jika akun ditemukan, Anda akan menerima email dengan tautan reset kata sandi.',
      life: 6000,
    })
    await router.push(loginRoute.value)
  } catch {
    notification.error('Gagal mengirim permintaan. Silakan coba lagi.')
  } finally {
    loading.value = false
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
          Lupa Kata Sandi!!
        </h1>
        <p class="text-base text-gray-600 mb-6 sm:mb-8">
          Harap masukkan Email atau ID Peserta Anda untuk mencari akun Anda
        </p>

        <form
          class="space-y-4 sm:space-y-5"
          @submit.prevent="onSubmit"
        >
          <div class="space-y-2">
            <label
              for="forgot-email"
              class="block text-sm font-medium text-gray-800"
            >
              Email / ID Peserta
            </label>
            <InputText
              id="forgot-email"
              v-model="emailOrId"
              type="text"
              placeholder="Email"
              class="auth-input w-full"
              :class="{ 'p-invalid': errorMessage }"
              autocomplete="email"
            />
            <small
              v-if="errorMessage"
              class="p-error block text-sm"
            >{{ errorMessage }}</small>
          </div>

          <Button
            type="submit"
            label="Cari"
            class="auth-btn w-full justify-center py-3 text-base font-medium"
            :loading="loading"
            loading-icon="pi pi-spin pi-spinner"
          />
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Sudah ingat kata sandi?
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
.auth-input :deep(input) {
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
