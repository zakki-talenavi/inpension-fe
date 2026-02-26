import { z } from 'zod'
import { Validation } from '~/utils/constants'

/**
 * Email atau ID Peserta (format email atau alfanumerik).
 */
const emailOrId = z
  .string()
  .transform((s) => (s ?? '').trim())
  .pipe(
    z
      .string()
      .min(1, 'Email atau ID Peserta tidak boleh kosong')
      .max(Validation.EMAIL_MAX_LENGTH, `Maksimal ${Validation.EMAIL_MAX_LENGTH} karakter`)
      .refine(
        (val) =>
          Validation.EMAIL_PATTERN.test(val) || /^[a-zA-Z0-9_.-]+$/.test(val),
        'Format email atau ID Peserta tidak valid'
      )
  )

const captcha = z.string().min(1, 'Captcha tidak boleh kosong')

export const ForgotPasswordSchema = z.object({
  emailOrId,
  captcha,
})

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>

export type ForgotPasswordFormErrors = Partial<Record<'emailOrId' | 'captcha', string>>

export function validateForgotPasswordForm(input: {
  emailOrId: string
  captcha: string
}):
  | { success: true; data: ForgotPasswordFormData }
  | { success: false; fieldErrors: ForgotPasswordFormErrors } {
  const result = ForgotPasswordSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const flattened = result.error.flatten()
  const fieldErrors: ForgotPasswordFormErrors = {}
  const emailMsg = flattened.fieldErrors.emailOrId
  const captchaMsg = flattened.fieldErrors.captcha
  if (emailMsg?.length) fieldErrors.emailOrId = emailMsg[0]
  if (captchaMsg?.length) fieldErrors.captcha = captchaMsg[0]
  return { success: false, fieldErrors }
}
