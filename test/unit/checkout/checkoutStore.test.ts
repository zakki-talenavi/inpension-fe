import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCheckoutStore } from '#layers/checkout/app/stores/checkout/useCheckoutStore'
import { useCartStore } from '#layers/cart/app/stores/cart/useCartStore'

describe('Checkout Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const cartStore = useCartStore()
    cartStore.items = [
      {
        product: {
          id: '1',
          name: 'Test Product',
          description: 'Test',
          price: 10000,
          category: 'electronics',
          image: '/test.jpg',
          stock: 10,
        },
        quantity: 2,
      },
    ]
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useCheckoutStore()
      
      expect(store.currentStep).toBe(1)
      expect(store.sameAsBilling).toBe(true)
      expect(store.isLoading).toBe(false)
      expect(store.orderCompleted).toBe(false)
    })
  })

  describe('shipping address', () => {
    it('should set valid shipping address', () => {
      const store = useCheckoutStore()
      
      store.setShippingAddress({
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA',
        phone: '1234567890',
      })

      expect(store.error).toBeNull()
      expect(store.canProceedToPayment).toBe(true)
    })

    it('should reject invalid shipping address', () => {
      const store = useCheckoutStore()
      
      store.setShippingAddress({
        firstName: 'J',
        lastName: 'Doe',
        address: '123',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA',
        phone: '123',
      })

      expect(store.error).not.toBeNull()
    })
  })

  describe('payment', () => {
    it('should set valid payment info', () => {
      const store = useCheckoutStore()
      
      store.setPayment({
        cardNumber: '1234567890123456',
        cardName: 'John Doe',
        expiryDate: '12/25',
        cvv: '123',
      })

      expect(store.error).toBeNull()
    })

    it('should reject invalid payment info', () => {
      const store = useCheckoutStore()
      
      store.setPayment({
        cardNumber: '123',
        cardName: 'John',
        expiryDate: '13/25',
        cvv: '12',
      })

      expect(store.error).not.toBeNull()
    })
  })

  describe('order totals', () => {
    it('should calculate shipping cost correctly', () => {
      const store = useCheckoutStore()
      const cartStore = useCartStore()
      
      cartStore.items = [{
        product: {
          id: '1',
          name: 'Test',
          description: 'Test',
          price: 10000,
          category: 'electronics',
          image: '/test.jpg',
          stock: 10,
        },
        quantity: 1,
      }]

      expect(store.shippingCost).toBe(999)
    })

    it('should offer free shipping for orders over $50', () => {
      const store = useCheckoutStore()
      const cartStore = useCartStore()
      
      cartStore.items = [{
        product: {
          id: '1',
          name: 'Test',
          description: 'Test',
          price: 10000,
          category: 'electronics',
          image: '/test.jpg',
          stock: 10,
        },
        quantity: 10,
      }]

      expect(store.shippingCost).toBe(0)
    })
  })

  describe('navigation', () => {
    it('should move to next step when valid', () => {
      const store = useCheckoutStore()
      
      store.setShippingAddress({
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA',
        phone: '1234567890',
      })

      store.nextStep()
      
      expect(store.currentStep).toBe(2)
    })

    it('should not move to next step when invalid', () => {
      const store = useCheckoutStore()
      
      store.nextStep()
      
      expect(store.currentStep).toBe(1)
    })

    it('should move to previous step', () => {
      const store = useCheckoutStore()
      
      store.currentStep = 3
      store.previousStep()
      
      expect(store.currentStep).toBe(2)
    })
  })
})
