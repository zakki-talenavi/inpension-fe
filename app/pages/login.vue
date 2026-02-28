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
const notification = useNotification()
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
  } catch (err: any) {
    notification.error(err?.message || 'Login gagal', {
      title: 'Gagal',
    })
  } finally {
    captcha.value = ''
    fetchCaptcha()
  }
}
</script>

<template>
  <AuthSplitLayout>
    <div class="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div class="w-full max-w-[400px]">
        <h1 class="mb-1 text-center text-lg sm:text-[1.15rem] font-bold tracking-tight text-gray-800 uppercase">
          Selamat Datang Kembali!
        </h1>
        <p class="mb-10 text-center text-[0.875rem] font-medium text-gray-700">
          Silahkan Login Dengan
        </p>

        <form
          class="auth-form flex w-full flex-col"
          aria-label="Form login"
          @submit.prevent="onSubmit"
        >
          <div class="mb-5">
            <label for="login-email" class="mb-1.5 block text-[0.85rem] font-medium text-gray-800">
              Email / NIK
            </label>
            <InputText
              id="login-email"
              v-model="email"
              type="text"
              placeholder="Email"
              class="w-full transition-colors"
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

          <div class="mb-5">
            <label for="login-password" class="mb-1.5 block text-[0.85rem] font-medium text-gray-800">
              Kata Sandi
            </label>
            <Password
              id="login-password"
              v-model="password"
              placeholder="Kata Sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full transition-colors"
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
            class="w-full justify-center py-2.5 mt-2 !font-normal !bg-[#52629d] !border-[#52629d] !text-white !rounded-sm hover:!bg-[#3f4a7c] hover:!border-[#3f4a7c] transition-colors"
            :loading="authStore.loading"
            :disabled="!canSubmit"
            loading-icon="pi pi-spin pi-spinner"
            :aria-busy="authStore.loading"
            aria-label="Submit login"
          />

          <div class="mt-4 text-center">
            <NuxtLink
              :to="{ path: '/forgot-password', query: roleKey ? { access: roleKey } : undefined }"
              class="inline-block text-[0.8rem] font-medium text-[#7d90b4] hover:text-[#52629d] hover:underline"
            >
              Lupa Kata Sandi?
            </NuxtLink>
            
            <p v-if="isPersonal" class="mt-3 text-sm text-gray-500">
              Belum punya akun?
              <NuxtLink to="/register" class="font-medium text-[#52629d] hover:underline">Daftar</NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </AuthSplitLayout>
</template>


