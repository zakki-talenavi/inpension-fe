<script setup lang="ts">
/* eslint-disable vue/no-undef-components */
defineProps<{
  captchaImg: string
  invalid?: boolean
  errorMessage?: string
  inputId?: string
}>()

defineEmits<{
  refresh: []
}>()

defineOptions({ name: 'CaptchaFormBlock' })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div>
    <label
      :for="inputId ?? 'captcha-input'"
      class="mb-2 block text-sm font-medium text-gray-800"
    >
      Captcha <span class="text-red-500">*</span>
    </label>
    <!-- Area gambar captcha lebih besar agar mudah dibaca -->
    <div class="mb-3 flex min-h-20 items-center justify-center overflow-hidden px-4 py-3">
      <img
        :src="captchaImg"
        alt="Captcha"
        class="block max-h-20 w-auto max-w-full object-contain"
        aria-hidden="true"
      >
    </div>
    <!-- InputGroup: input + tombol refresh di kanan (satu unit) -->
    <InputGroup>
      <InputText
        :id="inputId ?? 'captcha-input'"
        v-model="model"
        type="text"
        placeholder="Masukkan captcha"
        class="w-full"
        :class="{ 'p-invalid': invalid }"
        autocomplete="off"
        aria-label="Masukkan kode captcha"
        @keyup.enter="$emit('refresh')"
      />
      <InputGroupAddon>
        <Button
          type="button"
          icon="pi pi-refresh"
          aria-label="Perbarui captcha"
          severity="secondary"
          @click="$emit('refresh')"
        />
      </InputGroupAddon>
    </InputGroup>
    <small
      v-if="invalid && errorMessage"
      class="mt-1 block text-sm text-red-600"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>
