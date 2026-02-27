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

export const ForgotPasswordSchema = z.object({
  emailOrId,
})

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>

export type ForgotPasswordFormErrors = Partial<Record<'emailOrId', string>>

export function validateForgotPasswordForm(input: {
  emailOrId: string
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
  if (emailMsg?.length) fieldErrors.emailOrId = emailMsg[0]
  return { success: false, fieldErrors }
}
