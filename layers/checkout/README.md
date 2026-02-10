# Checkout Layer

## Overview

The Checkout layer manages the multi-step checkout process including shipping address, payment method, and order confirmation.

## Features

- **Multi-Step Form**: Step-by-step checkout flow
- **Shipping Address**: Collect and validate shipping information
- **Payment Method**: Payment information collection
- **Order Summary**: Review order before confirmation
- **Form Validation**: Zod-based validation for all checkout fields

## Dependencies

- **Shared Layer**: Uses shared utilities
- **Cart Layer**: Integrates with cart for order items
- **Auth Layer**: Requires authenticated user

## Pages

- `checkout.vue` - Main checkout page with multi-step form

## Store

- `useCheckoutStore` - Manages checkout form state and validation

## Schemas

- `CheckoutForm` - Complete checkout form data
- `ShippingAddress` - Shipping address information
- `PaymentMethod` - Payment method details

## Utils

- `validation.ts` - Checkout-specific validation helpers
- `steps.ts` - Checkout step management utilities

## Testing

Run tests for this layer:

```bash
# Unit tests
pnpm test:unit -- layers/checkout

# Integration tests
pnpm test:integration -- layers/checkout

# E2E tests
pnpm test:e2e:checkout
```

## Usage Example

```vue
<script setup lang="ts">
import { useCheckoutStore } from '#layers/checkout/app/stores/checkout/checkout'

const checkoutStore = useCheckoutStore()

async function submitCheckout() {
  await checkoutStore.submitOrder()
}
</script>
```

## Checkout Flow

1. **Shipping Address** - Collect delivery information
2. **Payment Method** - Collect payment details
3. **Review Order** - Confirm order details
4. **Confirmation** - Order placed successfully
