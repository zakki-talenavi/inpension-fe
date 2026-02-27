
export function useCaptcha() {
  const captchaKey = ref<string | null>(null)
  const captchaImage = ref<string | null>(null)
  const loading = ref(false)

  async function fetchCaptcha() {
    loading.value = true
    try {
      const { authCaptcha } = await import('~/services/api/auth')
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
