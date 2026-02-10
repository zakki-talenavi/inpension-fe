# Store Structure Standards

## Overview

All stores in this project follow a consistent structure using Pinia Composition API. This document outlines the standards for creating and organizing stores.

## Directory Structure

```
layers/{layer-name}/app/stores/
├── {domain}/
│   ├── use{Domain}Store.ts      # Main store file
│   ├── {domain}.types.ts        # Store-specific types (optional)
│   └── __tests__/
│       └── use{Domain}Store.test.ts
└── {feature}.ts                 # Simple feature stores (e.g., wishlist.ts)
```

### Examples

**Complex Store (in subdirectory):**
```
layers/products/app/stores/
└── products/
    ├── useProductsStore.ts
    ├── products.types.ts
    └── __tests__/
        └── useProductsStore.test.ts
```

**Simple Store (single file):**
```
layers/products/app/stores/
└── wishlist.ts
```

## Store Template

### Composition API Pattern

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { YourType } from '../schemas/your-schema'

export const useYourStore = defineStore('your-store-id', () => {
  // ============================================
  // STATE
  // ============================================
  const items = ref<YourType[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // ============================================
  // GETTERS (Computed)
  // ============================================
  const itemCount = computed(() => items.value.length)
  const hasItems = computed(() => items.value.length > 0)

  // ============================================
  // ACTIONS
  // ============================================
  
  /**
   * Fetch items from API
   */
  async function fetchItems() {
    loading.value = true
    error.value = null
    
    try {
      const api = useApi()
      const data = await api.get<YourType[]>('/your-endpoint')
      items.value = data
    }
    catch (err) {
      error.value = err as Error
      throw err
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Add item
   */
  function addItem(item: YourType) {
    items.value.push(item)
  }

  /**
   * Remove item
   */
  function removeItem(id: string) {
    items.value = items.value.filter(item => item.id !== id)
  }

  /**
   * Reset store to initial state
   */
  function $reset() {
    items.value = []
    loading.value = false
    error.value = null
  }

  // ============================================
  // RETURN (Public API)
  // ============================================
  return {
    // State
    items,
    loading,
    error,
    
    // Getters
    itemCount,
    hasItems,
    
    // Actions
    fetchItems,
    addItem,
    removeItem,
    $reset,
  }
})
```

## Best Practices

### 1. **Naming Conventions**

- Store file: `use{Domain}Store.ts` (e.g., `useProductsStore.ts`)
- Store ID: `{domain}` (e.g., `'products'`)
- Composable: `use{Domain}Store` (e.g., `useProductsStore`)

### 2. **State Management**

- Use `ref()` for reactive state
- Use `computed()` for derived state (getters)
- Always initialize state with proper types

### 3. **Actions**

- Async actions should handle loading and error states
- Use try-catch-finally for error handling
- Integrate with `useApi()` from core layer for API calls
- Document complex actions with JSDoc comments

### 4. **Error Handling**

```typescript
async function fetchData() {
  loading.value = true
  error.value = null
  
  try {
    const api = useApi()
    const { handleApiError, logError } = useErrorHandler()
    
    const data = await api.get('/endpoint')
    items.value = data
  }
  catch (err) {
    const apiError = handleApiError(err)
    logError(apiError)
    error.value = apiError
    throw apiError
  }
  finally {
    loading.value = false
  }
}
```

### 5. **Testing**

Every store should have corresponding tests:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useYourStore } from '../useYourStore'

describe('useYourStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty state', () => {
    const store = useYourStore()
    expect(store.items).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('should add item', () => {
    const store = useYourStore()
    store.addItem({ id: '1', name: 'Test' })
    expect(store.items).toHaveLength(1)
  })

  it('should reset store', () => {
    const store = useYourStore()
    store.addItem({ id: '1', name: 'Test' })
    store.$reset()
    expect(store.items).toEqual([])
  })
})
```

### 6. **Persistence**

For stores that need persistence:

```typescript
import { getValidatedItem, setItem } from '#layers/shared/app/utils/storage'
import { YourSchema } from '../schemas/your-schema'

const STORAGE_KEY = 'your-store-key'

// Load from storage on initialization
const items = ref<YourType[]>(
  getValidatedItem(STORAGE_KEY, z.array(YourSchema)) || []
)

// Watch and save to storage
watch(items, (newItems) => {
  setItem(STORAGE_KEY, newItems)
}, { deep: true })
```

## Store Organization

### When to Create a Subdirectory

Create a subdirectory when:
- Store has complex logic (>100 lines)
- Need separate type definitions
- Multiple related stores in same domain

### When to Use Single File

Use single file when:
- Simple state management (<100 lines)
- No complex types needed
- Standalone feature (e.g., wishlist, theme)

## Integration with Core Layer

All stores should use core layer services:

```typescript
import { useApi } from '#layers/core/app/composables/useApi'
import { useErrorHandler } from '#layers/core/app/composables/useErrorHandler'
import { useLogger } from '#layers/core/app/utils/logger'

export const useYourStore = defineStore('your-store', () => {
  const api = useApi()
  const { handleApiError, logError } = useErrorHandler()
  const logger = useLogger()

  async function fetchData() {
    try {
      logger.info('Fetching data...')
      const data = await api.get('/endpoint')
      logger.info('Data fetched successfully')
      return data
    }
    catch (err) {
      const apiError = handleApiError(err)
      logError(apiError)
      throw apiError
    }
  }

  return { fetchData }
})
```

## Migration Guide

To migrate existing stores to this standard:

1. Move store to appropriate directory structure
2. Add proper TypeScript types
3. Implement error handling with core layer
4. Add tests
5. Document complex logic
6. Update imports in consuming components
