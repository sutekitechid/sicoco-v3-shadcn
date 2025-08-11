<template>
	<div :id="id" class="w-full flex flex-col relative gap-4" :data-cy="dataCy">
		<!-- Horizontal Scroll Wrapper with Indicators -->
		<DataTableScrollWrapper
			ref="dataTableScrollWrapper"
			class="border-b"
			@scroll="onScrollEvent"
		>
			<!-- Table -->
			<Table :id="`${id}-table`" class="overflow-hidden">
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
									...getPinnedColumnStyles(col.compositeFieldId)
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
				<TableBody class="overflow-hidden !h-0">
					<tr
						v-if="data && data.length"
						ref="dummyRow"
						:class="getDataRowClasses(0, data[0])"
						class="border-none !h-0 overflow-hidden"
					>
						<!-- Selection Cell -->
						<TableCell
							v-if="selectable"
							:size="rowSize"
							class="text-center w-[3.75rem] bg-white font-medium sticky left-0 z-20 !h-0 !py-0"
						>
							<Checkbox
								class="mx-auto !h-0"
							/>
						</TableCell>

						<!-- Numbering Cell -->
						<TableCell
							v-if="showNumbering"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] font-medium !h-0 !py-0"
						>
						</TableCell>

						<!-- Data Cells -->
						<template
							v-for="(cell, cellIndex) in getVirtualRowColumns(data[0], 0)"
							:key="`cell-${0}-${cellIndex}`"
						>
							<TableCell
								:colspan="cell.bodyColspan || 1"
								:rowspan="cell.bodyRowspan || 1"
								:size="rowSize"
								:data-field="cell.compositeFieldId || cell.field"
								:class="getDataCellClasses(cell, flattenedHeaderRows[cellIndex], flattenedHeaderRows[cellIndex + 1])"
								class="!h-0 !py-0"
								:style="{ 
									...getPinnedColumnStyles(cell.compositeFieldId)
								}"
							>
								<div class="!h-0">
									<component :is="cell.cell" :row="data[0]" :index="0" class="!h-0" />
								</div>
							</TableCell>
						</template>
					</tr>
				</TableBody>

				<!-- Empty State -->
				<template v-if="data && data.length === 0 && !loading">
					<slot name="empty" />
				</template>
			</Table>
		</DataTableScrollWrapper>
		<!-- Virtual Scroll Container with Div Layout -->
		<VirtualScroll
			ref="tableVirtualWrapper"
			:class="[
				'-mt-2 text-sm',
				showFooter && dynamicFooterRows.length > 0 ? 'hide-scrollbar-x' : ''
			]"
			:style="{ height: scrollY }"
			:row-class="getVirtualRowClass"
			:length="data.length"
			:estimate-size="getRowHeight"
			:disabled="!shouldUseVirtualScroll"
			@row-click="(virtualRowIndex) => selectRows(getVirtualRowData(virtualRowIndex))"
			>
			<template #default="{ rowIndex }">
					<!-- Selection Cell -->
					<div
						v-if="selectable"
						:class="cn(
							'flex items-center justify-center bg-white sticky left-0 z-20 flex-shrink-0',
							tableCellVariant({ size: rowSize })
						)"
						:style="{ 
							...getSpecialVirtualCellWidthStyle('__selection__')
						}"
					>
						<Checkbox
							:model-value="isRowSelected(getVirtualRowData(rowIndex))"
							:value="true"
							:disabled="!computedIsRowSelectable[rowIndex]"
							:data-cy="checkboxDataCy"
							class="mx-auto"
						/>
					</div>
		
					<!-- Numbering Cell -->
					<div
						v-if="showNumbering"
						:class="cn(
							'flex items-center justify-center font-medium text-muted-foreground flex-shrink-0',
							tableCellVariant({ size: rowSize })
						)"
						:style="{ 
							...getSpecialVirtualCellWidthStyle('__numbering__')
						}"
					>
						{{ getRowNumber(rowIndex) }}
					</div>
		
					<!-- Data Cells -->
					<template
						v-for="(cell, cellIndex) in getVirtualRowColumns(getVirtualRowData(rowIndex), rowIndex)"
						:key="`cell-${rowIndex}-${cellIndex}`"
					>
						<div
							:data-field="cell.compositeFieldId || cell.field"
							:class="cn(
								'flex items-center flex-shrink-0',
								getDataCellClasses(cell, flattenedHeaderRows[cellIndex], flattenedHeaderRows[cellIndex + 1]),
								tableCellVariant({ size: rowSize })
							)"
							:style="{ 
								...getPinnedColumnStyles(cell.compositeFieldId),
								...getVirtualCellWidthStyle(cell, cell.bodyColspan || 1)
							}"
						>
							<component :is="cell.cell" :row="getVirtualRowData(rowIndex)" :index="rowIndex" />
						</div>
					</template>
			</template>
		</VirtualScroll>
		<!-- Footer -->
		<DataTableScrollWrapper
			v-if="showFooter && dynamicFooterRows.length > 0"
			ref="footerScrollWrapper"
			:enable-horizontal-scroll="true"
			:max-height="'auto'"
			class="border-t -mt-4"
			@scroll="(event) => syncHorizontalScrollFromFooter(event.target.scrollLeft)"
		>
			<Table :style="{ minWidth: totalTableWidth }">
				<TableFooter>
					<TableRow 
						v-for="footerRow in dynamicFooterRows" 
						:key="`footer-row-${footerRow.index}`"
					>
						<!-- Footer Selection Cell -->
						<TableCell
							v-if="selectable"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] bg-white font-medium sticky left-0 z-30"
							:style="{ 
								...getSpecialVirtualCellWidthStyle('__selection__')
							}"
						>
							<!-- Empty footer cell for selectable column -->
						</TableCell>

						<!-- Footer Numbering Cell -->
						<TableCell
							v-if="showNumbering"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] font-medium border-t"
							:style="{ 
								...getSpecialVirtualCellWidthStyle('__numbering__')
							}"
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
									...getVirtualCellWidthStyle(cell, cell.footerColspan || 1)
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
	TableHead,
	TableHeader,
	TableRow,
	TableBody,
	TableCell,
	TableFooter,
	tableCellVariant
} from '../table'
import { Checkbox } from '../../components/checkbox'
import { Pagination } from '../../components/pagination'
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'
import DataTableSortButton from './DataTableSortButton.vue'
import VirtualScroll from "../virtual-scroll/VirtualScroll.vue";

// Constants and Variants
import {
	COLUMN_SIZE,
} from '.'

// Composables
import {
	useDataTablePersistence,
	useColumnVisibility,
	useTreeOperations,
	useColumnSorting,
	useDataTablePinning,
	useHiddenColumnDetection,
	useDataTableStyle,
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

// Dummy row width state
const dummyRow = ref(null)
const dummyCellWidths = ref(new Map()) // Map<fieldId, width>

// Rowspan tracking state - tracks which columns should be skipped in each row
const rowspanTracker = ref(new Map()) // Map<rowIndex, Set<columnIndex>>

// Virtual scroll ref
const tableVirtualWrapper = ref(null)

// Clear rowspan tracker when data changes
watch(() => props.data, () => {
	rowspanTracker.value.clear()
}, { deep: true })

// ============================
// VIRTUAL SCROLLING OPTIMIZATION
// ============================

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

const actualRowHeight = ref(getRowheightBasedOnRowSize(rowSize.value))

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
	// Handle infinite scroll
	if (props.infiniteScroll) {
		handleInfiniteScrollDebounced(event)
	}
	
	// Sync horizontal scroll dengan virtual scroll container dan footer
	syncHorizontalScrollToVirtual(event.target.scrollLeft)
	syncHorizontalScrollToFooter(event.target.scrollLeft)
}

// Sync horizontal scroll dari header ke virtual container
function syncHorizontalScrollToVirtual(scrollLeft) {
	tableVirtualWrapper.value.scrollToLeft(scrollLeft)
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

// Sync horizontal scroll dari header/virtual ke footer
function syncHorizontalScrollToFooter(scrollLeft) {
	if (footerScrollWrapper.value && footerScrollWrapper.value.scrollContainer) {
		const footerScrollContainer = footerScrollWrapper.value.scrollContainer
		if (footerScrollContainer.scrollLeft !== scrollLeft) {
			footerScrollContainer.scrollLeft = scrollLeft
		}
	}
}

// Sync horizontal scroll dari footer ke header/virtual
function syncHorizontalScrollFromFooter(scrollLeft) {
	// Sync to header
	if (dataTableScrollWrapper.value && dataTableScrollWrapper.value.scrollContainer) {
		const headerScrollContainer = dataTableScrollWrapper.value.scrollContainer
		if (headerScrollContainer.scrollLeft !== scrollLeft) {
			headerScrollContainer.scrollLeft = scrollLeft
		}
	}
	
	// Sync to virtual container
	if (tableVirtualWrapper.value && tableVirtualWrapper.value.scrollLeft !== scrollLeft) {
		tableVirtualWrapper.value.scrollLeft = scrollLeft
	}
}

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

// Initialize styling composable
const {
	getDataRowClasses,
	getHeaderCellClasses,
	getHeaderContentClasses,
	getDataCellClasses,
	getFooterCellClasses,
	getVirtualRowClass,
	getRowKey,
	getVirtualRowData,
	clearRowClassCaches,
} = useDataTableStyle(props, computedIsRowSelectable)

// Clear styling cache when data changes
watch(() => props.data, clearRowClassCaches, { deep: true })

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
		
		// Use the same column generation logic as virtual rows but for footer
		const columns = getFooterRowColumns(footerKey)
		
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

// Computed property for total table width
const totalTableWidth = computed(() => {
	let totalWidth = 0
	
	// Add selection column width if enabled
	if (props.selectable) {
		const selectionWidth = dummyCellWidths.value.get('__selection__')
		if (selectionWidth && selectionWidth !== 'auto') {
			totalWidth += parseFloat(selectionWidth)
		} else {
			totalWidth += 60 // default selection column width
		}
	}
	
	// Add numbering column width if enabled
	if (props.showNumbering) {
		const numberingWidth = dummyCellWidths.value.get('__numbering__')
		if (numberingWidth && numberingWidth !== 'auto') {
			totalWidth += parseFloat(numberingWidth)
		} else {
			totalWidth += 60 // default numbering column width
		}
	}
	
	// Add all data columns widths
	allLeafColumns.value.forEach(col => {
		const fieldId = col.compositeFieldId || col.field
		const width = dummyCellWidths.value.get(fieldId)
		if (width && width !== 'auto') {
			totalWidth += parseFloat(width)
		} else {
			totalWidth += 150 // default column width
		}
	})
	
	return `${totalWidth}px`
})

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

// Function khusus untuk footer row columns yang menangani colspan
function getFooterRowColumns(footerKey) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const filteredColumns = []
	let skipNext = 0

	leafColumns.forEach((col) => {
		// Skip if this column should be skipped due to colspan in current row
		if (skipNext > 0) {
			skipNext--
			return
		}

		const colspan = resolveColspan(col, footerKey, null, null)
		const rowspan = resolveRowspan(col, footerKey, null, null)

		// Use original colspan for footer (tidak perlu adjust seperti di virtual rows)
		const finalColspan = colspan || 1

		const adjustedColumn = {
			...col,
			footerColspan: finalColspan,
			footerRowspan: rowspan,
		}

		filteredColumns.push(adjustedColumn)

		// Handle colspan - skip next columns in this row  
		if (finalColspan > 1) {
			skipNext = finalColspan - 1
		}
	})

	return filteredColumns
}

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
watch(rowSize, newVal => {
	persistence.saveRowSize(newVal)
	// Recapture dummy row widths when row size changes
	if (props.data && props.data.length > 0) {
		nextTick(() => {
			captureDummyRowWidths()
		})
	}
})

// Clear rowspan tracker when columns change
watch(allLeafColumns, () => {
	rowspanTracker.value.clear()
}, { deep: true })

// Capture dummy row widths when data changes
watch(() => props.data, () => {
	if (props.data && props.data.length > 0) {
		nextTick(() => {
			captureDummyRowWidths()
			setupDummyRowObserver()
		})
	}
}, { immediate: true, flush: 'post' })

// Setup scroll synchronization when footer visibility changes
watch(() => props.showFooter, () => {
	nextTick(() => {
		setupScrollSynchronization()
	})
}, { flush: 'post' })

// Setup scroll synchronization when footer rows change
watch(dynamicFooterRows, () => {
	nextTick(() => {
		setupScrollSynchronization()
	})
}, { flush: 'post' })

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
// DUMMY ROW WIDTH SYNCHRONIZATION
// ============================

// Function to capture widths from dummy row cells
function captureDummyRowWidths() {
	if (!dummyRow.value) return
	
	nextTick(() => {
		// Get the actual DOM element from the Vue component
		const rowElement = dummyRow.value.$el || dummyRow.value
		if (!rowElement || typeof rowElement.querySelectorAll !== 'function') {
			console.warn('Dummy row element not found or not a DOM element')
			return
		}
		
		const cells = rowElement.querySelectorAll('td')
		dummyCellWidths.value.clear()
		
		// Capture selection cell width if exists
		if (props.selectable && cells.length > 0) {
			const selectionCell = cells[0]
			const width = window.getComputedStyle(selectionCell).width
			if (width && width !== 'auto') {
				dummyCellWidths.value.set('__selection__', width)
			}
		}
		
		// Capture numbering cell width if exists
		const numberingCellIndex = props.selectable ? 1 : 0
		if (props.showNumbering && cells.length > numberingCellIndex) {
			const numberingCell = cells[numberingCellIndex]
			const width = window.getComputedStyle(numberingCell).width
			if (width && width !== 'auto') {
				dummyCellWidths.value.set('__numbering__', width)
			}
		}
		
		// Capture data cells widths
		const dataCellStartIndex = (props.selectable ? 1 : 0) + (props.showNumbering ? 1 : 0)
		const dataCells = Array.from(cells).slice(dataCellStartIndex)
		
		dataCells.forEach((cell, index) => {
			const fieldId = cell.getAttribute('data-field')
			if (fieldId) {
				const width = window.getComputedStyle(cell).width
				if (width && width !== 'auto') {
					dummyCellWidths.value.set(fieldId, width)
				}
			} else {
				// Fallback: use column index if no data-field
				const columns = getVirtualRowColumns(props.data[0], 0)
				if (columns[index]) {
					const fieldId = columns[index].compositeFieldId || columns[index].field
					const width = window.getComputedStyle(cell).width
					if (width && width !== 'auto') {
						dummyCellWidths.value.set(fieldId, width)
					}
				}
			}
		})
	})
}

// Setup ResizeObserver for dummy row to auto-capture width changes
function setupDummyRowObserver() {
	if (!dummyRow.value) return
	
	// Get the actual DOM element from the Vue component
	const rowElement = dummyRow.value.$el || dummyRow.value
	if (!rowElement || typeof rowElement.querySelectorAll !== 'function') {
		console.warn('Dummy row element not found or not a DOM element for ResizeObserver')
		return
	}
	
	const debouncedCapture = useDebounceFn(captureDummyRowWidths, 100)
	
	useResizeObserver(rowElement, debouncedCapture)
}

// Function to get width style for virtual cells
function getVirtualCellWidthStyle(cell, colspan = 1) {
	if (colspan === 1) {
		// Single cell - get width directly
		const fieldId = cell.compositeFieldId || cell.field
		const width = dummyCellWidths.value.get(fieldId)
		
		if (width && width !== 'auto') {
			return {
				width: width,
				minWidth: width,
				maxWidth: width,
				flexShrink: 0
			}
		}
	} else {
		// Multiple cells (colspan) - calculate combined width
		const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
		const currentColIndex = leafColumns.findIndex(col => 
			(col.compositeFieldId || col.field) === (cell.compositeFieldId || cell.field)
		)
		
		if (currentColIndex !== -1) {
			let totalWidth = 0
			let unit = 'px'
			let hasValidWidths = false
			
			for (let i = 0; i < colspan && (currentColIndex + i) < leafColumns.length; i++) {
				const colFieldId = leafColumns[currentColIndex + i].compositeFieldId || 
								   leafColumns[currentColIndex + i].field
				const colWidth = dummyCellWidths.value.get(colFieldId)
				
				if (colWidth && colWidth !== 'auto') {
					const widthValue = parseFloat(colWidth)
					const widthUnit = colWidth.replace(/[\d.]/g, '') || 'px'
					unit = widthUnit
					totalWidth += widthValue
					hasValidWidths = true
				}
			}
			
			if (hasValidWidths) {
				const totalWidthStr = `${totalWidth}${unit}`
				return {
					width: totalWidthStr,
					minWidth: totalWidthStr,
					maxWidth: totalWidthStr,
					flexShrink: 0
				}
			}
		}
	}
	
	// Fallback to default width
	const defaultWidth = colspan * 120
	return {
		width: `${defaultWidth}px`,
		minWidth: `${defaultWidth}px`,
		maxWidth: `${defaultWidth}px`,
		flexShrink: 0
	}
}

// Function to get width style for special virtual cells (selection, numbering)
function getSpecialVirtualCellWidthStyle(type) {
	const width = dummyCellWidths.value.get(type)
	
	if (width && width !== 'auto') {
		return {
			width: width,
			minWidth: width,
			maxWidth: width,
			flexShrink: 0
		}
	}
	
	// Fallback to fixed width
	return {
		width: '60px',
		minWidth: '60px',
		maxWidth: '60px',
		flexShrink: 0
	}
}

// ============================
// INFINITE SCROLL FUNCTIONS
// ============================
const dataTableScrollWrapper = ref(null)
const footerScrollWrapper = ref(null)

const hasMoreData = computed(() => {
	const totalPages = getTotalPages(props.total, computedPerPage.value)
	return props.page < totalPages
})

const needsExtraSpace = ref(false)

// Computed scroll height for infinite scroll (supports rem, px, etc.)
// const computedScrollY = computed(() => {
// 	let baseScrollY = props.scrollY
	
// 	// For infinite scroll, adjust the base scroll height
// 	if (props.infiniteScroll && needsExtraSpace.value) {
// 		const match = String(props.scrollY).match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)
// 		if (match) {
// 			const [, value, unit] = match
// 			const originalValue = parseFloat(value)
// 			const reducedValue = Math.max(
// 				originalValue * 0.7,
// 				unit === 'rem' ? 20 : originalValue * 0.5
// 			)
// 			baseScrollY = `${reducedValue}${unit}`
// 		}
// 	}
	
// 	// If footer is sticky, adjust scroll height to account for footer height
// 	if (props.stickyFooter && totalFooterHeight.value > 0) {
// 		const match = String(baseScrollY).match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)
// 		if (match) {
// 			const [, value, unit] = match
// 			const originalValue = parseFloat(value)
			
// 			// Convert footer height to the same unit as scrollY
// 			let footerHeightInSameUnit = totalFooterHeight.value
// 			if (unit === 'rem') {
// 				// Assuming 1rem = 16px (browser default)
// 				footerHeightInSameUnit = totalFooterHeight.value / 16
// 			} else if (unit === 'em') {
// 				// Assuming 1em = 16px (browser default)
// 				footerHeightInSameUnit = totalFooterHeight.value / 16
// 			}
// 			// For px and other units, use the value as-is
			
// 			const adjustedValue = originalValue + footerHeightInSameUnit
// 			return `${adjustedValue}${unit}`
// 		}
// 	}
	
// 	return baseScrollY
// })

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
	
	// Setup horizontal scroll synchronization
	nextTick(() => {
		setupScrollSynchronization()
	})
	
	
	// Capture dummy row widths if data exists
	if (props.data && props.data.length > 0) {
		nextTick(() => {
			captureDummyRowWidths()
			setupDummyRowObserver()
		})
	}
})

// Setup scroll synchronization antara header, virtual container, dan footer
function setupScrollSynchronization() {
	// Pastikan kedua container sudah ada
	if (!dataTableScrollWrapper.value || !tableVirtualWrapper.value) {
		return
	}
	
	// Throttled sync functions untuk performance
	const throttledSyncToVirtual = useThrottleFn((scrollLeft) => {
		syncHorizontalScrollToVirtual(scrollLeft)
	}, 0) // ~60fps
	
	const throttledSyncToHeader = useThrottleFn((scrollLeft) => {
		syncHorizontalScrollToHeader(scrollLeft)
	}, 0) // ~60fps
	
	const throttledSyncToFooter = useThrottleFn((scrollLeft) => {
		syncHorizontalScrollToFooter(scrollLeft)
	}, 0) // ~60fps
	
	const throttledSyncFromFooter = useThrottleFn((scrollLeft) => {
		syncHorizontalScrollFromFooter(scrollLeft)
	}, 0) // ~60fps
	
	// Add event listeners untuk sync scroll
	const headerScrollContainer = dataTableScrollWrapper.value.scrollContainer
	if (headerScrollContainer) {
		headerScrollContainer.addEventListener('scroll', (e) => {
			throttledSyncToVirtual(e.target.scrollLeft)
			throttledSyncToFooter(e.target.scrollLeft)
		}, { passive: true })
	}
	
	if (tableVirtualWrapper.value) {
		tableVirtualWrapper.value.addEventListener('scroll', (e) => {
			throttledSyncToHeader(e.target.scrollLeft)
			throttledSyncToFooter(e.target.scrollLeft)
		}, { passive: true })
	}
	
	// Add footer scroll synchronization
	if (footerScrollWrapper.value && footerScrollWrapper.value.scrollContainer) {
		const footerScrollContainer = footerScrollWrapper.value.scrollContainer
		footerScrollContainer.addEventListener('scroll', (e) => {
			throttledSyncFromFooter(e.target.scrollLeft)
		}, { passive: true })
	}
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
// VIRTUAL SCROLL FUNCTIONS
// ============================
// Get dynamic row height for virtualizer
function getRowHeight(index) {
	// Use minimum height based on row size configuration
	const baseHeight = Math.max(actualRowHeight.value || 40, 40) // Minimum 40px
	
	// Check if row has complex content that might need more height
	if (props.data && props.data[index]) {
		const row = props.data[index]
		const columns = getVirtualRowColumns(row, index)
		
		// Calculate estimated height based on content
		let maxEstimatedHeight = baseHeight
		
		for (const col of columns) {
			// Check for rowspan that might affect height
			if (col.bodyRowspan > 1) {
				maxEstimatedHeight = Math.max(maxEstimatedHeight, baseHeight * col.bodyRowspan)
			}
			
			// Check for text content length
			const cellValue = row[col.field]
			if (cellValue && typeof cellValue === 'string') {
				// Simple estimation based on text length
				if (cellValue.length > 50) {
					// Estimate lines (assuming ~40 chars per line at normal width)
					const estimatedLines = Math.ceil(cellValue.length / 40)
					const estimatedHeight = baseHeight + ((estimatedLines - 1) * 20)
					maxEstimatedHeight = Math.max(maxEstimatedHeight, estimatedHeight)
				}
			}
		}
		
		// Cap at reasonable maximum to prevent extreme values
		return Math.min(maxEstimatedHeight, baseHeight * 4)
	}
	
	return baseHeight
}

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

.hide-scrollbar-x::-webkit-scrollbar:horizontal {
	display: none; /* Chrome, Safari, Opera */
}

/* Alternative approach - hide only horizontal scrollbar */
.hide-scrollbar-x::-webkit-scrollbar {
	height: 0px; /* Hide horizontal scrollbar */
	width: 8px; /* Keep vertical scrollbar */
}
</style>
