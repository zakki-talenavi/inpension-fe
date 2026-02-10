/**
 * Domain Model Types
 * 
 * Core domain entities used throughout the application
 * These represent the business domain models
 */

// Re-export common types from API types
export type { User, UserStatus } from './api'
export type { Company, InvestmentPackage, Bank } from './api'
export type { DashboardStats, ActivityLog } from './api'
export type { Notification } from './api'
export type { AuditLog } from './api'

// Import UserRole type for use in models
import type { UserRole } from './api'

// Re-export UserRole as a type
export type { UserRole } from './api'

// ============================================
// Participant Models (DPLK)
// ============================================

/**
 * Participant data
 */
export interface Participant {
    id: string
    userId: string
    participantNumber: string
    fullName: string
    dateOfBirth: string
    gender: 'MALE' | 'FEMALE'
    phoneNumber: string
    email: string
    address: string
    city: string
    province: string
    postalCode: string
    npwp: string
    ktp: string
    companyId: string
    companyName: string
    employmentDate: string
    salary: number
    status: ParticipantStatus
    balance: number
    createdAt: string
    updatedAt: string
}

/**
 * Participant status
 */
export type ParticipantStatus =
    | 'ACTIVE'
    | 'INACTIVE'
    | 'PENDING_VERIFICATION'
    | 'VERIFIED'
    | 'SUSPENDED'

/**
 * Participant contribution
 */
export interface Contribution {
    id: string
    participantId: string
    participantNumber: string
    companyId: string
    amount: number
    contributionDate: string
    type: 'EMPLOYEE' | 'EMPLOYER'
    status: 'PENDING' | 'CONFIRMED' | 'FAILED'
    proofUrl?: string
    createdAt: string
    updatedAt: string
}

/**
 * Contribution upload
 */
export interface ContributionUpload {
    file: File
    companyId: string
    contributionMonth: string
    recordCount: number
    totalAmount: number
}

// ============================================
// Claim Models
// ============================================

/**
 * Claim request
 */
export interface Claim {
    id: string
    participantId: string
    participantNumber: string
    userId: string
    claimType: ClaimType
    amount: number
    reason: string
    status: ClaimStatus
    submittedDate: string
    reviewedDate?: string
    approvedDate?: string
    rejectedDate?: string
    rejectedReason?: string
    reviewedBy?: string
    attachments: ClaimAttachment[]
    createdAt: string
    updatedAt: string
}

/**
 * Claim types
 */
export type ClaimType =
    | 'FULL'
    | 'PARTIAL'
    | 'EARLY'
    | 'DISABILITY'
    | 'DEATH'

/**
 * Claim status
 */
export type ClaimStatus =
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'APPROVED'
    | 'REJECTED'
    | 'DISBURSED'
    | 'CANCELLED'

/**
 * Claim attachment
 */
export interface ClaimAttachment {
    id: string
    claimId: string
    fileName: string
    fileUrl: string
    fileType: string
    fileSize: number
    uploadedAt: string
}

// ============================================
// Investment Models
// ============================================

/**
 * Investment allocation
 */
export interface InvestmentAllocation {
    id: string
    participantId: string
    packageId: string
    packageName: string
    percentage: number
    amount: number
    currentValue: number
    profit: number
    createdAt: string
    updatedAt: string
}

/**
 * Investment transaction
 */
export interface InvestmentTransaction {
    id: string
    participantId: string
    packageId: string
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'REBALANCE'
    amount: number
    balanceBefore: number
    balanceAfter: number
    description: string
    createdAt: string
}

// ============================================
// Invoice Models
// ============================================

/**
 * Invoice
 */
export interface Invoice {
    id: string
    invoiceNumber: string
    companyId: string
    companyName: string
    participantId?: string
    participantNumber?: string
    type: InvoiceType
    amount: number
    tax: number
    totalAmount: number
    dueDate: string
    status: InvoiceStatus
    paidDate?: string
    paidAmount?: number
    paymentMethod?: string
    notes?: string
    createdAt: string
    updatedAt: string
}

/**
 * Invoice types
 */
export type InvoiceType =
    | 'CONTRIBUTION'
    | 'FEE'
    | 'PENALTY'
    | 'REFUND'

/**
 * Invoice status
 */
export type InvoiceStatus =
    | 'DRAFT'
    | 'SENT'
    | 'PAID'
    | 'OVERDUE'
    | 'CANCELLED'

// ============================================
// Report Models
// ============================================

/**
 * Report type
 */
export type ReportType =
    | 'PARTICIPANT'
    | 'CONTRIBUTION'
    | 'CLAIM'
    | 'INVESTMENT'
    | 'INVOICE'

/**
 * Report format
 */
export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV'

/**
 * Report request
 */
export interface ReportRequest {
    type: ReportType
    format: ReportFormat
    startDate?: string
    endDate?: string
    filters?: Record<string, any>
}

/**
 * Report data
 */
export interface Report {
    id: string
    reportType: ReportType
    format: ReportFormat
    fileName: string
    fileUrl: string
    generatedBy: string
    status: 'GENERATING' | 'COMPLETED' | 'FAILED'
    errorMessage?: string
    createdAt: string
    completedAt?: string
}

// ============================================
// Balance Models
// ============================================

/**
 * Account balance
 */
export interface AccountBalance {
    participantId: string
    participantNumber: string
    totalBalance: number
    employeeContribution: number
    employerContribution: number
    investmentProfit: number
    pendingWithdrawal: number
    availableBalance: number
    lastUpdated: string
}

/**
 * Balance history
 */
export interface BalanceHistory {
    id: string
    participantId: string
    balance: number
    change: number
    changeType: 'CONTRIBUTION' | 'WITHDRAWAL' | 'PROFIT' | 'FEE'
    description: string
    createdAt: string
}

// ============================================
// Menu & Navigation Models
// ============================================

/**
 * Menu item
 */
export interface MenuItem {
    id: string
    label: string
    icon?: string
    to?: string
    externalUrl?: string
    badge?: string | number
    children?: MenuItem[]
    permissions?: string[]
    roles?: UserRole[]
    visible: boolean
    order: number
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
    label: string
    to?: string
    disabled?: boolean
}

// ============================================
// Form Models
// ============================================

/**
 * Form field
 */
export interface FormField {
    name: string
    label: string
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'
    placeholder?: string
    required?: boolean
    disabled?: boolean
    readonly?: boolean
    options?: SelectOption[]
    validation?: ValidationRule[]
    defaultValue?: any
}

/**
 * Select option
 */
export interface SelectOption {
    label: string
    value: any
    disabled?: boolean
}

/**
 * Validation rule
 */
export interface ValidationRule {
    type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
    value?: any
    message: string
}

/**
 * Form configuration
 */
export interface FormConfig {
    fields: FormField[]
    submitLabel?: string
    cancelLabel?: string
    showCancel?: boolean
}

// ============================================
// Table Models
// ============================================

/**
 * Table column
 */
export interface TableColumn {
    field: string
    header: string
    sortable?: boolean
    filterable?: boolean
    width?: string | number
    align?: 'left' | 'center' | 'right'
    render?: (value: any, row: any) => any
}

/**
 * Table action
 */
export interface TableAction {
    label: string
    icon?: string
    type: 'button' | 'dropdown'
    onClick: (row: any) => void
    show?: (row: any) => boolean
    disabled?: (row: any) => boolean
    severity?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning'
}

/**
 * Table configuration
 */
export interface TableConfig {
    columns: TableColumn[]
    actions?: TableAction[]
    selectable?: boolean
    pagination?: boolean
    pageSize?: number
    showIndex?: boolean
}

// ============================================
// Filter Models
// ============================================

/**
 * Filter option
 */
export interface FilterOption {
    label: string
    value: any
}

/**
 * Filter configuration
 */
export interface FilterConfig {
    field: string
    label: string
    type: 'text' | 'select' | 'date' | 'dateRange' | 'number'
    options?: FilterOption[]
    placeholder?: string
}

// ============================================
// Export all model types
// ============================================

// All types are already exported above
// Import individual types as needed:
// import type { Participant, Claim, Contribution } from '~/types/models'
