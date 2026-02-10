<script setup lang="ts">
import { ref } from 'vue'
import { UCard, UInput, UButton, UAlert } from '#components'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'
import { RegisterCredentialsSchema } from '#layers/auth/app/schemas/auth'

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<Record<string, string>>({})

async function handleSubmit() {
  errors.value = {}

  const result = RegisterCredentialsSchema.safeParse({
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  })

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0].toString()] = issue.message
      }
    })
    return
  }

  const success = await authStore.register(
    result.data.name,
    result.data.email,
    result.data.password
  )

  if (!success) {
    errors.value.form = authStore.error || 'Registration failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          Create Account
        </h1>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="errors.form" class="mb-4">
          <UAlert
            icon="i-lucide-alert-circle"
            color="red"
            :title="errors.form"
          />
        </div>

        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <UInput
            id="name"
            v-model="name"
            type="text"
            placeholder="John Doe"
            :error="!!errors.name"
            :error-message="errors.name"
            required
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <UInput
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            :error="!!errors.email"
            :error-message="errors.email"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <UInput
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            :error="!!errors.password"
            :error-message="errors.password"
            required
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <UInput
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            :error="!!errors.confirmPassword"
            :error-message="errors.confirmPassword"
            required
          />
        </div>

        <UButton
          type="submit"
          color="black"
          size="lg"
          class="w-full"
          :loading="authStore.isLoading"
        >
          Create Account
        </UButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink to="/login" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
