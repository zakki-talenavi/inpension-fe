<script setup lang="ts">
/* eslint-disable vue/no-undef-components */
defineProps<{
  captchaImg: string | null
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
      Captcha
    </label>
    <div class="mb-3 flex min-h-20 w-full max-w-[400px] mx-auto items-center justify-center overflow-hidden">
      <img
        v-if="captchaImg"
        :src="captchaImg"
        alt="Captcha"
        class="block max-h-20 w-auto max-w-full object-contain"
        aria-hidden="true"
      >
      <Skeleton v-else width="100%" height="4.5rem" class="rounded-sm" />
    </div>
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
      <Button
        type="button"
        icon="pi pi-refresh"
        aria-label="Perbarui captcha"
        class="w-12 flex items-center justify-center !bg-[#52629d] !border-[#52629d] !text-white hover:!bg-[#435180] hover:!border-[#435180] !rounded-l-none !rounded-r-md transition-colors"
        @click="$emit('refresh')"
      />
    </InputGroup>
    <small
      v-if="invalid && errorMessage"
      class="mt-1 block text-sm text-red-600"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>
