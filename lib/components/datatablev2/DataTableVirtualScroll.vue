<template>
  <!-- Virtual scrolling spacer above visible rows -->
  <tr v-if="offsetY > 0">
    <td :colspan="100" :style="{ height: `${offsetY}px`, padding: 0, border: 'none' }"></td>
  </tr>
  
  <!-- Visible rows -->
  <slot
    :visible-items="visibleItems"
    :start-index="startIndex"
    :end-index="endIndex"
    :scroll-top="scrollTop"
  />
  
  <!-- Virtual scrolling spacer below visible rows -->
  <tr v-if="bottomSpacerHeight > 0">
    <td :colspan="100" :style="{ height: `${bottomSpacerHeight}px`, padding: 0, border: 'none' }"></td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    default: 48 // Default row height in pixels
  },
  containerHeight: {
    type: String,
    default: '400px'
  },
  overscan: {
    type: Number,
    default: 5 // Extra items to render outside viewport
  },
  scrollTop: {
    type: Number,
    default: 0
  }
})

// Calculate visible range
const containerHeightPx = computed(() => {
  return parseInt(props.containerHeight) || 400
})

const startIndex = computed(() => {
  const index = Math.floor(props.scrollTop / props.itemHeight)
  return Math.max(0, index - props.overscan)
})

const endIndex = computed(() => {
  const viewportItemCount = Math.ceil(containerHeightPx.value / props.itemHeight)
  const index = startIndex.value + viewportItemCount + props.overscan * 2
  return Math.min(props.items.length - 1, index)
})

// Memoized visible items with shallow comparison optimization
const visibleItems = computed(() => {
  const start = startIndex.value
  const end = endIndex.value + 1
  
  // Only recalculate if indices actually changed
  if (start === visibleItems._lastStart && end === visibleItems._lastEnd) {
    return visibleItems._lastItems
  }
  
  const items = props.items.slice(start, end)
  
  // Cache for next comparison
  visibleItems._lastStart = start
  visibleItems._lastEnd = end
  visibleItems._lastItems = items
  
  return items
})

const offsetY = computed(() => {
  return startIndex.value * props.itemHeight
})

const bottomSpacerHeight = computed(() => {
  const remainingItems = props.items.length - endIndex.value - 1
  return Math.max(0, remainingItems * props.itemHeight)
})

// Expose computed values
defineExpose({
  startIndex,
  endIndex,
  visibleItems,
  offsetY,
  bottomSpacerHeight
})
</script>
