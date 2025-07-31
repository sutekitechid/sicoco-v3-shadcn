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
import { computed, ref } from 'vue'

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

// Memoization cache for visible items
const lastStart = ref(-1)
const lastEnd = ref(-1)
const lastItems = ref([])

// Calculate visible range
const containerHeightPx = computed(() => {
  const heightStr = props.containerHeight || '400px'
  
  // Parse different CSS units and convert to pixels
  const match = String(heightStr).match(/^(\d+(?:\.\d+)?)([a-z%]+)?$/i)
  if (!match) return 400
  
  const [, value, unit = 'px'] = match
  const numValue = parseFloat(value)
  
  switch (unit.toLowerCase()) {
    case 'rem':
      // Assuming 1rem = 16px (browser default)
      return numValue * 16
    case 'em':
      // Assuming 1em = 16px (browser default, could be different based on parent font-size)
      return numValue * 16
    case 'px':
    case '':
      return numValue
    case 'vh':
      // Viewport height percentage
      const innerHeight = (typeof window !== 'undefined' && window.innerHeight) || 400
      return (numValue / 100) * innerHeight
    case 'vw':
      // Viewport width percentage (unusual for height but supported)
      const innerWidth = (typeof window !== 'undefined' && window.innerWidth) || 1024
      return (numValue / 100) * innerWidth
    case '%':
      // Percentage - assuming parent container is ~400px (fallback)
      return (numValue / 100) * 400
    default:
      // Fallback for unknown units
      return numValue || 400
  }
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
  if (start === lastStart.value && end === lastEnd.value) {
    return lastItems.value
  }
  
  const items = props.items.slice(start, end)
  
  // Cache for next comparison
  lastStart.value = start
  lastEnd.value = end
  lastItems.value = items
  return items
})

const offsetY = computed(() => {
  return startIndex.value * props.itemHeight
})

const bottomSpacerHeight = computed(() => {
  const remainingItems = props.items.length - endIndex.value - 1
  return Math.max(0, remainingItems * props.itemHeight)
})

// Validation functions for debugging
const validateVirtualScroll = () => {
  const totalItems = props.items.length
  const start = startIndex.value
  const end = endIndex.value
  const visible = visibleItems.value.length
  
  const report = {
    isValid: true,
    totalItems,
    startIndex: start,
    endIndex: end,
    visibleCount: visible,
    expectedCount: Math.min(end + 1 - start, totalItems - start),
    scrollPosition: props.scrollTop,
    containerHeight: containerHeightPx.value,
    itemHeight: props.itemHeight,
    overscan: props.overscan,
    issues: []
  }
  
  // Check for common issues
  if (start < 0) {
    report.issues.push('startIndex is negative')
    report.isValid = false
  }
  
  if (end >= totalItems && totalItems > 0) {
    report.issues.push('endIndex exceeds total items')
    report.isValid = false
  }
  
  if (visible !== report.expectedCount) {
    report.issues.push(`Visible count mismatch: expected ${report.expectedCount}, got ${visible}`)
    report.isValid = false
  }
  
  if (start > end) {
    report.issues.push('startIndex is greater than endIndex')
    report.isValid = false
  }
  
  return report
}

// Function to simulate scrolling through all data
const validateAllData = () => {
  const results = []
  const itemHeight = props.itemHeight
  const containerHeight = containerHeightPx.value
  const totalItems = props.items.length
  
  // Simulate scroll through entire dataset
  for (let scrollPos = 0; scrollPos <= totalItems * itemHeight; scrollPos += itemHeight) {
    const tempStartIndex = Math.max(0, Math.floor(scrollPos / itemHeight) - props.overscan)
    const viewportItemCount = Math.ceil(containerHeight / itemHeight)
    const tempEndIndex = Math.min(totalItems - 1, tempStartIndex + viewportItemCount + props.overscan * 2)
    
    results.push({
      scrollTop: scrollPos,
      startIndex: tempStartIndex,
      endIndex: tempEndIndex,
      visibleCount: tempEndIndex - tempStartIndex + 1
    })
  }
  
  // Check for gaps or overlaps
  const coveredIndices = new Set()
  results.forEach(result => {
    for (let i = result.startIndex; i <= result.endIndex; i++) {
      coveredIndices.add(i)
    }
  })
  
  const missingIndices = []
  for (let i = 0; i < totalItems; i++) {
    if (!coveredIndices.has(i)) {
      missingIndices.push(i)
    }
  }
  
  return {
    totalScrollPositions: results.length,
    coveredIndices: coveredIndices.size,
    totalItems,
    missingIndices,
    isComplete: missingIndices.length === 0,
    scrollPositions: results
  }
}

// Expose computed values
defineExpose({
  startIndex,
  endIndex,
  visibleItems,
  offsetY,
  bottomSpacerHeight,
  // Validation functions
  validateVirtualScroll,
  validateAllData
})
</script>
