// Company Profile Types
export interface CompanyProfile {
    id: string
    companyName: string
    companyCode: string
    npwp: string
    email: string
    phone: string
    address: string
    province: string
    city: string
    district: string
    postalCode: string
    industry: string
    employeeCount: number
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING_VERIFICATION'
    verifiedAt?: string
    joinDate: string
    createdAt: string
    updatedAt: string
}

// Participant Types (Company view)
export interface CompanyParticipant {
    id: string
    nik: string
    fullName: string
    email: string
    phone: string
    position: string
    joinDate: string
    salary: number
    contributionPercentage: number
    totalContribution: number
    balance: number
    status: 'ACTIVE' | 'INACTIVE'
    type: 'DKP' | 'PPIP'
}

// Contribution Types
export interface Contribution {
    id: string
    companyId: string
    period: string
    totalAmount: number
    totalParticipants: number
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'PAID'
    uploadedAt: string
    uploadedBy: string
    verifiedAt?: string
    verifiedBy?: string
    rejectionReason?: string
    items: ContributionItem[]
}

export interface ContributionItem {
    participantId: string
    participantName: string
    nik: string
    employeeContribution: number
    employerContribution: number
    totalContribution: number
}

export interface ContributionUpload {
    period: string
    file: File
}

// Claim Types (Company view)
export interface CompanyClaim {
    id: string
    participantId: string
    participantName: string
    claimType: 'RETIREMENT_BENEFIT' | 'TRANSFER_FUNDS' | 'WITHDRAWING_FUNDS'
    amount: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
    requestDate: string
    approvedDate?: string
    paidDate?: string
}

// Dashboard Stats
export interface CompanyDashboardStats {
    totalParticipants: number
    activeParticipants: number
    inactiveParticipants: number
    totalContribution: number
    monthlyContribution: number
    totalBalance: number
    pendingClaims: number
    pendingContributions: number
}

// Invoice Types
export interface CompanyInvoice {
    id: string
    invoiceNumber: string
    period: string
    dueDate: string
    totalAmount: number
    paidAmount: number
    status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE'
    items: Array<{
        description: string
        amount: number
    }>
}
