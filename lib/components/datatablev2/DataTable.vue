<template>
	<div :id="id" class="w-full flex flex-col relative gap-4" :data-cy="dataCy">
		<!-- Horizontal Scroll Wrapper with Indicators -->
		<DataTableScrollWrapper
			ref="dataTableScrollWrapper"
			:enable-horizontal-scroll="enableHorizontalScroll"
			:max-height="computedScrollY"
			:sticky-header="stickyHeaders"
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

				<!-- Table Body -->
				<TableBody>
					<!-- Loading State -->
					<template
						v-if="
							loading && (!infiniteScroll || (infiniteScroll && !data.length))
						"
					>
						<DataTableLoading :total-data="totalDataColumn" />
					</template>

					<!-- Virtual Scrolled Data Rows for Large Datasets -->
					<template v-else-if="shouldUseVirtualScroll && data && data.length">
						<DataTableVirtualScroll
							:items="data"
							:item-height="actualRowHeight"
							:container-height="scrollY"
							:scroll-top="scrollTop"
						>
							<template #default="{ visibleItems, startIndex }">
								<TableRow
									v-for="(row, rowIndex) in visibleItems"
									:ref="el => rowRefs[startIndex + rowIndex] = el"
									:key="`row-${startIndex + rowIndex}`"
									:class="getDataRowClasses(startIndex + rowIndex, row)"
									@click="selectRows(row)"
								>
									<!-- Selection Cell -->
									<TableCell
										v-if="selectable"
										:size="rowSize"
										class="text-center w-[3.75rem] bg-white font-medium sticky left-0 z-20"
									>
										<Checkbox
											:model-value="isRowSelected(row)"
											:value="true"
											:disabled="!props.isRowSelectable(row)"
											:data-cy="checkboxDataCy"
											class="mx-auto"
										/>
									</TableCell>

									<!-- Numbering Cell -->
									<TableCell
										v-if="showNumbering"
										:size="rowSize"
										class="text-center min-w-[60px] max-w-[60px] font-medium"
									>
										{{ getRowNumber(startIndex + rowIndex) }}
									</TableCell>

									<!-- Data Cells -->
									<template
										v-for="(cell, cellIndex) in getVisibleColumns('body', row, startIndex + rowIndex)"
										:key="`cell-${startIndex + rowIndex}-${cellIndex}`"
									>
										<TableCell
											:colspan="cell.bodyColspan || 1"
											:rowspan="cell.bodyRowspan || 1"
											:size="rowSize"
											:class="getDataCellClasses(cell)"
											:style="{ 
												...getPinnedColumnStyles(cell.compositeFieldId), 
												...getColumnWidthStyle(cell.compositeFieldId || cell.field) 
											}"
										>
											<component :is="cell.cell" :row="row" :index="startIndex + rowIndex" />
										</TableCell>
									</template>
								</TableRow>
							</template>
						</DataTableVirtualScroll>
					</template>

					<!-- Regular Data Rows for Smaller Datasets -->
					<template v-else-if="data && data.length">
						<TableRow
							v-for="(row, rowIndex) in data"
							:key="`row-${rowIndex}`"
							:class="getDataRowClasses(rowIndex, row)"
							@click="selectRows(row)"
						>
							<!-- Selection Cell -->
							<TableCell
								v-if="selectable"
								:size="rowSize"
								class="text-center w-[3.75rem] bg-white font-medium sticky left-0 z-20"
							>
								<Checkbox
									:model-value="isRowSelected(row)"
									:value="true"
									:disabled="!computedIsRowSelectable[rowIndex]"
									:data-cy="checkboxDataCy"
									class="mx-auto"
								/>
							</TableCell>

							<!-- Numbering Cell -->
							<TableCell
								v-if="showNumbering"
								:size="rowSize"
								class="text-center min-w-[60px] max-w-[60px] font-medium"
							>
								{{ getRowNumber(rowIndex) }}
							</TableCell>

							<!-- Data Cells -->
							<template
								v-for="(cell, cellIndex) in getVisibleColumns('body', row, rowIndex)"
								:key="`cell-${rowIndex}-${cellIndex}`"
							>
								<TableCell
									:colspan="cell.bodyColspan || 1"
									:rowspan="cell.bodyRowspan || 1"
									:size="rowSize"
									:class="getDataCellClasses(cell)"
									:style="{ 
										...getPinnedColumnStyles(cell.compositeFieldId), 
										...getColumnWidthStyle(cell.compositeFieldId || cell.field) 
									}"
								>
									<component :is="cell.cell" :row="row" :index="rowIndex" />
								</TableCell>
							</template>
						</TableRow>
					</template>

					<!-- Loading State Infinite Scroll -->
					<template
						v-if="data.length > 0 && data.length !== total && infiniteScroll"
					>
						<TableRow>
							<TableCell
								v-for="i in totalDataColumn"
								:key="i"
								loading
								class="p-2"
							/>
						</TableRow>
					</template>
				</TableBody>

				<!-- Table Footer -->
				<TableFooter v-if="showFooter && dynamicFooterRows.length > 0" :class="cn({ 'sticky bottom-0 z-30': stickyFooter })">
					<TableRow 
						v-for="footerRow in dynamicFooterRows" 
						:key="`footer-row-${footerRow.index}`"
					>
						<!-- Footer Selection Cell -->
						<TableCell
							v-if="selectable"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] bg-white font-medium sticky left-0 z-30 border-t"
						>
							<!-- Empty footer cell for selectable column -->
						</TableCell>

						<!-- Footer Numbering Cell -->
						<TableCell
							v-if="showNumbering"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] font-medium border-t"
						>
							<!-- Empty footer cell for numbering column -->
						</TableCell>

						<!-- Footer Data Cells -->
						<template
							v-for="(cell, cellIndex) in footerRow.columns"
							:key="`footer-${footerRow.index}-cell-${cellIndex}`"
						>
							<TableCell
								:colspan="cell.footerColspan || 1"
								:rowspan="cell.footerRowspan || 1"
								:size="rowSize"
								:class="getFooterCellClasses(cell)"
								:style="{ 
									...getPinnedColumnStyles(cell.compositeFieldId), 
									...getColumnWidthStyle(cell.compositeFieldId || cell.field) 
								}"
							>
								<!-- Dynamic footer content resolution -->
								<component 
									:is="getFooterComponent(cell, footerRow.footerKey)" 
									v-if="getFooterComponent(cell, footerRow.footerKey)" 
									:data="data"
									:footer-row="footerRow.index"
								/>
							</TableCell>
						</template>
					</TableRow>
				</TableFooter>

				<!-- Empty State -->
				<template v-if="data && data.length === 0 && !loading">
					<slot name="empty" />
				</template>
			</Table>
		</DataTableScrollWrapper>

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
import { cn } from '../../utils/tw-merge'
import { handleInfiniteScroll, getTotalPages } from '@/utils/pagination'
import { DEBOUNCE_DURATION } from '@/utils/constants'

// Components
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableFooter,
} from '../table'
import { Checkbox } from '../../components/checkbox'
import { Pagination } from '../../components/pagination'
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'
import DataTableLoading from './DataTableLoading.vue'
import DataTableSortButton from './DataTableSortButton.vue'
import DataTableVirtualScroll from './DataTableVirtualScroll.vue'

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

const visibleColumns = computed(() => {
	return getVisibleColumnsWithColspan('body')
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

function getVisibleColumns(type, row = null, rowIndex = null) {
	return getVisibleColumnsWithColspan(type, row, rowIndex)
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
	return colspan
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

const totalDataColumn = computed(() => {
	let result = visibleColumns.value.length
	if (props.selectable) result++
	if (props.showNumbering) result++
	return result
})

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

function getDataCellClasses(cell) {
	return cn(
		datatableDataCellVariants({
			hasBorderLeft: cell.hasBorderLeft,
			hasBorderRight: cell.hasBorderRight,
		}),
	)
}

function getFooterCellClasses(cell) {
	return cn(
		datatableDataCellVariants({
			hasBorderLeft: cell.hasBorderLeft,
			hasBorderRight: cell.hasBorderRight,
		}),
		'font-medium border-t',
		props.stickyFooter ? 'sticky bottom-0 z-10' : ''
	)
}

// ============================
// FOOTER HELPER FUNCTIONS
// ============================
function getFooterComponent(cell, footerKey) {
	// Check dynamic footer slots first
	if (cell.footerSlots && cell.footerSlots[footerKey]) {
		return cell.footerSlots[footerKey]
	}
	
	// Backward compatibility for single footer
	if (footerKey === 'footer' && cell.footer) {
		return cell.footer
	}
	
	return null
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
	if (props.preserveColumnWidths && oldLoading && !newLoading && !isColumnWidthsCaptured.value) {
		setTimeout(() => {
			captureColumnWidths()
		}, 100) // Small delay to ensure DOM is fully rendered
	}
}, { immediate: true })

// Reset column widths when data changes significantly
watch(() => props.data, () => {
	// Reset capture state if data becomes empty or significantly changes
	if (!props.data || props.data.length === 0) {
		isColumnWidthsCaptured.value = false
		savedColumnWidths.value.clear()
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
// Function to capture column widths from table headers
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

// Function to get column width style object
function getColumnWidthStyle(fieldId) {
	if (!props.preserveColumnWidths || !isColumnWidthsCaptured.value || !fieldId) return {}
	
	const savedWidth = getSavedColumnWidth(fieldId)
	if (savedWidth && savedWidth !== 'auto') {
		return {
			width: savedWidth,
			minWidth: savedWidth,
			maxWidth: savedWidth
		}
	}
	return {}
}

// Function to get saved width for a column
function getSavedColumnWidth(fieldId) {
	return savedColumnWidths.value.get(fieldId) || 'auto'
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
	if (props.preserveColumnWidths && !props.loading && !isColumnWidthsCaptured.value) {
		setTimeout(() => {
			captureColumnWidths()
		}, 200) // Slightly longer delay for mount
	}

	observeRowHeight()
})

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
