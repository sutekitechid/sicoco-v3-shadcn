<template>
	<div :id="id" class="w-full flex flex-col relative gap-4" :data-cy="dataCy">
		<!-- Horizontal Scroll Wrapper with Indicators -->
		<DataTableScrollWrapper
			ref="dataTableScrollWrapper"
			:enable-horizontal-scroll="false"
			:max-height="computedScrollY"
			:sticky-header="stickyHeaders"
			class="border-b"
			@scroll="onScrollEvent"
		>
			<!-- Table -->
			<Table :id="`${id}-table`">
				<!-- Table Header -->
				<TableHeader v-if="(data && data.length !== 0) || loading " :sticky="stickyHeaders">
					<TableRow
						v-for="(row, rowIndex) in headerRows"
						:key="`header-row-${rowIndex}`"
					>
						<!-- Selection Header Column -->
						<TableHead
							v-if="selectable && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] bg-white sticky left-0 z-30"
						>
							<Checkbox
								:model-value="isAnySelected"
								:indeterminate="isIndeterminate"
								:value="true"
								:disabled="isSelectAllDisabled"
								:data-cy="checkboxAllDataCy"
								class="mx-auto"
								@click="selectAll"
							/>
						</TableHead>

						<!-- Numbering Header Column -->
						<TableHead
							v-if="showNumbering && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							class="text-center w-[3.75rem]"
						>
							No.
						</TableHead>

						<!-- Data Header Columns -->
						<template
							v-for="(col, colIndex) in row"
							:key="`header-cell-${rowIndex}-${colIndex}`"
						>
							<TableHead
								:colspan="col.colspan"
								:rowspan="col.rowspan"
								:size="rowSize"
								:data-field="col.field"
								:class="cn(
									getHeaderCellClasses(col),
									hasHiddenColumnOnLeft(colIndex, row) && 'border-l-4 border-l-warning-50',
									isRightmostVisibleColumn(colIndex, row) && hasHiddenColumnOnRight(colIndex, row) && 'border-r-4 border-r-warning-50'
								)"
								:style="{ 
									...getPinnedColumnStyles(col.compositeFieldId), 
									...getColumnWidthStyle(col.compositeFieldId || col.field) 
								}"
							>
								<div class="flex items-center justify-between gap-2">
									<div :class="getHeaderContentClasses(col)">
										<component :is="col.header" />
									</div>
									<div class="flex items-center">
										<!-- Settings Dropdown -->
										<DataTableDropdownSettings
											v-if="enableTableSettings"
											:column-field="col.field"
											:column-position="colIndex"
											:column-visibility="columnVisibility"
											:all-leaf-columns="allLeafColumns"
											:row-size="rowSize"
											:show-pin-options="true"
											:is-pinned-left="
												isPinnedLeft(col.compositeFieldId || col.field)
											"
											:is-pinned-right="
												isPinnedRight(col.compositeFieldId || col.field)
											"
											:is-pinned="isPinned(col.compositeFieldId || col.field)"
											:show-hide-column="!col.hasSubheader"
											@hide-column="
												hideColumn(col.compositeFieldId || col.field)
											"
											@update:column-visibility="setHiddenColumns($event)"
											@update:row-size="rowSize = $event"
											@reset-table="resetTable"
											@pin-left="handlePinLeft(col.compositeFieldId)"
											@pin-right="handlePinRight(col.compositeFieldId)"
											@unpin="handleUnpin(col.compositeFieldId)"
										/>
										<!-- Sort Button -->
										<DataTableSortButton
											v-if="shouldShowSortControls(col)"
											:sort-state="getSortState(col.field)"
											:sort-index="getSortIndex(col.field)"
											:show-sort-controls="true"
											@toggle-sort="toggleSort(col.field)"
										/>
									</div>
								</div>
							</TableHead>
						</template>
					</TableRow>
				</TableHeader>

				<!-- Empty State -->
				<template v-if="data && data.length === 0 && !loading">
					<slot name="empty" />
				</template>
			</Table>
		</DataTableScrollWrapper>
		<!-- Virtual Scroll Container with Div Layout -->
		<div 
			ref="tableVirtualWrapper" 
			class="overflow-auto -mt-2" 
			:style="{ height: scrollY }"
			@scroll="onVirtualScrollEvent"
		>
			<div 
				class="relative"
				:style="{ 
					height: rowVirtualizer.getTotalSize() + 'px',
					minWidth: 'max-content'
				}"
			>
				<!-- Virtual Rows -->
				<template v-if="data && data.length">
					<div
						v-for="virtualRow in rowVirtualizer.getVirtualItems()"
						:key="`row-${virtualRow.index}`"
						:data-virtual-row="virtualRow.index"
						:class="cn(
							'absolute flex bg-background hover:bg-muted/50 transition-colors border-b',
							getDataRowClasses(virtualRow.index, getVirtualRowData(virtualRow)),
							props.selectable && 'cursor-pointer'
						)"
						:style="{
							top: `${virtualRow.start}px`,
							height: `${virtualRow.size}px`,
							left: '0',
							display: 'flex',
							alignItems: 'center',
							minWidth: 'max-content'
						}"
						@click="selectRows(getVirtualRowData(virtualRow))"
						@vue:mounted="triggerHeightMeasurement"
						@vue:updated="triggerHeightMeasurement"
					>
						<!-- Selection Cell -->
						<div
							v-if="selectable"
							:class="cn(
								'flex items-center justify-center bg-white sticky left-0 z-20 flex-shrink-0',
								rowSize === 'sm' ? 'px-2' : rowSize === 'lg' ? 'px-4' : 'px-3'
							)"
							:style="{ 
								width: '60px',
								minWidth: '60px',
								maxWidth: '60px'
							}"
						>
							<Checkbox
								:model-value="isRowSelected(getVirtualRowData(virtualRow))"
								:value="true"
								:disabled="!computedIsRowSelectable[virtualRow.index]"
								:data-cy="checkboxDataCy"
								class="mx-auto"
							/>
						</div>

						<!-- Numbering Cell -->
						<div
							v-if="showNumbering"
							:class="cn(
								'flex items-center justify-center font-medium text-muted-foreground flex-shrink-0',
								rowSize === 'sm' ? 'px-2 text-xs' : rowSize === 'lg' ? 'px-4 text-sm' : 'px-3 text-sm'
							)"
							:style="{ 
								width: '60px',
								minWidth: '60px',
								maxWidth: '60px'
							}"
						>
							{{ getRowNumber(virtualRow.index) }}
						</div>

						<!-- Data Cells -->
						<template
							v-for="(cell, cellIndex) in getVirtualRowColumns(getVirtualRowData(virtualRow), virtualRow.index)"
							:key="`cell-${virtualRow.index}-${cellIndex}`"
						>
							<div
								:data-field="cell.compositeFieldId || cell.field"
								:class="cn(
									'flex items-center flex-shrink-0',
									getDataCellClasses(cell, flattenedHeaderRows[cellIndex], flattenedHeaderRows[cellIndex + 1]),
									rowSize === 'sm' ? 'px-2 py-1 text-xs' : rowSize === 'lg' ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-sm'
								)"
								:style="{ 
									...getPinnedColumnStyles(cell.compositeFieldId),
									...getVirtualCellWidthStyle(cell, cell.bodyColspan || 1)
								}"
							>
								<component :is="cell.cell" :row="getVirtualRowData(virtualRow)" :index="virtualRow.index" />
							</div>
						</template>
					</div>
				</template>
			</div>
		</div>

		<!-- Pagination -->
		<Pagination
			v-if="paginated && data.length"
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="total"
			@change-page="onChangePage"
			@change-per-page="onChangePerPage"
		/>
	</div>
	<slot />
</template>

<script setup>
import {
	computed,
	ref,
	watch,
	nextTick,
	onMounted,
	reactive,
	provide,
	readonly
} from "vue";

import { useDebounceFn, useVModel, useThrottleFn, useResizeObserver } from '@vueuse/core'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { cn } from '../../utils/tw-merge'
import { handleInfiniteScroll, getTotalPages } from '@/utils/pagination'
import { DEBOUNCE_DURATION } from '@/utils/constants'

// Components
import {
	Table,
	TableHead,
	TableHeader,
	TableRow,
} from '../table'
import { Checkbox } from '../../components/checkbox'
import { Pagination } from '../../components/pagination'
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'
import DataTableSortButton from './DataTableSortButton.vue'

// Constants and Variants
import {
	COLUMN_SIZE,
	datatableHeaderVariants,
	datatableHeaderContentVariants,
	datatableDataCellVariants,
	datatableDataRowVariants
} from '.'

// Composables
import {
	useDataTablePersistence,
	useColumnVisibility,
	useTreeOperations,
	useColumnSorting,
	useDataTablePinning,
	useHiddenColumnDetection,
} from './composables/index.js'

// ============================
// PROPS & EMITS
// ============================
const props = defineProps({
	data: Array,
	// Column visibility
	enableColumnVisibility: {
		type: Boolean,
		default: true,
	},
	id: {
		type: String,
		default: 'datatable',
	},
	persistState: {
		type: Boolean,
		default: true,
	},
	// Horizontal scroll settings
	enableHorizontalScroll: {
		type: Boolean,
		default: true,
	},
	minColumnWidth: {
		type: String,
		default: '120px',
	},
	tableMinWidth: {
		type: String,
		default: 'full',
	},
	// Pagination
	paginated: {
		type: Boolean,
		default: false,
	},
	page: {
		type: Number,
		default: 1,
	},
	perPage: {
		type: [Number, String],
		default: 20,
	},
	total: {
		type: Number,
		default: 0,
	},
	// Display options
	showNumbering: {
		type: Boolean,
		default: true,
	},
	showFooter: {
		type: Boolean,
		default: false,
	},
	stickyFooter: {
		type: Boolean,
		default: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	// Virtual Scrolling Performance
	virtualScrollThreshold: {
		type: Number,
		default: 20,
	},
	virtualScrollThrottle: {
		type: Number,
		default: 30, // Throttle for virtual scroll updates
	},
	// Column width preservation
	preserveColumnWidths: {
		type: Boolean,
		default: true,
	},
	// Selection
	selectable: {
		type: Boolean,
		default: false,
	},
	rowKey: {
		type: String,
		default: 'id',
	},
	modelValue: {
		type: Array,
		default: () => [],
	},
	multipleSort: {
		type: Boolean,
		default: false,
	},
	stickyHeaders: {
		type: Boolean,
		default: true,
	},
	scrollY: {
		type: String,
		default: '40rem',
	},
	isRowSelectable: {
		type: Function,
		default: () => () => true,
	},
	infiniteScroll: {
		type: Boolean,
		default: false,
	},
	dataCy: {
		type: String,
		default: '',
	},
	itemHeight: {
		type: Number,
		default: undefined
	},
	enableTableSettings: {
		type: Boolean,
		default: true
	},
	enableVirtualScroll: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits([
	'column-visibility-change',
	'update:page',
	'update:perPage',
	'update:modelValue',
	'sort',
])

// ============================
// REACTIVE STATE
// ============================
const groups = reactive([])
const columns = reactive([])
const rowSize = ref(COLUMN_SIZE.Medium)

// Column width preservation state
const savedColumnWidths = ref(new Map()) // Map<fieldId, width>
const isColumnWidthsCaptured = ref(false)

// Rowspan tracking state - tracks which columns should be skipped in each row
const rowspanTracker = ref(new Map()) // Map<rowIndex, Set<columnIndex>>

// Clear rowspan tracker when data changes
watch(() => props.data, () => {
	rowspanTracker.value.clear()
}, { deep: true })

// ============================
// VIRTUAL SCROLLING OPTIMIZATION
// ============================

// Virtual scroll state
const scrollTop = ref(0)
const lastScrollTop = ref(0)

// Check if virtual scrolling should be enabled (based on scrollY and threshold)
const shouldUseVirtualScroll = computed(() => {
	if (!props.enableVirtualScroll) return false
  // Disable virtual scroll if infinite scroll is enabled
  if (props.infiniteScroll) return false
  
  const hasScrollY = !!props.scrollY
  const hasData = props.data && props.data.length > 0
  const exceedsThreshold = props.data && props.data.length > props.virtualScrollThreshold
  return hasScrollY && hasData && exceedsThreshold
})

const rowRefs = ref([])
const actualRowHeight = ref(getRowheightBasedOnRowSize(rowSize.value))

// Use ResizeObserver to update actualRowHeight reactively
function observeRowHeight() {
	const ROW_HEIGHT_DEBOUNCE_DURATION = 500 // Debounce duration for row height updates
	const ROW_HEIGHT_UPDATE_THRESHOLD = 20

	useResizeObserver(rowRefs, useDebounceFn((entries) => {
		let totalHeight = 0
		let totalRows = 0
		if (entries.length > 0) {
			entries.forEach(entry => {
				if (entry.contentRect) {
					totalHeight += entry.contentRect.height
					totalRows++
				}
			})

			const avgHeight = totalHeight / (totalRows || 1)
			// Only update if the change is significant (more than 20px)
			if (Math.abs(actualRowHeight.value - avgHeight) > ROW_HEIGHT_UPDATE_THRESHOLD) {
				actualRowHeight.value = Math.ceil(avgHeight)
			}
		} else {
			// Fallback to calculated height based on row size
			actualRowHeight.value = getRowheightBasedOnRowSize(rowSize.value)
		}
	}, ROW_HEIGHT_DEBOUNCE_DURATION))
}

// Calculate row height based on table cell size (fallback)
function getRowheightBasedOnRowSize(size) {
	// Base height includes border, text line height, and padding
	const baseHeight = 20 // Approximate text line height + border
	
	// Padding values based on table cell variants
	const paddingMap = {
		'sm': 8,  // p-2 = 0.5rem = 8px
		'md': 14, // p-3.5 = 0.875rem = 14px  
		'lg': 16, // p-4 = 1rem = 16px
	}
	
	const padding = paddingMap[size] || paddingMap['md']
	return baseHeight + (padding * 2) // top + bottom padding
}

// Optimized scroll handler with smart updates
const updateScrollTop = useThrottleFn((newScrollTop) => {
	// Only update if there's a meaningful change (at least 5px or item height difference)
	const threshold = actualRowHeight.value
	if (Math.abs(newScrollTop - lastScrollTop.value) >= threshold) {
		scrollTop.value = newScrollTop
		lastScrollTop.value = newScrollTop
	}
}, props.virtualScrollThrottle) // User-configurable throttling

// Row class cache for performance
const rowClassCache = new Map()

// Debounced infinite scroll handler
const handleInfiniteScrollDebounced = useDebounceFn(() => {
	if (!props.infiniteScroll) return
	if (dataTableScrollWrapper.value) {
		handleInfiniteScroll(
			dataTableScrollWrapper.value.scrollContainer,
			loadMoreData
		)
	}
}, DEBOUNCE_DURATION)

// Handle scroll events for both virtual scrolling and infinite scroll
function onScrollEvent(event) {
	// Handle virtual scrolling with optimized updates
	if (shouldUseVirtualScroll.value) {
		updateScrollTop(event.target.scrollTop)
	}
	
	// Handle infinite scroll
	if (props.infiniteScroll) {
		handleInfiniteScrollDebounced(event)
	}
	
	// Sync horizontal scroll dengan virtual scroll container
	syncHorizontalScrollToVirtual(event.target.scrollLeft)
}

// Handle scroll events khusus untuk virtual scroll container
function onVirtualScrollEvent(event) {
	// Handle vertical scroll untuk virtual scrolling
	if (shouldUseVirtualScroll.value) {
		updateScrollTop(event.target.scrollTop)
	}
	
	// Sync horizontal scroll dengan header table
	syncHorizontalScrollToHeader(event.target.scrollLeft)
	
	// Trigger height measurement untuk newly visible rows
	triggerHeightMeasurement()
}

// Sync horizontal scroll dari header ke virtual container
function syncHorizontalScrollToVirtual(scrollLeft) {
	if (tableVirtualWrapper.value && tableVirtualWrapper.value.scrollLeft !== scrollLeft) {
		tableVirtualWrapper.value.scrollLeft = scrollLeft
	}
}

// Sync horizontal scroll dari virtual container ke header
function syncHorizontalScrollToHeader(scrollLeft) {
	if (dataTableScrollWrapper.value && dataTableScrollWrapper.value.scrollContainer) {
		const headerScrollContainer = dataTableScrollWrapper.value.scrollContainer
		if (headerScrollContainer.scrollLeft !== scrollLeft) {
			headerScrollContainer.scrollLeft = scrollLeft
		}
	}
}

// Clear cache when data changes
watch(() => props.data, () => {
  rowClassCache.clear()
}, { flush: 'post' })

// ============================
// COMPOSABLES INITIALIZATION
// ============================
const persistence = useDataTablePersistence(props)
const {
	columnVisibility,
	isColumnVisible,
	toggleColumnVisibility,
	hideColumn,
	resetColumnVisibility,
	setHiddenColumns,
} = useColumnVisibility(emit)

const treeOps = useTreeOperations()

const {
	sortValue,
	toggleSort,
	getSortState,
	getSortIndex,
	clearSort,
	setSortState,
} = useColumnSorting(props, emit)

// ============================
// COMPUTED PROPERTIES - V-MODELS
// ============================
const computedPage = useVModel(props, 'page', emit)
const computedPerPage = useVModel(props, 'perPage', emit)
const computedModelValue = useVModel(props, 'modelValue', emit)

// ============================
// COMPUTED PROPERTIES - SELECTIONS
// ============================

// return true if all selectable rows meet the selection criteria
const computedIsRowSelectable = computed(() => {
	return props.data.map(row => props.isRowSelectable(row))
})

const selectableRows = computed(() => {
	return props.data.filter(row => props.isRowSelectable(row))
})

// Props for row identification
const rowKeyField = props.rowKey || 'id'

// Use WeakMap for object references and Map for primitive keys
const selectedRowsMap = computed(() => {
  const map = new Map()
  const weakMap = new WeakMap()
  
  computedModelValue.value.forEach((row, index) => {
    if (typeof row === 'object' && row !== null) {
      // For objects, prefer WeakMap with object reference
      // But also maintain Map with key for lookup
      const key = getRowKey(row, index)
      weakMap.set(row, true)
      map.set(key, row)
    } else {
      // For primitives, use Map
      map.set(row, true)
    }
  })
  
  return { map, weakMap }
})

const isIndeterminate = computed(() => {
	if (!computedModelValue.value || computedModelValue.value.length === 0)
		return false
	return computedModelValue.value.length < selectableRows.value.length
})

const isSelectAllDisabled = computed(() => {
	return selectableRows.value.length === 0
})

const isAnySelected = computed(() => {
	if (isSelectAllDisabled.value) {
		return false
	}
	return computedModelValue.value.length > 0
})

// Get unique identifier for a row
function getRowKey(row, index) {
  if (typeof row === 'object' && row !== null) {
    // Try to use specified key field first
    if (rowKeyField && row[rowKeyField] !== undefined) {
      return row[rowKeyField]
    }
    // Fallback to index-based key for objects without primary key
    return `row-${index}`
  }
  // For primitive values, use the value itself
  return row
}

// Optimized row selection check
function isRowSelected(row) {
  const { map, weakMap } = selectedRowsMap.value
  
  if (typeof row === 'object' && row !== null) {
    // First try direct object reference (fastest)
    if (weakMap.has(row)) {
      return true
    }
    
    // Fallback to key-based lookup
    const key = getRowKey(row, -1) // -1 since we don't have index here
    if (key.startsWith('row-')) {
      // For index-based keys, we need to check by object reference in the map values
      for (const [, selectedRow] of map) {
        if (typeof selectedRow === 'object' && selectedRow === row) {
          return true
        }
      }
      return false
    }
    
    return map.has(key)
  }
  
  // For primitive values
  return map.has(row)
}

// Performance-optimized row classes with memoization
const getDataRowClasses = (rowIndex, row) => {
	const rowKey = getRowKey(row, rowIndex);
	const cacheKey = `${rowIndex}-${rowKey}-${props.selectable}`;
	
	if (rowClassCache.has(cacheKey)) {
		return rowClassCache.get(cacheKey);
	}
	
	const classes = [];
	
	if (props.rowClass) {
		if (typeof props.rowClass === 'function') {
			classes.push(props.rowClass(row, rowIndex));
		} else {
			classes.push(props.rowClass);
		}
	}
	
	if (props.selectable) {
		classes.push('cursor-pointer');
	}

	classes.push(datatableDataRowVariants({
		selectable: computedIsRowSelectable.value[rowIndex],
	}))

	const result = classes.join(' ');
	rowClassCache.set(cacheKey, result);
	return result;
};

// Watch data changes to clear cache
watch(() => props.data, () => {
	rowClassCache.clear();
}, { deep: true });

// ============================
// COMPUTED PROPERTIES - COLUMNS
// ============================
const tree = computed(() => {
	return treeOps.buildTree(groups, columns)
})

const allLeafColumns = computed(() => {
	const ungroupedColumns = getUngroupedColumns()
	const allNodes = [...tree.value, ...ungroupedColumns]
	const leafColumns = treeOps.collectLeafColumns(allNodes)
	return treeOps.sortColumns(leafColumns)
})

const {
	hasHiddenColumnOnLeft,
	hasHiddenColumnOnRight,
	isRightmostVisibleColumn,
} = useHiddenColumnDetection(allLeafColumns, isColumnVisible)

const sortedNodes = computed(() => {
	const filteredTree = treeOps.filterTreeByVisibility(
		tree.value,
		isColumnVisible
	)
	const filteredUngroupedColumns = getFilteredUngroupedColumns()
	const allNodes = [...filteredTree, ...filteredUngroupedColumns]
	return treeOps.sortNodes(allNodes)
})

const headerRows = computed(() => {
	if (sortedNodes.value.length === 0) return []

	const depth = Math.max(
		...sortedNodes.value.map(c => treeOps.calculateDepth(c)),
		1
	)
	return treeOps.flattenTreeToRows(sortedNodes.value, depth)
})

const flattenedHeaderRows = computed(() => {
	const result = []
	headerRows.value.forEach(row => {
		row.forEach(col => {
			for (let i = 0; i < (col.colspan || 1); i++) {	
				result.push(col)
			}
		})
	})

	return result
})

// Dynamic footer rows - automatically detect all footer slots
const dynamicFooterRows = computed(() => {
	const footerRowsMap = new Map()
	
	// Collect all footer slots from all columns
	allLeafColumns.value.forEach(col => {
		if (col.footerSlots) {
			Object.keys(col.footerSlots).forEach(slotName => {
				if (slotName.startsWith('footer')) {
					// Extract footer number (footer -> 1, footer2 -> 2, footer10 -> 10, etc.)
					let footerIndex = 1
					if (slotName !== 'footer') {
						const match = slotName.match(/footer(\d+)/)
						if (match) {
							footerIndex = parseInt(match[1])
						}
					}
					
					if (!footerRowsMap.has(footerIndex)) {
						footerRowsMap.set(footerIndex, new Set())
					}
					footerRowsMap.get(footerIndex).add(slotName)
				}
			})
		}
		
		// Backward compatibility for single footer
		if (col.footer) {
			if (!footerRowsMap.has(1)) {
				footerRowsMap.set(1, new Set())
			}
			footerRowsMap.get(1).add('footer')
		}
	})
	
	// Convert to sorted array and generate columns for each footer row
	const footerRows = []
	const sortedIndexes = Array.from(footerRowsMap.keys()).sort((a, b) => a - b)
	
	sortedIndexes.forEach(footerIndex => {
		const footerKey = footerIndex === 1 ? 'footer' : `footer${footerIndex}`
		const columns = getVisibleColumnsWithColspan(footerKey)
		
		// Only add footer row if it has content
		const hasContent = columns.some(col => {
			if (col.footerSlots && col.footerSlots[footerKey]) return true
			if (footerKey === 'footer' && col.footer) return true
			return false
		})
		
		if (hasContent) {
			footerRows.push({
				index: footerIndex,
				footerKey,
				columns
			})
		}
	})
	
	return footerRows
})

// Function khusus untuk virtual row columns yang menangani colspan dengan width adjustment
function getVirtualRowColumns(row, rowIndex) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const filteredColumns = []
	let skipNext = 0
	let actualColumnIndex = 0

	// Get columns that should be skipped in this row due to previous rowspans
	const skipColumns = rowspanTracker.value.get(rowIndex) || new Set()

	leafColumns.forEach((col) => {
		// Skip if this column should be skipped due to colspan in current row
		if (skipNext > 0) {
			skipNext--
			actualColumnIndex++
			return
		}

		// Skip if this column should be skipped due to rowspan from previous rows
		if (skipColumns.has(actualColumnIndex)) {
			actualColumnIndex++
			return
		}

		const colspan = resolveColspan(col, 'body', row, rowIndex)
		const rowspan = resolveRowspan(col, 'body', row, rowIndex)

		// Don't adjust colspan for virtual rows - use original value
		const finalColspan = colspan || 1

		const adjustedColumn = {
			...col,
			bodyColspan: finalColspan,
			bodyRowspan: rowspan,
		}

		filteredColumns.push(adjustedColumn)

		// Handle colspan - skip next columns in this row  
		if (finalColspan > 1) {
			skipNext = finalColspan - 1
		}

		// Handle rowspan - mark columns to skip in subsequent rows
		if (rowspan > 1) {
			for (let futureRow = rowIndex + 1; futureRow < rowIndex + rowspan; futureRow++) {
				if (!rowspanTracker.value.has(futureRow)) {
					rowspanTracker.value.set(futureRow, new Set())
				}
				
				// Mark columns to skip (including colspan effect)
				for (let colOffset = 0; colOffset < finalColspan; colOffset++) {
					rowspanTracker.value.get(futureRow).add(actualColumnIndex + colOffset)
				}
			}
		}

		actualColumnIndex += finalColspan
	})

	return filteredColumns
}


function getVisibleColumnsWithColspan(type, row = null, rowIndex = null) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)

	// For body type, we need to handle rowspan tracking
	if (type === 'body' && rowIndex !== null) {
		return getVisibleColumnsWithRowspanTracking(leafColumns, row, rowIndex)
	}

	// For non-body types (header, footer), use the original logic
	const filteredColumns = []
	let skipNext = 0

	leafColumns.forEach((col, index) => {
		if (skipNext > 0) {
			skipNext--
			return
		}

		const colspan = resolveColspan(col, type, row, rowIndex)
		const rowspan = resolveRowspan(col, type, row, rowIndex)

		const adjustedColspan = calculateAdjustedColspan(
			colspan,
			leafColumns,
			index
		)

		const adjustedColumn = {
			...col,
			[type.startsWith('footer') ? 'footerColspan' : 'bodyColspan']: adjustedColspan,
			[type.startsWith('footer') ? 'footerRowspan' : 'bodyRowspan']: rowspan,
		}

		filteredColumns.push(adjustedColumn)

		if (adjustedColspan > 1) {
			skipNext = adjustedColspan - 1
		}
	})

	return filteredColumns
}

function getVisibleColumnsWithRowspanTracking(leafColumns, row, rowIndex) {
	const filteredColumns = []
	let skipNext = 0
	let actualColumnIndex = 0 // Track actual column position accounting for skipped columns

	// Get columns that should be skipped in this row due to previous rowspans
	const skipColumns = rowspanTracker.value.get(rowIndex) || new Set()

	leafColumns.forEach((col, originalIndex) => {
		// Skip if this column should be skipped due to colspan in current row
		if (skipNext > 0) {
			skipNext--
			actualColumnIndex++
			return
		}

		// Skip if this column should be skipped due to rowspan from previous rows
		if (skipColumns.has(actualColumnIndex)) {
			actualColumnIndex++
			return
		}

		const colspan = resolveColspan(col, 'body', row, rowIndex)
		const rowspan = resolveRowspan(col, 'body', row, rowIndex)

		const adjustedColspan = calculateAdjustedColspan(
			colspan,
			leafColumns,
			originalIndex
		)

		const adjustedColumn = {
			...col,
			bodyColspan: adjustedColspan,
			bodyRowspan: rowspan,
		}

		filteredColumns.push(adjustedColumn)

		// Handle colspan - skip next columns in this row
		if (adjustedColspan > 1) {
			skipNext = adjustedColspan - 1
		}

		// Handle rowspan - mark columns to skip in subsequent rows
		if (rowspan > 1) {
			for (let futureRow = rowIndex + 1; futureRow < rowIndex + rowspan; futureRow++) {
				if (!rowspanTracker.value.has(futureRow)) {
					rowspanTracker.value.set(futureRow, new Set())
				}
				
				// Mark columns to skip (including colspan effect)
				for (let colOffset = 0; colOffset < adjustedColspan; colOffset++) {
					rowspanTracker.value.get(futureRow).add(actualColumnIndex + colOffset)
				}
			}
		}

		actualColumnIndex += adjustedColspan
	})

	return filteredColumns
}

function resolveColspan(col, type, row = null, rowIndex = null) {
	let colspan
	if (type.startsWith('footer')) {
		colspan = col.footerColspan
	} else {
		colspan = col.bodyColspan
	}

	if (typeof colspan === 'function') {
		if (row === null || typeof row !== 'object' || typeof rowIndex !== 'number') {
			return 1
		}
		return colspan(row, rowIndex)
	}
	
	// Return 1 if colspan is undefined, null, or 0
	return colspan || 1
}

function resolveRowspan(col, type, row = null, rowIndex = null) {
	let rowspan
	if (type.startsWith('footer')) {
		rowspan = col.footerRowspan
	} else {
		rowspan = col.bodyRowspan
	}

	if (typeof rowspan === 'function') {
		if (row === null || typeof row !== 'object' || typeof rowIndex !== 'number') {
			return 1
		}
		return rowspan(row, rowIndex)
	}
	return rowspan || 1
}

function calculateAdjustedColspan(colspan, allColumns, startIndex) {
	const originalColspan = colspan || 1
	
	// Calculate how many columns are available from current position
	const availableColumns = allColumns.length - startIndex
	
	// If colspan is greater than or equal to available columns, 
	// reduce it to prevent columns from disappearing
	if (originalColspan >= availableColumns && availableColumns > 1) {
		return availableColumns - 1
	}
	
	return originalColspan
}

function getUngroupedColumns() {
	return columns
		.filter(c => !c.group && c.field)
		.map(col => ({
			...col,
			isLeaf: true,
			children: [],
		}))
}

function getFilteredUngroupedColumns() {
	return columns
		.filter(c => !c.group && c.field && isColumnVisible(c.field))
		.map(col => ({
			...col,
			isLeaf: true,
			children: [],
			compositeFieldId: col.field,
			registrationOrder: columns.indexOf(col),
		}))
}

// ============================
// PROVIDERS FOR CHILD COMPONENTS
// ============================
provide('registerGroup', group => groups.push(group))
provide('registerColumn', col => {
	columns.push({
		...col,
		enableHiding: col.enableHiding !== false,
	})
})

// ============================
// SELECTION FUNCTIONS
// ============================
function selectAll() {
	if (!props.selectable) return

	if (isIndeterminate.value) {
		const unselectedItems = selectableRows.value.filter(
			item =>
				!computedModelValue.value.includes(item) && props.isRowSelectable(item)
		)
		computedModelValue.value = [...computedModelValue.value, ...unselectedItems]
	} else if (computedModelValue.value.length === selectableRows.value.length) {
		computedModelValue.value = []
	} else {
		computedModelValue.value = selectableRows.value
	}
}

function selectRows(row) {
	if (!props.selectable) return

	if (!props.isRowSelectable(row)) return

	// Find the row index using helper function
	const index = findRowIndexInSelection(row)
	
	if (index > -1) {
		const newSelection = [...computedModelValue.value]
		newSelection.splice(index, 1)
		computedModelValue.value = newSelection
	} else {
		computedModelValue.value.push(row)
	}
}

// Helper function to find row index in selected rows
function findRowIndexInSelection(row) {
	for (let i = 0; i < computedModelValue.value.length; i++) {
		const selectedRow = computedModelValue.value[i]
		
		// For objects, compare by reference first, then by key
		if (typeof row === 'object' && typeof selectedRow === 'object') {
			if (selectedRow === row) {
				return i
			}
			// Fallback to key comparison for different object instances with same data
			const rowKey = getRowKey(row, -1)
			const selectedRowKey = getRowKey(selectedRow, -1)
			if (rowKey !== `row--1` && rowKey === selectedRowKey) {
				return i
			}
		} else if (selectedRow === row) {
			// For primitives, direct comparison
			return i
		}
	}
	return -1
}

// ============================
// PAGINATION FUNCTIONS
// ============================
function getRowNumber(rowIndex) {
	if (props.paginated) {
		return (
			(computedPage.value - 1) * Number(computedPerPage.value) + rowIndex + 1
		)
	}
	return rowIndex + 1
}

function onChangePage(page) {
	emit('change-page', page)
}

function onChangePerPage(perPage) {
	emit('change-per-page', perPage)
}

// ============================
// UI CONTROL VISIBILITY FUNCTIONS
// ============================
function shouldShowSortControls(col) {
	if (!col.field) return false
	const leafColumn = allLeafColumns.value.find(leaf => leaf.field === col.field)
	if (leafColumn) {
		return leafColumn.sortable
	}
	return false
}

// ============================
// STYLING FUNCTIONS - OPTIMIZED
// ============================
function getHeaderCellClasses(col) {
	return cn(
		datatableHeaderVariants({
			hasSubheader: col.hasSubheader,
			hasBorderLeft: col.hasBorderLeft,
			hasBorderRight: col.hasBorderRight,
			isSticky: props.stickyHeaders,
		}),
	)
}

function getHeaderContentClasses(col) {
	return cn(
		'flex justify-between w-full items-center group',
		datatableHeaderContentVariants({
			hasSubheader: col.hasSubheader,
		})
	)
}

const dataCellClassCache = new Map()
function getDataCellClasses(cell, headerRow = null, nextHeaderRow = null) {
	if (dataCellClassCache.has(cell.compositeFieldId)) {
		return dataCellClassCache.get(cell.compositeFieldId)
	}
	let hasBorderRight = false
	if (headerRow && headerRow.hasBorderRight) {
		if (nextHeaderRow && !nextHeaderRow.group && !nextHeaderRow.hasSubheader) {
			hasBorderRight = true
		}
	}
	const className = cn(
		datatableDataCellVariants({
			hasBorderLeft: cell.hasBorderLeft,
			hasBorderRight,
		}),
	)
	dataCellClassCache.set(cell.compositeFieldId, className)
	return className
}

// ============================
// PIN HANDLERS
// ============================
const {
	pinnedLeft,
	pinnedRight,
	isPinned,
	isPinnedLeft,
	isPinnedRight,
	pinLeft,
	pinRight,
	unpin,
	getStickyOffsets,
	resetPinning,
} = useDataTablePinning(props, allLeafColumns, groups, sortedNodes)

function handlePinLeft(fieldId) {
	pinLeft(fieldId)
}

function handlePinRight(fieldId) {
	pinRight(fieldId)
}

function handleUnpin(fieldId) {
	unpin(fieldId)
}

function getPinnedColumnStyles(fieldId) {
	if (!fieldId) return {}
	const stickyOffsets = getStickyOffsets()
	return stickyOffsets[fieldId] || {}
}

// ============================
// RESET FUNCTION
// ============================
function resetTable() {
	resetColumnVisibility()
	rowSize.value = COLUMN_SIZE.Medium
	// Reset pinning state
	resetPinning()
}

// ============================
// WATCHERS
// ============================
watch(columnVisibility, newVal => {
	persistence.saveColumnVisibility(newVal)
}, {
	deep: true,
})
watch(rowSize, newVal => persistence.saveRowSize(newVal))

// Clear rowspan tracker when columns change
watch(allLeafColumns, () => {
	rowspanTracker.value.clear()
}, { deep: true })

// Watch loading state to capture column widths when loading becomes false
watch(() => props.loading, (newLoading, oldLoading) => {
	// Capture widths when loading changes from true to false (initial data load complete)
	if (props.preserveColumnWidths && oldLoading && !newLoading) {
		setTimeout(() => {
			// Prioritas untuk virtual row widths
			if (props.data && props.data.length > 0) {
				captureVirtualRowColumnWidths()
			} else if (!isColumnWidthsCaptured.value) {
				captureColumnWidths()
			}
		}, 100) // Small delay to ensure DOM is fully rendered
	}
}, { immediate: true })

// Reset column widths when data changes significantly
watch(() => props.data, () => {
	// Reset capture state if data becomes empty or significantly changes
	if (!props.data || props.data.length === 0) {
		isColumnWidthsCaptured.value = false
		isVirtualRowWidthsCaptured.value = false
		savedColumnWidths.value.clear()
		virtualRowColumnWidths.value.clear()
	} else {
		// Capture virtual row widths saat data berubah
		setTimeout(() => {
			captureVirtualRowColumnWidths()
		}, 200)
	}
}, { deep: true })

watch(
	allLeafColumns,
	newColumns => {
		if (newColumns.length > 0) {
			const savedVisibility = persistence.loadColumnVisibility()
			if (savedVisibility !== null) {
				// Migrate from old visible-based format to new hidden-based format if needed
				const allColumnFields = newColumns.map(
					col => col.compositeFieldId || col.field
				)
				const hiddenColumns = persistence.migrateColumnVisibilityFormat(
					savedVisibility,
					allColumnFields
				)
				setHiddenColumns(hiddenColumns)
			}
		}
	},
	{ immediate: true }
)

// ============================
// INFINITE SCROLL FUNCTIONS
// ============================
const dataTableScrollWrapper = ref(null)

// ============================
// COLUMN WIDTH PRESERVATION FUNCTIONS
// ============================
// State untuk menyimpan width yang sudah dihitung dari virtual rows
const virtualRowColumnWidths = ref(new Map()) // Map<fieldId, width>
const isVirtualRowWidthsCaptured = ref(false)

// Function to capture column widths from first virtual row
function captureVirtualRowColumnWidths() {
	if (!props.preserveColumnWidths || isVirtualRowWidthsCaptured.value || !tableVirtualWrapper.value) return
	
	nextTick(() => {
		// Cari row pertama di virtual scroll container
		const firstVirtualRow = tableVirtualWrapper.value.querySelector('div[data-virtual-row="0"]') ||
								tableVirtualWrapper.value.querySelector('div:first-child > div:first-child')
		
		if (!firstVirtualRow) {
			console.warn('First virtual row not found for width calculation')
			return
		}
		
		// Ambil semua cell dari row pertama
		const cells = firstVirtualRow.querySelectorAll('div[data-field]')
		
		cells.forEach(cell => {
			const fieldId = cell.getAttribute('data-field')
			if (fieldId) {
				const computedStyle = window.getComputedStyle(cell)
				const width = computedStyle.width
				if (width && width !== 'auto') {
					virtualRowColumnWidths.value.set(fieldId, width)
				}
			}
		})
		
		// Capture selection dan numbering column widths jika ada
		const selectionCell = firstVirtualRow.querySelector('div:first-child')
		if (selectionCell && props.selectable) {
			const width = window.getComputedStyle(selectionCell).width
			if (width && width !== 'auto') {
				virtualRowColumnWidths.value.set('__selection__', width)
			}
		}
		
		const numberingCell = firstVirtualRow.querySelector('div:nth-child(' + (props.selectable ? '2' : '1') + ')')
		if (numberingCell && props.showNumbering) {
			const width = window.getComputedStyle(numberingCell).width
			if (width && width !== 'auto') {
				virtualRowColumnWidths.value.set('__numbering__', width)
			}
		}
		
		isVirtualRowWidthsCaptured.value = true
		
		// Setelah capture virtual row widths, update header widths
		updateHeaderWidthsFromVirtualRows()
	})
}

// Function to update header widths based on virtual row widths
function updateHeaderWidthsFromVirtualRows() {
	if (!isVirtualRowWidthsCaptured.value || !dataTableScrollWrapper.value) return
	
	nextTick(() => {
		const tableSelector = `#${props.id}-table`
		const tableElement = dataTableScrollWrapper.value.$el?.querySelector(tableSelector) || 
							 dataTableScrollWrapper.value.$el?.querySelector('table')
		
		if (!tableElement) return
		
		// Update header cells dengan width dari virtual rows
		virtualRowColumnWidths.value.forEach((width, fieldId) => {
			if (fieldId === '__selection__') {
				const selectionHeader = tableElement.querySelector('thead th:first-child')
				if (selectionHeader && props.selectable) {
					selectionHeader.style.width = width
					selectionHeader.style.minWidth = width
					selectionHeader.style.maxWidth = width
				}
			} else if (fieldId === '__numbering__') {
				const numberingHeader = tableElement.querySelector('thead th:nth-child(' + (props.selectable ? '2' : '1') + ')')
				if (numberingHeader && props.showNumbering) {
					numberingHeader.style.width = width
					numberingHeader.style.minWidth = width
					numberingHeader.style.maxWidth = width
				}
			} else {
				const headerCell = tableElement.querySelector(`thead th[data-field="${fieldId}"]`)
				if (headerCell) {
					headerCell.style.width = width
					headerCell.style.minWidth = width
					headerCell.style.maxWidth = width
				}
			}
		})
	})
}

// Function to capture column widths from table headers (fallback method)
function captureColumnWidths() {
	if (!props.preserveColumnWidths || isColumnWidthsCaptured.value || !dataTableScrollWrapper.value) return
	
	nextTick(() => {
		// Use specific table ID as selector to ensure we get the correct table
		const tableSelector = `#${props.id}-table`
		const tableElement = dataTableScrollWrapper.value.$el?.querySelector(tableSelector) || 
							 dataTableScrollWrapper.value.$el?.querySelector('table')
		
		if (!tableElement) {
			console.warn(`Table element not found for selector: ${tableSelector}`)
			return
		}
		
		const headerCells = tableElement.querySelectorAll('thead th[data-field]')
		
		headerCells.forEach(cell => {
			const fieldId = cell.getAttribute('data-field')
			if (fieldId) {
				const computedStyle = window.getComputedStyle(cell)
				const width = computedStyle.width
				if (width && width !== 'auto') {
					savedColumnWidths.value.set(fieldId, width)
				}
			}
		})
		
		// Also capture selection and numbering columns if they exist
		const selectionHeader = tableElement.querySelector('thead th:first-child')
		if (selectionHeader && props.selectable) {
			const width = window.getComputedStyle(selectionHeader).width
			if (width && width !== 'auto') {
				savedColumnWidths.value.set('__selection__', width)
			}
		}
		
		const numberingHeader = tableElement.querySelector('thead th:nth-child(' + (props.selectable ? '2' : '1') + ')')
		if (numberingHeader && props.showNumbering) {
			const width = window.getComputedStyle(numberingHeader).width
			if (width && width !== 'auto') {
				savedColumnWidths.value.set('__numbering__', width)
			}
		}
		
		isColumnWidthsCaptured.value = true
	})
}

// Function to get column width style object - updated untuk virtual rows
function getColumnWidthStyle(fieldId) {
	if (!props.preserveColumnWidths || !fieldId) return {}
	
	let finalWidth = null
	
	// Get virtual row width and header width
	const virtualWidth = isVirtualRowWidthsCaptured.value ? 
		virtualRowColumnWidths.value.get(fieldId) : null
	const headerWidth = isColumnWidthsCaptured.value ? 
		savedColumnWidths.value.get(fieldId) : null
	
	// Compare widths and use the larger one
	if (virtualWidth && virtualWidth !== 'auto' && headerWidth && headerWidth !== 'auto') {
		const virtualValue = parseFloat(virtualWidth)
		const headerValue = parseFloat(headerWidth)
		
		// Use the larger width value
		finalWidth = virtualValue >= headerValue ? virtualWidth : headerWidth
	} else if (virtualWidth && virtualWidth !== 'auto') {
		finalWidth = virtualWidth
	} else if (headerWidth && headerWidth !== 'auto') {
		finalWidth = headerWidth
	}
	
	if (finalWidth) {
		return {
			width: finalWidth,
			minWidth: finalWidth,
			maxWidth: finalWidth
		}
	}
	
	return {}
}

// Function to calculate virtual cell width based on colspan
function getVirtualCellWidthStyle(cell, colspan = 1) {
	// For colspan > 1, we need to calculate combined width of multiple columns
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const currentColIndex = leafColumns.findIndex(col => 
		(col.compositeFieldId || col.field) === (cell.compositeFieldId || cell.field)
	)
	
	if (currentColIndex === -1) {
		// Fallback to default width multiplied by colspan
		const defaultWidth = 120
		return {
			width: `${defaultWidth * colspan}px`,
			minWidth: `${defaultWidth * colspan}px`,
			maxWidth: `${defaultWidth * colspan * 1.5}px`
		}
	}
	
	// Calculate combined width from current column and next (colspan-1) columns
	let totalWidth = 0
	let unit = 'px'
	let hasValidWidths = false
	
	for (let i = 0; i < colspan && (currentColIndex + i) < leafColumns.length; i++) {
		const colFieldId = leafColumns[currentColIndex + i].compositeFieldId || 
						   leafColumns[currentColIndex + i].field
		const colStyle = getColumnWidthStyle(colFieldId)
		
		if (colStyle.width) {
			const widthValue = parseFloat(colStyle.width)
			const widthUnit = colStyle.width.replace(/[\d.]/g, '') || 'px'
			unit = widthUnit // Use the unit from the first valid width
			totalWidth += widthValue
			hasValidWidths = true
		} else {
			// Add default width if no saved width
			totalWidth += 120 // 120px default
		}
	}
	
	if (!hasValidWidths) {
		// Fallback if no saved widths found
		const defaultWidth = 120
		return {
			width: `${defaultWidth * colspan}px`,
			minWidth: `${defaultWidth * colspan}px`,
			maxWidth: `${defaultWidth * colspan * 1.5}px`
		}
	}
	
	return {
		width: `${totalWidth}${unit}`,
		minWidth: `${totalWidth}${unit}`,
		maxWidth: `${totalWidth * 1.5}${unit}`
	}
}

const hasMoreData = computed(() => {
	const totalPages = getTotalPages(props.total, computedPerPage.value)
	return props.page < totalPages
})

const needsExtraSpace = ref(false)

// Calculate total footer height for sticky positioning
const totalFooterHeight = computed(() => {
	if (!props.stickyFooter || !dynamicFooterRows.value.length) {
		return 0
	}
	
	// Calculate actual footer row height based on current row size
	const footerRowHeight = actualRowHeight.value
	
	return dynamicFooterRows.value.length * footerRowHeight
})

// Computed scroll height for infinite scroll (supports rem, px, etc.)
const computedScrollY = computed(() => {
	let baseScrollY = props.scrollY
	
	// For infinite scroll, adjust the base scroll height
	if (props.infiniteScroll && needsExtraSpace.value) {
		const match = String(props.scrollY).match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)
		if (match) {
			const [, value, unit] = match
			const originalValue = parseFloat(value)
			const reducedValue = Math.max(
				originalValue * 0.7,
				unit === 'rem' ? 20 : originalValue * 0.5
			)
			baseScrollY = `${reducedValue}${unit}`
		}
	}
	
	// If footer is sticky, adjust scroll height to account for footer height
	if (props.stickyFooter && totalFooterHeight.value > 0) {
		const match = String(baseScrollY).match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)
		if (match) {
			const [, value, unit] = match
			const originalValue = parseFloat(value)
			
			// Convert footer height to the same unit as scrollY
			let footerHeightInSameUnit = totalFooterHeight.value
			if (unit === 'rem') {
				// Assuming 1rem = 16px (browser default)
				footerHeightInSameUnit = totalFooterHeight.value / 16
			} else if (unit === 'em') {
				// Assuming 1em = 16px (browser default)
				footerHeightInSameUnit = totalFooterHeight.value / 16
			}
			// For px and other units, use the value as-is
			
			const adjustedValue = originalValue + footerHeightInSameUnit
			return `${adjustedValue}${unit}`
		}
	}
	
	return baseScrollY
})

async function checkScrollability() {
	if (!props.infiniteScroll || !dataTableScrollWrapper.value) return
	await nextTick()
	const scrollContainer = dataTableScrollWrapper.value.scrollContainer
	if (scrollContainer) {
		const hasVerticalScroll =
			scrollContainer.scrollHeight > scrollContainer.clientHeight
		needsExtraSpace.value =
			!hasVerticalScroll && hasMoreData.value && !props.loading
	}
}

function loadMoreData() {
	if (props.loading || !hasMoreData.value) return
	computedPage.value++
}

watch(() => props.data, checkScrollability, { flush: 'post' })

onMounted(() => {
	checkScrollability()
	// Load rowSize from localStorage
	const savedRowSize = persistence.loadRowSize(COLUMN_SIZE.Medium)
	if (savedRowSize) {
		rowSize.value = savedRowSize
	}
	
	// Capture column widths if loading is already false on mount
	if (props.preserveColumnWidths && !props.loading) {
		setTimeout(() => {
			// Prioritas untuk virtual row widths jika ada data
			if (props.data && props.data.length > 0) {
				captureVirtualRowColumnWidths()
			} else if (!isColumnWidthsCaptured.value) {
				captureColumnWidths()
			}
		}, 200) // Slightly longer delay for mount
	}

	observeRowHeight()
	
	// Setup horizontal scroll synchronization
	setupScrollSynchronization()
	
	// Setup dynamic height measurement observer
	setupDynamicHeightObserver()
})

// Setup scroll synchronization antara header dan virtual container
function setupScrollSynchronization() {
	// Pastikan kedua container sudah ada
	if (!dataTableScrollWrapper.value || !tableVirtualWrapper.value) {
		return
	}
	
	// Throttled sync functions untuk performance
	const throttledSyncToVirtual = useThrottleFn((scrollLeft) => {
		syncHorizontalScrollToVirtual(scrollLeft)
	}, 16) // ~60fps
	
	const throttledSyncToHeader = useThrottleFn((scrollLeft) => {
		syncHorizontalScrollToHeader(scrollLeft)
	}, 16) // ~60fps
	
	// Add event listeners untuk sync scroll
	const headerScrollContainer = dataTableScrollWrapper.value.scrollContainer
	if (headerScrollContainer) {
		headerScrollContainer.addEventListener('scroll', (e) => {
			throttledSyncToVirtual(e.target.scrollLeft)
		}, { passive: true })
	}
	
	if (tableVirtualWrapper.value) {
		tableVirtualWrapper.value.addEventListener('scroll', (e) => {
			throttledSyncToHeader(e.target.scrollLeft)
		}, { passive: true })
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

const checkboxAllDataCy = computed(() => {
	const prefix = props.dataCy ? `${props.dataCy}-` : ''
	return `${prefix}checkbox-all`
})

const checkboxDataCy = computed(() => {
	const prefix = props.dataCy ? `${props.dataCy}-` : ''
	return `${prefix}checkbox`
})

// ============================
// EXPOSE METHODS
// ============================
defineExpose({
	toggleColumnVisibility,
	resetTable,
	isColumnVisible,
	columnVisibility: readonly(columnVisibility),
	allLeafColumns,
	// Sorting methods
	toggleSort,
	getSortState,
	getSortIndex,
	clearSort,
	setSortState,
	sortValue: readonly(sortValue),
	// Pinning methods
	pinLeft,
	pinRight,
	unpin,
	isPinned,
	isPinnedLeft,
	isPinnedRight,
	pinnedLeft: readonly(pinnedLeft),
	pinnedRight: readonly(pinnedRight),
	checkboxAllDataCy,
	checkboxDataCy,
})

// ============================
// VIRTUAL SCROLLING IMPLEMENTATION
// ============================
const tableVirtualWrapper = ref(null)

// Dynamic height measurement state
const rowHeights = ref(new Map()) // Map<rowIndex, height>
const measuredRows = ref(new Set()) // Set of measured row indices

// Get dynamic row height for virtualizer
function getRowHeight(index) {
	// Return cached height if available
	if (rowHeights.value.has(index)) {
		return rowHeights.value.get(index)
	}
	
	// Estimate based on row size and content
	const baseHeight = actualRowHeight.value || 48
	
	// Check if row has complex content that might need more height
	if (props.data && props.data[index]) {
		const row = props.data[index]
		const columns = getVirtualRowColumns(row, index)
		
		// Check for potential multi-line content
		let hasComplexContent = false
		for (const col of columns) {
			// Check for rowspan that might affect height
			if (col.bodyRowspan > 1) {
				hasComplexContent = true
				break
			}
			
			// Check for long text content (basic heuristic)
			if (row[col.field] && typeof row[col.field] === 'string' && row[col.field].length > 100) {
				hasComplexContent = true
				break
			}
		}
		
		// Return estimated height based on content complexity
		if (hasComplexContent) {
			return baseHeight * 1.5 // 50% more height for complex content
		}
	}
	
	return baseHeight
}

// Trigger height measurement untuk row yang baru rendered (debounced)
const triggerHeightMeasurement = useDebounceFn(() => {
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

// Create reactive virtualizer with dynamic height
let rowVirtualizer = useVirtualizer({
	count: props.data?.length || 0,
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

// Get virtual row data safely
function getVirtualRowData(virtualRow) {
  if (!props.data || !virtualRow || virtualRow.index >= props.data.length) {
    console.warn('Invalid virtual row:', virtualRow?.index, 'of', props.data?.length)
    return null
  }
  return props.data[virtualRow.index]
}

// Clear height cache when data changes significantly
watch(() => props.data, (newData, oldData) => {
	// Clear cache if data length changes significantly or data is completely new
	if (!oldData || !newData || Math.abs(newData.length - oldData.length) > 10) {
		rowHeights.value.clear()
		measuredRows.value.clear()
	}
	
	// Recreate virtualizer with new data
	rowVirtualizer = useVirtualizer({
		count: newData?.length || 0,
		getScrollElement: () => tableVirtualWrapper.value,
		estimateSize: getRowHeight,
		measureElement: (element) => {
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
	
	// Trigger measurement untuk rows yang baru
	triggerHeightMeasurement()
}, { immediate: true })

// Watch row size changes to update height estimates
watch(rowSize, () => {
	// Clear height cache when row size changes
	rowHeights.value.clear()
	measuredRows.value.clear()
	
	// Update actual row height
	actualRowHeight.value = getRowheightBasedOnRowSize(rowSize.value)
	
	// Trigger remeasurement
	triggerHeightMeasurement()
})

// Watch for column changes that might affect row heights
watch(allLeafColumns, () => {
	// Clear height cache when columns change significantly
	rowHeights.value.clear()
	measuredRows.value.clear()
	
	// Trigger remeasurement
	triggerHeightMeasurement()
}, { deep: true })
</script>

<style scoped>
table {
	border-collapse: separate !important;
	border-spacing: 0;
}
tbody tr:not(:last-child) td {
	border-bottom: 1px solid rgb(229 231 235);
}
</style>
