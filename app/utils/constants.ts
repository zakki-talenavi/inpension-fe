/**
 * Application Constants
 * 
 * Centralized location for all application-wide constants
 */

// ============================================
// API Constants
// ============================================

/**
 * HTTP Status Codes
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const

/**
 * API Response status
 */
export const ApiStatus = {
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending',
} as const

// ============================================
// User & Auth Constants
// ============================================

/**
 * User roles
 */
export const UserRole = {
    ADMINISTRATOR: 'ADMINISTRATOR',
    DPLK: 'DPLK',
    COMPANY: 'COMPANY',
    PERSONAL: 'PERSONAL',
} as const

/**
 * User status
 */
export const UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    PENDING: 'PENDING',
} as const

/**
 * Token storage keys
 */
export const TokenKey = {
    ACCESS: 'auth_token',
    REFRESH: 'refresh_token',
} as const

// ============================================
// Date & Time Constants
// ============================================

/**
 * Date formats for display
 */
export const DateFormat = {
    DISPLAY: 'DD MMM YYYY', // 10 Jan 2024
    DISPLAY_WITH_TIME: 'DD MMM YYYY HH:mm', // 10 Jan 2024 14:30
    ISO: 'YYYY-MM-DD', // 2024-01-10
    ISO_WITH_TIME: 'YYYY-MM-DD HH:mm:ss', // 2024-01-10 14:30:00
    MONTH_YEAR: 'MMM YYYY', // Jan 2024
    YEAR: 'YYYY', // 2024
    SHORT: 'DD/MM/YYYY', // 10/01/2024
} as const

/**
 * Time zones
 */
export const TimeZone = {
    WIB: 'Asia/Jakarta',
    WITA: 'Asia/Makassar',
    WIT: 'Asia/Jayapura',
} as const

// ============================================
// Pagination Constants
// ============================================

/**
 * Default pagination options
 */
export const Pagination = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    MAX_PAGE_SIZE: 100,
} as const

// ============================================
// File & Upload Constants
// ============================================

/**
 * Allowed file types for upload
 */
export const FileType = {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
} as const

/**
 * File size limits (in bytes)
 */
export const FileSize = {
    KB: 1024,
    MB: 1024 * 1024,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
    MAX_EXCEL_SIZE: 5 * 1024 * 1024, // 5MB
} as const

// ============================================
// Currency & Number Constants
// ============================================

/**
 * Currency codes
 */
export const Currency = {
    IDR: 'IDR',
    USD: 'USD',
    EUR: 'EUR',
} as const

/**
 * Number formatting options
 */
export const NumberFormat = {
    DECIMAL_PLACES: 2,
    THOUSANDS_SEPARATOR: '.',
    DECIMAL_SEPARATOR: ',',
} as const

// ============================================
// Validation Constants
// ============================================

/**
 * Common validation rules
 */
export const Validation = {
    // Password
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    PASSWORD_REQUIRE_UPPERCASE: true,
    PASSWORD_REQUIRE_LOWERCASE: true,
    PASSWORD_REQUIRE_NUMBER: true,
    PASSWORD_REQUIRE_SPECIAL: true,

    // Username
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    USERNAME_PATTERN: /^[a-zA-Z0-9_]+$/,

    // Email
    EMAIL_MAX_LENGTH: 255,
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // Phone
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 15,
    PHONE_PATTERN: /^[+]?[0-9]{10,15}$/,

    // Name
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,

    // General text
    TEXT_MAX_LENGTH: 500,
    TEXTAREA_MAX_LENGTH: 5000,
} as const

// ============================================
// Application Routes
// ============================================

/**
 * Public routes (no authentication required)
 */
export const PublicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
] as const

/**
 * Protected routes (authentication required)
 */
export const ProtectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
] as const

/**
 * Role-based routes
 */
export const RoleRoutes = {
    ADMIN: ['/admin'],
    DPLK: ['/dplk'],
    COMPANY: ['/company'],
    PERSONAL: ['/personal'],
} as const

// ============================================
// Local Storage Keys
// ============================================

/**
 * Local storage keys
 */
export const StorageKey = {
    THEME: 'app_theme',
    LANGUAGE: 'app_language',
    SIDEBAR_COLLAPSED: 'sidebar_collapsed',
    RECENT_ITEMS: 'recent_items',
    FILTERS: 'filters_',
    PREFERENCES: 'user_preferences',
} as const

// ============================================
// Application Settings
// ============================================

/**
 * Application modes
 */
export const AppMode = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    STAGING: 'staging',
} as const

/**
 * Feature flags
 */
export const FeatureFlag = {
    ENABLE_REGISTRATION: true,
    ENABLE_PASSWORD_RESET: true,
    ENABLE_EMAIL_VERIFICATION: true,
    ENABLE_2FA: false,
    ENABLE_API_DOCS: true,
} as const

// ============================================
// Error Messages
// ============================================

/**
 * Common error messages
 */
export const ErrorMessage = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

// ============================================
// Success Messages
// ============================================

/**
 * Common success messages
 */
export const SuccessMessage = {
    CREATED: 'Created successfully.',
    UPDATED: 'Updated successfully.',
    DELETED: 'Deleted successfully.',
    SAVED: 'Saved successfully.',
    SENT: 'Sent successfully.',
} as const

// ============================================
// Export all constants as a single object
// ============================================

export const Constants = {
    HttpStatus,
    ApiStatus,
    UserRole,
    UserStatus,
    TokenKey,
    DateFormat,
    TimeZone,
    Pagination,
    FileType,
    FileSize,
    Currency,
    NumberFormat,
    Validation,
    PublicRoutes,
    ProtectedRoutes,
    RoleRoutes,
    StorageKey,
    AppMode,
    FeatureFlag,
    ErrorMessage,
    SuccessMessage,
} as const
