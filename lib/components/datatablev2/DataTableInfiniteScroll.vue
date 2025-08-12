<!--
DataTableInfiniteScroll Component

This component handles infinite scroll functionality for DataTable pagination.
When infinite scroll is enabled, it replaces the virtual scrolling mechanism
and automatically loads more data when the user scrolls near the bottom.

Purpose:
- Provides seamless pagination experience without manual page navigation
- Automatically detects when user reaches near the bottom of the content
- Triggers data loading events for parent components to handle
- Manages loading states and prevents duplicate requests
- Replaces virtual scrolling when enabled (infinite scroll takes precedence)

Usage:
- Used instead of VirtualScroll component when props.infiniteScroll is true
- Renders all data rows without virtualization
- Monitors scroll position to trigger load more functionality
-->

<template>
	<div 
		ref="infiniteScrollContainer"
		:class="[
			'overflow-auto -mt-2 text-sm',
			showFooter && dynamicFooterRows.length > 0 ? 'hide-scrollbar-x' : '',
      $attrs.class
		]"
		:style="{ maxHeight: scrollY }"
		@scroll="handleScroll"
	>
		<!-- Render all rows without virtualization -->
		<div 
			v-for="(rowData, rowIndex) in data" 
			:key="getRowKey(rowData, rowIndex)"
      class="flex table-row"
		>
			<DataTableRowContent
				:row-data="rowData"
				:row-index="rowIndex"
				:selectable="selectable"
				:show-numbering="showNumbering"
				:row-size="rowSize"
				:checkbox-data-cy="checkboxDataCy"
				:get-virtual-row-columns="getVirtualRowColumns"
				:get-row-number="getRowNumber"
				:get-special-virtual-cell-width-style="getSpecialVirtualCellWidthStyle"
				:get-data-cell-classes="getDataCellClasses"
				:get-pinned-column-styles="getPinnedColumnStyles"
				:get-virtual-cell-width-style="getVirtualCellWidthStyle"
				:is-row-selected="isRowSelected"
				:select-rows="selectRows"
				:on-select-row="onSelectRow"
				:flattened-header-rows="flattenedHeaderRows"
				:is-row-selectable="isRowSelectable"
			/>
		</div>

		<!-- Loading indicator -->
		<div v-if="loading && hasMoreData" class="flex items-center justify-center p-4">
			<Skeleton class="h-4 w-full" />
		</div>
	</div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { handleInfiniteScroll, getTotalPages } from '../../utils/pagination'
import { DEBOUNCE_DURATION } from '../../utils/constants'
import DataTableRowContent from './DataTableRowContent.vue'
import Skeleton from '../skeleton/Skeleton.vue'

// Props
const props = defineProps({
	data: {
		type: Array,
		required: true
	},
	// Pagination props
	page: {
		type: Number,
		required: true
	},
	perPage: {
		type: [Number, String],
		required: true
	},
	total: {
		type: Number,
		required: true
	},
	loading: {
		type: Boolean,
		default: false
	},
	// Display props
	selectable: {
		type: Boolean,
		default: false
	},
	showNumbering: {
		type: Boolean,
		default: true
	},
	showFooter: {
		type: Boolean,
		default: false
	},
	dynamicFooterRows: {
		type: Array,
		default: () => []
	},
	// Styling props
	rowSize: {
		type: String,
		required: true
	},
	scrollY: {
		type: String,
		required: true
	},
	checkboxDataCy: {
		type: String,
		default: ''
	},
	// Key generation
	rowKey: {
		type: String,
		default: 'id'
	},
	// Function props
	getRowKey: {
		type: Function,
		required: true
	},
	getVirtualRowColumns: {
		type: Function,
		required: true
	},
	getRowNumber: {
		type: Function,
		required: true
	},
	getSpecialVirtualCellWidthStyle: {
		type: Function,
		required: true
	},
	getDataCellClasses: {
		type: Function,
		required: true
	},
	getPinnedColumnStyles: {
		type: Function,
		required: true
	},
	getVirtualCellWidthStyle: {
		type: Function,
		required: true
	},
	isRowSelected: {
		type: Function,
		required: true
	},
	selectRows: {
		type: Function,
		required: true
	},
	onSelectRow: {
		type: Function,
		required: true
	},
	// Data arrays
	flattenedHeaderRows: {
		type: Array,
		required: true
	},
	isRowSelectable: {
		type: Array,
		required: true
	}
})

// Emits
const emit = defineEmits(['load-more', 'scroll'])

// Refs
const infiniteScrollContainer = ref(null)

// Computed properties
const hasMoreData = computed(() => {
	const totalPages = getTotalPages(props.total, props.perPage)
	return props.page < totalPages
})

// Debounced scroll handler
const debouncedScrollHandler = useDebounceFn(() => {
	if (!infiniteScrollContainer.value || props.loading || !hasMoreData.value) return
	
	handleInfiniteScroll(
		infiniteScrollContainer.value,
		() => emit('load-more')
	)
}, DEBOUNCE_DURATION)

// Handle scroll events
function handleScroll(event) {
	// Emit scroll event for horizontal scroll synchronization
	emit('scroll', event)
	
	// Handle infinite scroll detection
	debouncedScrollHandler()
}

// Setup scroll listener
onMounted(() => {
	// Initial scroll check in case content doesn't fill the container
	nextTick(() => {
		if (infiniteScrollContainer.value && !props.loading && hasMoreData.value) {
			const container = infiniteScrollContainer.value
			const hasVerticalScroll = container.scrollHeight > container.clientHeight
			
			// If content doesn't fill container and there's more data, trigger load
			if (!hasVerticalScroll) {
				emit('load-more')
			}
		}
	})
})

// Cleanup
onUnmounted(() => {
	// Debounced function cleanup is handled automatically by VueUse
})

function addEventListener(event, handler) {
  if (infiniteScrollContainer.value) {
    infiniteScrollContainer.value.addEventListener(event, handler)
  }
}

// Expose container ref for parent access
defineExpose({
  addEventListener,
	scrollToLeft: (scrollLeft) => {
		if (infiniteScrollContainer.value) {
			infiniteScrollContainer.value.scrollLeft = scrollLeft
		}
	}
})
</script>

<style scoped>
.hide-scrollbar-x::-webkit-scrollbar:horizontal {
	display: none; /* Chrome, Safari, Opera */
}

/* Alternative approach - hide only horizontal scrollbar */
.hide-scrollbar-x::-webkit-scrollbar {
	height: 0px; /* Hide horizontal scrollbar */
	width: 8px; /* Keep vertical scrollbar */
}
</style>
