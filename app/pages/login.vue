<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '#layers/shared/app/stores/auth'

defineOptions({
  name: 'LoginPage'
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

definePageMeta({
  layout: false
})


const credentials = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(credentials.value)

    toast.add({
      severity: 'success',
      summary: 'Selamat Datang',
      detail: 'Login berhasil, mengarahkan ke dashboard...',
      life: 2000
    })

    // Slight delay to show success state
    setTimeout(() => {
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
    }, 1000)

  } catch (error: unknown) {
    errorMessage.value = error instanceof Error ? error.message : 'Email atau password salah'
    toast.add({
      severity: 'error',
      summary: 'Login Gagal',
      detail: errorMessage.value,
      life: 4000
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="login-container">
      <div class="login-content">
        <div class="brand-section">
          <div class="logo-container">
            <i class="pi pi-shield brand-icon"></i>
          </div>
          <h1 class="app-name">InPension</h1>
          <p class="app-tagline">Sistem Manajemen Dana Pensiun Terpercaya</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="welcome-text">
            <h2>Selamat Datang Kembali</h2>
            <p class="subtitle">Silakan masuk ke akun Anda</p>
          </div>

          <Message v-if="errorMessage" severity="error" class="mb-4" :closable="false">{{ errorMessage }}</Message>

          <div class="form-group">
            <FloatLabel>
              <InputText id="email" v-model="credentials.email" type="email" class="w-full" :invalid="!!errorMessage" />
              <label for="email">Email Address</label>
            </FloatLabel>
          </div>

          <div class="form-group">
            <FloatLabel>
              <Password id="password" v-model="credentials.password" :feedback="false" toggle-mask class="w-full"
                input-class="w-full" :invalid="!!errorMessage" />
              <label for="password">Password</label>
            </FloatLabel>
          </div>

          <div class="form-actions">
            <a href="#" class="forgot-password">Lupa Password?</a>
          </div>

          <Button type="submit" label="Masuk" icon="pi pi-sign-in" :loading="loading" class="w-full login-button"
            size="large" />
        </form>

        <div class="login-footer">
          <p>© 2026 InPension. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

/* Abstract Background Shapes */
.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  border-radius: 50%;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  top: -10%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #6366f1, #4f46e5);
  animation-delay: 0s;
}

.shape-2 {
  bottom: -10%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #ec4899, #db2777);
  animation-delay: -5s;
}

.shape-3 {
  top: 40%;
  left: 40%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #06b6d4, #0891b2);
  animation-delay: -10s;
  opacity: 0.2;
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }

  33% {
    transform: translate(30px, -50px) rotate(10deg);
  }

  66% {
    transform: translate(-20px, 20px) rotate(-10deg);
  }
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
  z-index: 10;
  position: relative;
}

.login-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.brand-section {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.brand-icon {
  font-size: 2rem;
  color: white;
}

.app-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.app-tagline {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.welcome-text {
  margin-bottom: 2rem;
  text-align: center;
}

.welcome-text h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.forgot-password {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: #4338ca;
  text-decoration: underline;
}

.login-button {
  font-weight: 600;
  letter-spacing: 0.025em;
}

.login-footer {
  text-align: center;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 0;
}

/* PrimeVue Customization overrides */
:deep(.p-inputtext) {
  border-radius: 12px;
  padding: 1rem 1rem 1rem 1rem;
  /* Adjust for FloatLabel */
  transition: all 0.2s;
}

:deep(.p-float-label label) {
  left: 1rem;
  color: #64748b;
}

:deep(.p-inputtext:focus) {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-button) {
  border-radius: 12px;
  padding: 1rem;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  border: none;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}

:deep(.p-button:hover) {
  background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}
</style>
