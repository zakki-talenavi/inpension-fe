import { generateMock } from '@anatine/zod-mock'
import { ProductReviewSchema, CreateReviewSchema } from '../schemas/review'
import type { ProductReview, CreateReview } from '../schemas/review'

/**
 * Generate a valid ProductReview object with optional overrides
 * @param overrides - Partial ProductReview to override generated values
 * @returns A valid ProductReview object
 */
export function generateProductReview(overrides?: Partial<ProductReview>): ProductReview {
    const generated = generateMock(ProductReviewSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate an array of valid ProductReview objects
 * @param count - Number of reviews to generate
 * @returns Array of ProductReview objects
 */
export function generateProductReviews(count: number): ProductReview[] {
    return Array.from({ length: count }, () => generateProductReview())
}

/**
 * Generate a valid CreateReview object
 * @param overrides - Partial CreateReview to override
 * @returns Valid CreateReview object
 */
export function generateCreateReview(overrides?: Partial<CreateReview>): CreateReview {
    const generated = generateMock(CreateReviewSchema)
    return { ...generated, ...overrides }
}

/**
 * Generate a review with specific rating
 * @param rating - Rating value (1-5)
 * @param overrides - Additional overrides
 * @returns ProductReview with specified rating
 */
export function generateReviewWithRating(rating: number, overrides?: Partial<ProductReview>): ProductReview {
    return generateProductReview({ rating, ...overrides })
}

/**
 * Generate reviews for a specific product
 * @param productId - Product ID
 * @param count - Number of reviews to generate
 * @returns Array of reviews for the product
 */
export function generateReviewsForProduct(productId: string, count: number): ProductReview[] {
    return Array.from({ length: count }, () => generateProductReview({ productId }))
}
