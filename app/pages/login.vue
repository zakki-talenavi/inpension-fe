<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '#layers/shared/app/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)

async function handleLogin() {
  loading.value = true
  
  try {
    await authStore.login(credentials.value)
    
    toast.add({
      severity: 'success',
      summary: 'Login Berhasil',
      detail: 'Selamat datang!',
      life: 3000
    })
    
    // Redirect based on role
    const role = authStore.user?.role
    switch (role) {
      case 'DPLK':
        router.push('/scope/dplk')
        break
      case 'COMPANY':
        router.push('/scope/company')
        break
      case 'PERSONAL':
        router.push('/scope/personal')
        break
      case 'ADMINISTRATOR':
        router.push('/scope/admin')
        break
      default:
        router.push('/')
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Login Gagal',
      detail: error.message || 'Email atau password salah',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <Card class="login-card">
        <template #header>
          <div class="login-header">
            <h1>InPension</h1>
            <p>Sistem Manajemen Dana Pensiun</p>
          </div>
        </template>
        
        <template #content>
          <form @submit.prevent="handleLogin">
            <div class="field">
              <label for="email">Email</label>
              <InputText
                id="email"
                v-model="credentials.email"
                type="email"
                placeholder="email@example.com"
                required
                class="w-full"
              />
            </div>
            
            <div class="field">
              <label for="password">Password</label>
              <Password
                id="password"
                v-model="credentials.password"
                placeholder="Password"
                :feedback="false"
                toggle-mask
                required
                class="w-full"
              />
            </div>
            
            <Button
              type="submit"
              label="Login"
              icon="pi pi-sign-in"
              :loading="loading"
              class="w-full"
            />
          </form>
        </template>
        
        <template #footer>
          <div class="login-footer">
            <small>© 2026 InPension. All rights reserved.</small>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
}

.login-card {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  padding: 2rem 1rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.login-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
  font-weight: bold;
}

.login-header p {
  margin: 0;
  opacity: 0.9;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  color: #6c757d;
}
</style>
