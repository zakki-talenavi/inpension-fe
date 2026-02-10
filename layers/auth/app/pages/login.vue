<script setup lang="ts">
import { ref } from 'vue'
import { UCard, UInput, UButton, UAlert } from '#components'
import { useAuthStore } from '#layers/auth/app/stores/auth/useAuthStore'
import { LoginCredentialsSchema } from '#layers/auth/app/schemas/auth'
import { useRouter } from '#app'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const role = ref('351c138d-176a-4f5b-b0b1-8c188adf731e')
const errors = ref<Record<string, string>>({})

async function handleSubmit() {
  errors.value = {}

  const result = LoginCredentialsSchema.safeParse({
    email: email.value,
    password: password.value,
    role: role.value,
  })

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      if (issue.path[0]) {
        errors.value[issue.path[0].toString()] = issue.message
      }
    })
    return
  }

  const success = await authStore.login(result.data.email, result.data.password, result.data.role)

  if (success) {
    await router.push('/')
  } else {
    errors.value.form = authStore.error || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold text-center">
          Sign In
        </h1>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="errors.form" class="mb-4">
          <UAlert
            icon="i-lucide-alert-circle"
            color="error"
            :title="errors.form"
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
            data-testid="email-input"
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
            data-testid="password-input"
          />
        </div>

        <div>
          <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <UInput
            id="role"
            v-model="role"
            type="text"
            placeholder="Role UUID"
            :error="!!errors.role"
            :error-message="errors.role"
            required
          />
        </div>

        <UButton
          type="submit"
          color="neutral"
          size="lg"
          class="w-full"
          :loading="authStore.isLoading"
        >
          Sign In
        </UButton>
      </form>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink to="/register" class="text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Sign up
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
