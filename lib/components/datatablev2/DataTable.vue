<template>
	<div
		:id="id"
		class="flex flex-col"
		:data-cy="dataCy"
	>
		<div ref="scrollContainer" class="overflow-auto" :style="{ maxHeight: computedScrollY }">
			<Table :id="tableId">
				<!-- Header -->
				<TableHeader :class="getHeaderSectionClasses()">
					<TableRow
						v-for="(row, rowIndex) in headerRows"
						:key="`header-row-${rowIndex}`"
					>
						<!-- Selection Header Column -->
						<TableHead
							v-if="selectable && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							data-col="__selection__"
							class="text-center min-w-[60px] max-w-[60px] bg-white dark:bg-neutral-10 sticky left-0 z-40"
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
							data-col="__numbering__"
							class="text-center w-[3.75rem] bg-white dark:bg-neutral-10"
							:style="{ ...getPinnedColumnStyle('__numbering__'), zIndex: 40 }"
						>
							No.
						</TableHead>

						<!-- Data Header Columns -->
						<TableHead
							v-for="(col, colIndex) in row"
							:key="`header-cell-${rowIndex}-${colIndex}`"
							:colspan="col.colspan"
							:rowspan="col.rowspan"
							:size="rowSize"
							:data-field="col.field"
							:class="getHeaderCellClasses(col)"
							:style="getPinnedColumnStyle(col.compositeFieldId)"
						>
							<div class="flex items-center justify-between gap-2">
								<div :class="getHeaderContentClasses(col)">
									<component :is="col.header" />
								</div>
								<DataTableSortButton
									v-if="shouldShowSortControls(col)"
									:sort-state="getSortState(col.field)"
									:sort-index="getSortIndex(col.field)"
									:show-sort-controls="true"
									@toggle-sort="toggleSort(col.field)"
								/>
							</div>
						</TableHead>
					</TableRow>
				</TableHeader>

				<!-- Loading State (full — replaces data rows when not infinite scroll or no data yet) -->
				<DataTableLoading v-if="loading && (!infiniteScroll || dataLength === 0)" :total-data="totalDataColumn" />

				<!-- Empty State -->
				<TableBody v-else-if="dataLength === 0">
					<TableRow>
						<TableCell :colspan="totalDataColumn">
							<slot name="empty" />
						</TableCell>
					</TableRow>
				</TableBody>

				<!-- Data Rows (always visible when has data, even during infinite-scroll load-more) -->
				<TableBody v-if="!loading || (infiniteScroll && dataLength > 0)">
					<TableRow
						v-for="(row, rowIndex) in filteredData"
						:key="rowKey ? row[rowKey] : rowIndex"
						:class="getDataRowClasses(rowIndex, row)"
						@click="handleRowClick(row, rowIndex)"
					>
						<TableCell
							v-if="selectable"
							:size="rowSize"
							:class="['sticky left-0 z-20 text-center min-w-[60px] max-w-[60px]', getPinnedCellBgClass(filteredIsRowSelectable[rowIndex])]"
						>
							<Checkbox
								:model-value="isRowSelected(row)"
								:value="true"
								:disabled="!filteredIsRowSelectable[rowIndex]"
								:data-cy="checkboxDataCy"
								class="mx-auto"
								@click.stop
								@update:model-value="(val) => onSelectRow(val, row)"
							/>
						</TableCell>
						<TableCell
							v-if="showNumbering"
							:size="rowSize"
							:class="['text-center', getPinnedCellBgClass(filteredIsRowSelectable[rowIndex])]"
							:style="getPinnedColumnStyle('__numbering__')"
						>
							{{ getRowNumber(rowIndex) }}
						</TableCell>
						<TableCell
							v-for="col in getRowColumns(row, rowIndex)"
							:key="col.compositeFieldId"
							:colspan="col.bodyColspan"
							:rowspan="col.bodyRowspan"
							:size="rowSize"
							:class="getDataCellClasses(col, null, null, rowIndex)"
							:style="getPinnedColumnStyle(col.compositeFieldId)"
						>
							<component :is="col.cell" :row="row" :index="rowIndex" />
						</TableCell>
					</TableRow>
				</TableBody>

				<!-- Infinite Scroll Loading Skeleton (appended after data rows) -->
				<DataTableLoading v-if="loading && infiniteScroll && dataLength > 0" :total-data="totalDataColumn" />

				<!-- Footer (inside same Table) -->
				<DataTableFooter
					v-if="showFooter && !loading && dataLength > 0"
					:data="filteredData"
					:rows="dynamicFooterRows"
					:selectable="selectable"
					:show-numbering="showNumbering"
					:row-size="rowSize"
					:get-pinned-column-style="getPinnedColumnStyle"
					:sticky="stickyFooter"
				/>
			</Table>

			<!-- Infinite Scroll Sentinel (inside scroll container so IntersectionObserver root works) -->
			<div v-if="infiniteScroll" ref="infiniteScrollSentinel" class="h-px" />
		</div>

		<!-- Pagination -->
		<Pagination
			v-if="shouldShowPagination && (props.data?.length ?? 0)"
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="effectiveTotal"
			class="mt-4"
		/>
		<slot />
	</div>
</template>

<script setup>
import {
	computed,
	ref,
	watch,
	nextTick,
	onMounted,
	onUnmounted,
	reactive,
	provide,
	readonly,
} from 'vue'

import { useVModel, useResizeObserver } from '@vueuse/core'

// Components
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../table'
import { Pagination } from '../../components/pagination'
import DataTableSortButton from './DataTableSortButton.vue'
import DataTableFooter from './DataTableFooter.vue'
import DataTableLoading from './DataTableLoading.vue'
import Checkbox from '../checkbox/Checkbox.vue'

// Composables
import {
	useTreeOperations,
	useColumnSorting,
	useDataTablePinning,
	useDataTableStyle,
	useSelectRow,
} from './composables/index.js'

// Constants
import { COLUMN_SIZE } from '.'

// ============================
// PROPS & EMITS
// ============================
const props = defineProps({
	data: Array,
	id: {
		type: String,
		default: 'datatable',
	},
	// Pagination — 3-value: true | false | undefined (auto)
	paginated: {
		type: Boolean,
		default: undefined,
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
	infiniteScroll: {
		type: Boolean,
		default: false,
	},
	scrollY: {
		type: String,
		default: '40rem',
	},
	isRowSelectable: {
		type: Function,
		default: () => true,
	},
	dataCy: {
		type: String,
		default: '',
	},
	rowClass: {
		type: [String, Function],
		default: '',
	},
	rowSize: {
		type: String,
		default: '',
	},
})

const emit = defineEmits([
	'update:page',
	'update:perPage',
	'update:modelValue',
	'sort',
])

// ============================
// REACTIVE STATE
// ============================
const scrollContainer = ref(null)
const infiniteScrollSentinel = ref(null)
let infiniteScrollObserver = null

const groups = reactive([])
const columns = reactive([])

const computedRowSize = computed(() => props.rowSize || COLUMN_SIZE.Small)
const rowSize = ref(computedRowSize.value)

const tableId = computed(() => `${props.id}-table`)

// Client-side pagination: slice data when paginated !== false and not infinite scroll
const isClientSidePaginated = computed(() =>
	!props.infiniteScroll && props.paginated === undefined
)

// ============================
// V-MODELS
// ============================
const computedPage = useVModel(props, 'page', emit)
const computedPerPage = useVModel(props, 'perPage', emit)

const filteredData = computed(() => {
	const data = props.data || []
	if (!isClientSidePaginated.value) return data
	const start = (computedPage.value - 1) * Number(computedPerPage.value)
	return data.slice(start, start + Number(computedPerPage.value))
})

// Selectability for the currently rendered rows (page-relative index)
// Avoids off-by-page-offset when computedIsRowSelectable uses full props.data indices
const filteredIsRowSelectable = computed(() =>
	filteredData.value.map(row => props.isRowSelectable(row))
)

// ============================
// CONSTANTS
// ============================
const MAXIMUM_PER_PAGE = 100

const dataLength = computed(() => filteredData.value.length)

// ============================
// COMPOSABLES
// ============================
const treeOps = useTreeOperations()

const {
	isIndeterminate,
	isSelectAllDisabled,
	isAnySelected,
	isRowSelected,
	selectAll,
	onSelectRow,
} = useSelectRow(props, emit)

// ============================
// COLUMN TREE
// ============================
const tree = computed(() => treeOps.buildTree(groups, columns))

const allLeafColumns = computed(() => {
	const ungrouped = getUngroupedColumns()
	const allNodes = [...tree.value, ...ungrouped]
	const leafColumns = treeOps.collectLeafColumns(allNodes)
	return treeOps.sortColumns(leafColumns)
})

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
	const filteredTree = treeOps.filterTreeByVisibility(tree.value)
	const filteredUngrouped = getFilteredUngroupedColumns()
	return treeOps.sortNodes([...filteredTree, ...filteredUngrouped])
})

const headerRows = computed(() => {
	if (sortedNodes.value.length === 0) return []
	const depth = Math.max(...sortedNodes.value.map(c => treeOps.calculateDepth(c)), 1)
	return treeOps.flattenTreeToRows(sortedNodes.value, depth)
})

// ============================
// PINNING
// ============================
const hasSelectable = computed(() => props.selectable)
const hasNumbering = computed(() => props.showNumbering)

const {
	getPinnedColumnStyle,
	refreshPinnedOffsets,
	scheduleRefresh,
} = useDataTablePinning(allLeafColumns, {
	hasSelectable,
	hasNumbering,
	tableId,
})

// ============================
// STYLING
// ============================
const {
	getDataRowClasses,
	getHeaderSectionClasses,
	getHeaderCellClasses,
	getHeaderContentClasses,
	getDataCellClasses,
	getPinnedCellBgClass,
	clearRowClassCaches,
} = useDataTableStyle(props, filteredIsRowSelectable)

watch(() => filteredData.value, clearRowClassCaches, { deep: true })

// ============================
// INFINITE SCROLL
// ============================
function loadMoreData() {
	if (props.loading) return
	computedPage.value++
}

function setupInfiniteScrollObserver() {
	if (!props.infiniteScroll) return
	infiniteScrollObserver?.disconnect()
	nextTick(() => {
		if (!infiniteScrollSentinel.value) return
		infiniteScrollObserver = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !props.loading) {
					loadMoreData()
				}
			},
			{
				root: scrollContainer.value || null,
				threshold: 0,
			}
		)
		infiniteScrollObserver.observe(infiniteScrollSentinel.value)
	})
}

// ============================
// PAGINATION
// ============================
const shouldShowPagination = computed(() => {
	if (props.infiniteScroll) return false
	if (props.paginated === true) return true
	if (props.paginated === false) return false
	// undefined → auto-protect (use raw data length, not sliced)
	return (props.data?.length ?? 0) > MAXIMUM_PER_PAGE
})

watch(
	shouldShowPagination,
	(newVal) => {
		if (newVal) {
			computedPerPage.value = MAXIMUM_PER_PAGE
		}
	},
	{ deep: true }
)

const effectiveTotal = computed(() => {
	if (isClientSidePaginated.value) return props.data?.length ?? 0
	return props.total
})

function getRowNumber(rowIndex) {
	return (computedPage.value - 1) * Number(computedPerPage.value) + rowIndex + 1
}

// ============================
// BODY ROW COLUMN HELPERS
// ============================
function resolveSpan(value, row, rowIndex) {
	if (typeof value === 'function') return value(row, rowIndex)
	return value || 1
}

function getRowColumns(row, rowIndex) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const result = []
	let skipNext = 0
	for (const col of leafColumns) {
		if (skipNext > 0) {
			skipNext--
			continue
		}
		const colspan = resolveSpan(col.bodyColspan, row, rowIndex)
		const rowspan = resolveSpan(col.bodyRowspan, row, rowIndex)
		result.push({ ...col, bodyColspan: colspan, bodyRowspan: rowspan })
		if (colspan > 1) skipNext = colspan - 1
	}
	return result
}

// ============================
// FOOTER ROW COLUMNS
// ============================
const dynamicFooterRows = computed(() => {
	const footerRowsMap = new Map()

	allLeafColumns.value.forEach(col => {
		if (col.footerSlots) {
			Object.keys(col.footerSlots).forEach(slotName => {
				if (!slotName.startsWith('footer')) return
				let footerIndex = 1
				if (slotName !== 'footer') {
					const match = slotName.match(/footer(\d+)/)
					if (match) footerIndex = Number.parseInt(match[1])
				}
				if (!footerRowsMap.has(footerIndex)) footerRowsMap.set(footerIndex, new Set())
				footerRowsMap.get(footerIndex).add(slotName)
			})
		}
		if (col.footer) {
			if (!footerRowsMap.has(1)) footerRowsMap.set(1, new Set())
			footerRowsMap.get(1).add('footer')
		}
	})

	const footerRows = []
	const sortedIndexes = Array.from(footerRowsMap.keys()).sort((a, b) => a - b)
	sortedIndexes.forEach(footerIndex => {
		const footerKey = footerIndex === 1 ? 'footer' : `footer${footerIndex}`
		const cols = getFooterRowColumns(footerKey)
		const hasContent = cols.some(col => {
			if (col.footerSlots && col.footerSlots[footerKey]) return true
			if (footerKey === 'footer' && col.footer) return true
			return false
		})
		if (hasContent) footerRows.push({ index: footerIndex, footerKey, columns: cols })
	})
	return footerRows
})

function getFooterRowColumns(footerKey) {
	const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
	const result = []
	let skipNext = 0
	leafColumns.forEach(col => {
		if (skipNext > 0) { skipNext--; return }
		const footerColspan = typeof col.footerColspan === 'function'
			? col.footerColspan(footerKey)
			: (col.footerColspan || 1)
		const footerRowspan = typeof col.footerRowspan === 'function'
			? col.footerRowspan(footerKey)
			: (col.footerRowspan || 1)
		result.push({ ...col, footerColspan, footerRowspan })
		if (footerColspan > 1) skipNext = footerColspan - 1
	})
	return result
}

// ============================
// TOTALS
// ============================
const totalDataColumn = computed(() => {
	let result = allLeafColumns.value.length
	if (props.selectable) result++
	if (props.showNumbering) result++
	return result
})

const computedScrollY = computed(() => {
	if (!props.scrollY) return undefined
	return props.scrollY
})

// ============================
// ROW INTERACTION
// ============================
function handleRowClick(row, rowIndex) {
	if (!props.selectable) return
	if (!filteredIsRowSelectable.value[rowIndex]) return
	onSelectRow(!isRowSelected(row), row)
}

// ============================
// SORT CONTROLS
// ============================
function shouldShowSortControls(col) {
	if (!col.field) return false
	const leafColumn = allLeafColumns.value.find(leaf => leaf.field === col.field)
	return leafColumn ? leafColumn.sortable : false
}

// ============================
// COLUMN HELPERS
// ============================
function getUngroupedColumns() {
	return columns
		.filter(c => !c.group && c.field)
		.map(col => ({ ...col, isLeaf: true, children: [] }))
}

function getFilteredUngroupedColumns() {
	return columns
		.filter(c => !c.group && c.field)
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
	// Inherit pin from group if column itself has no pin set
	const group = groups.find(g => g.name === col.group)
	const pin = col.pin || (group && group.pin) || ''
	columns.push({ ...col, pin })
})

// ============================
// WATCHERS
// ============================
watch(rowSize, () => {
	nextTick(() => scheduleRefresh())
})

watch(
	allLeafColumns,
	newColumns => {
		if (newColumns.length > 0 && sortValue.value.length === 0) {
			initializeDefaultSorting()
		}
		scheduleRefresh()
	},
	{ immediate: true }
)

watch(() => filteredData.value, () => {
	nextTick(() => scheduleRefresh())
}, { deep: true })

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
	setupInfiniteScrollObserver()
	scheduleRefresh()

	const tableEl = document.getElementById(tableId.value)
	if (tableEl) {
		useResizeObserver(tableEl, () => {
			scheduleRefresh()
		})
	}
})

onUnmounted(() => {
	infiniteScrollObserver?.disconnect()
})

// ============================
// COMPUTED HELPERS
// ============================
const checkboxAllDataCy = computed(() => {
	const prefix = props.dataCy ? `${props.dataCy}-` : ''
	return `${prefix}checkbox-all`
})

const checkboxDataCy = computed(() => {
	const prefix = props.dataCy ? `${props.dataCy}-` : ''
	return `${prefix}checkbox`
})

// ============================
// RESET
// ============================
function resetTable() {
	rowSize.value = computedRowSize.value
}

// ============================
// EXPOSE METHODS
// ============================
defineExpose({
	resetTable,
	allLeafColumns,
	// Sorting
	toggleSort,
	getSortState,
	getSortIndex,
	clearSort,
	setSortState,
	initializeDefaultSorting,
	sortValue: readonly(sortValue),
	// Pinning
	refreshPinnedOffsets,
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
	border-bottom: 1px solid;
	@apply border-neutral-20;
}
</style>
