import { generateMock } from '@anatine/zod-mock'
import { CheckoutSchema, CheckoutAddressSchema, CheckoutPaymentSchema } from '../schemas/checkout'
import type { Checkout, CheckoutAddress, CheckoutPayment } from '../schemas/checkout'

/**
 * Generate a valid Checkout object with optional overrides
 * @param overrides - Partial Checkout to override generated values
 * @returns A valid Checkout object
 */
export function generateCheckout(overrides?: Partial<Checkout>): Checkout {
    const generated = generateMock(CheckoutSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate a valid CheckoutAddress object
 * @param overrides - Partial CheckoutAddress to override
 * @returns Valid CheckoutAddress object
 */
export function generateCheckoutAddress(overrides?: Partial<CheckoutAddress>): CheckoutAddress {
    const generated = generateMock(CheckoutAddressSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate a valid CheckoutPayment object
 * @param overrides - Partial CheckoutPayment to override
 * @returns Valid CheckoutPayment object
 */
export function generateCheckoutPayment(overrides?: Partial<CheckoutPayment>): CheckoutPayment {
    const generated = generateMock(CheckoutPaymentSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate a complete checkout with all required fields
 * @returns Complete Checkout object
 */
export function generateCompleteCheckout(): Checkout {
    return generateCheckout({
        shippingAddress: generateCheckoutAddress(),
        payment: generateCheckoutPayment(),
    })
}
