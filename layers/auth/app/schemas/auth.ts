import { z } from 'zod'

export const LoginCredentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().uuid('Invalid role ID'),
})

export const RegisterCredentialsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  role: z.string().optional(),
  createdAt: z.string().optional(),
})

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
})

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>
export type User = z.infer<typeof UserSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
