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
import { watch, nextTick, onMounted, defineEmits, ref } from 'vue'
import { useDebounceFn  } from '@vueuse/core'
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

// Dynamic height measurement state
const rowHeights = ref(new Map()) // Map<rowIndex, height>
const measuredRows = ref(new Set()) // Set of measured row indices
const emit = defineEmits(['row-click'])

// Create reactive virtualizer with dynamic height
let rowVirtualizer = useVirtualizer({
	count: props.length || 0,
	getScrollElement: () => tableVirtualWrapper.value,
	estimateSize: getRowHeight,
	measureElement: (element) => {
		// Custom measurement function for dynamic heights
		const rowIndex = parseInt(element.getAttribute('data-virtual-row'))
		const height = element.offsetHeight
		
		if (height > 0 && !isNaN(rowIndex)) {
			rowHeights.value.set(rowIndex, height)
			measuredRows.value.add(rowIndex)
		}
		
		return height
	},
	overscan: 5,
})

// Get dynamic row height for virtualizer
function getRowHeight(index) {
	// Return cached height if available
	if (rowHeights.value.has(index)) {
		return rowHeights.value.get(index)
	}
	
  // Fallback to estimate size if not measured
  return typeof props.estimateSize === 'function' ? props.estimateSize(index) : props.estimateSize
}

// Clear height cache when data changes significantly
watch(() => props.length, async(newLength, oldLength) => {
  await nextTick()
	// Clear cache if data length changes significantly or data is completely new
	if (!oldLength || !newLength || Math.abs(newLength - oldLength) > 10) {
		rowHeights.value.clear()
		measuredRows.value.clear()
	}

  console.log('Data length changed, clearing height cache:', newLength, oldLength)
	
	// Recreate virtualizer with new data
	rowVirtualizer = useVirtualizer({
		count: newLength || 0,
		getScrollElement: () => tableVirtualWrapper.value,
		estimateSize: () => 48,
		measureElement: (el) => el.getBoundingClientRect().height,
		overscan: 5,
	})
}, { immediate: true })

function measureRows(el) {
	if (el) {
		rowVirtualizer.value.measureElement(el)
	}
}


// Setup dynamic height measurement observer
function setupDynamicHeightObserver() {
	if (!tableVirtualWrapper.value) return
	
	// Use MutationObserver untuk detect perubahan pada virtual rows
	const observer = new MutationObserver((mutations) => {
		let shouldTriggerMeasurement = false
		
		mutations.forEach((mutation) => {
			// Check untuk added nodes (new virtual rows)
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE && 
						node.hasAttribute && 
						node.hasAttribute('data-virtual-row')) {
						shouldTriggerMeasurement = true
					}
				})
			}
			
			// Check untuk style changes yang might affect height
			if (mutation.type === 'attributes' && 
				(mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
				shouldTriggerMeasurement = true
			}
		})
		
		if (shouldTriggerMeasurement) {
			// Debounce measurement untuk avoid excessive calls
			triggerHeightMeasurement()
		}
	})
	
	// Observe virtual container dan semua descendants
	observer.observe(tableVirtualWrapper.value, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['style', 'class', 'data-virtual-row']
	})
	
	// Store observer reference untuk cleanup (optional)
	tableVirtualWrapper.value._heightObserver = observer
}

onMounted(() => {
  // Setup observer after component is mounted
  setupDynamicHeightObserver()
})

// Trigger height measurement untuk row yang baru rendered (debounced)
function triggerHeightMeasurement() {
  useDebounceFn(() => {
    if (!tableVirtualWrapper.value) return
    
    nextTick(() => {
      const virtualRows = tableVirtualWrapper.value.querySelectorAll('div[data-virtual-row]')
      let hasNewMeasurements = false
      
      virtualRows.forEach(element => {
        const rowIndex = parseInt(element.getAttribute('data-virtual-row'))
        const height = element.offsetHeight
        
        if (height > 0 && !isNaN(rowIndex)) {
          const existingHeight = rowHeights.value.get(rowIndex)
          
          // Only update if height changed significantly (more than 2px difference)
          if (!existingHeight || Math.abs(existingHeight - height) > 2) {
            rowHeights.value.set(rowIndex, height)
            measuredRows.value.add(rowIndex)
            hasNewMeasurements = true
          }
        }
      })
      
      // Optionally trigger virtualizer update if significant changes detected
      if (hasNewMeasurements && rowVirtualizer) {
        // Force virtualizer to recalculate if needed
        // This is automatically handled by @tanstack/vue-virtual
      }
    })
  }, 100) // Debounce for 100ms to avoid excessive calls
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
