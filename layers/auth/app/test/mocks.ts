import { generateMock } from '@anatine/zod-mock'
import { UserSchema, LoginCredentialsSchema } from '../schemas/auth'
import type { User, LoginCredentials } from '../schemas/auth'

/**
 * Generate a valid User object with optional overrides
 * @param overrides - Partial User to override generated values
 * @returns A valid User object
 */
export function generateUser(overrides?: Partial<User>): User {
    const generated = generateMock(UserSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate an array of valid User objects
 * @param count - Number of users to generate
 * @returns Array of User objects
 */
export function generateUsers(count: number): User[] {
    return Array.from({ length: count }, () => generateUser())
}

/**
 * Generate valid login credentials
 * @param overrides - Partial LoginCredentials to override
 * @returns Valid LoginCredentials object
 */
export function generateLoginCredentials(overrides?: Partial<LoginCredentials>): LoginCredentials {
    const generated = generateMock(LoginCredentialsSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate a user with specific email
 * @param email - Email address
 * @param overrides - Additional overrides
 * @returns User with specified email
 */
export function generateUserWithEmail(email: string, overrides?: Partial<User>): User {
    return generateUser({ email, ...overrides })
}
