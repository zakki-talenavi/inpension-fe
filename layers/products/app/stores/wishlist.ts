import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWishlistStore = defineStore('wishlist', () => {
    // --- GLOBAL STATE ---
    // Data ini 'hidup' di level aplikasi.
    // Bisa diakses oleh Header (untuk jumlah love), ProductCard (untuk tombol love), dll.
    const itemIds = ref<string[]>([])

    // Actions
    function toggleWishlist(productId: string) {
        if (itemIds.value.includes(productId)) {
            itemIds.value = itemIds.value.filter(id => id !== productId)
        } else {
            itemIds.value.push(productId)
        }
    }

    // Getters
    const isInWishlist = computed(() => (productId: string) => itemIds.value.includes(productId))
    const count = computed(() => itemIds.value.length)

    return {
        itemIds,
        toggleWishlist,
        isInWishlist,
        count
    }
})
