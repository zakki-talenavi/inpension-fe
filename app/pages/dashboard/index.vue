<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <div class="dashboard-home">
    <!-- Placeholder for future Page Builder canvas -->
    <div class="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center m-2">
      <i class="pi pi-objects-column text-5xl text-gray-300 mb-4 block" />
      <h3 class="text-lg font-semibold text-gray-500 mb-2">
        Area Page Builder
      </h3>
      <p class="text-sm text-gray-400 max-w-md mx-auto">
        Area ini akan digunakan sebagai canvas untuk Page Builder custom Anda.
        Konten halaman akan di-render secara dinamis berdasarkan konfigurasi yang tersimpan di database.
      </p>
    </div>
  </div>
</template>
