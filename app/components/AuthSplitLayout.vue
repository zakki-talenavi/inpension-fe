<script setup lang="ts">
defineOptions({ name: 'AuthSplitLayout' })
</script>

<template>
  <div class="auth-split-page flex h-screen w-full overflow-hidden">
    <!-- Left Background Pane (5/12 width) -->
    <div 
      class="auth-split-left hidden md:flex w-5/12 flex-col items-center bg-cover bg-center min-h-full"
      style="background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/layout/images/lp/background-login-opsindo.jpg');"
    >
      <!-- Login Header (Top Half) -->
      <NuxtLink to="/" class="flex flex-1 flex-col justify-center items-center w-full cursor-pointer hover:opacity-95 transition-opacity">
        <div class="flex flex-col items-end w-fit">
          <img 
            src="/assets/layout/images/logo/logo-inpension-white.png" 
            alt="DPLK Logo" 
            class="h-[5.5rem] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          >
          <div class="flex justify-end items-center gap-1.5 mt-1 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pr-[2%]">
            <span class="text-[0.8rem] font-medium tracking-wide">Powered by</span>
            <img 
              src="/assets/layout/images/logo/logo-opsitech-white.png" 
              alt="Logo Maps White" 
              class="h-[4rem] w-auto object-contain"
            >
          </div>
        </div>
      </NuxtLink>

      <!-- Login Caption (Bottom Half) -->
      <div class="flex flex-1 flex-col justify-center px-10 xl:px-18 w-full text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <span class="block capitalize mb-8 leading-snug tracking-wide text-[35px] font-medium">Siapkan Masa Depan Anda Bersama Inpension</span>
        <span class="block capitalize leading-snug tracking-wide opacity-95 text-[25px] mb-16 font-normal">Rencanakan sekarang, sejahtera nanti</span>
      </div>
    </div>

    <!-- Right Form Slot (7/12 width) -->
    <div class="auth-split-right flex-1 md:w-7/12 flex flex-col h-full min-h-0 overflow-y-auto bg-[#f8f9fa] md:min-w-0 pb-10">
      <!-- Mobile: compact logo -->
      <div class="md:hidden shrink-0 flex justify-center pt-6 pb-2">
        <NuxtLink to="/" class="inline-block bg-[#52629d] p-3 rounded-md">
          <img
            src="/assets/layout/images/logo/logo-inpension-white.png"
            alt="InPension"
            class="h-10 w-auto object-contain"
          >
        </NuxtLink>
      </div>
      <slot />
    </div>

    <!-- Global Footer -->
    <footer class="fixed bottom-0 left-0 right-0 flex justify-between items-center px-6 py-2 bg-[#6C757D] text-white/95 text-[11px] font-medium z-20">
      <span>© 2026 OpsiTech • v1.1.7 • v1.1.12</span>
      <span>All Rights Reserved</span>
    </footer>
  </div>
</template>

<style scoped>
.auth-split-page {
  height: 100vh;
  max-height: 100dvh;
}
</style>
