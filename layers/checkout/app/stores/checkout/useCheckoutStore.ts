import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'
import type { Checkout, CheckoutAddress, CheckoutPayment } from '#layers/checkout/app/schemas/checkout'
import { CheckoutSchema } from '#layers/checkout/app/schemas/checkout'
import { useCartStore } from '#layers/cart/app/stores/cart/useCartStore'

export const useCheckoutStore = defineStore('checkout', () => {
  const config = useRuntimeConfig()
  const cartStore = useCartStore()

  const shippingAddress = ref<Partial<CheckoutAddress>>({})
  const billingAddress = ref<Partial<CheckoutAddress>>({})
  const payment = ref<Partial<CheckoutPayment>>({})
  const sameAsBilling = ref(true)
  const notes = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentStep = ref(1)
  const orderCompleted = ref(false)

  const canProceedToPayment = computed(() => {
    const result = CheckoutAddressSchema.safeParse(shippingAddress.value)
    return result.success
  })

  const canCompleteOrder = computed(() => {
    if (!canProceedToPayment.value) return false
    
    const paymentResult = CheckoutPaymentSchema.safeParse(payment.value)
    return paymentResult.success
  })

  const shippingCost = computed(() => {
    const subtotal = cartStore.subtotal
    return subtotal >= 5000 ? 0 : 999
  })

  const tax = computed(() => {
    return Math.round(cartStore.subtotal * 0.1)
  })

  const total = computed(() => {
    return cartStore.subtotal + shippingCost.value + tax.value
  })

  function setShippingAddress(address: CheckoutAddress) {
    const result = CheckoutAddressSchema.safeParse(address)
    if (result.success) {
      shippingAddress.value = result.data
      error.value = null
      if (sameAsBilling.value) {
        billingAddress.value = result.data
      }
    } else {
      error.value = result.error.issues[0].message
    }
  }

  function setBillingAddress(address: CheckoutAddress) {
    const result = CheckoutAddressSchema.safeParse(address)
    if (result.success) {
      billingAddress.value = result.data
      error.value = null
    } else {
      error.value = result.error.issues[0].message
    }
  }

  function setPayment(paymentInfo: CheckoutPayment) {
    const result = CheckoutPaymentSchema.safeParse(paymentInfo)
    if (result.success) {
      payment.value = result.data
      error.value = null
    } else {
      error.value = result.error.issues[0].message
    }
  }

  function setSameAsBilling(value: boolean) {
    sameAsBilling.value = value
    if (value) {
      billingAddress.value = shippingAddress.value
    }
  }

  function setStep(step: number) {
    currentStep.value = step
  }

  function nextStep() {
    if (currentStep.value === 1 && canProceedToPayment.value) {
      currentStep.value = 2
    } else if (currentStep.value === 2 && canCompleteOrder.value) {
      currentStep.value = 3
    }
  }

  function previousStep() {
    if (currentStep.value > 1) {
      currentStep.value -= 1
    }
  }

  async function completeOrder() {
    if (!canCompleteOrder.value) {
      error.value = 'Please complete all required fields'
      return false
    }

    isLoading.value = true
    error.value = null

    try {
      const checkoutData: Checkout = {
        shippingAddress: shippingAddress.value as CheckoutAddress,
        billingAddress: sameAsBilling.value ? undefined : billingAddress.value as CheckoutAddress,
        sameAsBilling: sameAsBilling.value,
        payment: payment.value as CheckoutPayment,
        notes: notes.value || undefined,
      }

      const result = CheckoutSchema.safeParse(checkoutData)
      if (!result.success) {
        error.value = result.error.issues[0].message
        return false
      }

      const response = await $fetch(`${config.public.apiBaseUrl}/orders`, {
        method: 'POST',
        body: {
          checkout: result.data,
          items: cartStore.items,
          subtotal: cartStore.subtotal,
          shipping: shippingCost.value,
          tax: tax.value,
          total: total.value,
        },
      })

      cartStore.clearCart()
      orderCompleted.value = true
      currentStep.value = 4

      return true
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Order failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function resetCheckout() {
    shippingAddress.value = {}
    billingAddress.value = {}
    payment.value = {}
    sameAsBilling.value = true
    notes.value = ''
    currentStep.value = 1
    orderCompleted.value = false
    error.value = null
  }

  return {
    shippingAddress,
    billingAddress,
    payment,
    sameAsBilling,
    notes,
    isLoading,
    error,
    currentStep,
    orderCompleted,
    canProceedToPayment,
    canCompleteOrder,
    shippingCost,
    tax,
    total,
    setShippingAddress,
    setBillingAddress,
    setPayment,
    setSameAsBilling,
    setStep,
    nextStep,
    previousStep,
    completeOrder,
    resetCheckout,
  }
})
