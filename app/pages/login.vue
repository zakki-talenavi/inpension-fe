<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import type { RoleOption } from '~/types/scope'
import { useAuthStore } from '~/stores/auth/useAuthStore'
import AuthSplitLayout from '~/components/AuthSplitLayout.vue'

defineOptions({ name: 'LoginPage' })

const { roleKey } = useLoginRole()
const router = useRouter()
const authStore = useAuthStore()
const roles = useRoleOptions()

const email = ref('')
const password = ref('')
const submitted = ref(false)

const currentRoleRouting = computed(() => {
  const key = roleKey.value
  if (!key) return '/'
  const role = roles.find((r: RoleOption) => r.key === key)
  return role?.routing ?? '/'
})

const isPersonal = computed(() => roleKey.value === 'personal')

const errors = computed(() => {
  const e: { email?: string; password?: string } = {}
  if (submitted.value) {
    if (!email.value?.trim()) e.email = 'Email atau ID DPLK tidak boleh kosong'
    if (!password.value?.trim()) e.password = 'Kata sandi tidak boleh kosong'
  }
  return e
})

async function onSubmit() {
  submitted.value = true
  if (errors.value.email || errors.value.password) return
  try {
    await authStore.login({ email: email.value.trim(), password: password.value })
    await router.push(currentRoleRouting.value)
  } catch {
    // Error shown by store / toast
  }
}
</script>

<template>
  <AuthSplitLayout>
    <div class="flex-1 flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 lg:px-10">
      <div class="w-full max-w-md">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 uppercase tracking-wide text-center mb-1">
          SELAMAT DATANG KEMBALI!
        </h1>
        <p class="text-base text-gray-600 text-center mb-6 sm:mb-8">
          Silakan Login Dengan
        </p>

        <form
          class="space-y-4 sm:space-y-5"
          @submit.prevent="onSubmit"
        >
          <div class="space-y-2">
            <label
              for="login-email"
              class="block text-sm font-medium text-gray-800"
            >
              Email / ID DPLK
            </label>
            <InputText
              id="login-email"
              v-model="email"
              type="text"
              placeholder="Email"
              class="auth-input w-full"
              :class="{ 'p-invalid': errors.email }"
              autocomplete="username"
            />
            <small
              v-if="errors.email"
              class="p-error block text-sm"
            >{{ errors.email }}</small>
          </div>

          <div class="space-y-2">
            <label
              for="login-password"
              class="block text-sm font-medium text-gray-800"
            >
              Kata Sandi
            </label>
            <Password
              id="login-password"
              v-model="password"
              placeholder="Kata Sandi"
              :feedback="false"
              toggle-mask
              input-class="w-full"
              :class="{ 'p-invalid': errors.password }"
              class="auth-password w-full"
              @keydown.enter.prevent="onSubmit"
            />
            <small
              v-if="errors.password"
              class="p-error block text-sm"
            >{{ errors.password }}</small>
          </div>

          <Button
            type="submit"
            label="Masuk"
            class="auth-btn w-full justify-center py-3 text-base font-medium"
            :loading="authStore.loading"
            loading-icon="pi pi-spin pi-spinner"
          />
        </form>

        <div class="mt-5 sm:mt-6 text-center space-y-2">
          <NuxtLink
            :to="{ path: '/forgot-password', query: roleKey ? { access: roleKey } : undefined }"
            class="block text-primary hover:underline text-sm font-medium"
          >
            Lupa Kata Sandi?
          </NuxtLink>
          <p
            v-if="isPersonal"
            class="text-sm text-gray-600"
          >
            Belum Punya Account?
            <NuxtLink
              to="/register"
              class="text-primary font-medium hover:underline ml-1"
            >
              Daftar
            </NuxtLink>
          </p>
        </div>
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
