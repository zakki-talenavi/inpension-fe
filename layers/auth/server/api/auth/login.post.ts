import { defineEventHandler, readBody, createError } from 'h3'
import type { LoginCredentials } from '#layers/auth/app/schemas/auth'
import { LoginCredentialsSchema, AuthResponseSchema } from '#layers/auth/app/schemas/auth'

const API_BASE_URL = process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api-inpension.codeline.id/api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = LoginCredentialsSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid credentials',
      data: result.error.issues,
    })
  }

  const credentials: LoginCredentials = result.data

  try {
    const response = await $fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      },
    })

    return AuthResponseSchema.parse(response)
  } catch (err: unknown) {
    const message = err instanceof Error && err.message ? err.message : 'Login failed'
    const statusCode = err instanceof Error && 'statusCode' in err ? (err as any).statusCode : 401
    
    throw createError({
      statusCode,
      message,
    })
  }
})
