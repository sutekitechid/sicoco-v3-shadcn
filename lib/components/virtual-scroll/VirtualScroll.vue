<template>
  <div 
    ref="tableVirtualWrapper"
    class="overflow-auto"
    v-bind="$attrs"
  >
    <div 
      class="relative"
      :style="{ 
        height: rowVirtualizer.getTotalSize() + 'px'
      }"
    >
      <!-- Virtual Rows -->
      <template v-if="length > 0">
        <div
          v-for="virtualRow in rowVirtualizer.getVirtualItems()"
          :key="`row-${virtualRow.index}`"
          :ref="(el) => measureRows(el)"
          :data-index="virtualRow.index"
          :data-virtual-row="virtualRow.index"
          :class="cn(
            'absolute',
            getItemClass(virtualRow),
          )"
          :style="getItemStyle(virtualRow)"
          @click="handleRowClick(virtualRow.index)"
        >
          <slot :rowIndex="virtualRow.index" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useVirtualizer } from '@tanstack/vue-virtual'
import { watch, nextTick, defineEmits, ref } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps({
  length: {
    type: Number,
    default: 0
  },
  itemClass: {
    type: [String, Function, Object, Array],
    default: ''
  },
  itemStyle: {
    type: [String, Object, Function],
    default: () => ({})
  },
  estimateSize: {
    type: [Number, Function],
    default: 48 // Default row height
  },
})

// ============================
// VIRTUAL SCROLLING IMPLEMENTATION
// ============================
const tableVirtualWrapper = ref(null)

const emit = defineEmits(['row-click'])

// Create reactive virtualizer with dynamic height
let rowVirtualizer = initializeVirtualizer()

// Clear height cache when data changes significantly
watch(() => props.length, async() => {
  await nextTick()

	// Recreate virtualizer with new data
	rowVirtualizer = initializeVirtualizer()
}, { immediate: true })

function initializeVirtualizer() {
  return  useVirtualizer({
		count: props.length || 0,
		getScrollElement: () => tableVirtualWrapper.value,
		estimateSize: () => 48,
		measureElement: (el) => el.getBoundingClientRect().height,
		overscan: 5,
	})
}

function measureRows(el) {
	if (el) {
		rowVirtualizer.value.measureElement(el)
	}
}

function handleRowClick(index) {
  // Emit event or handle row click logic
  emit('row-click', index)
}

function getItemClass(row) {
  // Return custom row class if provided
  if (typeof props.itemClass === 'function') {
    return props.itemClass(row)
  }
  return props.itemClass
}

function getItemStyle(row) {
  const baseStyle = {
    top: `${row.start}px`,
  }
  
  let finalStyle = baseStyle
  
  // Merge custom row style if provided
  if (typeof props.itemStyle === 'function') {
    finalStyle = {
      ...baseStyle,
      ...props.itemStyle(row)
    }
  } else if (props.itemStyle) {
    finalStyle = {
      ...baseStyle,
      ...props.itemStyle
    }
  }
  
  // Convert style object to CSS string
  return Object.entries(finalStyle)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join('; ')
}

function addEventListener(event, handler) {
  if (tableVirtualWrapper.value && tableVirtualWrapper.value.addEventListener) {
    tableVirtualWrapper.value.addEventListener(event, handler)
  }
}

function scrollToLeft(position) {
  if (tableVirtualWrapper.value && tableVirtualWrapper.value.scrollLeft !== position) {
    tableVirtualWrapper.value.scrollLeft = position
  }
}

defineExpose({
  addEventListener,
  scrollToLeft
})
</script>
