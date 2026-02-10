import { Validation } from './constants'

/**
 * Validation Utilities
 * 
 * Provides common validation functions for forms and data validation
 */

// ============================================
// Validation Result Types
// ============================================

/**
 * Validation result
 */
export interface ValidationResult {
    valid: boolean
    message?: string
}

/**
 * Validation error
 */
export interface ValidationError {
    field: string
    message: string
}

// ============================================
// String Validators
// ============================================

/**
 * Validate email format
 * 
 * @param email - Email to validate
 * @returns Validation result
 * 
 * @example
 * validateEmail('user@example.com') // { valid: true }
 * validateEmail('invalid') // { valid: false, message: '...' }
 */
export function validateEmail(email: string | null | undefined): ValidationResult {
    if (!email) {
        return { valid: false, message: 'Email is required' }
    }

    if (email.length > Validation.EMAIL_MAX_LENGTH) {
        return { valid: false, message: `Email must not exceed ${Validation.EMAIL_MAX_LENGTH} characters` }
    }

    if (!Validation.EMAIL_PATTERN.test(email)) {
        return { valid: false, message: 'Invalid email format' }
    }

    return { valid: true }
}

/**
 * Validate password strength
 * 
 * @param password - Password to validate
 * @returns Validation result
 * 
 * @example
 * validatePassword('Pass123!') // { valid: true }
 * validatePassword('weak') // { valid: false, message: '...' }
 */
export function validatePassword(password: string | null | undefined): ValidationResult {
    if (!password) {
        return { valid: false, message: 'Password is required' }
    }

    if (password.length < Validation.PASSWORD_MIN_LENGTH) {
        return { valid: false, message: `Password must be at least ${Validation.PASSWORD_MIN_LENGTH} characters` }
    }

    if (password.length > Validation.PASSWORD_MAX_LENGTH) {
        return { valid: false, message: `Password must not exceed ${Validation.PASSWORD_MAX_LENGTH} characters` }
    }

    if (Validation.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' }
    }

    if (Validation.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' }
    }

    if (Validation.PASSWORD_REQUIRE_NUMBER && !/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' }
    }

    if (Validation.PASSWORD_REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' }
    }

    return { valid: true }
}

/**
 * Validate username
 * 
 * @param username - Username to validate
 * @returns Validation result
 */
export function validateUsername(username: string | null | undefined): ValidationResult {
    if (!username) {
        return { valid: false, message: 'Username is required' }
    }

    if (username.length < Validation.USERNAME_MIN_LENGTH) {
        return { valid: false, message: `Username must be at least ${Validation.USERNAME_MIN_LENGTH} characters` }
    }

    if (username.length > Validation.USERNAME_MAX_LENGTH) {
        return { valid: false, message: `Username must not exceed ${Validation.USERNAME_MAX_LENGTH} characters` }
    }

    if (!Validation.USERNAME_PATTERN.test(username)) {
        return { valid: false, message: 'Username can only contain letters, numbers, and underscores' }
    }

    return { valid: true }
}

/**
 * Validate phone number
 * 
 * @param phone - Phone number to validate
 * @returns Validation result
 */
export function validatePhone(phone: string | null | undefined): ValidationResult {
    if (!phone) {
        return { valid: false, message: 'Phone number is required' }
    }

    const cleanedPhone = phone.replace(/[\s-]/g, '')

    if (cleanedPhone.length < Validation.PHONE_MIN_LENGTH) {
        return { valid: false, message: `Phone number must be at least ${Validation.PHONE_MIN_LENGTH} digits` }
    }

    if (cleanedPhone.length > Validation.PHONE_MAX_LENGTH) {
        return { valid: false, message: `Phone number must not exceed ${Validation.PHONE_MAX_LENGTH} digits` }
    }

    if (!Validation.PHONE_PATTERN.test(cleanedPhone)) {
        return { valid: false, message: 'Invalid phone number format' }
    }

    return { valid: true }
}

/**
 * Validate name (first name, last name, etc.)
 * 
 * @param name - Name to validate
 * @param fieldName - Field name for error message (default: 'Name')
 * @returns Validation result
 */
export function validateName(name: string | null | undefined, fieldName: string = 'Name'): ValidationResult {
    if (!name) {
        return { valid: false, message: `${fieldName} is required` }
    }

    if (name.length < Validation.NAME_MIN_LENGTH) {
        return { valid: false, message: `${fieldName} must be at least ${Validation.NAME_MIN_LENGTH} characters` }
    }

    if (name.length > Validation.NAME_MAX_LENGTH) {
        return { valid: false, message: `${fieldName} must not exceed ${Validation.NAME_MAX_LENGTH} characters` }
    }

    return { valid: true }
}

// ============================================
// Number Validators
// ============================================

/**
 * Validate number is within range
 * 
 * @param value - Number to validate
 * @param min - Minimum value (optional)
 * @param max - Maximum value (optional)
 * @param fieldName - Field name for error message (default: 'Value')
 * @returns Validation result
 */
export function validateNumberRange(
    value: number | null | undefined,
    min?: number,
    max?: number,
    fieldName: string = 'Value'
): ValidationResult {
    if (value === null || value === undefined) {
        return { valid: false, message: `${fieldName} is required` }
    }

    if (isNaN(value)) {
        return { valid: false, message: `${fieldName} must be a valid number` }
    }

    if (min !== undefined && value < min) {
        return { valid: false, message: `${fieldName} must be at least ${min}` }
    }

    if (max !== undefined && value > max) {
        return { valid: false, message: `${fieldName} must not exceed ${max}` }
    }

    return { valid: true }
}

/**
 * Validate positive number
 * 
 * @param value - Number to validate
 * @param fieldName - Field name for error message (default: 'Value')
 * @returns Validation result
 */
export function validatePositiveNumber(
    value: number | null | undefined,
    fieldName: string = 'Value'
): ValidationResult {
    const result = validateNumberRange(value, 0.0001, undefined, fieldName)
    if (!result.valid) {
        return result
    }

    if (value !== null && value !== undefined && value <= 0) {
        return { valid: false, message: `${fieldName} must be greater than 0` }
    }

    return { valid: true }
}

// ============================================
// Date Validators
// ============================================

/**
 * Validate date is not in the past
 * 
 * @param date - Date to validate
 * @param fieldName - Field name for error message (default: 'Date')
 * @returns Validation result
 */
export function validateDateNotPast(
    date: string | Date | null | undefined,
    fieldName: string = 'Date'
): ValidationResult {
    if (!date) {
        return { valid: false, message: `${fieldName} is required` }
    }

    const d = new Date(date)
    if (isNaN(d.getTime())) {
        return { valid: false, message: `${fieldName} must be a valid date` }
    }

    const now = new Date()
    if (d < now) {
        return { valid: false, message: `${fieldName} cannot be in the past` }
    }

    return { valid: true }
}

/**
 * Validate date is not in the future
 * 
 * @param date - Date to validate
 * @param fieldName - Field name for error message (default: 'Date')
 * @returns Validation result
 */
export function validateDateNotFuture(
    date: string | Date | null | undefined,
    fieldName: string = 'Date'
): ValidationResult {
    if (!date) {
        return { valid: false, message: `${fieldName} is required` }
    }

    const d = new Date(date)
    if (isNaN(d.getTime())) {
        return { valid: false, message: `${fieldName} must be a valid date` }
    }

    const now = new Date()
    if (d > now) {
        return { valid: false, message: `${fieldName} cannot be in the future` }
    }

    return { valid: true }
}

/**
 * Validate date of birth (must be past date and reasonable age)
 * 
 * @param dateOfBirth - Date of birth to validate
 * @param minAge - Minimum age (default: 13)
 * @param maxAge - Maximum age (default: 120)
 * @returns Validation result
 */
export function validateDateOfBirth(
    dateOfBirth: string | Date | null | undefined,
    minAge: number = 13,
    maxAge: number = 120
): ValidationResult {
    if (!dateOfBirth) {
        return { valid: false, message: 'Date of birth is required' }
    }

    const dob = new Date(dateOfBirth)
    if (isNaN(dob.getTime())) {
        return { valid: false, message: 'Date of birth must be a valid date' }
    }

    const now = new Date()
    const age = now.getFullYear() - dob.getFullYear()

    if (dob > now) {
        return { valid: false, message: 'Date of birth cannot be in the future' }
    }

    if (age < minAge) {
        return { valid: false, message: `You must be at least ${minAge} years old` }
    }

    if (age > maxAge) {
        return { valid: false, message: `Please enter a valid date of birth` }
    }

    return { valid: true }
}

// ============================================
// File Validators
// ============================================

/**
 * Validate file type
 * 
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns Validation result
 */
export function validateFileType(
    file: File | null | undefined,
    allowedTypes: string[]
): ValidationResult {
    if (!file) {
        return { valid: false, message: 'File is required' }
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` }
    }

    return { valid: true }
}

/**
 * Validate file size
 * 
 * @param file - File to validate
 * @param maxSizeInBytes - Maximum file size in bytes
 * @returns Validation result
 */
export function validateFileSize(
    file: File | null | undefined,
    maxSizeInBytes: number
): ValidationResult {
    if (!file) {
        return { valid: false, message: 'File is required' }
    }

    if (file.size > maxSizeInBytes) {
        const maxSizeMB = (maxSizeInBytes / (1024 * 1024)).toFixed(2)
        return { valid: false, message: `File size must not exceed ${maxSizeMB} MB` }
    }

    return { valid: true }
}

/**
 * Validate image file
 * 
 * @param file - File to validate
 * @param maxSizeInBytes - Maximum file size in bytes (default: 5MB)
 * @returns Validation result
 */
export function validateImageFile(
    file: File | null | undefined,
    maxSizeInBytes: number = 5 * 1024 * 1024
): ValidationResult {
    const typeResult = validateFileType(file, [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ])
    if (!typeResult.valid) {
        return typeResult
    }

    return validateFileSize(file, maxSizeInBytes)
}

// ============================================
// Object/Form Validators
// ============================================

/**
 * Validate required field
 * 
 * @param value - Value to validate
 * @param fieldName - Field name for error message (default: 'Field')
 * @returns Validation result
 */
export function validateRequired(
    value: any,
    fieldName: string = 'Field'
): ValidationResult {
    if (value === null || value === undefined) {
        return { valid: false, message: `${fieldName} is required` }
    }

    if (typeof value === 'string' && value.trim() === '') {
        return { valid: false, message: `${fieldName} is required` }
    }

    if (Array.isArray(value) && value.length === 0) {
        return { valid: false, message: `${fieldName} is required` }
    }

    return { valid: true }
}

/**
 * Validate field length
 * 
 * @param value - Value to validate
 * @param minLength - Minimum length
 * @param maxLength - Maximum length
 * @param fieldName - Field name for error message (default: 'Field')
 * @returns Validation result
 */
export function validateLength(
    value: string | any[] | null | undefined,
    minLength: number,
    maxLength: number,
    fieldName: string = 'Field'
): ValidationResult {
    if (!value) {
        return { valid: false, message: `${fieldName} is required` }
    }

    const length = value.length

    if (length < minLength) {
        return { valid: false, message: `${fieldName} must be at least ${minLength} characters` }
    }

    if (length > maxLength) {
        return { valid: false, message: `${fieldName} must not exceed ${maxLength} characters` }
    }

    return { valid: true }
}

/**
 * Validate form object
 * 
 * @param formData - Form data to validate
 * @param validators - Object mapping field names to validator functions
 * @returns Object with validation errors by field
 * 
 * @example
 * const errors = validateForm({
 *   email: formData.email,
 *   password: formData.password,
 * }, {
 *   email: validateEmail,
 *   password: validatePassword,
 * })
 */
export function validateForm<T extends Record<string, any>>(
    formData: T,
    validators: Partial<Record<keyof T, (value: any) => ValidationResult>>
): Record<string, string> {
    const errors: Record<string, string> = {}

    for (const [field, validator] of Object.entries(validators)) {
        if (validator) {
            const result = validator(formData[field])
            if (!result.valid && result.message) {
                errors[field] = result.message
            }
        }
    }

    return errors
}

/**
 * Check if form has errors
 * 
 * @param errors - Errors object from validateForm
 * @returns True if there are errors
 */
export function hasErrors(errors: Record<string, string>): boolean {
    return Object.keys(errors).length > 0
}

// ============================================
// Export all validators
// ============================================

export const validators = {
    // String validators
    validateEmail,
    validatePassword,
    validateUsername,
    validatePhone,
    validateName,

    // Number validators
    validateNumberRange,
    validatePositiveNumber,

    // Date validators
    validateDateNotPast,
    validateDateNotFuture,
    validateDateOfBirth,

    // File validators
    validateFileType,
    validateFileSize,
    validateImageFile,

    // Generic validators
    validateRequired,
    validateLength,
    validateForm,
    hasErrors,
}
