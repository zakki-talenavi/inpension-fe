<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import type { ForgotPasswordFormErrors } from '~/schemas/forgot-password'
import { validateForgotPasswordForm } from '~/schemas/forgot-password'
import AuthSplitLayout from '~/components/AuthSplitLayout.vue'
import CaptchaFormBlock from '../components/CaptchaFormBlock.vue'

defineOptions({ name: 'ForgotPasswordPage' })

const { roleKey } = useLoginRole()
const router = useRouter()
const notification = useNotification()
const { captchaImage, fetchCaptcha } = useCaptcha()

const emailOrId = ref('')
const captcha = ref('')
const errors = ref<ForgotPasswordFormErrors>({})
const loading = ref(false)

const loginRoute = computed(() => ({ path: '/login', query: roleKey.value ? { access: roleKey.value } : undefined }))

async function onSubmit() {
  const result = validateForgotPasswordForm({
    emailOrId: emailOrId.value,
    captcha: captcha.value,
  })
  if (!result.success) {
    errors.value = result.fieldErrors
    return
  }
  errors.value = {}
  loading.value = true
  try {
    // TODO: panggil API forgot password + kirim result.data.captcha & captchaKey saat backend siap
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
    captcha.value = ''
    fetchCaptcha()
  }
}
</script>

<template>
  <AuthSplitLayout>
    <div class="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div class="w-full max-w-md">
        <NuxtLink
          :to="loginRoute"
          class="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <i class="pi pi-arrow-left" />
          Kembali
        </NuxtLink>

        <h1 class="mb-1 text-center text-2xl font-bold tracking-tight text-gray-900">
          Lupa Kata Sandi
        </h1>
        <p class="mb-6 text-center text-[0.9375rem] font-medium text-gray-600">
          Masukkan email atau ID peserta untuk mengirim tautan reset kata sandi
        </p>

        <form class="auth-form flex w-full flex-col" @submit.prevent="onSubmit">
          <div class="mb-6">
            <label for="forgot-email" class="mb-2 block text-sm font-medium text-gray-800">Email / ID Peserta <span class="text-red-500">*</span></label>
            <InputText
              id="forgot-email"
              v-model="emailOrId"
              type="text"
              placeholder="Masukkan email atau ID peserta"
              class="w-full"
              :class="{ 'p-invalid': errors.emailOrId }"
              autocomplete="email"
            />
            <small v-if="errors.emailOrId" class="mt-1 block text-sm text-red-600">{{ errors.emailOrId }}</small>
          </div>

          <div class="mb-6">
            <CaptchaFormBlock
              v-model="captcha"
              :captcha-img="captchaImage"
              :invalid="!!errors.captcha"
              :error-message="errors.captcha"
              input-id="forgot-captcha"
              @refresh="fetchCaptcha()"
            />
          </div>

          <Button
            type="submit"
            label="Kirim tautan reset"
            class="auth-btn w-full justify-center py-3"
            :loading="loading"
            loading-icon="pi pi-spin pi-spinner"
          />
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Sudah ingat kata sandi?
          <NuxtLink :to="loginRoute" class="font-medium text-primary hover:underline">Masuk</NuxtLink>
        </p>
      </div>
    </div>
  </AuthSplitLayout>
</template>

