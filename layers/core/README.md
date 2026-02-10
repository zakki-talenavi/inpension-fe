# Core Layer

## Overview

The Core layer provides essential infrastructure services used across all feature layers. This includes API client, error handling, logging, and other shared services.

## Features

- **API Client**: Type-safe HTTP client with centralized error handling
- **Error Handling**: Structured error handling with custom error classes
- **Logging**: Centralized logging with multiple log levels
- **Extensible**: Easy to add new infrastructure services

## Dependencies

- No dependencies on other layers (foundation layer)

## Composables

### `useApi()`

Type-safe API client with automatic error handling.

```typescript
import { useApi } from '#layers/core/app/composables/useApi'

const api = useApi()

// GET request
const data = await api.get<Product[]>('/products')

// POST request
const created = await api.post<Product>('/products', { name: 'New Product' })

// PUT request
const updated = await api.put<Product>('/products/1', { name: 'Updated' })

// DELETE request
await api.delete('/products/1')
```

### `useErrorHandler()`

Centralized error handling for API and validation errors.

```typescript
import { useErrorHandler } from '#layers/core/app/composables/useErrorHandler'

const { handleApiError, handleValidationError, logError, showErrorToast } = useErrorHandler()

try {
  await api.get('/products')
} catch (error) {
  const apiError = handleApiError(error)
  logError(apiError)
  showErrorToast(apiError)
}
```

## Utils

### `useLogger()`

Structured logging utility.

```typescript
import { useLogger } from '#layers/core/app/utils/logger'

const logger = useLogger()

logger.debug('Debug message', { userId: '123' })
logger.info('User logged in', { userId: '123' })
logger.warn('API rate limit approaching', { remaining: 10 })
logger.error('Failed to fetch data', { error: err })
```

## Error Classes

### `ApiError`

Thrown when API requests fail.

```typescript
class ApiError extends Error {
  statusCode?: number
  data?: unknown
}
```

### `ValidationError`

Thrown when validation fails.

```typescript
class ValidationError extends Error {
  errors: Array<{ path: string; message: string }>
}
```

## Testing

Run tests for this layer:

```bash
# Unit tests
pnpm test:unit -- layers/core

# Integration tests
pnpm test:integration -- layers/core
```

## Architecture

This is a **foundation layer** that:
- Has no dependencies on other layers
- Provides infrastructure services
- Is imported by all feature layers
- Should not contain business logic

## Extending

To add new infrastructure services:

1. Create composable in `app/composables/`
2. Add tests in `app/composables/__tests__/`
3. Document in this README
4. Update layer dependencies in `eslint.config.mjs`
