import { describe, it, expect } from 'vitest'
import { filterProducts, sortProducts } from '#layers/products/app/utils/filters'
import type { Product } from '#layers/shared/app/schemas/product'
import type { ProductFilter, ProductSort } from '#layers/products/app/schemas/filters'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 12999,
    category: 'electronics',
    stock: 50,
    rating: 4.5,
    image: '/headphones.jpg',
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for athletes',
    price: 8999,
    category: 'sports',
    stock: 30,
    rating: 4.2,
    image: '/shoes.jpg',
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker',
    price: 5999,
    category: 'home',
    stock: 0,
    rating: 3.8,
    image: '/coffee.jpg',
  },
  {
    id: '4',
    name: 'Laptop Backpack',
    description: 'Durable laptop backpack',
    price: 4999,
    category: 'electronics',
    stock: 100,
    rating: 4.7,
    image: '/backpack.jpg',
  },
]

describe('filterProducts', () => {
  it('should return all products when no filter is applied', () => {
    const filter: ProductFilter = {}
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(4)
  })

  it('should filter by search query in product name', () => {
    const filter: ProductFilter = { search: 'wireless' }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Wireless Headphones')
  })

  it('should filter by search query in description', () => {
    const filter: ProductFilter = { search: 'noise cancellation' }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Wireless Headphones')
  })

  it('should be case-insensitive when searching', () => {
    const filter: ProductFilter = { search: 'HEADPHONES' }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Wireless Headphones')
  })

  it('should filter by category', () => {
    const filter: ProductFilter = { category: 'electronics' }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.category === 'electronics')).toBe(true)
  })

  it('should filter by price range', () => {
    const filter: ProductFilter = { priceRange: { min: 5000, max: 10000 } }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.price >= 5000 && p.price <= 10000)).toBe(true)
  })

  it('should filter by minimum rating', () => {
    const filter: ProductFilter = { minRating: 4.5 }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(2)
    expect(result.every((p) => (p.rating ?? 0) >= 4.5)).toBe(true)
  })

  it('should filter by stock availability', () => {
    const filter: ProductFilter = { inStock: true }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(3)
    expect(result.every((p) => p.stock > 0)).toBe(true)
  })

  it('should combine multiple filters', () => {
    const filter: ProductFilter = {
      category: 'electronics',
      inStock: true,
      minRating: 4.0,
    }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.category === 'electronics' && p.stock > 0 && (p.rating ?? 0) >= 4.0)).toBe(true)
  })

  it('should return empty array when no products match', () => {
    const filter: ProductFilter = { search: 'nonexistent' }
    const result = filterProducts(mockProducts, filter)
    expect(result).toHaveLength(0)
  })
})

describe('sortProducts', () => {
  it('should sort by name ascending', () => {
    const sort: ProductSort = 'name-asc'
    const result = sortProducts(mockProducts, sort)
    expect(result[0].name).toBe('Coffee Maker')
    expect(result[result.length - 1].name).toBe('Wireless Headphones')
  })

  it('should sort by name descending', () => {
    const sort: ProductSort = 'name-desc'
    const result = sortProducts(mockProducts, sort)
    expect(result[0].name).toBe('Wireless Headphones')
    expect(result[result.length - 1].name).toBe('Coffee Maker')
  })

  it('should sort by price ascending', () => {
    const sort: ProductSort = 'price-asc'
    const result = sortProducts(mockProducts, sort)
    expect(result[0].price).toBe(4999)
    expect(result[result.length - 1].price).toBe(12999)
  })

  it('should sort by price descending', () => {
    const sort: ProductSort = 'price-desc'
    const result = sortProducts(mockProducts, sort)
    expect(result[0].price).toBe(12999)
    expect(result[result.length - 1].price).toBe(4999)
  })

  it('should sort by rating descending', () => {
    const sort: ProductSort = 'rating-desc'
    const result = sortProducts(mockProducts, sort)
    expect(result[0].rating).toBe(4.7)
    expect(result[result.length - 1].rating).toBe(3.8)
  })

  it('should not mutate original array', () => {
    const sort: ProductSort = 'price-asc'
    const originalLength = mockProducts.length
    const originalFirst = mockProducts[0]
    
    sortProducts(mockProducts, sort)
    
    expect(mockProducts).toHaveLength(originalLength)
    expect(mockProducts[0]).toBe(originalFirst)
  })
})

describe('filter and sort combination', () => {
  it('should filter then sort correctly', () => {
    const filter: ProductFilter = { category: 'electronics' }
    const sort: ProductSort = 'price-asc'
    
    const filtered = filterProducts(mockProducts, filter)
    const result = sortProducts(filtered, sort)
    
    expect(result).toHaveLength(2)
    expect(result[0].price).toBeLessThan(result[1].price)
  })
})
