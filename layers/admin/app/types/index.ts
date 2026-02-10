// User Types
export interface User {
    id: string
    username: string
    email: string
    fullName: string
    role: 'ADMINISTRATOR' | 'DPLK' | 'COMPANY' | 'PERSONAL'
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
    lastLogin?: string
    createdAt: string
    updatedAt: string
}

export interface UserCreate {
    username: string
    email: string
    fullName: string
    password: string
    role: string
}

export interface UserUpdate {
    email?: string
    fullName?: string
    role?: string
    status?: string
}

// Master Data Types
export interface Company {
    id: string
    companyName: string
    companyCode: string
    npwp: string
    email: string
    phone: string
    address: string
    status: 'ACTIVE' | 'INACTIVE'
    createdAt: string
}

export interface InvestmentPackage {
    id: string
    packageName: string
    packageCode: string
    description: string
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    minAllocation: number
    maxAllocation: number
    status: 'ACTIVE' | 'INACTIVE'
}

export interface Bank {
    id: string
    bankName: string
    bankCode: string
    swiftCode: string
    status: 'ACTIVE' | 'INACTIVE'
}

// Dashboard Stats
export interface AdminDashboardStats {
    totalUsers: number
    activeUsers: number
    totalCompanies: number
    totalParticipants: number
    totalAUM: number
    pendingVerifications: number
}

// Audit Log
export interface AuditLog {
    id: string
    userId: string
    userName: string
    action: string
    module: string
    description: string
    ipAddress: string
    timestamp: string
}
