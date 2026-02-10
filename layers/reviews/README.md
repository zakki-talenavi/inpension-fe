# Reviews Layer

## Overview

The Reviews layer manages product reviews and ratings functionality including creating reviews, displaying ratings, and calculating average ratings.

## Features

- **Product Reviews**: Users can write reviews for products
- **Star Ratings**: 1-5 star rating system
- **Review Display**: Show reviews with user information
- **Average Rating**: Calculate and display average product ratings
- **Review Validation**: Zod-based validation for review content

## Dependencies

- **Shared Layer**: Uses `Product` schema from shared layer
- **Auth Layer**: Uses `User` schema for review authors

## Schemas

- `Review` - Product review with rating and content
- `Rating` - Star rating (1-5)

## Utils

- `calculations.ts` - Calculate average ratings and rating distributions

## Testing

Run tests for this layer:

```bash
# Unit tests
pnpm test:unit -- layers/reviews

# Integration tests
pnpm test:integration -- layers/reviews
```

## Usage Example

```vue
<script setup lang="ts">
import { useReviewsStore } from '#layers/reviews/app/stores/reviews/reviews'
import type { Review } from '#layers/reviews/app/schemas/review'

const reviewsStore = useReviewsStore()

async function submitReview(productId: string, rating: number, content: string) {
  await reviewsStore.createReview({ productId, rating, content })
}
</script>
```

## Review Schema

Reviews include:
- Product ID reference
- User information
- Star rating (1-5)
- Review text content
- Timestamp
- Helpful votes (optional)
