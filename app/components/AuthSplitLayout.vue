<script setup lang="ts">
defineOptions({ name: 'AuthSplitLayout' })

const bgImageError = ref(false)

// URL aset public: pakai origin request supaya gambar/logo load (SSR + client)
const requestURL = useRequestURL()
const lpBgUrl = computed(() => `${requestURL.origin}/assets/layout/images/lp/background-login-opsindo.jpg`)
const logoUrl = computed(() => `${requestURL.origin}/assets/layout/images/login/logo-inpension-white.svg`)
</script>

<template>
  <div class="auth-split-page flex h-screen w-full overflow-hidden">
    <!-- Left: branding + background (sama untuk login & register; ubah di sini = ganti di semua) -->
    <div class="auth-split-left relative flex-1 h-full max-md:hidden md:flex md:flex-col md:min-w-0">
      <div
        class="auth-split-bg absolute inset-0 bg-[#1a1a2e]"
        :style="{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6))' }"
      />
      <img
        v-show="!bgImageError"
        :src="lpBgUrl"
        alt=""
        class="auth-split-bg-img absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
        aria-hidden="true"
        @error="bgImageError = true"
      >
      <div class="auth-split-overlay absolute inset-0 flex flex-col justify-between py-8 px-6 md:px-8 z-10">
        <NuxtLink
          to="/"
          class="auth-split-header flex flex-col items-end w-full"
        >
          <img
            :src="logoUrl"
            alt="InPension"
            class="h-20 w-auto object-contain drop-shadow-md"
          >
          <div class="flex items-center gap-2 mt-2 text-white text-sm md:text-base font-medium">
            <span>Powered by</span>
            <span class="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">OpsiTech</span>
          </div>
        </NuxtLink>
        <div class="auth-split-caption text-white px-4 md:px-6 space-y-1 text-shadow">
          <p class="text-xl md:text-2xl lg:text-3xl font-semibold capitalize">
            Siapkan Masa Depan Anda Bersama Inpension
          </p>
          <p class="text-base md:text-lg lg:text-xl font-normal capitalize text-white/95">
            Rencanakan Sekarang, Sejahtera Nanti
          </p>
        </div>
      </div>
    </div>

    <!-- Right: slot (form login / register / dll) -->
    <div class="auth-split-right flex-1 flex flex-col h-full min-h-0 overflow-y-auto bg-[#F2F0F9] md:min-w-0 pb-10">
      <!-- Mobile: compact logo -->
      <div class="md:hidden shrink-0 flex justify-center pt-6 pb-2">
        <NuxtLink
          to="/"
          class="inline-block"
        >
          <img
            :src="logoUrl"
            alt="InPension"
            class="h-12 w-auto object-contain auth-split-mobile-logo"
          >
        </NuxtLink>
      </div>
      <slot />
    </div>

    <!-- Footer (sama di semua halaman auth) -->
    <footer class="auth-split-footer fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 sm:px-6 py-2.5 bg-[#6C757D] text-white text-xs z-20">
      <span class="opacity-95">© 2020 OpsiTech • v1.1.1.7 • v1.1.15</span>
      <span class="opacity-80">All Rights Reserved</span>
    </footer>
  </div>
</template>

<style scoped>
.auth-split-bg {
  background-color: #1a1a2e;
}

.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.auth-split-mobile-logo {
  filter: brightness(0) saturate(100%) invert(20%) sepia(30%) saturate(500%) hue-rotate(230deg);
}

.auth-split-page {
  height: 100vh;
  max-height: 100dvh;
}
</style>
