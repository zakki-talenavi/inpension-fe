import { defineEventHandler, readBody, createError } from 'h3'
import type { RegisterCredentials } from '#layers/auth/app/schemas/auth'
import { RegisterCredentialsSchema, AuthResponseSchema } from '#layers/auth/app/schemas/auth'

// Mock user database for testing (shared with login)
const MOCK_USERS: Record<string, {
  id: string
  email: string
  name: string
  password: string
}> = {
  'dplk@example.com': {
    id: 'test-user-id',
    email: 'dplk@example.com',
    name: 'Test User',
    password: '12345',
  },
}

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

  // Check if user already exists
  if (MOCK_USERS[credentials.email]) {
    throw createError({
      statusCode: 409,
      message: 'User already exists',
    })
  }

  // Create new user
  const newUser = {
    id: `user-${Date.now()}`,
    email: credentials.email,
    name: credentials.name,
    password: credentials.password, // In production, this should be hashed
  }

  MOCK_USERS[credentials.email] = newUser

  // Generate a mock token
  const token = `mock-token-${Date.now()}`

  // Return auth response
  return AuthResponseSchema.parse({
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
    token,
  })
})
