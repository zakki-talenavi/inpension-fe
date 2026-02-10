// Common API Response Types
export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// Common Domain Types
export interface Address {
    street: string
    province: string
    city: string
    district: string
    postalCode: string
}

export interface BankAccount {
    bankName: string
    bankCode: string
    accountNumber: string
    accountName: string
}

export interface Document {
    id: string
    fileName: string
    fileType: string
    fileSize: number
    fileUrl: string
    uploadedAt: string
}

// Filter & Pagination Types
export interface FilterOptions {
    search?: string
    status?: string
    startDate?: string
    endDate?: string
}

export interface PaginationOptions {
    page: number
    pageSize: number
}

// Notification Types
export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error'

export interface NotificationOptions {
    severity: NotificationSeverity
    summary: string
    detail: string
    life?: number
}
