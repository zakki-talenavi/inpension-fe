<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  trend?: {
    value: number
    isPositive: boolean
  }
}

const props = defineProps<Props>()

const colorClasses = {
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  purple: 'text-purple-600 bg-purple-50',
  orange: 'text-orange-600 bg-orange-50',
  red: 'text-red-600 bg-red-50'
}

const iconColorClasses = {
  blue: 'text-blue-200',
  green: 'text-green-200',
  purple: 'text-purple-200',
  orange: 'text-orange-200',
  red: 'text-red-200'
}
</script>

<template>
  <Card>
    <template #content>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">{{ label }}</p>
          <p class="text-3xl font-bold" :class="colorClasses[color || 'blue']">
            {{ value }}
          </p>
          <div v-if="trend" class="mt-2">
            <span
              :class="trend.isPositive ? 'text-green-600' : 'text-red-600'"
              class="text-sm font-semibold"
            >
              <i :class="trend.isPositive ? 'pi pi-arrow-up' : 'pi pi-arrow-down'" />
              {{ Math.abs(trend.value) }}%
            </span>
          </div>
        </div>
        <i
          v-if="icon"
          :class="[icon, iconColorClasses[color || 'blue']]"
          class="text-4xl"
        />
      </div>
    </template>
  </Card>
</template>
