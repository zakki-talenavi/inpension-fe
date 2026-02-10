import { defineStore } from 'pinia'
import { balanceService } from '#layers/personal/services/balance.service'
import type { Balance, BalanceDetail, Transaction } from '#layers/personal/app/types'

interface BalanceState {
    balance: Balance | null
    history: BalanceDetail[]
    transactions: Transaction[]
    loading: boolean
    error: string | null
}

export const useBalanceStore = defineStore('personal-balance', {
    state: (): BalanceState => ({
        balance: null,
        history: [],
        transactions: [],
        loading: false,
        error: null
    }),

    getters: {
        totalContribution: (state) => {
            if (!state.balance) return 0
            return state.balance.employeeContribution + state.balance.employerContribution
        },

        returnPercentage: (state) => {
            if (!state.balance || state.balance.totalBalance === 0) return 0
            return (state.balance.investmentReturn / state.balance.totalBalance) * 100
        }
    },

    actions: {
        async fetchBalance() {
            this.loading = true
            this.error = null

            try {
                this.balance = await balanceService.getBalance()
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil saldo'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchHistory(year?: number) {
            this.loading = true
            this.error = null

            try {
                this.history = await balanceService.getBalanceHistory(year)
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil riwayat saldo'
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchTransactions(filters?: any) {
            this.loading = true
            this.error = null

            try {
                this.transactions = await balanceService.getTransactions(filters)
            } catch (error: any) {
                this.error = error.message || 'Gagal mengambil transaksi'
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
