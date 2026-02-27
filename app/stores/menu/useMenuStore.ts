import { defineStore } from 'pinia'

export interface MenuItem {
    id?: string
    label: string
    icon: string
    to?: string
    items?: MenuItem[]
    key?: string // For PrimeVue Tree
}

// Generate unique keys for PrimeVue Tree compatibility
const generateKeys = (items: MenuItem[], parentKey = ''): MenuItem[] => {
    return items.map((item, index) => {
        const key = parentKey ? `${parentKey}-${index}` : `${index}`
        const newItem = { ...item, key }
        if (newItem.items && newItem.items.length > 0) {
            newItem.items = generateKeys(newItem.items, key)
        }
        return newItem
    })
}

export const useMenuStore = defineStore('menu', {
    state: () => ({
        // Hardcoded initial data for now, later fetched from API
        menuItems: generateKeys([
            { label: 'Home', icon: 'pi pi-home', to: '/dashboard' },
            { label: 'Home Investpro', icon: 'pi pi-home', to: '/dashboard' },
            { label: 'Formulir Registrasi', icon: 'pi pi-id-card', to: '/dashboard' },
            {
                label: 'Persetujuan PPIP',
                icon: 'pi pi-verified',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-objects-column', to: '/dashboard' },
                    { label: 'Perusahaan', icon: 'pi pi-building', to: '/dashboard' },
                    { label: 'Individu', icon: 'pi pi-user', to: '/dashboard' },
                    { label: 'Peserta Keluar', icon: 'pi pi-user-minus', to: '/dashboard' },
                ],
            },
            {
                label: 'Persetujuan DKP',
                icon: 'pi pi-verified',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-objects-column', to: '/dashboard' },
                    { label: 'Perusahaan', icon: 'pi pi-building', to: '/dashboard' },
                ],
            },
            {
                label: 'Kepesertaan PPIP',
                icon: 'pi pi-users',
                items: [
                    { label: 'Data Peserta', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            {
                label: 'Kepesertaan DKP',
                icon: 'pi pi-th-large',
                items: [
                    { label: 'Data Peserta', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            {
                label: 'Perubahan Data',
                icon: 'pi pi-pencil',
                items: [
                    { label: 'Daftar Perubahan', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            {
                label: 'Iuran Peserta',
                icon: 'pi pi-wallet',
                items: [
                    { label: 'Daftar Iuran', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            {
                label: 'Entertainment Budget',
                icon: 'pi pi-credit-card',
                items: [
                    { label: 'Daftar Budget', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            { label: 'E Statement', icon: 'pi pi-file-edit', to: '/dashboard' },
            {
                label: 'Laporan',
                icon: 'pi pi-chart-bar',
                items: [
                    { label: 'Daftar Laporan', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            {
                label: 'Premi Asuransi',
                icon: 'pi pi-shield',
                items: [
                    { label: 'Daftar Premi', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            { label: 'APUPPT', icon: 'pi pi-file', to: '/dashboard' },
            {
                label: 'Klaim Pembayaran',
                icon: 'pi pi-money-bill',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-objects-column', to: '/dashboard' },
                    {
                        label: 'Manfaat Pensiun',
                        icon: 'pi pi-verified',
                        items: [
                            { label: 'Verifikasi Manfaat', icon: 'pi pi-check-circle', to: '/dashboard' },
                            { label: 'Jadwal Berkala', icon: 'pi pi-calendar', to: '/dashboard' },
                            { label: 'Tagihan Manfaat', icon: 'pi pi-file-check', to: '/dashboard' },
                            { label: 'Historis Pengajuan Manfaat', icon: 'pi pi-history', to: '/dashboard' },
                            { label: 'Historis Pembayaran Manfaat', icon: 'pi pi-history', to: '/dashboard' },
                        ],
                    },
                    { label: 'Pengalihan Dana', icon: 'pi pi-arrow-right-arrow-left', to: '/dashboard' },
                    { label: 'Penarikan Dana', icon: 'pi pi-download', to: '/dashboard' },
                    { label: 'Retur dan Realisasi Klaim', icon: 'pi pi-replay', to: '/dashboard' },
                ],
            },
            {
                label: 'Data Cycle',
                icon: 'pi pi-sync',
                items: [
                    { label: 'Daftar Cycle', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            {
                label: 'Arahan Investasi',
                icon: 'pi pi-chart-line',
                items: [
                    { label: 'Daftar Arahan', icon: 'pi pi-list', to: '/dashboard' },
                ],
            },
            { label: 'Pengumuman', icon: 'pi pi-megaphone', to: '/dashboard' },
            { label: 'User DPLK', icon: 'pi pi-user', to: '/dashboard' },
            { label: 'Pengaturan', icon: 'pi pi-cog', to: '/dashboard/settings/menu' },
            { label: 'Audit Log', icon: 'pi pi-history', to: '/dashboard' },
        ]) as MenuItem[],
    }),

    actions: {
        initialize() {
            if (import.meta.client) {
                const storedMenu = localStorage.getItem('inpension_menu')
                if (storedMenu) {
                    try {
                        const parsed = JSON.parse(storedMenu)
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            this.setMenuItems(parsed)
                        } else {
                            console.warn('Invalid menu format in localStorage, falling back to default.')
                            localStorage.removeItem('inpension_menu')
                        }
                    } catch (e) {
                        console.error('Failed to parse menu from local storage:', e)
                        localStorage.removeItem('inpension_menu') // Wipe corrupted data
                    }
                }

                // Subscribe to any state changes and sync back to local storage
                this.$subscribe((mutation, state) => {
                    localStorage.setItem('inpension_menu', JSON.stringify(state.menuItems))
                }, { detached: true })
            }
        },

        setMenuItems(newItems: MenuItem[]) {
            this.menuItems = generateKeys(newItems)
        },

        // Recursive function to add a new item to a specific parent node key
        addMenuItem(newItem: MenuItem, parentKey?: string) {
            if (!parentKey) {
                this.menuItems.push(newItem)
                this.setMenuItems(this.menuItems) // Regenerate keys
                return
            }

            const addToNode = (items: MenuItem[]): boolean => {
                for (const item of items) {
                    if (item.key === parentKey) {
                        if (!item.items) item.items = []
                        item.items.push(newItem)
                        return true
                    }
                    if (item.items && addToNode(item.items)) {
                        return true
                    }
                }
                return false
            }

            addToNode(this.menuItems)
            this.setMenuItems(this.menuItems) // Regenerate keys
        },

        // Recursive function to update a specific node
        updateMenuItem(keyToUpdate: string, updatedData: Partial<MenuItem>) {
            const updateNode = (items: MenuItem[]): boolean => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    if (!item) continue
                    if (item.key === keyToUpdate) {
                        Object.assign(item, updatedData)
                        return true
                    }
                    if (item.items && updateNode(item.items as MenuItem[])) {
                        return true
                    }
                }
                return false
            }

            updateNode(this.menuItems)
            this.setMenuItems(this.menuItems)
        },

        // Recursive function to delete a specific node
        deleteMenuItem(keyToDelete: string) {
            const deleteFromNode = (items: MenuItem[]): boolean => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    if (!item) continue
                    if (item.key === keyToDelete) {
                        items.splice(i, 1)
                        return true
                    }
                    if (item.items && item.items.length > 0) {
                        if (deleteFromNode(item.items as MenuItem[])) {
                            if (item.items.length === 0) {
                                delete item.items
                            }
                            return true
                        }
                    }
                }
                return false
            }

            deleteFromNode(this.menuItems)
            this.setMenuItems(this.menuItems)
        }
    },
})
