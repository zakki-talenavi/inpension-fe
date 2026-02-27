import { z } from 'zod'
import { Validation } from '~/utils/constants'

const loginId = z
  .string()
  .transform((s) => (s ?? '').trim())
  .pipe(
    z
      .string()
      .min(1, 'Email atau ID DPLK tidak boleh kosong')
      .max(Validation.EMAIL_MAX_LENGTH, `Maksimal ${Validation.EMAIL_MAX_LENGTH} karakter`)
      .refine(
        (val) =>
          Validation.EMAIL_PATTERN.test(val) || /^[a-zA-Z0-9_.-]+$/.test(val),
        'Format email atau ID DPLK tidak valid'
      )
  )

const password = z
  .string()
  .min(1, 'Kata sandi tidak boleh kosong')
  .max(
    Validation.PASSWORD_MAX_LENGTH,
    `Kata sandi maksimal ${Validation.PASSWORD_MAX_LENGTH} karakter`
  )

const captcha = z.string().min(1, 'Captcha tidak boleh kosong')

export const LoginSchema = z.object({
  email: loginId,
  password,
  captcha,
})

export type LoginFormData = z.infer<typeof LoginSchema>

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>

const LOGIN_FIELD_KEYS: (keyof LoginFormData)[] = ['email', 'password', 'captcha']

export function validateLoginForm(input: { email: string; password: string; captcha: string }): {
  success: true
  data: LoginFormData
} | {
  success: false
  fieldErrors: LoginFormErrors
} {
  const result = LoginSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const flattened = result.error.flatten()
  const fieldErrors: LoginFormErrors = {}
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (messages && messages.length > 0 && LOGIN_FIELD_KEYS.includes(key as keyof LoginFormData)) {
      fieldErrors[key as keyof LoginFormData] = messages[0]
    }
  }
  return { success: false, fieldErrors }
}
