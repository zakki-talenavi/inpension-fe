import { defineEventHandler, readBody, createError } from 'h3'
import type { RegisterCredentials } from '#layers/auth/app/schemas/auth'
import { RegisterCredentialsSchema, AuthResponseSchema } from '#layers/auth/app/schemas/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = RegisterCredentialsSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid registration data',
      data: result.error.issues,
    })
  }

  const credentials: RegisterCredentials = result.data

  const newUser = {
    id: Date.now().toString(),
    name: credentials.name,
    email: credentials.email,
    createdAt: new Date().toISOString(),
  }

  const token = Buffer.from(JSON.stringify({ userId: newUser.id })).toString('base64')

  const response = AuthResponseSchema.parse({
    user: newUser,
    token,
  })

  return response
})
