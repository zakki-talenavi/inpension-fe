import { authCaptcha } from '~/services/api/auth'

export function useCaptcha() {
  const captchaKey = ref<string | null>(null)
  const captchaImage = ref<string | null>(null)
  const loading = ref(false)

  let _lastFetch = 0

  async function fetchCaptcha() {
    const now = Date.now()
    if (now - _lastFetch < 100 || loading.value) return
    _lastFetch = now

    loading.value = true
    try {
      const res = await authCaptcha()
      captchaKey.value = res.data.captcha_id
      captchaImage.value = res.data.image_base64
    } catch {
      captchaKey.value = null
      captchaImage.value = null
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchCaptcha()
  })

  return {
    captchaKey,
    captchaImage,
    loading,
    fetchCaptcha,
  }
}
