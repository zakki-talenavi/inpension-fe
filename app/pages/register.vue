<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import type { RegisterFormErrors } from '~/schemas/register'
import { useAuthStore } from '~/stores/auth/useAuthStore'
import { validateRegisterForm } from '~/schemas/register'
import AuthSplitLayout from '~/components/AuthSplitLayout.vue'
import CaptchaFormBlock from '../components/CaptchaFormBlock.vue'

defineOptions({ name: 'RegisterPage' })

const { roleKey } = useLoginRole()
const router = useRouter()
const authStore = useAuthStore()
const { captchaImage, fetchCaptcha } = useCaptcha()

const fullName = ref('')
const identityNumber = ref('')
const email = ref('')
const emailConfirm = ref('')
const password = ref('')
const passwordConfirm = ref('')
const captcha = ref('')
const errors = ref<RegisterFormErrors>({})

const registerRoute = computed(() => ({ path: '/register', query: roleKey.value ? { access: roleKey.value } : undefined }))
const loginRoute = computed(() => ({ path: '/login', query: roleKey.value ? { access: roleKey.value } : undefined }))

async function onSubmit() {
  const result = validateRegisterForm({
    fullName: fullName.value,
    identityNumber: identityNumber.value,
    email: email.value,
    emailConfirm: emailConfirm.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
    captcha: captcha.value,
  })
  if (!result.success) {
    errors.value = result.fieldErrors
    return
  }
  errors.value = {}
  try {
    await authStore.register({
      name: result.data.fullName,
      email: result.data.email,
      password: result.data.password,
      role: roleKey.value === 'dplk' ? 'DPLK' : roleKey.value === 'company' ? 'COMPANY' : 'PERSONAL',
    })
    await router.push(roleKey.value ? `/scope/${roleKey.value}` : '/')
  } catch {
    // Error shown by store / toast
  } finally {
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
          Buat Akun
        </h1>
        <p class="mb-6 text-center text-[0.9375rem] font-medium text-gray-600">
          Selamat datang di portal DPLK
        </p>

        <form class="auth-form flex w-full flex-col" @submit.prevent="onSubmit">
          <div class="mb-6">
            <label for="reg-fullName" class="mb-2 block text-sm font-medium text-gray-800">Nama Lengkap <span class="text-red-500">*</span></label>
            <InputText
              id="reg-fullName"
              v-model="fullName"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              class="w-full"
              :class="{ 'p-invalid': errors.fullName }"
              autocomplete="name"
            />
            <small v-if="errors.fullName" class="mt-1 block text-sm text-red-600">{{ errors.fullName }}</small>
          </div>

          <div class="mb-6">
            <label for="reg-identity" class="mb-2 block text-sm font-medium text-gray-800">No Identitas (NIK/KITAS) <span class="text-red-500">*</span></label>
            <InputText
              id="reg-identity"
              v-model="identityNumber"
              type="text"
              placeholder="Masukkan nomor identitas Anda"
              class="w-full"
              :class="{ 'p-invalid': errors.identityNumber }"
            />
            <small v-if="errors.identityNumber" class="mt-1 block text-sm text-red-600">{{ errors.identityNumber }}</small>
          </div>

          <div class="mb-6">
            <label for="reg-email" class="mb-2 block text-sm font-medium text-gray-800">Email <span class="text-red-500">*</span></label>
            <InputText
              id="reg-email"
              v-model="email"
              type="email"
              placeholder="Masukkan email Anda"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              autocomplete="email"
            />
            <small v-if="errors.email" class="mt-1 block text-sm text-red-600">{{ errors.email }}</small>
          </div>

          <div class="mb-6">
            <label for="reg-emailConfirm" class="mb-2 block text-sm font-medium text-gray-800">Ulangi Email <span class="text-red-500">*</span></label>
            <InputText
              id="reg-emailConfirm"
              v-model="emailConfirm"
              type="email"
              placeholder="Masukkan ulang email Anda"
              class="w-full"
              :class="{ 'p-invalid': errors.emailConfirm }"
              autocomplete="email"
            />
            <small v-if="errors.emailConfirm" class="mt-1 block text-sm text-red-600">{{ errors.emailConfirm }}</small>
          </div>

          <div class="mb-6">
            <label for="reg-password" class="mb-2 block text-sm font-medium text-gray-800">Kata Sandi <span class="text-red-500">*</span></label>
            <Password
              id="reg-password"
              v-model="password"
              placeholder="Masukkan kata sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              :class="{ 'p-invalid': errors.password }"
              class="w-full"
            />
            <small v-if="errors.password" class="mt-1 block text-sm text-red-600">{{ errors.password }}</small>
          </div>

          <div class="mb-6">
            <label for="reg-passwordConfirm" class="mb-2 block text-sm font-medium text-gray-800">Ulangi Kata Sandi <span class="text-red-500">*</span></label>
            <Password
              id="reg-passwordConfirm"
              v-model="passwordConfirm"
              placeholder="Masukkan ulang kata sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              :class="{ 'p-invalid': errors.passwordConfirm }"
              class="w-full"
            />
            <small v-if="errors.passwordConfirm" class="mt-1 block text-sm text-red-600">{{ errors.passwordConfirm }}</small>
          </div>

          <div class="mb-6">
            <CaptchaFormBlock
              v-model="captcha"
              :captcha-img="captchaImage"
              :invalid="!!errors.captcha"
              :error-message="errors.captcha"
              input-id="reg-captcha"
              @refresh="fetchCaptcha()"
            />
          </div>

          <Button
            type="submit"
            label="Daftar"
            class="auth-btn w-full justify-center py-3"
            :loading="authStore.loading"
            loading-icon="pi pi-spin pi-spinner"
          />
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?
          <NuxtLink :to="loginRoute" class="font-medium text-primary hover:underline">Masuk</NuxtLink>
        </p>
      </div>
    </div>
  </AuthSplitLayout>
</template>

