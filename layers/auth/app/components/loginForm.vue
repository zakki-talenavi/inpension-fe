<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth/useAuthStore'

const authStore = useAuthStore()
const email = ref('')
const password = ref('')

async function handleSubmit() {
    await authStore.login(email.value, password.value)
}
</script>

<template>
    <div class="p-4 border rounded shadow-md max-w-sm mx-auto">
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
            <input v-model="email" type="email" placeholder="Email" class="border p-2 rounded" />
            <input v-model="password" type="password" placeholder="Password" class="border p-2 rounded" />
            <button type="submit" :disabled="authStore.loading"
                class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">
                {{ authStore.loading ? 'Logging in...' : 'Login' }}
            </button>
            <p v-if="authStore.error" class="text-red-500 text-sm">
                {{ authStore.error }}
            </p>
        </form>
    </div>
</template>
