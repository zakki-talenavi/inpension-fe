<script setup lang="ts">
/* eslint-disable vue/no-undef-components -- PrimeVue components from @primevue/nuxt-module */
import { authVerifyEmail, authSendVerification } from '~/services/api/auth'

defineOptions({ name: 'VerificationPage' })

const route = useRoute()
const router = useRouter()
const notification = useNotification()

// Query params passed from registration
const fullname = computed(() => (route.query.fullname as string) || '')
const email = computed(() => (route.query.email as string) || '')

onMounted(() => {
  if (!email.value) {
    router.replace('/login')
  }
})

const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const resending = ref(false)

const errors = ref<{
  verificationCode?: string
  newPassword?: string
  confirmPassword?: string
}>({})

function validate(): boolean {
  const fieldErrors: typeof errors.value = {}

  if (!verificationCode.value.trim()) {
    fieldErrors.verificationCode = 'Kode verifikasi tidak boleh kosong'
  }
  if (!newPassword.value) {
    fieldErrors.newPassword = 'Kata sandi baru tidak boleh kosong'
  } else if (newPassword.value.length < 8) {
    fieldErrors.newPassword = 'Kata sandi minimal 8 karakter'
  }
  if (!confirmPassword.value) {
    fieldErrors.confirmPassword = 'Ulangi kata sandi tidak boleh kosong'
  } else if (newPassword.value !== confirmPassword.value) {
    fieldErrors.confirmPassword = 'Kata sandi tidak sama'
  }

  errors.value = fieldErrors
  return Object.keys(fieldErrors).length === 0
}

async function onSubmit() {
  if (!validate()) return

  loading.value = true
  try {
    const res = await authVerifyEmail({
      token: verificationCode.value,
      new_password: newPassword.value,
    })

    notification.success(res.message || 'Verifikasi berhasil', {
      title: 'Berhasil',
    })
    await router.push({ path: '/login', query: { access: 'personal' } })
  } catch (err: any) {
    notification.error(err?.message || 'Verifikasi gagal', {
      title: 'Gagal',
    })
  } finally {
    loading.value = false
  }
}

async function resendCode() {
  resending.value = true
  try {
    const res = await authSendVerification(email.value)

    notification.success(res.message || 'Kode berhasil dikirim ulang', {
      title: 'Berhasil',
    })
  } catch (err: any) {
    notification.error(err?.message || 'Gagal mengirim ulang kode', {
      title: 'Gagal',
    })
  } finally {
    resending.value = false
  }
}
</script>

<template>
  <div class="verify-page">
    <!-- White card -->
    <div class="verify-card">
      <!-- Icon -->
      <div class="verify-icon-wrapper">
        <i class="pi pi-envelope verify-icon" />
        <span class="verify-badge">1</span>
      </div>

      <h1 class="verify-title">
        Verifikasi Email Kamu
      </h1>

      <!-- Personalized message -->
      <p class="verify-greeting">
        Hai, {{ fullname || 'Pengguna' }}
      </p>
      <p class="verify-desc">
        Kami sudah mengirim email yang berisi kode verifikasi, mohon untuk mengisi kotak kosong
        dibawah dengan kode yang diberikan untuk memverifikasi email.
      </p>

      <!-- Resend -->
      <p class="verify-resend-text">
        Tidak menerima email atau kode kadaluarsa?
      </p>
      <Button
        type="button"
        label="Kirim Ulang Kode"
        class="verify-resend-btn"
        :loading="resending"
        loading-icon="pi pi-spin pi-spinner"
        @click="resendCode"
      />

      <form class="verify-form" @submit.prevent="onSubmit">
        <!-- Kode Verifikasi -->
        <div class="verify-field">
          <label for="verify-code" class="verify-label">Kode Verifikasi</label>
          <InputText
            id="verify-code"
            v-model="verificationCode"
            type="text"
            placeholder="Masukkan kode verifikasi"
            class="verify-input verify-input--code"
            :class="{ 'p-invalid': errors.verificationCode }"
            autocomplete="one-time-code"
            autofocus
          />
          <small v-if="errors.verificationCode" class="verify-error">
            {{ errors.verificationCode }}
          </small>
        </div>

        <!-- Kata Sandi Baru -->
        <div class="verify-field">
          <label for="verify-password" class="verify-label">Kata Sandi Baru</label>
          <Password
            id="verify-password"
            v-model="newPassword"
            placeholder="Masukkan kata sandi baru"
            :feedback="false"
            toggle-mask
            input-class="w-full"
            class="w-full"
            :class="{ 'p-invalid': errors.newPassword }"
          />
          <small v-if="errors.newPassword" class="verify-error">
            {{ errors.newPassword }}
          </small>
        </div>

        <!-- Ulangi Kata Sandi -->
        <div class="verify-field">
          <label for="verify-password-confirm" class="verify-label">Ulangi Kata Sandi</label>
          <Password
            id="verify-password-confirm"
            v-model="confirmPassword"
            placeholder="Masukkan ulang kata sandi"
            :feedback="false"
            toggle-mask
            input-class="w-full"
            class="w-full"
            :class="{ 'p-invalid': errors.confirmPassword }"
          />
          <small v-if="errors.confirmPassword" class="verify-error">
            {{ errors.confirmPassword }}
          </small>
        </div>

        <Button
          type="submit"
          label="VERIFIKASI EMAIL"
          class="verify-submit-btn"
          :loading="loading"
          loading-icon="pi pi-spin pi-spinner"
        />
      </form>
    </div>

    <!-- Footer -->
    <footer class="verify-footer">
      <span>© 2026 OpsiTech • v1.1.7 • v1.1.12</span>
      <span>All Rights Reserved</span>
    </footer>
  </div>
</template>

<style scoped>
.verify-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: #52629d;
  padding: 2rem 1rem 3.5rem;
}

.verify-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 2.5rem 2.5rem 2rem;
}

/* ---- Icon ---- */
.verify-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 5rem;
  margin-bottom: 1.25rem;
}

.verify-icon {
  font-size: 3.5rem;
  color: #52629d;
}

.verify-badge {
  position: absolute;
  top: -0.2rem;
  right: -0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #ef4444;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

/* ---- Text ---- */
.verify-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  text-align: center;
}

.verify-greeting {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #52629d;
  margin-bottom: 0.25rem;
  text-align: center;
}

.verify-desc {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #64748b;
  text-align: center;
  max-width: 420px;
  margin-bottom: 0.75rem;
}

/* ---- Resend ---- */
.verify-resend-text {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  text-align: center;
}

:deep(.verify-resend-btn) {
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  padding: 0.4rem 1.25rem;
  border-color: #52629d;
  color: #52629d;
  background: transparent;
  border-radius: 0.25rem;
}
:deep(.verify-resend-btn:hover) {
  background: rgba(82, 98, 157, 0.08);
}

/* ---- Form ---- */
.verify-form {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
}

.verify-field {
  margin-bottom: 1rem;
}

.verify-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  text-align: center;
  margin-bottom: 0.375rem;
}

.verify-input {
  width: 100%;
}

.verify-input--code {
  text-align: center;
  letter-spacing: 0.25em;
  font-weight: 600;
}

.verify-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #ef4444;
  text-align: center;
}

/* ---- Submit ---- */
:deep(.verify-submit-btn) {
  margin-top: 0.5rem;
  width: 100%;
  justify-content: center;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  background-color: #52629d;
  border-color: #52629d;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.2s, border-color 0.2s;
}
:deep(.verify-submit-btn:hover) {
  background-color: #3f4a7c;
  border-color: #3f4a7c;
}

/* ---- Footer ---- */
.verify-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background-color: #6c757d;
  color: rgba(255, 255, 255, 0.95);
  font-size: 11px;
  font-weight: 500;
  z-index: 20;
}

/* ---- Responsive ---- */
@media (max-width: 640px) {
  .verify-card {
    padding: 2rem 1.25rem 1.5rem;
  }
  .verify-title {
    font-size: 1.25rem;
  }
}
</style>
