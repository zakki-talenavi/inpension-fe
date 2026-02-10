# ADR-002: Schema-Driven Development with Zod

**Status:** Accepted  
**Date:** 2026-02-09  
**Decision Makers:** Development Team

## Context

We needed a way to:
- Ensure type safety at runtime
- Validate data at layer boundaries
- Generate TypeScript types from schemas
- Create consistent mock data for testing

## Decision

We will use **Zod** for schema-driven development across all layers.

### Implementation

1. **Define schemas** in `layers/*/app/schemas/`
2. **Validate at boundaries**: API responses, form inputs, localStorage
3. **Generate types**: Use `z.infer<typeof Schema>` for TypeScript types
4. **Mock generation**: Use `@anatine/zod-mock` for test data

### Example

```typescript
// Schema definition
import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'food']),
})

export type Product = z.infer<typeof ProductSchema>

// Runtime validation
const product = ProductSchema.parse(apiResponse)

// Mock generation
import { generateMock } from '@anatine/zod-mock'
const mockProduct = generateMock(ProductSchema)
```

## Consequences

### Positive

- ✅ **Runtime Safety**: Catch invalid data at runtime
- ✅ **Single Source of Truth**: Schema defines both types and validation
- ✅ **Better Errors**: Detailed validation error messages
- ✅ **Test Data**: Automatic mock generation from schemas
- ✅ **API Contracts**: Clear contracts between layers

### Negative

- ⚠️ **Bundle Size**: Zod adds ~14KB to bundle
- ⚠️ **Performance**: Runtime validation has overhead
- ⚠️ **Learning Curve**: Team needs to learn Zod API

### Neutral

- 📝 **Migration**: Need to convert existing types to Zod schemas
- 📝 **Documentation**: Document schema patterns and best practices

## Alternatives Considered

### 1. TypeScript Only
- **Rejected**: No runtime validation, type erasure at runtime

### 2. Yup
- **Rejected**: Less TypeScript integration, larger bundle

### 3. io-ts
- **Rejected**: More complex API, steeper learning curve

### 4. ArkType
- **Considered**: Faster, but less mature ecosystem

## Best Practices

1. **Validate at Boundaries**
   - API responses
   - Form submissions
   - localStorage data
   - Component props (when needed)

2. **Schema Location**
   - Place schemas in `layers/*/app/schemas/`
   - One schema file per domain entity
   - Export both schema and inferred type

3. **Error Handling**
   ```typescript
   const result = ProductSchema.safeParse(data)
   if (!result.success) {
     const { handleValidationError } = useErrorHandler()
     throw handleValidationError(result.error)
   }
   ```

4. **Reusable Schemas**
   ```typescript
   // Base schemas in shared layer
   export const IdSchema = z.string().uuid()
   export const TimestampSchema = z.string().datetime()
   
   // Compose in feature layers
   export const ProductSchema = z.object({
     id: IdSchema,
     createdAt: TimestampSchema,
     // ...
   })
   ```

## Implementation Checklist

- [x] Install Zod and @anatine/zod-mock
- [x] Create schemas for all domain entities
- [x] Add validation at API boundaries
- [x] Generate mock data for tests
- [ ] Add schema validation to forms
- [ ] Document schema patterns
- [ ] Train team on Zod usage

## References

- [Zod Documentation](https://zod.dev/)
- [@anatine/zod-mock](https://github.com/anatine/zod-plugins/tree/main/packages/zod-mock)
- [TESTING.md](../TESTING.md)
