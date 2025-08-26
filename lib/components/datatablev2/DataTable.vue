<template>
	<div
		:id="id"
		class="flex flex-col relative overflow-hidden"
		:data-cy="dataCy"
	>
		<!-- Horizontal Scroll Wrapper with Indicators -->
		<!-- Table -->
		 <div
		 	ref="header"
		 	class="overflow-x-auto overflow-y-hidden hide-scroll-x"
			@pointerover="pointerOverHeader"
			@scroll="syncHeaderScroll"
		>
			 <Table :id="tableId" class="overflow-x-auto mr-2.5">
				 <!-- Table Header -->
				 <TableHeader v-if="dataLength !== 0 || loading">
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
								 :class="
									 cn(
										 getHeaderCellClasses(col),
										 hasHiddenColumnOnLeft(colIndex, row) &&
											 'border-l-4 border-l-warning-50',
										 isRightmostVisibleColumn(colIndex, row) &&
											 hasHiddenColumnOnRight(colIndex, row) &&
											 'border-r-4 border-r-warning-50'
									 )
								 "
								 :style="{
									 ...getPinnedColumnStyles(col.compositeFieldId),
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
	 
				 <!-- Loading State -->
				 <template v-if="loading && !data?.length">
					 <DataTableLoading :total-data="totalDataColumn" />
				 </template>
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
					 @mounted="handleDummyMounted"
				 />
	 
				 <!-- Empty State -->
				 <template v-if="dataLength === 0 && !loading">
					 <slot name="empty" />
				 </template>
			 </Table>
		 </div>

		<!-- Virtual Scroll Container with Div Layout (when virtual scroll is enabled) -->
		<VirtualScroll
			v-if="startRender"
			ref="virtualScroll"
			:class="['text-sm scroll-content w-full overflow-x-auto hide-scroll-x']"
			:style="{ maxHeight: computedScrollY }"
			:item-class="getVirtualRowClass"
			:item-style="{ width: totalTableWidthPx }"
			:data-length="dataLength"
			:total="total || 0"
			:estimate-size="getRowHeight"
			:disabled="!shouldUseVirtualScroll"
			:enabled="scrollY !== ''"
			:infinite-scroll="infiniteScroll"
			:overscan="computedOverScan"
			@load-more="loadMoreData"
		>
			<template #default="{ rowIndex }">
				<DataTableRowContent
					:row-data="getVirtualRowData(rowIndex)"
					:row-index="rowIndex"
					:selectable="selectable"
					:show-numbering="showNumbering"
					:row-size="rowSize"
					:checkbox-data-cy="checkboxDataCy"
					:get-virtual-row-columns="getVirtualRowColumns"
					:get-row-number="getRowNumber"
					:get-special-virtual-cell-width-style="
						getSpecialVirtualCellWidthStyle
					"
					:get-data-cell-classes="getDataCellClasses"
					:get-pinned-column-styles="getPinnedColumnStyles"
					:get-virtual-cell-width-style="getVirtualCellWidthStyle"
					:is-row-selected="isRowSelected"
					:select-rows="selectRows"
					:on-select-row="onSelectRow"
					:flattened-header-rows="flattenedHeaderRows"
					:is-row-selectable="computedIsRowSelectable"
				/>
			</template>
		</VirtualScroll>
		<DataTableInfiniteScrollLoading
			v-if="loading && infiniteScroll && dataLength > 0"
			:row-data="getVirtualRowData(0)"
			:row-index="0"
			:selectable="selectable"
			:show-numbering="showNumbering"
			:row-size="rowSize"
			:get-virtual-row-columns="getVirtualRowColumns"
			:get-special-virtual-cell-width-style="getSpecialVirtualCellWidthStyle"
			:get-data-cell-classes="getDataCellClasses"
			:get-pinned-column-styles="getPinnedColumnStyles"
			:get-virtual-cell-width-style="getVirtualCellWidthStyle"
			:flattened-header-rows="flattenedHeaderRows"
		/>

		<!-- Footer -->
		<div
			ref="footer"
			class="overflow-x-auto"
			@pointerover="pointerOverFooter"
			@scroll="syncFooterScroll"
		>
			<DataTableFooter
				v-if="startRender && showFooter"
				:data="data"
				:rows="dynamicFooterRows"
				:selectable="selectable"
				:show-numbering="showNumbering"
				:row-size="rowSize"
				:total-table-width="totalTableWidthPx"
				:get-special-virtual-cell-width-style="getSpecialVirtualCellWidthStyle"
				:get-virtual-cell-width-style="getVirtualCellWidthStyle"
				:get-pinned-column-styles="getPinnedColumnStyles"
			/>
		</div>
	</div>
	<!-- Pagination -->
	<Pagination
		v-if="paginated && dataLength"
		v-model:page="computedPage"
		v-model:per-page="computedPerPage"
		:total="total"
		class="mt-4"
		@change-page="onChangePage"
		@change-per-page="onChangePerPage"
	/>
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
	readonly,
	onUnmounted,
} from 'vue'

import { useVModel, useResizeObserver } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'

// Components
import { Table, TableHead, TableHeader, TableRow } from '../table'
import { Pagination } from '../../components/pagination'
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableSortButton from './DataTableSortButton.vue'
import DataTableFooter from './DataTableFooter.vue'
import DataTableDummyBody from './DataTableDummyBody.vue'
import DataTableRowContent from './DataTableRowContent.vue'
import DataTableLoading from './DataTableLoading.vue'
import DataTableInfiniteScrollLoading from './DataTableInfiniteScrollLoading.vue'
import VirtualScroll from '../virtual-scroll/VirtualScroll.vue'
import Checkbox from '../checkbox/Checkbox.vue'
import { isMobile } from '../../utils/viewport'

// Composables
import { useSyncScroll } from './composables/useSyncScroll'

// Constants and Variants
import { COLUMN_SIZE } from '.'

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
		default: undefined,
	},
	enableTableSettings: {
		type: Boolean,
		default: false,
	},
	enableVirtualScroll: {
		type: Boolean,
		default: true,
	},
	rowSize: {
		type: String,
		default: ''
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

const computedRowSize = computed(() => {
	return props.rowSize || COLUMN_SIZE.Small
})

const rowSize = ref(computedRowSize.value)

// Dummy table body ref
const dummyTableBody = ref(null)
const virtualScroll = ref(null)
const tableId = computed(() => `${props.id}-table`)

const dataLength = computed(() => {
	return props.data ? props.data.length : 0
})

const startRender = computed(() => {
	return dataLength.value > 0
})

// Clear rowspan tracker when data changes
watch(
	() => props.data,
	() => {
		clearRowspanTracker()
	},
	{ deep: true }
)

// Handle infinite scroll loading
function loadMoreData() {
	if (props.loading) return
	computedPage.value++
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

const {
	sortValue,
	toggleSort,
	getSortState,
	getSortIndex,
	clearSort,
	setSortState,
	initializeDefaultSorting,
} = useColumnSorting(props, emit, allLeafColumns)

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
				columns,
			})
		}
	})

	return footerRows
})

// Function khusus untuk footer row columns yang menangani colspan
function getFooterRowColumns(footerKey) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const filteredColumns = []
	let skipNext = 0

	leafColumns.forEach(col => {
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
	rowSize.value = computedRowSize.value
	// Reset pinning state
	resetPinning()
}

// ============================
// WATCHERS
// ============================
watch(
	columnVisibility,
	newVal => {
		persistence.saveColumnVisibility(newVal)
	},
	{
		deep: true,
	}
)
watch(rowSize, newVal => {
	persistence.saveRowSize(newVal)
	// Recapture dummy row widths when row size changes
	if (dataLength.value > 0) {
		nextTick(() => {
			captureDummyRowWidths()
		})
	}
})

// Clear rowspan tracker when columns change
watch(
	allLeafColumns,
	() => {
		clearRowspanTracker()
	},
	{ deep: true }
)

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

			// Initialize default sorting if no sort state exists
			if (sortValue.value.length === 0) {
				initializeDefaultSorting()
			}
		}
	},
	{ immediate: true }
)

// ============================
// REFS FOR SCROLL CONTAINERS
// ============================

onMounted(() => {
	// Load rowSize from localStorage
	const savedRowSize = persistence.loadRowSize(computedRowSize.value)
	if (savedRowSize) {
		rowSize.value = savedRowSize
	}
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

// Initialize styling composable
const {
	getDataRowClasses,
	getHeaderCellClasses,
	getHeaderContentClasses,
	getDataCellClasses,
	getVirtualRowClass,
	getVirtualRowData,
	clearRowClassCaches,
} = useDataTableStyle(props, computedIsRowSelectable)

// Clear styling cache when data changes
watch(() => props.data, clearRowClassCaches, { deep: true })

// Initialize column width composable
const {
	captureDummyRowWidths,
	setupDummyRowObserver,
	getVirtualCellWidthStyle,
	getSpecialVirtualCellWidthStyle,
} = useDataTableColumnWidth(
	props,
	allLeafColumns,
	sortedNodes,
	treeOps,
	getVirtualRowColumns,
	() => dummyTableBody.value?.dummyRow
)

const totalTableWidth = ref(0)

const totalTableWidthPx = computed(() => {
	return totalTableWidth.value > 0 ? `${totalTableWidth.value}px` : 'auto'
})

const totalDataColumn = computed(() => {
	const visibleColumns = allLeafColumns.value.filter(col =>
		isColumnVisible(col.compositeFieldId || col.field)
	)
	if (visibleColumns.length === 0) return 0
	let result = visibleColumns.length
	if (props.selectable) result++
	if (props.showNumbering) result++
	return result
})

function handleDummyMounted() {
	// Capture dummy row widths after dummy table is mounted
	captureDummyRowWidths()
	setupDummyRowObserver()

	useResizeObserver(dummyTableBody.value?.dummyRow, entries => {
		const entry = entries[0]
		const { width } = entry.contentRect
		totalTableWidth.value = width
	})
}

// ============================
// SCROLL SYNCHRONIZATION
// ============================
const header = ref(null)
const footer = ref(null)

const {
	syncHeaderScroll: _syncHeaderScroll,
	syncBodyScroll: _syncBodyScroll,
	syncFooterScroll: _syncFooterScroll,
	pointerOverHeader,
	pointerOverBody,
	pointerOverFooter,
	setupVirtualScrollSync
} = useSyncScroll()

// Wrapper functions to pass refs
function syncHeaderScroll() {
	_syncHeaderScroll(header, virtualScroll, footer)
}

function syncBodyScroll() {
	_syncBodyScroll(header, virtualScroll, footer)
}

function syncFooterScroll() {
	_syncFooterScroll(header, virtualScroll, footer)
}

// Setup virtual scroll synchronization
setupVirtualScrollSync(virtualScroll, header, footer)

onUnmounted(() => {
	if (virtualScroll.value) {
		virtualScroll.value.virtualWrapper.removeEventListener('scroll', syncBodyScroll);
		virtualScroll.value.virtualWrapper.removeEventListener('pointerover', pointerOverBody);
	}
});

const computedScrollY = computed(() => {
	if (!props.scrollY) return 0
	if (isMobile()) return '20rem'
	return props.scrollY
})

// Handle Low-spec mobile device which can not render the row items smoothly if there are many items
const computedOverScan = computed(() => {
	if (isMobile()) return 1
	return 5
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
	initializeDefaultSorting,
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

.hide-scroll-x::-webkit-scrollbar:horizontal {
	width: 0;
	height: 0;
}
</style>
