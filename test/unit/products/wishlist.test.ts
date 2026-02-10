import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWishlistStore } from '#layers/products/app/stores/wishlist'

describe('Wishlist Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have empty wishlist initially', () => {
      const store = useWishlistStore()
      
      expect(store.itemIds).toEqual([])
      expect(store.count).toBe(0)
    })

    it('should not have items in wishlist initially', () => {
      const store = useWishlistStore()
      
      expect(store.isInWishlist('product-1')).toBe(false)
    })
  })

  describe('toggleWishlist', () => {
    it('should add product to wishlist', () => {
      const store = useWishlistStore()
      
      store.toggleWishlist('product-1')
      
      expect(store.itemIds).toContain('product-1')
      expect(store.count).toBe(1)
      expect(store.isInWishlist('product-1')).toBe(true)
    })

    it('should remove product from wishlist', () => {
      const store = useWishlistStore()
      
      store.toggleWishlist('product-1')
      expect(store.isInWishlist('product-1')).toBe(true)
      
      store.toggleWishlist('product-1')
      expect(store.isInWishlist('product-1')).toBe(false)
      expect(store.count).toBe(0)
    })

    it('should handle multiple products', () => {
      const store = useWishlistStore()
      
      store.toggleWishlist('product-1')
      store.toggleWishlist('product-2')
      store.toggleWishlist('product-3')
      
      expect(store.count).toBe(3)
      expect(store.isInWishlist('product-1')).toBe(true)
      expect(store.isInWishlist('product-2')).toBe(true)
      expect(store.isInWishlist('product-3')).toBe(true)
    })

    it('should not duplicate items', () => {
      const store = useWishlistStore()
      
      store.toggleWishlist('product-1')
      store.toggleWishlist('product-1')
      store.toggleWishlist('product-1')
      
      expect(store.count).toBe(1)
      expect(store.itemIds).toEqual(['product-1'])
    })
  })

  describe('isInWishlist', () => {
    it('should return true for existing items', () => {
      const store = useWishlistStore()
      
      store.toggleWishlist('product-1')
      
      expect(store.isInWishlist('product-1')).toBe(true)
    })

    it('should return false for non-existing items', () => {
      const store = useWishlistStore()
      
      store.toggleWishlist('product-1')
      
      expect(store.isInWishlist('product-2')).toBe(false)
    })
  })

  describe('count', () => {
    it('should reflect correct number of items', () => {
      const store = useWishlistStore()
      
      expect(store.count).toBe(0)
      
      store.toggleWishlist('product-1')
      expect(store.count).toBe(1)
      
      store.toggleWishlist('product-2')
      expect(store.count).toBe(2)
      
      store.toggleWishlist('product-1')
      expect(store.count).toBe(1)
    })
  })
})
