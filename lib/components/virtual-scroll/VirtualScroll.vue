<template>
	<div ref="virtualWrapper" class="overflow-y-auto" v-bind="$attrs">
		<!-- Virtual Scroll Enabled -->
		<div
			v-if="computedEnabled"
			class="relative"
			:style="{
				height: rowVirtualizer.getTotalSize() + 'px',
			}"
		>
			<!-- Virtual Rows -->
			<template v-if="count > 0">
				<div
					v-for="virtualRow in virtualItems"
					:key="`row-${virtualRow.index}`"
					:ref="el => measureRows(el)"
					:data-index="virtualRow.index"
					:data-virtual-row="virtualRow.index"
					:class="cn('absolute', getItemClass(virtualRow))"
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
					:class="cn(getItemClass({ index: index - 1 }))"
					@click="handleRowClick(index - 1)"
				>
					<slot :rowIndex="index - 1" />
				</div>
			</template>
		</div>

		<!-- Loading State - Skeleton Rows -->
		<div>
			<slot name="loading" />
		</div>
	</div>
</template>

<script setup>
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, defineEmits, ref, watch, onUnmounted } from 'vue'
import { cn } from '../../utils/tw-merge'
import toPX from '../../utils/to-px'

const props = defineProps({
	total: {
		type: Number,
		default: 0,
	},
	dataLength: {
		type: Number,
		default: 0,
	},
	itemClass: {
		type: [String, Function, Object, Array],
		default: '',
	},
	itemStyle: {
		type: [String, Object, Function],
		default: () => ({}),
	},
	estimateSize: {
		type: [Number, Function],
		default: 48, // Default row height
	},
	enabled: {
		type: Boolean,
		default: true,
	},
	infiniteScroll: {
		type: Boolean,
		default: false,
	},
	overscan: {
		type: Number,
		default: 5,
	},
	scrollY: {
		type: [String, Number],
		default: '',
	},
})

// ============================
// VIRTUAL SCROLLING IMPLEMENTATION
// ============================
const virtualWrapper = ref(null)

const emit = defineEmits(['row-click', 'load-more'])

const count = computed(() => {
	return props.dataLength || 0
})

const computedEnabled = computed(() => {
	if (!props.enabled) return false
	
	// compare rowVirtualizer.getTotalSize() with scrollY
	if (props.scrollY && virtualWrapper.value) {
		const wrapperMaxHeight = toPX(virtualWrapper.value.style.maxHeight)
		if (wrapperMaxHeight === null) return false
		return virtualWrapper.value.scrollHeight > wrapperMaxHeight
	}

	return true
})

// Create reactive virtualizer with dynamic height
let rowVirtualizer = initializeVirtualizer()
const lastPos = ref(0)

watch(count, newValue => {
	if (newValue) {
		lastPos.value = rowVirtualizer.value.scrollOffset
		rowVirtualizer = initializeVirtualizer()
		rowVirtualizer.value.scrollToOffset(lastPos.value)
	}
})

const virtualItems = computed(() => {
	return rowVirtualizer.value.getVirtualItems()
})

function initializeVirtualizer() {
	return useVirtualizer({
		count: count.value,
		getScrollElement: () => virtualWrapper.value,
		estimateSize: () => 48,
		overscan: props.overscan,
		enabled: props.enabled,
	})
}

let rafId = null
const elementsToMeasure = new Set()

function measureRows(el) {
	if (!el) return
	
	elementsToMeasure.add(el)
	
	if (rafId) return
	
	rafId = requestAnimationFrame(() => {
		elementsToMeasure.forEach(element => {
				rowVirtualizer.value.measureElement(element)
		})
		elementsToMeasure.clear()
		rafId = null
	})
}

onUnmounted(() => {
	if (rafId) {
		cancelAnimationFrame(rafId)
	}
})

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
			...props.itemStyle(row),
		}
	} else if (props.itemStyle) {
		finalStyle = {
			...baseStyle,
			...props.itemStyle,
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
	if (virtualWrapper.value && virtualWrapper.value.addEventListener) {
		virtualWrapper.value.addEventListener(event, handler)
	}
}

function scrollToLeft(position) {
	if (virtualWrapper.value && virtualWrapper.value.scrollLeft !== position) {
		virtualWrapper.value.scrollLeft = position
	}
}

// Alternative: scroll-based infinite loading
function handleScroll() {
	if (!props.enabled || !props.infiniteScroll || !virtualWrapper.value) return

	// Only trigger if there's more data to load
	if (props.dataLength >= props.total) return

	const { scrollTop, scrollHeight, clientHeight } = virtualWrapper.value
	const scrollThreshold = 100 // pixels from bottom

	// Check if user scrolled near bottom
	if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
		emit('load-more')
	}
}

// Add scroll listener for more reliable infinite scroll
watch(
	virtualWrapper,
	newWrapper => {
		// Add new listener
		if (newWrapper) {
			newWrapper.addEventListener('scroll', handleScroll)
		}
	},
	{ immediate: true }
)

// Cleanup on unmount
onUnmounted(() => {
	if (virtualWrapper.value) {
		virtualWrapper.value.removeEventListener('scroll', handleScroll)
	}
})

function scrollToOffset(position) {
	if (rowVirtualizer.value) {
		rowVirtualizer.value.scrollToOffset(position)
	}
}

defineExpose({
	addEventListener,
	scrollToLeft,
	virtualWrapper,
	scrollToOffset,
})
</script>
