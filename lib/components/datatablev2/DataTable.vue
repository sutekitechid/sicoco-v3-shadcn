<template>
	<div
		:id="id"
		class="flex flex-col"
		:data-cy="dataCy"
		:data-testid="props.dataTestid || dataCy"
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
							class="text-center min-w-[60px] max-w-[60px] sticky left-0 z-40"
						>
							<Checkbox
								:model-value="isAnySelected"
								:indeterminate="isIndeterminate"
								:value="true"
								:disabled="isSelectAllDisabled"
								:data-cy="checkboxAllDataCy"
								:data-testid="checkboxAllDataTestid"
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
							class="text-center w-[3.75rem]"
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
							:data-field="col.compositeFieldId || col.field"
							:class="[getHeaderCellClasses(col), getPinnedColumnShadowClass(col.compositeFieldId)]"
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
						:class="getDataRowClasses(rowIndex, row, filteredIsRowSelectable[rowIndex])"
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
								:data-testid="checkboxDataTestid"
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
							:class="[getDataCellClasses(col, null, null, filteredIsRowSelectable[rowIndex]), getPinnedColumnShadowClass(col.compositeFieldId)]"
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

					:sorted-leaf-columns="sortedLeafColumns"
					:selectable="selectable"
					:show-numbering="showNumbering"
					:row-size="rowSize"
					:get-pinned-column-style="getPinnedColumnStyle"
					:get-pinned-column-shadow-class="getPinnedColumnShadowClass"
					:sticky="stickyFooter"
				/>
			</Table>

			<!-- Infinite Scroll Sentinel (inside scroll container so IntersectionObserver root works) -->
			<div v-if="infiniteScroll" ref="infiniteScrollSentinel" class="h-px" />
		</div>

		<!-- Pagination -->
		<Pagination
			v-if="shouldShowPagination && totalRows"
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="effectiveTotal"
			:visible-items="filteredData"
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

import { useResizeObserver } from '@vueuse/core'

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
	resolveSpan,
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
	dataTestid: {
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

// Falls back to COLUMN_SIZE.Small when rowSize prop is not provided.
const computedRowSize = computed(() => props.rowSize || COLUMN_SIZE.Small)
const rowSize = ref(computedRowSize.value)

// Stable HTML id used for DOM queries (e.g. measuring column widths for sticky offsets).
const tableId = computed(() => `${props.id}-table`)

// Client-side pagination (auto mode): slice data only when paginated is undefined,
// infinite scroll is off, and dataset is large (>100 rows).
const isClientSidePaginated = computed(() =>
	!props.infiniteScroll &&
	props.paginated === undefined
)

// ============================
// V-MODELS
// ============================
const mPage = ref(props.page)
const computedPage = computed({
	get() {
		return mPage.value
	},
	set(value) {
		mPage.value = value
		emit('update:page', value)
	},
})

const mPerPage = ref(props.perPage)
const computedPerPage = computed({
	get() {
		return mPerPage.value
	},
	set(value) {
		mPerPage.value = value
		emit('update:perPage', value)
	},
})

// ============================
// CONSTANTS
// ============================
const MAXIMUM_PER_PAGE = 100
const normalizedData = computed(() => props.data || [])
const totalRows = computed(() => normalizedData.value.length)

// Slice props.data to the current page when client-side pagination is active.
// Returns the full array as-is for server-side or infinite-scroll modes.
const filteredData = computed(() => {
	const data = normalizedData.value
	if (!isClientSidePaginated.value || totalRows.value <= MAXIMUM_PER_PAGE) return data

	const perPage = Number(computedPerPage.value) || MAXIMUM_PER_PAGE
	const start = (computedPage.value - 1) * perPage
	return data.slice(start, start + perPage)
})

// Selectability for the currently rendered rows (page-relative index)
// Avoids off-by-page-offset when computedIsRowSelectable uses full props.data indices
const filteredIsRowSelectable = computed(() =>
	filteredData.value.map(row => props.isRowSelectable(row))
)

// Number of rows currently rendered — used for empty-state and infinite-scroll checks.
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
// Hierarchical tree built from registered DataTableGroupColumn and DataTableColumn children.
const tree = computed(() => treeOps.buildTree(groups, columns))

// Visible, sorted top-level nodes (groups + ungrouped columns) after applying
// column-visibility filtering. This drives both headerRows and sortedLeafColumns.
const sortedNodes = computed(() => {
	const filteredTree = treeOps.filterTreeByVisibility(tree.value)
	const filteredUngrouped = getFilteredUngroupedColumns()
	return treeOps.sortNodes([...filteredTree, ...filteredUngrouped])
})

// 2D array of header cell descriptors (one array per header row level).
// Multi-level when grouped columns are present; single-row otherwise.
const headerRows = computed(() => {
	if (sortedNodes.value.length === 0) return []
	const depth = Math.max(...sortedNodes.value.map(c => treeOps.calculateDepth(c)), 1)
	return treeOps.flattenTreeToRows(sortedNodes.value, depth)
})

// Ordered leaf columns from the visible tree — cached once per sort/visibility change.
// Shared by getRowColumns and DataTableFooter to avoid O(rows × cols) rebuilds per render.
const sortedLeafColumns = computed(() => treeOps.collectLeafColumns(sortedNodes.value))

const {
	sortValue,
	toggleSort,
	getSortState,
	getSortIndex,
	clearSort,
	setSortState,
	initializeDefaultSorting,
} = useColumnSorting(props, emit, sortedLeafColumns)

// ============================
// PINNING
// ============================
// Reactive wrappers passed to useDataTablePinning so it can read the latest
// prop values without creating a direct prop reference inside the composable.
const hasSelectable = computed(() => props.selectable)
const hasNumbering = computed(() => props.showNumbering)

const {
	getPinnedColumnStyle,
	getPinnedColumnShadowClass,
	refreshPinnedOffsets,
	scheduleRefresh,
} = useDataTablePinning(sortedLeafColumns, {
	hasSelectable,
	hasNumbering,
	tableId,
	headerRows,
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
} = useDataTableStyle(props)

watch(() => filteredData.value, clearRowClassCaches, { deep: true })

// ============================
// PAGINATION
// ============================
// Determines whether the <Pagination> bar is rendered.
// - Infinite scroll: never (pagination is replaced by scroll-triggered loading)
// - Auto mode (paginated === undefined): only when data exceeds MAXIMUM_PER_PAGE
// - Explicit server mode (paginated === true): always
const shouldShowPagination = computed(() => {
	if (props.infiniteScroll) return false
	if (props.paginated === true) return true
	if (props.paginated === false) return false
	return totalRows.value > MAXIMUM_PER_PAGE
})

watch(
	shouldShowPagination,
	(newVal) => {
		if (newVal && isClientSidePaginated.value) {
			computedPerPage.value = MAXIMUM_PER_PAGE
		}
	},
	{ immediate: true }
)

// Total row count passed to <Pagination>.
// Client-side: derived from full data array length.
// Server-side: taken from the `total` prop supplied by the parent.
const effectiveTotal = computed(() => {
	if (isClientSidePaginated.value) return totalRows.value
	return props.total
})

// Returns the 1-based display row number accounting for the current page offset.
// Infinite scroll: filteredData contains all accumulated rows so rowIndex is already absolute.
// Paginated: offset by (page - 1) * perPage to get the correct global row number.
function getRowNumber(rowIndex) {
	if (props.infiniteScroll) return rowIndex + 1
	return (computedPage.value - 1) * Number(computedPerPage.value) + rowIndex + 1
}

// ============================
// BODY ROW COLUMN HELPERS
// ============================
// Builds the ordered list of <td> cells for a single data row.
// Evaluates per-row bodyColspan/bodyRowspan functions and skips columns
// that are merged into a preceding cell's colspan.
function getRowColumns(row, rowIndex) {
	const leafColumns = sortedLeafColumns.value
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
// TOTALS
// ============================
// Total number of visible <td>/<th> columns including the selection and numbering columns.
// Used as the colspan for empty/loading state rows that span the full table width.
const totalDataColumn = computed(() => {
	let result = sortedLeafColumns.value.length
	if (props.selectable) result++
	if (props.showNumbering) result++
	return result
})

// CSS max-height value for the scroll container; undefined disables the constraint.
const computedScrollY = computed(() => {
	if (!props.scrollY) return undefined
	return props.scrollY
})

// ============================
// ROW INTERACTION
// ============================
// Toggles row selection when the user clicks anywhere on a selectable row.
// No-op for non-selectable rows or when selectable prop is false.
function handleRowClick(row, rowIndex) {
	if (!props.selectable) return
	if (!filteredIsRowSelectable.value[rowIndex]) return
	onSelectRow(!isRowSelected(row), row)
}

// ============================
// SORT CONTROLS
// ============================
// Returns true only for leaf columns that explicitly set sortable=true.
// Group header cells (no field) never show sort controls.
function shouldShowSortControls(col) {
	if (!col.field) return false
	const leafColumn = sortedLeafColumns.value.find(leaf => leaf.field === col.field)
	return leafColumn ? leafColumn.sortable : false
}

// ============================
// COLUMN HELPERS
// ============================

// Sets compositeFieldId and registrationOrder,
// matching the shape produced by buildTree for grouped columns.
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
	sortedLeafColumns,
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
// INFINITE SCROLL
// ============================
// Attaches an IntersectionObserver to the sentinel element at the bottom of the scroll container.
// When the sentinel becomes visible, loadMoreData() is called to append the next page.
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

// Advances to the next page to trigger the parent to load more rows.
// Called by setupInfiniteScrollObserver when the scroll sentinel enters the viewport.
function loadMoreData() {
	if (props.loading) return
	computedPage.value++
}

// ============================
// COMPUTED HELPERS
// ============================
// data-cy attribute for the select-all checkbox, scoped by the dataCy prop.
const checkboxAllDataCy = computed(() => {
	const prefix = props.dataCy ? `${props.dataCy}-` : ''
	return `${prefix}checkbox-all`
})

// data-testid attribute for the select-all checkbox, scoped by dataTestid (or dataCy fallback).
const checkboxAllDataTestid = computed(() => {
	const base = props.dataTestid || props.dataCy
	const prefix = base ? `${base}-` : ''
	return `${prefix}checkbox-all`
})

// data-cy attribute for individual row checkboxes, scoped by the dataCy prop.
const checkboxDataCy = computed(() => {
	const prefix = props.dataCy ? `${props.dataCy}-` : ''
	return `${prefix}checkbox`
})

// data-testid attribute for individual row checkboxes, scoped by dataTestid (or dataCy fallback).
const checkboxDataTestid = computed(() => {
	const base = props.dataTestid || props.dataCy
	const prefix = base ? `${base}-` : ''
	return `${prefix}checkbox`
})

// ============================
// EXPOSE METHODS
// ============================
defineExpose({
	sortedLeafColumns,
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
}
tbody td {
	@apply !border-neutral-400;
}

:global(.datatable-pinned-shadow-right) {
	box-shadow: 4px 0 8px -2px rgba(var(--color-neutral-950) / 0.1) !important;
}

:global(.datatable-pinned-shadow-left) {
	box-shadow: -4px 0 8px -2px rgba(var(--color-neutral-950) / 0.1) !important;
}
</style>
