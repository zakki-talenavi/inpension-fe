# Cart Layer

## Overview

The Cart layer manages shopping cart functionality including adding/removing items, quantity management, and cart persistence.

## Features

- **Add to Cart**: Add products to shopping cart
- **Remove from Cart**: Remove items from cart
- **Quantity Management**: Increase/decrease item quantities
- **Cart Persistence**: Save cart to localStorage
- **Cart Calculations**: Calculate subtotals, totals, and item counts

## Dependencies

- **Shared Layer**: Uses `Product` schema from shared layer
- **Shared Utils**: Uses `formatCurrency` and storage utilities

## Components

- `cartItem.vue` - Individual cart item display with quantity controls
- `cartList.vue` - List of all cart items
- `cartSummary.vue` - Cart totals and summary

## Pages

- `shoppingCart.vue` - Shopping cart page

## Store

- `useCartStore` - Manages cart state with localStorage persistence

## Schemas

- `CartItem` - Cart item with product reference and quantity

## Utils

- `calculations.ts` - Pure functions for cart calculations (subtotal, total, etc.)

## Testing

Run tests for this layer:

```bash
# Unit tests
pnpm test:unit -- layers/cart

# Integration tests
pnpm test:integration -- layers/cart
```

## Usage Example

```vue
<script setup lang="ts">
import { useCartStore } from '#layers/cart/app/stores/cart/cart'
import type { Product } from '#layers/shared/app/schemas/product'

const cartStore = useCartStore()

function addToCart(product: Product) {
  cartStore.addItem(product)
}
</script>
```
