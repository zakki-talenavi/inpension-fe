/**
 * API Types
 * 
 * Common types used for API requests and responses
 */

// ============================================
// Base API Types
// ============================================

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = unknown> {
    data: T
    message?: string
    success?: boolean
    meta?: ResponseMeta
}

/**
 * Response metadata (pagination, etc.)
 */
export interface ResponseMeta {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    hasNext?: boolean
    hasPrevious?: boolean
}

/**
 * Paginated API Response
 */
export interface PaginatedApiResponse<T = unknown> extends ApiResponse<T[]> {
    meta: ResponseMeta & {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrevious: boolean
    }
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
    message: string
    errors?: Record<string, string[]>
    code?: string
    status?: number
    stack?: string // Only in development
}

// ============================================
// Request Types
// ============================================

/**
 * Pagination request parameters
 */
export interface PaginationParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

/**
 * Search request parameters
 */
export interface SearchParams extends PaginationParams {
    search?: string
    filters?: Record<string, any>
}

/**
 * ID-based request parameters
 */
export interface IdParams {
    id: string
}

// ============================================
// Auth API Types
// ============================================

/**
 * Login request
 */
export interface LoginRequest {
    username: string
    password: string
    rememberMe?: boolean
}

/**
 * Login response
 */
export interface LoginResponse {
    user: User
    accessToken: string
    refreshToken: string
    expiresIn: number
}

/**
 * Register request
 */
export interface RegisterRequest {
    username: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
    refreshToken: string
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
    accessToken: string
    refreshToken: string
    expiresIn: number
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
    email: string
}

/**
 * Reset password request
 */
export interface ResetPasswordRequest {
    token: string
    password: string
    passwordConfirmation: string
}

/**
 * Change password request
 */
export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
    newPasswordConfirmation: string
}

// ============================================
// User API Types
// ============================================

/**
 * User data
 */
export interface User {
    id: string
    username: string
    email: string
    fullName: string
    phoneNumber?: string
    avatar?: string
    role: UserRole
    status: UserStatus
    permissions?: string[]
    emailVerified?: boolean
    lastLoginAt?: string
    createdAt: string
    updatedAt: string
}

/**
 * User roles
 */
export type UserRole = 'ADMINISTRATOR' | 'DPLK' | 'COMPANY' | 'PERSONAL'

/**
 * User status
 */
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'

/**
 * Create user request
 */
export interface CreateUserRequest {
    username: string
    email: string
    password: string
    fullName: string
    role: UserRole
    phoneNumber?: string
}

/**
 * Update user request
 */
export interface UpdateUserRequest {
    email?: string
    fullName?: string
    phoneNumber?: string
    role?: UserRole
    status?: UserStatus
}

/**
 * Update profile request
 */
export interface UpdateProfileRequest {
    fullName?: string
    phoneNumber?: string
    avatar?: string
}

// ============================================
// File Upload Types
// ============================================

/**
 * File upload response
 */
export interface FileUploadResponse {
    file: UploadedFile
}

/**
 * Uploaded file data
 */
export interface UploadedFile {
    id: string
    name: string
    originalName: string
    mimeType: string
    size: number
    url: string
    path: string
    createdAt: string
}

/**
 * Multiple file upload response
 */
export interface MultipleFileUploadResponse {
    files: UploadedFile[]
}

// ============================================
// Common Entity Types
// ============================================

/**
 * Company data
 */
export interface Company {
    id: string
    companyName: string
    companyCode: string
    npwp: string
    email: string
    phoneNumber?: string
    address?: string
    logo?: string
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
    updatedAt: string
}

/**
 * Investment package data
 */
export interface InvestmentPackage {
    id: string
    packageName: string
    packageCode: string
    description: string
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    minAllocation: number
    maxAllocation: number
    expectedReturn: number
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
    updatedAt: string
}

/**
 * Bank data
 */
export interface Bank {
    id: string
    bankName: string
    bankCode: string
    swiftCode: string
    logo?: string
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
    updatedAt: string
}

// ============================================
// Dashboard Types
// ============================================

/**
 * Dashboard statistics
 */
export interface DashboardStats {
    totalUsers: number
    activeUsers: number
    totalCompanies: number
    totalParticipants: number
    totalAUM: number
    pendingVerifications: number
    recentActivity?: ActivityLog[]
}

/**
 * Activity log
 */
export interface ActivityLog {
    id: string
    userId: string
    userName: string
    action: string
    module: string
    description: string
    ipAddress?: string
    userAgent?: string
    createdAt: string
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
    label: string
    value: number
}

/**
 * Time series data
 */
export interface TimeSeriesData {
    period: string
    value: number
}

// ============================================
// Audit Log Types
// ============================================

/**
 * Audit log entry
 */
export interface AuditLog {
    id: string
    userId: string
    userName: string
    action: string
    module: string
    description: string
    ipAddress?: string
    userAgent?: string
    changes?: Record<string, { from: any; to: any }>
    createdAt: string
}

/**
 * Audit log filters
 */
export interface AuditLogFilters extends PaginationParams {
    userId?: string
    action?: string
    module?: string
    startDate?: string
    endDate?: string
}

// ============================================
// Notification Types
// ============================================

/**
 * Notification data
 */
export interface Notification {
    id: string
    userId: string
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    read: boolean
    actionUrl?: string
    createdAt: string
}

/**
 * Mark notification read request
 */
export interface MarkNotificationReadRequest {
    notificationIds: string[]
    read: boolean
}

// ============================================
// Settings Types
// ============================================

/**
 * User settings
 */
export interface UserSettings {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
    notifications: {
        email: boolean
        push: boolean
        sms: boolean
    }
    dateFormat: string
    timeFormat: '12h' | '24h'
}

/**
 * Update settings request
 */
export interface UpdateSettingsRequest {
    theme?: 'light' | 'dark' | 'auto'
    language?: string
    timezone?: string
    notifications?: {
        email?: boolean
        push?: boolean
        sms?: boolean
    }
    dateFormat?: string
    timeFormat?: '12h' | '24h'
}

// ============================================
// Export all API types
// ============================================

// All types are already exported above
// This file serves as a central location for API-related types
// Import individual types as needed:
// import type { User, LoginRequest, ApiResponse } from '~/types/api'
