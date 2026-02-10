# Auth Layer

## Overview

The Auth layer handles user authentication and authorization including login, registration, JWT token management, and protected routes.

## Features

- **User Login**: Email/password authentication
- **User Registration**: New user account creation
- **JWT Token Management**: Secure token storage and refresh
- **Protected Routes**: Middleware for route protection
- **User Profile**: User account information management

## Dependencies

- **Shared Layer**: Uses shared utilities for storage

## Middleware

- `auth.ts` - Protects routes requiring authentication
- `guest.ts` - Redirects authenticated users from login/register pages

## Pages

- `login.vue` - User login page
- `register.vue` - User registration page

## Store

- `useAuthStore` - Manages authentication state and user session

## Schemas

- `User` - User account information
- `LoginCredentials` - Login form data
- `RegisterCredentials` - Registration form data

## Utils

- `jwt.ts` - JWT token encoding/decoding utilities
- `validation.ts` - Authentication validation helpers

## Testing

Run tests for this layer:

```bash
# Unit tests
pnpm test:unit -- layers/auth

# Integration tests
pnpm test:integration -- layers/auth

# E2E tests
pnpm test:e2e:auth
```

## Usage Example

```vue
<script setup lang="ts">
import { useAuthStore } from '#layers/auth/app/stores/auth/auth'

const authStore = useAuthStore()

async function handleLogin(email: string, password: string) {
  await authStore.login(email, password)
}
</script>
```

## Protected Routes

Use the auth middleware to protect routes:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>
```
