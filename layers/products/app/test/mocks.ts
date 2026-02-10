import { generateMock } from '@anatine/zod-mock'
import { ProductFilterSchema, ProductSortSchema } from '../schemas/filters'
import type { ProductFilter, ProductSort } from '../schemas/filters'

/**
 * Generate a valid ProductFilter object with optional overrides
 * @param overrides - Partial ProductFilter to override generated values
 * @returns A valid ProductFilter object
 */
export function generateFilter(overrides?: Partial<ProductFilter>): ProductFilter {
    const generated = generateMock(ProductFilterSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate a valid ProductSort value
 * @returns A valid ProductSort enum value
 */
export function generateSort(): ProductSort {
    return generateMock(ProductSortSchema)
}

/**
 * Generate an empty filter (no filtering applied)
 * @returns Empty ProductFilter object
 */
export function generateEmptyFilter(): ProductFilter {
    return {}
}

/**
 * Generate a filter with specific category
 * @param category - Category to filter by
 * @returns ProductFilter with category set
 */
export function generateCategoryFilter(category: string): ProductFilter {
    return generateFilter({ category })
}

/**
 * Generate a filter with price range
 * @param min - Minimum price in cents
 * @param max - Maximum price in cents
 * @returns ProductFilter with price range set
 */
export function generatePriceRangeFilter(min: number, max: number): ProductFilter {
    return generateFilter({ priceRange: { min, max } })
}
