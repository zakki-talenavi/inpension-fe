import { z } from 'zod'

export const ProductReviewSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  userName: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  comment: z.string().min(10).max(1000),
  helpful: z.number().default(0),
  verified: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateReviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  comment: z.string().min(10).max(1000),
})

export type ProductReview = z.infer<typeof ProductReviewSchema>
export type CreateReview = z.infer<typeof CreateReviewSchema>
