# ADR-003: Centralized Error Handling

**Status:** Accepted  
**Date:** 2026-02-09  
**Decision Makers:** Development Team

## Context

We needed a consistent way to:
- Handle API errors across all features
- Log errors for debugging and monitoring
- Show user-friendly error messages
- Validate data with Zod schemas

## Decision

We will implement **centralized error handling** in the core layer with:
- Custom error classes (`ApiError`, `ValidationError`)
- Error handler composable (`useErrorHandler`)
- Structured logging (`useLogger`)
- Integration with API client

### Architecture

```
layers/core/app/
├── composables/
│   ├── useErrorHandler.ts   # Error handling logic
│   └── useApi.ts             # API client with error handling
└── utils/
    └── logger.ts             # Logging utility
```

### Error Classes

```typescript
class ApiError extends Error {
  statusCode?: number
  data?: unknown
}

class ValidationError extends Error {
  errors: Array<{ path: string; message: string }>
}
```

### Usage

```typescript
// In stores or composables
const api = useApi()
const { handleApiError, logError, showErrorToast } = useErrorHandler()

try {
  const data = await api.get('/products')
} catch (error) {
  const apiError = handleApiError(error)
  logError(apiError, { context: 'fetchProducts' })
  showErrorToast(apiError)
}
```

## Consequences

### Positive

- ✅ **Consistency**: Same error handling across all features
- ✅ **Debugging**: Structured logging with context
- ✅ **User Experience**: User-friendly error messages
- ✅ **Monitoring**: Easy to integrate with error tracking services
- ✅ **Type Safety**: Typed error classes

### Negative

- ⚠️ **Abstraction**: Adds layer of abstraction over native errors
- ⚠️ **Learning Curve**: Team needs to use error handlers consistently

### Neutral

- 📝 **Migration**: Need to update existing error handling
- 📝 **Integration**: Can integrate with Sentry, LogRocket, etc.

## Error Handling Patterns

### 1. API Errors

```typescript
async function fetchData() {
  const api = useApi()
  const { handleApiError, logError } = useErrorHandler()
  
  try {
    return await api.get('/endpoint')
  } catch (error) {
    const apiError = handleApiError(error)
    logError(apiError, { endpoint: '/endpoint' })
    throw apiError
  }
}
```

### 2. Validation Errors

```typescript
import { ProductSchema } from '../schemas/product'

function validateProduct(data: unknown) {
  const { handleValidationError, logError } = useErrorHandler()
  
  const result = ProductSchema.safeParse(data)
  if (!result.success) {
    const validationError = handleValidationError(result.error)
    logError(validationError, { data })
    throw validationError
  }
  
  return result.data
}
```

### 3. Store Error State

```typescript
export const useProductsStore = defineStore('products', () => {
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  
  async function fetchProducts() {
    loading.value = true
    error.value = null
    
    try {
      const api = useApi()
      const data = await api.get('/products')
      // ...
    } catch (err) {
      const { handleApiError } = useErrorHandler()
      error.value = handleApiError(err)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  
  return { loading, error, fetchProducts }
})
```

## Logging Levels

```typescript
const logger = useLogger()

logger.debug('Debug info', { userId: '123' })
logger.info('User logged in', { userId: '123' })
logger.warn('API rate limit approaching', { remaining: 10 })
logger.error('Failed to fetch data', { error: err })
```

## Future Enhancements

1. **Error Tracking Integration**
   - Integrate with Sentry for production error tracking
   - Add breadcrumbs for better debugging

2. **User Notifications**
   - Integrate with toast notification library
   - Show user-friendly messages based on error type

3. **Retry Logic**
   - Add automatic retry for transient errors
   - Exponential backoff for rate limiting

4. **Error Boundaries**
   - Add Vue error boundaries for component errors
   - Graceful degradation for critical errors

## Implementation Checklist

- [x] Create error classes
- [x] Implement useErrorHandler composable
- [x] Integrate with useApi
- [x] Add logging utility
- [ ] Integrate with Sentry
- [ ] Add toast notifications
- [ ] Update all stores to use error handling
- [ ] Document error handling patterns

## References

- [Error Handling Best Practices](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)
- [Vue Error Handling](https://vuejs.org/guide/best-practices/production-deployment.html#tracking-runtime-errors)
- [Sentry Documentation](https://docs.sentry.io/)
