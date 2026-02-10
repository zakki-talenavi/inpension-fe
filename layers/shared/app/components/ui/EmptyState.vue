<script setup lang="ts">
interface Props {
  message?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Tidak ada data',
  icon: 'pi pi-inbox'
})
</script>

<template>
  <div class="empty-state">
    <div class="flex flex-col items-center justify-center py-12">
      <i :class="icon" class="text-6xl text-gray-300 mb-4" />
      <p class="text-gray-500 text-lg">{{ message }}</p>
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
