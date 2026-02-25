<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import type { RoleOption } from '~/types/scope'
import { useAuthStore } from '~/stores/auth/useAuthStore'

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
  <div class="login-page flex h-screen w-full overflow-hidden">
    <!-- Left: branding + background -->
    <div class="login-left relative flex-1 h-full max-md:hidden md:flex md:flex-col md:min-w-0">
      <div
        class="login-bg absolute inset-0 bg-cover bg-center bg-no-repeat bg-[#1a1a2e]"
        :style="{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(\'/assets/layout/images/lp/background-login.jpg\')',
        }"
      />
      <div class="login-overlay absolute inset-0 flex flex-col justify-between py-8 px-6 md:px-8 z-10">
        <NuxtLink
          to="/"
          class="login-header flex flex-col items-end w-full"
        >
          <img
            src="/assets/layout/images/login/logo-inpension-white.svg"
            alt="InPension"
            class="h-20 w-auto object-contain drop-shadow-md"
          >
          <div class="flex items-center gap-2 mt-2 text-white text-sm md:text-base font-medium">
            <span>Powered by</span>
            <span class="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">OpsiTech</span>
          </div>
        </NuxtLink>
        <div class="login-caption text-white px-4 md:px-6 space-y-1 text-shadow">
          <p class="text-xl md:text-2xl lg:text-3xl font-semibold capitalize">
            Siapkan Masa Depan Anda Bersama Inpension
          </p>
          <p class="text-base md:text-lg lg:text-xl font-normal capitalize text-white/95">
            Rencanakan Sekarang, Sejahtera Nanti
          </p>
        </div>
      </div>
    </div>

    <!-- Right: form -->
    <div class="login-right flex-1 flex flex-col h-full min-h-0 overflow-y-auto bg-[#F2F0F9] md:min-w-0 pb-10">
      <!-- Mobile: compact logo -->
      <div class="md:hidden shrink-0 flex justify-center pt-6 pb-2">
        <NuxtLink
          to="/"
          class="inline-block"
        >
          <img
            src="/assets/layout/images/login/logo-inpension-white.svg"
            alt="InPension"
            class="h-12 w-auto object-contain"
            style="filter: brightness(0) saturate(100%) invert(20%) sepia(30%) saturate(500%) hue-rotate(230deg)"
          >
        </NuxtLink>
      </div>
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
                class="login-input w-full"
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
                class="login-password w-full"
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
              class="login-btn w-full justify-center py-3 text-base font-medium"
              :loading="authStore.loading"
              loading-icon="pi pi-spin pi-spinner"
            />
          </form>

          <div class="mt-5 sm:mt-6 text-center space-y-2">
            <NuxtLink
              :to="{ path: '/forgot-password', query: roleKey ? { access: roleKey } : undefined }"
              class="block text-[#6A0DAD] hover:underline text-sm font-medium"
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
                class="text-[#6A0DAD] font-medium hover:underline ml-1"
              >
                Daftar
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="login-footer fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 py-2.5 bg-[#6C757D] text-white text-xs z-20">
      <span class="opacity-95">© 2020 OpsiTech • v1.1.1.7 • v1.1.15</span>
      <span class="opacity-80">All Rights Reserved</span>
    </footer>
  </div>
</template>

<style scoped>
/* Fallback when background image not found */
.login-bg {
  background-color: #1a1a2e;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* PrimeVue overrides for login form */
.login-input :deep(input),
.login-password :deep(input) {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.login-btn :deep(.p-button) {
  background: #6A0DAD !important;
  border-color: #6A0DAD !important;
  color: #fff !important;
  border-radius: 0.5rem;
}

.login-btn :deep(.p-button:hover:not(:disabled)) {
  background: #5a0b94 !important;
  border-color: #5a0b94 !important;
  color: #fff !important;
}

/* Lock to viewport, no scroll */
.login-page {
  height: 100vh;
  max-height: 100dvh;
}
</style>
