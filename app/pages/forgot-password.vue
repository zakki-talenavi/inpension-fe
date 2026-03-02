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
const emailOrId = ref('')
const captcha = ref('')
const errors = ref<ForgotPasswordFormErrors>({})
const loading = ref(false)

const { captchaKey, captchaImage, fetchCaptcha } = useCaptcha()

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
    const { authForgotPassword } = await import('~/services/api/auth')
    await authForgotPassword({
      email: result.data.emailOrId,
      captcha_id: captchaKey.value || '',
      captcha_answer: result.data.captcha,
    })
    
    notification.success('Permintaan berhasil', {
      message: 'Jika akun ditemukan, Anda akan menerima email dengan tautan reset kata sandi.',
      life: 6000,
    })
    await router.push(loginRoute.value)
  } catch (err: any) {
    notification.error(err?.message || 'Gagal mengirim permintaan. Silakan coba lagi.')
  } finally {
    loading.value = false
    captcha.value = ''
    fetchCaptcha()
  }
}
</script>

<template>
  <AuthSplitLayout>
    <div class="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:px-10">
      <!-- Tombol Kembali di sudut kiri atas -->
      <div class="w-full mb-auto pb-4">
        <NuxtLink
          :to="loginRoute"
          class="inline-flex items-center gap-2 text-[0.875rem] font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <i class="pi pi-arrow-left text-[0.8rem]" />
          Kembali
        </NuxtLink>
      </div>

      <div class="w-full max-w-md mx-auto my-auto pb-10">

        <h1 class="mb-1 text-center text-[1.15rem] sm:text-lg font-bold tracking-tight text-gray-800 uppercase">
          Lupa Kata Sandi!
        </h1>
        <p class="mb-6 text-center text-[0.875rem] font-medium text-gray-700">
          Harap masukkan Email atau ID Peserta Anda untuk mencari akun Anda
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
            label="Cari"
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

