/**
 * Validate Indonesian NIK (16 digits)
 */
export function validateNIK(nik: string): boolean {
    return /^\d{16}$/.test(nik)
}

/**
 * Validate Indonesian NPWP (15 digits)
 */
export function validateNPWP(npwp: string): boolean {
    const cleaned = npwp.replace(/[.-]/g, '')
    return /^\d{15}$/.test(cleaned)
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number (Indonesian format)
 */
export function validatePhone(phone: string): boolean {
    const cleaned = phone.replace(/[\s-]/g, '')
    return /^(\+62|62|0)[0-9]{9,12}$/.test(cleaned)
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
    valid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (password.length < 8) {
        errors.push('Password minimal 8 karakter')
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password harus mengandung huruf besar')
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password harus mengandung huruf kecil')
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password harus mengandung angka')
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}
