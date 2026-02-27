<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- Card, Button from @primevue/nuxt-module */
import type { RoleOption, RoleActionType } from '~/types/scope'

const roles = useRoleOptions()
const router = useRouter()
const loginRoleCookie = useCookie<string | null>('login_role', { default: () => null })

const isLoading = ref(false)

function goAccess(roleKey: string) {
  loginRoleCookie.value = roleKey
  router.push({ path: '/login', query: { access: roleKey } })
}

function handleAction(role: RoleOption, action: { type: RoleActionType; label: string; route?: string }) {
  if (action.type === 'login') {
    goAccess(role.key)
    return
  }
  if (action.type === 'register' && action.route) {
    router.push(action.route)
    return
  }
  if (action.type === 'with_inventory') {
    isLoading.value = true
    
    localStorage.setItem('investpro_login_pending', String(Date.now()))
    
    const config = useRuntimeConfig()
    const gatewayBaseUrl = (config.public as any).investproGatewayUrl || 'https://uatinvestasi.investpro.id/gateway'
  
    const authUrl = new URL(`${gatewayBaseUrl}/oauth/authorize`)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('client_id', 'inpension')
    authUrl.searchParams.set('redirect_uri', window.location.origin + '/scope/dplk')
    authUrl.searchParams.set('scope', 'openid read write trust')
    
    window.location.href = authUrl.toString()
    return
  }
}
</script>

<template>
  <div class="scope-page min-h-screen flex flex-col bg-white relative overflow-x-hidden">
    <!-- Decorative blobs (behind content) -->
    <div
      class="scope-bg-blobs absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />

    <!-- Main: title + subtitle + cards -->
    <main class="scope-main flex-1 flex flex-col items-center justify-center py-6 sm:py-8 px-4 pb-24 relative z-10">
      <div class="scope-heading text-center mb-10 max-w-[600px]">
        <h1 class="scope-title text-2xl sm:text-3xl font-bold text-[#52629d] uppercase tracking-wide mb-3">
          PILIH TIPE USER
        </h1>
        <p class="scope-subtitle text-sm sm:text-[0.9375rem] text-gray-500 leading-relaxed font-light">
          Silahkan memilih tipe user yang tersedia. Jika anda bukan peserta DPLK silahkan login melalui Admin DPLK
        </p>
      </div>

      <p
        v-if="roles.length === 0"
        class="text-gray-500 text-center"
      >
        Tidak ada tipe user tersedia. Hubungi administrator.
      </p>

      <div
        v-else
        class="scope-cards grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center items-stretch w-full max-w-[1000px] mx-auto"
      >
        <Card
          v-for="role in roles"
          :key="role.key"
          class="scope-card min-w-[260px] max-w-[300px] flex-1 basis-[260px] flex flex-col h-full"
        >
          <template #content>
            <div class="flex flex-col w-full">
              <!-- Top part: Image + Title -->
              <div class="flex flex-col items-center">
                <!-- Image Icon -->
                <div class="scope-card-icon flex items-center justify-center h-[120px] w-full mb-6 mt-2">
                  <img
                    v-if="role.image"
                    :src="role.image"
                    :alt="role.title"
                    class="h-full w-auto max-w-[150px] object-contain"
                  >
                  <i
                    v-else
                    :class="['pi', role.icon, 'text-6xl text-gray-400']"
                  />
                </div>
                
                <!-- Title & Subtitle -->
                <div class="text-center flex flex-col items-center">
                  <h3 class="font-semibold text-gray-700 text-lg uppercase tracking-wide m-0">
                    {{ role.title }}
                  </h3>
                  <p v-if="role.subtitle" class="text-amber-500 font-medium text-xs uppercase tracking-widest m-0 mt-1">
                    {{ role.subtitle }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="scope-card-actions flex flex-col gap-2.5 w-full md:mt-7 mt-2">
                <Button
                  v-for="(action, idx) in role.actions"
                  :key="idx"
                  :label="action.label"
                  icon="pi pi-sign-in"
                  icon-pos="left"
                  :loading="isLoading"
                  class="scope-btn w-full justify-center"
                  :class="(action.variant === 'outlined' || action.type === 'with_inventory' || action.type === 'register') ? 'scope-btn-light' : 'scope-btn-primary'"
                  @click="handleAction(role, action)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </main>

    <footer class="scope-footer relative z-10 flex justify-between items-center flex-wrap gap-2 px-4 sm:px-6 py-2 bg-[#6C757D] text-white text-xs">
      <span class="opacity-95 text-[0.7rem] tracking-wide">© 2026 Opsitech • v0.0.1 • v0.0.0</span>
      <span class="opacity-95 text-[0.7rem] tracking-wide">All Rights Reserved</span>
    </footer>
  </div>
</template>

<style scoped>
/* Background: blob SVGs */
.scope-bg-blobs {
  background-image:
    url("/assets/layout/images/lp/blob%20right.svg"),
    url("/assets/layout/images/lp/blob%20left.svg");
  background-size: contain, contain;
  background-repeat: no-repeat, no-repeat;
  background-position: right 175%, left bottom;
}

/* PrimeVue Card Overrides */
/* target class directly instead of using :deep() for the root element, 
   ensuring the card itself becomes a stretching flex container */
.scope-card {
  background: #ffffff !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 15px rgb(0 0 0 / 0.04), 0 2px 5px rgb(0 0 0 / 0.02) !important;
  border: 1px solid #f1f5f9 !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
}

.scope-card :deep(.p-card-header),
.scope-card :deep(.p-card-title),
.scope-card :deep(.p-card-subtitle) {
  display: none !important;
}

.scope-card :deep(.p-card-body) {
  flex-grow: 1 !important;
  padding: 1.5rem !important;
  display: flex !important;
  flex-direction: column !important;
}

.scope-card :deep(.p-card-content) {
  padding: 0 !important;
  flex-grow: 1 !important;
  display: flex !important;
  flex-direction: column !important;
}

/* PrimeVue Button Overrides */
:deep(.scope-btn.p-button) {
  border-radius: 0.375rem;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none !important;
  box-shadow: none !important;
}

/* Primary Button (#52629d) */
:deep(.scope-btn-primary.p-button) {
  background-color: #52629d !important;
  color: #ffffff !important;
}
:deep(.scope-btn-primary.p-button:hover) {
  background-color: #435180 !important;
}

/* Light / Secondary Button */
:deep(.scope-btn-light.p-button) {
  background-color: #e2e8f0 !important;
  color: #52629d !important;
}
:deep(.scope-btn-light.p-button:hover) {
  background-color: #cbd5e1 !important;
}
</style>
