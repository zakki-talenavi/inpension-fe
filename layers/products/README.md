# Products Layer

## Overview

The Products layer handles all product catalog functionality including browsing, filtering, sorting, and displaying product details.

## Features

- **Product Catalog**: Display grid of products with images, prices, and ratings
- **Filtering**: Filter products by category, price range, rating, and stock availability
- **Sorting**: Sort products by name, price, or rating
- **Search**: Search products by name or description
- **Product Details**: View detailed product information

## Dependencies

- **Shared Layer**: Uses `Product` and `ProductCategory` schemas from shared layer

## Components

- `productCard.vue` - Individual product card display
- `productFilters.vue` - Filter controls for products
- `productGrid.vue` - Grid layout for product cards
- `productDetailImage.vue` - Product detail page image display
- `productDetailInfo.vue` - Product detail page information

## Store

- `useProductsStore` - Manages product catalog state, filtering, and sorting

## Schemas

- `ProductFilter` - Filter criteria for products
- `ProductSort` - Sort options for products

## Utils

- `filters.ts` - Pure functions for filtering and sorting products

## Testing

Run tests for this layer:

```bash
# Unit tests
pnpm test:unit -- layers/products

# Integration tests
pnpm test:integration -- layers/products
```

## Usage Example

```vue
<script setup lang="ts">
import { useProductsStore } from '#layers/products/app/stores/products/products'
import ProductGrid from '#layers/products/app/components/productGrid.vue'

const productsStore = useProductsStore()
</script>

<template>
  <ProductGrid />
</template>
```
