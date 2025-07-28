<template>
	<div :id="id" class="w-full flex flex-col relative gap-4" :data-cy="dataCy">
		<!-- Horizontal Scroll Wrapper with Indicators -->
		<DataTableScrollWrapper
			v-if="data && data.length"
			ref="dataTableScrollWrapper"
			:enable-horizontal-scroll="enableHorizontalScroll"
			:max-height="computedScrollY"
			:sticky-header="stickyHeaders"
			@scroll="onScrollEvent"
		>
			<!-- Table -->
			<Table>
				<!-- Table Header -->
				<TableHeader :sticky="stickyHeaders">
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
								:class="getHeaderCellClasses(col)"
								:style="getPinnedColumnStyles(col.compositeFieldId)"
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
					<template v-if="shouldUseVirtualScroll && data && data.length">
						<DataTableVirtualScroll
							:items="data"
							:item-height="rowHeight"
							:container-height="scrollY"
							:scroll-top="scrollTop"
							:overscan="10"
						>
							<template #default="{ visibleItems, startIndex }">
								<TableRow
									v-for="(row, rowIndex) in visibleItems"
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
										v-for="(cell, cellIndex) in visibleColumns"
										:key="`cell-${startIndex + rowIndex}-${cellIndex}`"
									>
										<TableCell
											:colspan="cell.bodyColspan || 1"
											:rowspan="cell.bodyRowspan || 1"
											:size="rowSize"
											:class="getDataCellClasses(cell)"
											:style="getPinnedColumnStyles(cell.compositeFieldId)"
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
								v-for="(cell, cellIndex) in visibleColumns"
								:key="`cell-${rowIndex}-${cellIndex}`"
							>
								<TableCell
									:colspan="cell.bodyColspan || 1"
									:rowspan="cell.bodyRowspan || 1"
									:size="rowSize"
									:class="getDataCellClasses(cell)"
									:style="getPinnedColumnStyles(cell.compositeFieldId)"
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
				<TableFooter v-if="showFooter">
					<TableRow>
						<!-- Footer Selection Cell -->
						<TableCell
							v-if="selectable"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] bg-white font-medium sticky left-0 z-20"
						>
							<!-- Empty footer cell for selectable column -->
						</TableCell>

						<!-- Footer Numbering Cell -->
						<TableCell
							v-if="showNumbering"
							:size="rowSize"
							class="text-center min-w-[60px] max-w-[60px] font-medium"
						>
							<!-- Empty footer cell for numbering column -->
						</TableCell>

						<!-- Footer Data Cells -->
						<template
							v-for="(cell, cellIndex) in visibleFooterColumns"
							:key="`footer-cell-${cellIndex}`"
						>
							<TableCell
								:colspan="cell.footerColspan || 1"
								:rowspan="cell.footerRowspan || 1"
								:size="rowSize"
								:class="getFooterCellClasses(cell)"
								:style="getPinnedColumnStyles(cell.compositeFieldId)"
							>
								<component :is="cell.footer" v-if="cell.footer" :data="data" />
								<span v-else>-</span>
							</TableCell>
						</template>
					</TableRow>
				</TableFooter>
			</Table>
		</DataTableScrollWrapper>
		<template v-else>
			<slot name="empty" />
		</template>

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
import { useDebounceFn, useVModel, useThrottleFn } from '@vueuse/core'
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
	loading: {
		type: Boolean,
		default: false,
	},
	// Virtual Scrolling Performance
	virtualScrollThreshold: {
		type: Number,
		default: 20,
	},
	rowHeight: {
		type: Number,
		default: 48,
	},
	virtualScrollThrottle: {
		type: Number,
		default: 16, // ~60fps, set to 0 to disable throttling
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

// Optimized scroll handler with smart updates
const updateScrollTop = useThrottleFn((newScrollTop) => {
	// Only update if there's a meaningful change (at least 5px or item height difference)
	const threshold = Math.max(5, props.rowHeight * 0.1)
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

const visibleFooterColumns = computed(() => {
	return getVisibleColumnsWithColspan('footer')
})

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

function getVisibleColumnsWithColspan(type) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const allLeafColumnsForSpan = allLeafColumns.value

	const filteredColumns = []
	let skipNext = 0

	leafColumns.forEach(col => {
		if (skipNext > 0) {
			skipNext--
			return
		}

		const originalIndex = allLeafColumnsForSpan.findIndex(
			originalCol => originalCol.field === col.field
		)

		const adjustedColspan = calculateAdjustedColspan(
			type === 'footer' ? col.footerColspan : col.bodyColspan,
			allLeafColumnsForSpan,
			originalIndex
		)

		const adjustedColumn = {
			...col,
			[type === 'footer' ? 'footerColspan' : 'bodyColspan']: adjustedColspan,
		}

		filteredColumns.push(adjustedColumn)

		if (adjustedColspan > 1) {
			skipNext = adjustedColspan - 1
		}
	})

	return filteredColumns
}

function calculateAdjustedColspan(colspan, allColumns, startIndex) {
	const originalColspan = colspan || 1
	if (originalColspan <= 1) return originalColspan

	let adjustedColspan = 1

	for (let i = 1; i < originalColspan; i++) {
		const targetIndex = startIndex + i
		if (targetIndex < allColumns.length) {
			const targetColumn = allColumns[targetIndex]
			if (
				isColumnVisible(targetColumn.compositeFieldId || targetColumn.field)
			) {
				adjustedColspan++
			}
		}
	}

	return adjustedColspan
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

	// Find the row index using efficient comparison
	let index = -1
	for (let i = 0; i < computedModelValue.value.length; i++) {
		const selectedRow = computedModelValue.value[i]
		
		// For objects, compare by reference first, then by key
		if (typeof row === 'object' && typeof selectedRow === 'object') {
			if (selectedRow === row) {
				index = i
				break
			}
			// Fallback to key comparison for different object instances with same data
			const rowKey = getRowKey(row, -1)
			const selectedRowKey = getRowKey(selectedRow, -1)
			if (rowKey !== `row--1` && rowKey === selectedRowKey) {
				index = i
				break
			}
		} else if (selectedRow === row) {
			// For primitives, direct comparison
			index = i
			break
		}
	}
	
	if (index > -1) {
		const newSelection = [...computedModelValue.value]
		newSelection.splice(index, 1)
		computedModelValue.value = newSelection
	} else {
		computedModelValue.value.push(row)
	}
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
	return [
		datatableHeaderVariants({
			hasSubheader: col.hasSubheader,
			hasBorderLeft: col.hasBorderLeft,
			hasBorderRight: col.hasBorderRight,
			isSticky: props.stickyHeaders,
		}),
	]
}

function getHeaderContentClasses(col) {
	return [
		cn(
			'flex justify-between w-full items-center group',
			datatableHeaderContentVariants({
				hasSubheader: col.hasSubheader,
			})
		),
	]
}

function getDataCellClasses(cell) {
	return [
		datatableDataCellVariants({
			hasBorderLeft: cell.hasBorderLeft,
			hasBorderRight: cell.hasBorderRight,
		}),
	]
}

function getFooterCellClasses(cell) {
	return [
		datatableDataCellVariants({
			hasBorderLeft: cell.hasBorderLeft,
			hasBorderRight: cell.hasBorderRight,
		}),
		'font-medium bg-muted/50',
	]
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
watch(columnVisibility, newVal => persistence.saveColumnVisibility(newVal), {
	deep: true,
})
watch(rowSize, newVal => persistence.saveRowSize(newVal))

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

const hasMoreData = computed(() => {
	const totalPages = getTotalPages(props.total, computedPerPage.value)
	return props.page < totalPages
})

const needsExtraSpace = ref(false)

// Computed scroll height for infinite scroll (supports rem, px, etc.)
const computedScrollY = computed(() => {
	if (!props.infiniteScroll || !needsExtraSpace.value) {
		return props.scrollY
	}

	// Extract numeric value and unit (e.g., "40rem", "600px")
	const match = String(props.scrollY).match(/^(\d+(?:\.\d+)?)([a-z%]+)$/i)
	if (!match) return props.scrollY

	const [, value, unit] = match
	const originalValue = parseFloat(value)
	const reducedValue = Math.max(
		originalValue * 0.7,
		unit === 'rem' ? 20 : originalValue * 0.5
	)
	return `${reducedValue}${unit}`
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

// Check scrollability when component mounts
onMounted(() => {
	checkScrollability()
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
})
</script>
