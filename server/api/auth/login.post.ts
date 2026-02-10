import { defineEventHandler, readBody } from 'h3'
import type { LoginCredentials } from '#layers/auth/app/schemas/auth'
import { LoginCredentialsSchema, AuthResponseSchema } from '#layers/auth/app/schemas/auth'

// Mock user database for testing
const MOCK_USERS = {
  'dplk@example.com': {
    id: 'test-user-id',
    email: 'dplk@example.com',
    name: 'Test User',
    password: '12345', // In production, this should be hashed
  },
}

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

  // Check if user exists and password matches
  const user = MOCK_USERS[credentials.email as keyof typeof MOCK_USERS]

  if (!user || user.password !== credentials.password) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password',
    })
  }

  // Generate a mock token
  const token = `mock-token-${Date.now()}`

  // Return auth response
  return AuthResponseSchema.parse({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  })
})
