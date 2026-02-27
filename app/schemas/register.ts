import { z } from 'zod'
import { Validation } from '~/utils/constants'

const fullName = z
  .string()
  .transform((s) => (s ?? '').trim())
  .pipe(
    z
      .string()
      .min(1, 'Nama lengkap tidak boleh kosong')
      .min(Validation.NAME_MIN_LENGTH, `Nama minimal ${Validation.NAME_MIN_LENGTH} karakter`)
      .max(Validation.NAME_MAX_LENGTH, `Nama maksimal ${Validation.NAME_MAX_LENGTH} karakter`)
  )

const identityNumber = z
  .string()
  .transform((s) => (s ?? '').trim())
  .pipe(
    z
      .string()
      .min(1, 'No identitas tidak boleh kosong')
      .min(5, 'No identitas minimal 5 karakter')
      .max(30, 'No identitas maksimal 30 karakter')
      .refine(
        (val) => /^\d{16}$/.test(val) || /^[a-zA-Z0-9_-]+$/.test(val),
        'Format NIK (16 digit) atau KITAS tidak valid'
      )
  )

const email = z
  .string()
  .transform((s) => (s ?? '').trim())
  .pipe(
    z
      .string()
      .min(1, 'Email tidak boleh kosong')
      .max(Validation.EMAIL_MAX_LENGTH, `Maksimal ${Validation.EMAIL_MAX_LENGTH} karakter`)
      .email('Format email tidak valid')
  )



const captcha = z.string().min(1, 'Captcha tidak boleh kosong')

export const RegisterSchema = z
  .object({
    fullName,
    identityNumber,
    email,
    emailConfirm: z.string(),
    captcha,
  })
  .refine((data) => data.email === data.emailConfirm, {
    message: 'Email tidak sama',
    path: ['emailConfirm'],
  })

export type RegisterFormData = z.infer<typeof RegisterSchema>

export type RegisterFormErrors = Partial<
  Record<
    | 'fullName'
    | 'identityNumber'
    | 'email'
    | 'emailConfirm'
    | 'captcha',
    string
  >
>

const REGISTER_FIELD_KEYS: (keyof RegisterFormErrors)[] = [
  'fullName',
  'identityNumber',
  'email',
  'emailConfirm',
  'captcha',
]

export function validateRegisterForm(input: {
  fullName: string
  identityNumber: string
  email: string
  emailConfirm: string
  captcha: string
}):
  | { success: true; data: RegisterFormData }
  | { success: false; fieldErrors: RegisterFormErrors } {
  const result = RegisterSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const flattened = result.error.flatten()
  const fieldErrors: RegisterFormErrors = {}
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (
      messages &&
      messages.length > 0 &&
      REGISTER_FIELD_KEYS.includes(key as keyof RegisterFormErrors)
    ) {
      fieldErrors[key as keyof RegisterFormErrors] = messages[0]
    }
  }
  return { success: false, fieldErrors }
}
