<script setup lang="ts">
/**
 * ProductCard component (Products Layer)
 *
 * Displays a single product in a card format using Nuxt UI components
 * Uses shared utilities (formatCurrency) from shared layer
 * Entire card is clickable to navigate to product detail page
 * Emits cart-related events for parent to handle (maintains layer independence)
 */

import { NuxtLink, UCard, UButton, UBadge, UIcon, UModal } from '#components'
import type { Product } from '#layers/shared/app/schemas/product'
import { formatCurrency } from '#layers/shared/app/utils/currency'
import { useWishlistStore } from '../stores/wishlist'
import { ref } from 'vue'

interface Props {
  product: Product
  inCartQuantity?: number  // Quantity in cart (0 or undefined = not in cart)
}

interface Emits {
  (e: 'add-to-cart', product: Product): void
  (e: 'increment', product: Product): void
  (e: 'decrement', product: Product): void
  (e: 'remove', product: Product): void
}

const { product, inCartQuantity = 0 } = defineProps<Props>()
const emit = defineEmits<Emits>()

const wishlistStore = useWishlistStore()

// --- LOCAL STATE ---
// Hanya komponen ini yang peduli apakah Quick View lagi terbuka atau tombol lagi loading/hover.
// Tidak perlu masuk Pinia.
const isQuickViewOpen = ref(false)
const isHovered = ref(false)

function handleAction(event: MouseEvent, action: 'add' | 'increment' | 'decrement' | 'remove') {
  // Prevent navigation when clicking action buttons
  event.preventDefault()
  event.stopPropagation()

  switch (action) {
    case 'add':
      emit('add-to-cart', product)
      break
    case 'increment':
      emit('increment', product)
      break
    case 'decrement':
      emit('decrement', product)
      break
    case 'remove':
      emit('remove', product)
      break
  }
}

function toggleWishlist(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  // Panggil Action Global
  wishlistStore.toggleWishlist(product.id)
}

function openQuickView(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  // Ubah State Lokal
  isQuickViewOpen.value = true
}
</script>

<template>
  <NuxtLink
    :to="`/products/${product.id}`"
    class="block cursor-pointer group"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <UCard class="hover:shadow-lg transition-shadow duration-200 h-full relative">
      <template #header>
        <div class="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          <NuxtImg
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          <!-- GLOBAL STATE EXAMPLE: Wishlist Button -->
          <!-- State 'love' nya global, sinkron dengan semua komponen lain -->
          <button
            class="absolute top-2 left-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm transition-colors z-10 hover:text-red-500"
            :class="wishlistStore.isInWishlist(product.id) ? 'text-red-500' : 'text-gray-400'"
            @click="toggleWishlist"
          >
            <UIcon 
              :name="wishlistStore.isInWishlist(product.id) ? 'i-lucide-heart-filled' : 'i-lucide-heart'" 
              class="w-5 h-5 flex-shrink-0" 
              dynamic 
            />
          </button>

          <UBadge
            v-if="product.stock === 0"
            label="Out of Stock"
            color="error"
            class="absolute top-2 right-2"
          />
          <UBadge
            v-else-if="inCartQuantity > 0"
            :label="`In Cart: ${inCartQuantity}`"
            color="success"
            icon="i-lucide-shopping-cart"
            class="absolute top-2 right-2"
          />

          <!-- LOCAL STATE EXAMPLE: Quick View Button -->
          <!-- Muncul hanya saat hover (local state 'isHovered') -->
          <!-- Membuka modal (local state 'isQuickViewOpen') -->
          <div 
            v-if="isHovered && product.stock > 0"
            class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px] transition-opacity"
          >
             <UButton
              color="white"
              variant="solid"
              size="sm"
              icon="i-lucide-eye"
              label="Quick View"
              class="shadow-lg"
              @click="openQuickView"
             />
          </div>
        </div>
      </template>

      <div class="flex flex-col gap-3">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {{ product.name }}
        </h3>

        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow">
          {{ product.description }}
        </p>

        <div class="flex justify-between items-center">
          <span class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ formatCurrency(product.price) }}
          </span>
          <span
            v-if="product.rating"
            class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1"
          >
            <span>⭐</span>
            <span>{{ product.rating.toFixed(1) }}</span>
          </span>
        </div>
      </div>

      <template #footer>
        <!-- Not in cart - show Add to Cart button -->
        <UButton
          v-if="inCartQuantity === 0"
          type="button"
          block
          :disabled="product.stock === 0"
          :label="product.stock === 0 ? 'Out of Stock' : 'Add to Cart'"
          icon="i-lucide-shopping-cart"
          color="primary"
          @click="handleAction($event, 'add')"
        />

        <!-- In cart - show quantity controls -->
        <div
          v-else
          class="flex items-center gap-2"
        >
          <div class="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1 flex-1">
            <UButton
              type="button"
              icon="i-lucide-minus"
              size="sm"
              square
              variant="ghost"
              color="neutral"
              aria-label="Decrease quantity"
              @click="handleAction($event, 'decrement')"
            />
            <span class="flex-1 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ inCartQuantity }}
            </span>
            <UButton
              type="button"
              icon="i-lucide-plus"
              size="sm"
              square
              variant="ghost"
              color="neutral"
              aria-label="Increase quantity"
              @click="handleAction($event, 'increment')"
            />
          </div>
          <UButton
            type="button"
            icon="i-lucide-trash-2"
            size="sm"
            square
            variant="ghost"
            color="error"
            aria-label="Remove from cart"
            @click="handleAction($event, 'remove')"
          />
        </div>
      </template>
    </UCard>
  </NuxtLink>

  <!-- LOCAL STATE EXAMPLE: Quick View Modal -->
  <!-- Komponen Modal ini 'hidup' cuma selama component ProductCard ini ada -->
  <UModal v-model="isQuickViewOpen">
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">Quick View: {{ product.name }}</h3>
      </template>
      <div class="flex gap-4">
         <NuxtImg :src="product.image" class="w-1/2 rounded-lg" />
         <div class="w-1/2 flex flex-col gap-2">
            <p class="text-gray-600">{{ product.description }}</p>
            <p class="text-2xl font-bold text-primary">{{ formatCurrency(product.price) }}</p>
            <p>Stock: {{ product.stock }}</p>
         </div>
      </div>
      <template #footer>
        <UButton label="Close" color="gray" variant="ghost" @click="isQuickViewOpen = false" />
      </template>
    </UCard>
  </UModal>
</template>
