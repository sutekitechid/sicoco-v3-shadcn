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
				
				<!-- Dummy Table Body for Width Measurement -->
				<DataTableDummyBody
					ref="dummyTableBody"
					:data="data"
					:selectable="selectable"
					:show-numbering="showNumbering"
					:row-size="rowSize"
					:get-data-row-classes="getDataRowClasses"
					:get-virtual-row-columns="getVirtualRowColumns"
					:flattened-header-rows="flattenedHeaderRows"
					:get-data-cell-classes="getDataCellClasses"
					:get-pinned-column-styles="getPinnedColumnStyles"
				/>

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
							@update:model-value="(value) => onSelectRow(value, getVirtualRowData(rowIndex))"
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
		<DataTableFooter
			ref="footerScrollWrapper"
			:data="data"
			:show-footer="showFooter"
			:dynamic-footer-rows="dynamicFooterRows"
			:selectable="selectable"
			:show-numbering="showNumbering"
			:row-size="rowSize"
			:total-table-width="totalTableWidth"
			:get-special-virtual-cell-width-style="getSpecialVirtualCellWidthStyle"
			:get-virtual-cell-width-style="getVirtualCellWidthStyle"
			:get-footer-cell-classes="getFooterCellClasses"
			:get-pinned-column-styles="getPinnedColumnStyles"
			:get-footer-component="getFooterComponent"
			@scroll="syncHorizontalScrollFromFooterWrapper"
		/>

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

import { useDebounceFn, useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import { handleInfiniteScroll, getTotalPages } from '@/utils/pagination'
import { DEBOUNCE_DURATION } from '@/utils/constants'

// Components
import {
	Table,
	TableHead,
	TableHeader,
	TableRow,
	tableCellVariant
} from '../table'
import { Checkbox } from '../../components/checkbox'
import { Pagination } from '../../components/pagination'
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'
import DataTableSortButton from './DataTableSortButton.vue'
import DataTableFooter from './DataTableFooter.vue'
import DataTableDummyBody from './DataTableDummyBody.vue'
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
	useSelectRow,
	useDataTableColumnWidth,
	useVirtualScroll,
	useDataTableScrollSync,
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

// Virtual scroll ref
const tableVirtualWrapper = ref(null)

// Dummy table body ref  
const dummyTableBody = ref(null)

// Clear rowspan tracker when data changes
watch(() => props.data, () => {
	clearRowspanTracker()
}, { deep: true })

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
	syncHorizontalScrollToVirtualWrapper(event.target.scrollLeft)
	syncHorizontalScrollToFooterWrapper(event.target.scrollLeft)
}

// Wrapper functions that use the composable
function syncHorizontalScrollToVirtualWrapper(scrollLeft) {
	syncHorizontalScrollToVirtual(tableVirtualWrapper.value, scrollLeft)
}

function syncHorizontalScrollToHeaderWrapper(scrollLeft) {
	syncHorizontalScrollToHeader(dataTableScrollWrapper.value, scrollLeft)
}

function syncHorizontalScrollToFooterWrapper(scrollLeft) {
	syncHorizontalScrollToFooter(footerScrollWrapper.value, scrollLeft)
}

function syncHorizontalScrollFromFooterWrapper(scrollLeft) {
	syncHorizontalScrollFromFooter(dataTableScrollWrapper.value, tableVirtualWrapper.value, scrollLeft)
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

// ============================
// COMPUTED PROPERTIES - SELECTIONS
// ============================
const {
	computedIsRowSelectable,
	isIndeterminate,
	isSelectAllDisabled,
	isAnySelected,
	isRowSelected,
	selectAll,
	selectRows,
	onSelectRow,
} = useSelectRow(props, emit)

// Get unique identifier for a row
// Optimized row selection check
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
	getVirtualRowData,
	clearCaches,
} = useDataTableStyle(props, computedIsRowSelectable)

// Clear styling cache when data changes
watch(() => props.data, clearCaches, { deep: true })

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
	clearRowspanTracker()
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
	const syncFunctions = {
		syncHorizontalScrollToVirtual: syncHorizontalScrollToVirtualWrapper,
		syncHorizontalScrollToHeader: syncHorizontalScrollToHeaderWrapper,
		syncHorizontalScrollToFooter: syncHorizontalScrollToFooterWrapper,
		syncHorizontalScrollFromFooter: syncHorizontalScrollFromFooterWrapper,
	}
	
	setupScrollSynchronizationFromComposable(
		dataTableScrollWrapper.value,
		tableVirtualWrapper.value,
		footerScrollWrapper.value,
		syncFunctions
	)
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
// VIRTUAL SCROLLING OPTIMIZATION
// ============================

// Initialize virtual scroll composable
const {
	shouldUseVirtualScroll,
	getVirtualRowColumns,
	getRowHeight,
	clearRowspanTracker,
	resolveColspan,
	resolveRowspan,
} = useVirtualScroll(props, sortedNodes, treeOps, rowSize)

// Initialize column width composable
const {
	totalTableWidth,
	captureDummyRowWidths,
	setupDummyRowObserver,
	getVirtualCellWidthStyle,
	getSpecialVirtualCellWidthStyle,
} = useDataTableColumnWidth(props, allLeafColumns, sortedNodes, treeOps, getVirtualRowColumns, () => dummyTableBody.value?.dummyRow)

// Initialize scroll sync composable
const {
	syncHorizontalScrollToVirtual,
	syncHorizontalScrollToHeader,
	syncHorizontalScrollToFooter,
	syncHorizontalScrollFromFooter,
	setupScrollSynchronization: setupScrollSynchronizationFromComposable,
} = useDataTableScrollSync()

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
