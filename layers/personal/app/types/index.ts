// Personal Profile Types
export interface PersonalProfile {
    id: string
    nik: string
    fullName: string
    email: string
    phone: string
    birthDate: string
    birthPlace: string
    gender: 'M' | 'F'
    address: string
    province: string
    city: string
    district: string
    postalCode: string
    maritalStatus: string
    employmentStatus: 'ACTIVE' | 'INACTIVE' | 'RETIRED'
    companyName?: string
    position?: string
    joinDate: string
    retirementDate?: string
    createdAt: string
    updatedAt: string
}

// Balance Types
export interface Balance {
    totalBalance: number
    employeeContribution: number
    employerContribution: number
    investmentReturn: number
    lastUpdated: string
}

export interface BalanceDetail {
    period: string
    openingBalance: number
    contribution: number
    investmentReturn: number
    withdrawal: number
    closingBalance: number
}

// Investment Types
export interface Investment {
    id: string
    packageName: string
    packageCode: string
    allocation: number
    balance: number
    units: number
    navPerUnit: number
    returnPercentage: number
    returnAmount: number
}

export interface InvestmentHistory {
    date: string
    packageName: string
    navPerUnit: number
    units: number
    balance: number
    return: number
}

// Transaction Types
export interface Transaction {
    id: string
    date: string
    type: 'CONTRIBUTION' | 'WITHDRAWAL' | 'RETURN' | 'TRANSFER'
    description: string
    amount: number
    balance: number
}

// Dashboard Stats
export interface PersonalDashboardStats {
    totalBalance: number
    monthlyContribution: number
    totalReturn: number
    returnPercentage: number
    yearsToRetirement: number
    projectedBalance: number
}

// Claim Types (Personal view)
export interface PersonalClaim {
    id: string
    claimType: 'RETIREMENT_BENEFIT' | 'TRANSFER_FUNDS' | 'WITHDRAWING_FUNDS'
    amount: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID'
    requestDate: string
    approvedDate?: string
    paidDate?: string
    rejectionReason?: string
}

export interface ClaimRequest {
    claimType: 'RETIREMENT_BENEFIT' | 'TRANSFER_FUNDS' | 'WITHDRAWING_FUNDS'
    amount: number
    reason: string
    bankAccount: string
    bankName: string
    documents: File[]
}
