// Participant Types
export interface Participant {
    id: string
    nik: string
    fullName: string
    email: string
    phone: string
    birthDate: string
    gender: 'M' | 'F'
    address: string
    type: 'PERSONAL' | 'COMPANY'
    status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE'
    registrationDate: string
    verifiedAt?: string
    verifiedBy?: string
    companyId?: string
    companyName?: string
    createdAt: string
    updatedAt: string
}

export interface ParticipantRegistrationPersonal {
    identity: {
        nik: string
        fullName: string
        birthDate: string
        birthPlace: string
        gender: 'M' | 'F'
        email: string
        phone: string
        address: string
        province: string
        city: string
        district: string
        postalCode: string
    }
    funds: {
        initialDeposit: number
        monthlyContribution: number
        paymentMethod: string
        bankAccount: string
        bankName: string
    }
    investment: {
        investmentProfile: string
        riskTolerance: string
        investmentGoal: string
        investmentPackage: string
    }
    heir: {
        heirs: Array<{
            name: string
            relationship: string
            birthDate: string
            percentage: number
            phone: string
            address: string
        }>
    }
    privacy: {
        agreedToPrivacy: boolean
        agreedToDataSharing: boolean
    }
    terms: {
        agreedToTerms: boolean
        signature: string
        signedAt: string
    }
    documents: {
        ktp: File | null
        npwp: File | null
        familyCard: File | null
        bankStatement: File | null
    }
}

export interface ParticipantRegistrationCompany {
    companyId: string
    participants: Array<{
        nik: string
        fullName: string
        email: string
        phone: string
        birthDate: string
        gender: 'M' | 'F'
        position: string
        joinDate: string
        salary: number
        contributionPercentage: number
    }>
}

export interface ParticipantVerification {
    participantId: string
    verificationType: 'PPIP' | 'DKP'
    status: 'APPROVED' | 'REJECTED'
    notes: string
    verifiedBy: string
    verifiedAt: string
    documents: Array<{
        type: string
        url: string
        status: 'APPROVED' | 'REJECTED'
    }>
}

// Claim Types
export interface Claim {
    id: string
    participantId: string
    participantName: string
    claimType: 'RETIREMENT_BENEFIT' | 'TRANSFER_FUNDS' | 'WITHDRAWING_FUNDS'
    amount: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
    requestDate: string
    approvedDate?: string
    paidDate?: string
    approvedBy?: string
    rejectionReason?: string
    documents: Array<{
        type: string
        url: string
    }>
    createdAt: string
    updatedAt: string
}

export interface ClaimRequest {
    participantId: string
    claimType: 'RETIREMENT_BENEFIT' | 'TRANSFER_FUNDS' | 'WITHDRAWING_FUNDS'
    amount: number
    reason: string
    bankAccount: string
    bankName: string
    documents: File[]
}

// Invoice Types
export interface Invoice {
    id: string
    invoiceNumber: string
    companyId: string
    companyName: string
    period: string
    dueDate: string
    totalAmount: number
    paidAmount: number
    status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'OVERDUE'
    items: Array<{
        description: string
        quantity: number
        unitPrice: number
        amount: number
    }>
    createdAt: string
    updatedAt: string
}

// Dashboard Types
export interface DashboardStats {
    totalParticipants: number
    activeParticipants: number
    pendingVerification: number
    totalClaims: number
    pendingClaims: number
    totalInvoices: number
    unpaidInvoices: number
    totalAUM: number
}

// Report Types
export interface Report {
    id: string
    name: string
    type: string
    period: string
    generatedAt: string
    generatedBy: string
    fileUrl: string
    status: 'GENERATING' | 'COMPLETED' | 'FAILED'
}
