import { generateMock } from '@anatine/zod-mock'
import { CartItemSchema } from '../schemas/cart'
import type { CartItem } from '../schemas/cart'
import { generateProduct } from '#layers/shared/app/test/mocks'

/**
 * Generate a valid CartItem object with optional overrides
 * @param overrides - Partial CartItem to override generated values
 * @returns A valid CartItem object
 */
export function generateCartItem(overrides?: Partial<CartItem>): CartItem {
    const generated = generateMock(CartItemSchema)
    // Ensure we have a valid product
    if (!overrides?.product) {
        generated.product = generateProduct()
    }
    return { ...generated, ...overrides }
}

/**
 * Generate an array of valid CartItem objects
 * @param count - Number of cart items to generate
 * @returns Array of CartItem objects
 */
export function generateCartItems(count: number): CartItem[] {
    return Array.from({ length: count }, () => generateCartItem())
}

/**
 * Generate a cart item with specific price and quantity for calculation tests
 * @param price - Price in cents
 * @param quantity - Item quantity
 * @returns CartItem with specified price and quantity
 */
export function generateCartItemWithPrice(price: number, quantity: number): CartItem {
    return generateCartItem({
        product: generateProduct({ price }),
        quantity,
    })
}

/**
 * Generate a cart item for a specific product
 * @param productId - Product ID
 * @param quantity - Item quantity
 * @returns CartItem for the specified product
 */
export function generateCartItemForProduct(productId: string, quantity = 1): CartItem {
    return generateCartItem({
        product: generateProduct({ id: productId }),
        quantity,
    })
}
