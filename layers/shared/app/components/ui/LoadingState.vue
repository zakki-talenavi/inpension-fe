<script setup lang="ts">
interface Props {
  loading?: boolean
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  message: 'Loading...'
})
</script>

<template>
  <div class="loading-state">
    <div class="flex flex-col items-center justify-center py-12">
      <ProgressSpinner />
      <p v-if="message" class="mt-4 text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
