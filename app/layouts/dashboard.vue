<script setup lang="ts">
import AppSidebar from '~/components/AppSidebar.vue'
import AppHeader from '~/components/AppHeader.vue'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="dashboard-root flex h-screen overflow-hidden bg-[#f4f4f4]">
    <AppSidebar :open="sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>

      <footer class="flex justify-between items-center px-4 py-2 bg-[#6C757D] text-white text-[0.65rem] flex-shrink-0">
        <span class="opacity-90">© 2026 Opsitech • v1.1.7 • v1.1.12</span>
        <span class="opacity-90">All Rights Reserved</span>
      </footer>
    </div>
  </div>
</template>
