<script setup lang="ts">
interface Props {
  title: string
  visible: boolean
  width?: string
  modal?: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  width: '500px',
  modal: true
})

const emit = defineEmits<Emits>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
  dialogVisible.value = false
}
</script>

<template>
  <Dialog
    v-model:visible="dialogVisible"
    :header="title"
    :modal="modal"
    :style="{ width }"
  >
    <slot />
    
    <template #footer>
      <slot name="footer">
        <Button
          label="Batal"
          icon="pi pi-times"
          severity="secondary"
          @click="handleCancel"
        />
        <Button
          label="Simpan"
          icon="pi pi-check"
          @click="handleConfirm"
        />
      </slot>
    </template>
  </Dialog>
</template>
