import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'
import { z } from 'zod'
import { ProductSchema } from '#layers/shared/app/schemas/product'
import type { ProductFilter, ProductSort } from '../../schemas/filters'
import { filterProducts, sortProducts } from '../../utils/filters'

export const useProductsStore = defineStore('products', () => {
  const config = useRuntimeConfig()
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentFilter = ref<ProductFilter>({
    search: undefined,
    category: 'all',
    inStock: false,
  })
  const currentSort = ref<ProductSort>('name-asc')

  async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch(`${config.public.apiBaseUrl}/products`)
      const validationResult = z.array(ProductSchema).safeParse(response)

      if (!validationResult.success) {
        // eslint-disable-next-line no-console
        console.error('API response validation failed:', validationResult.error.issues)
        throw new Error('Invalid product data received from API')
      }

      products.value = validationResult.data
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch products:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
      products.value = []
    }
    finally {
      loading.value = false
    }
  }

  function setFilter(filter: ProductFilter) {
    currentFilter.value = filter
  }

  function setSort(sort: ProductSort) {
    currentSort.value = sort
  }

  function resetFilter() {
    currentFilter.value = {
      search: undefined,
      category: 'all',
      inStock: false,
    }
    currentSort.value = 'name-asc'
  }

  // Getters (computed)
  const filteredProducts = computed(() => {
    let result = filterProducts(products.value, currentFilter.value)
    result = sortProducts(result, currentSort.value)
    return result
  })

  const productById = computed(() => (id: string) =>
    products.value.find(p => p.id === id),
  )

  const categories = computed(() => {
    const cats = new Set(products.value.map(p => p.category))
    return Array.from(cats)
  })

  // Public API
  return {
    // State
    products,
    loading,
    error,
    currentFilter,
    currentSort,
    // Getters
    filteredProducts,
    productById,
    categories,
    // Actions
    fetchProducts,
    setFilter,
    setSort,
    resetFilter,
  }
})
