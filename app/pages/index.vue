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
    goAccess(role.key)
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
      <div class="scope-heading text-center mb-8 sm:mb-10 max-w-[560px]">
        <h1 class="scope-title text-2xl sm:text-3xl md:text-[2rem] font-bold text-[#6A0DAD] uppercase tracking-wide mb-3">
          PILIH TIPE USER
        </h1>
        <p class="scope-subtitle text-[0.9375rem] sm:text-base text-[#6B7280] leading-relaxed">
          Silahkan memilih tipe user yang tersedia. Jika anda bukan peserta DPLK, silahkan login melalui Admin DPLK.
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
        class="scope-cards flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 justify-center items-stretch w-full max-w-[900px]"
      >
        <Card
          v-for="role in roles"
          :key="role.key"
          class="scope-card min-w-[260px] max-w-[300px] flex-1 basis-[260px]"
        >
          <template #title>
            <span class="scope-card-title block text-center font-bold text-gray-800 text-lg sm:text-xl">
              {{ role.title }}
            </span>
          </template>
          <template #subtitle>
            <span class="scope-card-subtitle block text-center text-sm text-gray-600 mt-0.5">
              {{ role.subtitle }}
            </span>
          </template>
          <template #content>
            <div class="scope-card-icon flex items-center justify-center w-[88px] h-[88px] sm:w-24 sm:h-24 mx-auto mb-3">
              <img
                v-if="role.image"
                :src="role.image"
                :alt="role.title"
                class="w-full h-full object-contain"
              >
              <i
                v-else
                :class="['pi', role.icon, 'text-4xl sm:text-5xl text-gray-500']"
              />
            </div>
            <div class="scope-card-actions flex flex-col gap-2 sm:gap-2.5 pt-1">
              <Button
                v-for="(action, idx) in role.actions"
                :key="idx"
                :label="action.label"
                :icon="action.type === 'with_inventory' ? 'pi pi-list' : 'pi pi-arrow-right'"
                icon-pos="left"
                :loading="isLoading"
                class="scope-btn w-full justify-center"
                :class="(action.variant === 'outlined' || action.type === 'with_inventory') ? 'scope-btn-outline' : 'scope-btn-primary'"
                :severity="(action.variant === 'outlined' || action.type === 'with_inventory') ? 'secondary' : 'primary'"
                :variant="(action.variant === 'outlined' || action.type === 'with_inventory') ? 'outlined' : undefined"
                @click="handleAction(role, action)"
              />
            </div>
          </template>
        </Card>
      </div>
    </main>

    <footer class="scope-footer relative z-10 flex justify-between items-center flex-wrap gap-2 px-4 sm:px-6 py-3 bg-[#6C757D] text-white text-xs">
      <span class="opacity-95">© 2020 Qodebach • v1.1.1.7 • v1.1.15</span>
      <span class="opacity-80 text-[0.6875rem]">All Rights Reserved</span>
    </footer>
  </div>
</template>

<style scoped>
/* Background: blob SVGs seperti semula (tidak diubah) */
.scope-bg-blobs {
  background-image:
    url("/assets/layout/images/lp/blob%20right.svg"),
    url("/assets/layout/images/lp/blob%20left.svg");
  background-size: contain, contain;
  background-repeat: no-repeat, no-repeat;
  background-position: right 175%, left bottom;
}

/* PrimeVue Card/Button: override minimal agar tampil konsisten (Tailwind tidak bisa target .p-card/.p-button) */
.scope-card :deep(.p-card),
.scope-card :deep(.p-card-body) {
  background: #fff !important;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.06), 0 2px 8px rgb(0 0 0 / 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scope-card :deep(.p-card-header) {
  display: none;
}

.scope-card :deep(.p-card-body) {
  flex: 1;
  padding: 1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
}

.scope-card :deep(.p-card-title),
.scope-card :deep(.p-card-subtitle) {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
}

.scope-card :deep(.p-card-content) {
  padding: 0;
  margin-top: auto;
}

.scope-btn :deep(.p-button) {
  border-radius: 0.5rem;
  font-weight: 500;
  padding: 0.625rem 1rem;
}

.scope-btn-primary :deep(.p-button) {
  background: #6A0DAD !important;
  border-color: #6A0DAD !important;
  color: #fff !important;
}

.scope-btn-primary :deep(.p-button:hover) {
  background: #5a0b94 !important;
  border-color: #5a0b94 !important;
  color: #fff !important;
}

.scope-btn-outline :deep(.p-button) {
  background: #fff !important;
  border: 1px solid #6A0DAD !important;
  color: #6A0DAD !important;
}

.scope-btn-outline :deep(.p-button:hover) {
  background: #f5f0fa !important;
  border-color: #6A0DAD !important;
  color: #6A0DAD !important;
}
</style>
