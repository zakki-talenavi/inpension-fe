import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  role: z.enum(['DPLK', 'COMPANY', 'PERSONAL', 'ADMINISTRATOR']),
})

export type User = z.infer<typeof UserSchema>
