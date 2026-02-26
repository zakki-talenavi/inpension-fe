<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import type { RoleOption } from '~/types/scope'
import type { LoginFormErrors } from '~/schemas/login'
import { useAuthStore } from '~/stores/auth/useAuthStore'
import { validateLoginForm } from '~/schemas/login'
import AuthSplitLayout from '~/components/AuthSplitLayout.vue'
import CaptchaFormBlock from '../components/CaptchaFormBlock.vue'

defineOptions({ name: 'LoginPage' })

const { roleKey } = useLoginRole()
const router = useRouter()
const authStore = useAuthStore()
const roles = useRoleOptions()

const { captchaKey, captchaImage, fetchCaptcha } = useCaptcha()
const email = ref('')
const password = ref('')
const captcha = ref('')
const errors = ref<LoginFormErrors>({})

const currentRoleRouting = computed(() => {
  const key = roleKey.value
  if (!key) return '/'
  const role = roles.find((r: RoleOption) => r.key === key)
  return role?.routing ?? '/'
})

const isPersonal = computed(() => roleKey.value === 'personal')

const canSubmit = computed(() =>
  Boolean(email.value?.trim() && password.value && captcha.value?.trim())
)

async function onSubmit() {
  const result = validateLoginForm({
    email: email.value,
    password: password.value,
    captcha: captcha.value,
  })
  if (!result.success) {
    errors.value = result.fieldErrors
    return
  }
  errors.value = {}
  try {
    await authStore.login({
      email: result.data.email,
      password: result.data.password,
      captchaKey: captchaKey.value,
      captcha: result.data.captcha,
    })
    await router.push(currentRoleRouting.value)
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
        <h1 class="mb-1 text-center text-2xl font-bold tracking-tight text-gray-900">
          Selamat Datang Kembali!
        </h1>
        <p class="mb-6 text-center text-[0.9375rem] font-medium text-gray-600">
          Silakan login dengan akun Anda
        </p>

        <form
          class="auth-form flex w-full flex-col"
          aria-label="Form login"
          @submit.prevent="onSubmit"
        >
          <div class="mb-6">
            <label for="login-email" class="mb-2 block text-sm font-medium text-gray-800">
              Email / ID DPLK <span class="text-red-500">*</span>
            </label>
            <InputText
              id="login-email"
              v-model="email"
              type="text"
              placeholder="Masukkan email atau ID DPLK"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              autocomplete="username"
              autofocus
              aria-required="true"
              :aria-invalid="!!errors.email"
              aria-describedby="login-email-error"
              @keydown.enter.prevent="onSubmit"
            />
            <small
              v-if="errors.email"
              id="login-email-error"
              class="mt-1 block text-sm text-red-600"
              role="alert"
            >
              {{ errors.email }}
            </small>
          </div>

          <div class="mb-6">
            <label for="login-password" class="mb-2 block text-sm font-medium text-gray-800">
              Kata Sandi <span class="text-red-500">*</span>
            </label>
            <Password
              id="login-password"
              v-model="password"
              placeholder="Masukkan kata sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              :class="{ 'p-invalid': errors.password }"
              class="w-full"
              aria-required="true"
              @keydown.enter.prevent="onSubmit"
            />
            <small
              v-if="errors.password"
              class="mt-1 block text-sm text-red-600"
              role="alert"
            >
              {{ errors.password }}
            </small>
          </div>

          <div class="mb-6">
            <CaptchaFormBlock
              v-model="captcha"
              :captcha-img="captchaImage"
              :invalid="!!errors.captcha"
              :error-message="errors.captcha"
              input-id="login-captcha"
              @refresh="fetchCaptcha()"
            />
          </div>

          <Button
            type="submit"
            label="Masuk"
            class="auth-btn w-full justify-center py-3"
            :loading="authStore.loading"
            :disabled="!canSubmit"
            loading-icon="pi pi-spin pi-spinner"
            :aria-busy="authStore.loading"
            aria-label="Submit login"
          />
        </form>

        <div class="mt-6 space-y-2 text-center text-sm text-gray-500">
          <NuxtLink
            :to="{ path: '/forgot-password', query: roleKey ? { access: roleKey } : undefined }"
            class="block font-medium text-primary hover:underline"
          >
            Lupa kata sandi?
          </NuxtLink>
          <p v-if="isPersonal">
            Belum punya akun?
            <NuxtLink to="/register" class="font-medium text-primary hover:underline">Daftar</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </AuthSplitLayout>
</template>

