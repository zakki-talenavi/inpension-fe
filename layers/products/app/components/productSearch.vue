<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { UInput, UButton, UBadge } from '#components'
import { useProductsStore } from '#layers/products/app/stores/products/useProductsStore'
import { ProductFilterSchema } from '#layers/products/app/schemas/filters'

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  search: [query: string]
  clear: []
}>()

const productsStore = useProductsStore()
const searchQuery = ref('')
const showSuggestions = ref(false)
const suggestionIndex = ref(-1)

const suggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim().length < 2) {
    return []
  }

  const query = searchQuery.value.toLowerCase()
  const products = productsStore.products

  const uniqueSuggestions = new Set<string>()

  products.forEach((product) => {
    if (product.name.toLowerCase().includes(query)) {
      uniqueSuggestions.add(product.name)
    }
    if (product.category.toLowerCase().includes(query)) {
      uniqueSuggestions.add(product.category)
    }
  })

  return Array.from(uniqueSuggestions).slice(0, 5)
})

const filteredProductsCount = computed(() => {
  if (!searchQuery.value) return 0
  return productsStore.filteredProducts.length
})

function handleSearch() {
  const trimmedQuery = searchQuery.value.trim()
  if (trimmedQuery) {
    const result = ProductFilterSchema.shape.search.safeParse(trimmedQuery)
    if (result.success) {
      productsStore.setFilter({ search: result.data })
      emit('search', trimmedQuery)
    }
  }
  showSuggestions.value = false
}

function clearSearch() {
  searchQuery.value = ''
  productsStore.resetFilter()
  emit('clear')
}

function selectSuggestion(suggestion: string) {
  searchQuery.value = suggestion
  handleSearch()
}

function handleKeydown(event: KeyboardEvent) {
  if (!showSuggestions.value || suggestions.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      suggestionIndex.value = Math.min(suggestionIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      suggestionIndex.value = Math.max(suggestionIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (suggestionIndex.value >= 0) {
        selectSuggestion(suggestions.value[suggestionIndex.value])
      } else {
        handleSearch()
      }
      break
    case 'Escape':
      showSuggestions.value = false
      suggestionIndex.value = -1
      break
  }
}

watch(searchQuery, (newValue) => {
  showSuggestions.value = newValue.trim().length >= 2
  suggestionIndex.value = -1
})
</script>

<template>
  <div class="relative w-full">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <UInput
          v-model="searchQuery"
          :placeholder="props.placeholder || 'Search products...'"
          size="lg"
          icon="i-lucide-search"
          @keydown="handleKeydown"
          @focus="showSuggestions = searchQuery.trim().length >= 2"
          @blur="setTimeout(() => showSuggestions = false, 200)"
        />

        <div
          v-if="showSuggestions && suggestions.length > 0"
          class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
        >
          <div
            v-for="(suggestion, index) in suggestions"
            :key="suggestion"
            class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
            :class="{ 'bg-gray-100 dark:bg-gray-700': index === suggestionIndex }"
            @mousedown="selectSuggestion(suggestion)"
          >
            <span class="text-sm">{{ suggestion }}</span>
            <UBadge size="xs" variant="soft">
              {{ suggestion.toLowerCase().includes(searchQuery.toLowerCase()) ? 'Product' : 'Category' }}
            </UBadge>
          </div>
        </div>
      </div>

      <UButton
        v-if="searchQuery"
        color="gray"
        variant="ghost"
        icon="i-lucide-x"
        @click="clearSearch"
      />

      <UButton
        color="black"
        size="lg"
        :disabled="!searchQuery.trim()"
        @click="handleSearch"
      >
        Search
      </UButton>
    </div>

    <div
      v-if="searchQuery && filteredProductsCount > 0"
      class="mt-2 text-sm text-gray-600 dark:text-gray-400"
    >
      Found {{ filteredProductsCount }} products for "{{ searchQuery }}"
    </div>
  </div>
</template>
