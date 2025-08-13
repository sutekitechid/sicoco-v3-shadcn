<template>
  <div 
    ref="tableVirtualWrapper"
    class="overflow-auto"
    v-bind="$attrs"
  >
    <!-- Virtual Scroll Enabled -->
    <div 
      v-if="enabled"
      class="relative"
      :style="{ 
        height: rowVirtualizer.getTotalSize() + 'px'
      }"
    >
      <!-- Virtual Rows -->
      <template v-if="count > 0">
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
    
    <!-- Virtual Scroll Disabled - Render All Items -->
    <div v-else class="relative">
      <template v-if="count > 0">
        <div
          v-for="index in count"
          :key="`row-${index - 1}`"
          :data-index="index - 1"
          :class="cn(
            getItemClass({ index: index - 1 }),
          )"
          @click="handleRowClick(index - 1)"
        >
          <slot :rowIndex="index - 1" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, defineEmits, ref, watchEffect, watch } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  dataLength: {
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
  enabled: {
    type: Boolean,
    default: true
  },
  infiniteScroll: {
    type: Boolean,
    default: false
  },
  overscan: {
    type: Number,
    default: 5
  }
})

// ============================
// VIRTUAL SCROLLING IMPLEMENTATION
// ============================
const tableVirtualWrapper = ref(null)

const emit = defineEmits(['row-click', 'load-more'])

const count = computed(() => {
  if (props.infiniteScroll) {
    return props.total || 0
  }
  return props.dataLength || 0
})

// Create reactive virtualizer with dynamic height
let rowVirtualizer = initializeVirtualizer()

watch(count, (newValue) => {
  if (newValue) {
    rowVirtualizer = initializeVirtualizer()
  }
})

function initializeVirtualizer() {
  return useVirtualizer({
		count: count.value,
		getScrollElement: () => tableVirtualWrapper.value,
		estimateSize: () => 48,
		measureElement: (el) => el.getBoundingClientRect().height,
		overscan: props.overscan,
    enabled: props.enabled
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

// Infinite scroll handler
watchEffect(() => {
  if (!props.enabled) return
  if (!props.infiniteScroll) return

  const virtualItems = rowVirtualizer.value.getVirtualItems()
  const lastItem = virtualItems[virtualItems.length - 1]
  
  if (lastItem && lastItem.index >= props.dataLength - props.overscan) {
    emit('load-more')
  }
})

defineExpose({
  addEventListener,
  scrollToLeft
})
</script>
