import { generateMock } from '@anatine/zod-mock'
import { ProductSchema, ProductCategorySchema } from '../schemas/product'
import type { Product, ProductCategory } from '../schemas/product'

/**
 * Generate a valid Product object with optional overrides
 * @param overrides - Partial Product to override generated values
 * @returns A valid Product object
 */
export function generateProduct(overrides?: Partial<Product>): Product {
    const generated = generateMock(ProductSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate an array of valid Product objects
 * @param count - Number of products to generate
 * @returns Array of Product objects
 */
export function generateProducts(count: number): Product[] {
    return Array.from({ length: count }, () => generateProduct())
}

/**
 * Generate a valid ProductCategory
 * @returns A valid ProductCategory enum value
 */
export function generateCategory(): ProductCategory {
    return generateMock(ProductCategorySchema)
}

/**
 * Generate a product with specific price for calculation tests
 * @param price - Price in cents
 * @param overrides - Additional overrides
 * @returns Product with specified price
 */
export function generateProductWithPrice(price: number, overrides?: Partial<Product>): Product {
    return generateProduct({ price, ...overrides })
}
