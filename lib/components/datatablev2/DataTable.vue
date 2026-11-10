<template>
	<div
		:id="id"
		class="flex flex-col"
		:data-cy="dataCy"
		:data-testid="props.dataTestid || dataCy"
	>
		<div
			ref="scrollContainer"
			class="overflow-auto"
			:style="{ maxHeight: computedScrollY }"
		>
			<Table :id="tableId">
				<!-- Header -->
				<TableHeader :class="[getHeaderSectionClasses(), 'text-body-sm']">
					<TableRow
						v-for="(row, rowIndex) in headerRows"
						:key="`header-row-${rowIndex}`"
					>
						<!-- Drag Handle Header Column -->
						<TableHead
							v-if="draggable && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							data-col="__draggable__"
							class="w-12"
							:style="{ ...getPinnedColumnStyle('__draggable__'), zIndex: 40 }"
						/>

						<!-- Selection Header Column -->
						<TableHead
							v-if="selectable && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							data-col="__selection__"
							class="text-center w-12 min-w-12 max-w-12 z-40"
							:style="{ ...getPinnedColumnStyle('__selection__'), zIndex: 40 }"
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

						<!-- Detail Toggle Header Column -->
						<TableHead
							v-if="hasDetailColumn && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							data-col="__detail__"
							class="text-center w-12 min-w-12 max-w-12"
							:style="{ ...getPinnedColumnStyle('__detail__'), zIndex: 40 }"
						/>

						<!-- Numbering Header Column -->
						<TableHead
							v-if="showNumbering && rowIndex === 0"
							:rowspan="headerRows.length || 1"
							:size="rowSize"
							data-col="__numbering__"
							class="text-center w-15"
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
							:width="col.width"
							:data-field="col.compositeFieldId || col.field"
							:class="[
								getHeaderCellClasses(col),
								getPinnedColumnShadowClass(col.compositeFieldId),
							]"
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
				<DataTableLoading
					v-if="loading && (!infiniteScroll || dataLength === 0)"
					:total-data="totalDataColumn"
				/>

				<!-- Empty State -->
				<TableBody v-else-if="dataLength === 0">
					<TableRow>
						<TableCell :colspan="totalDataColumn">
							<slot name="empty" />
						</TableCell>
					</TableRow>
				</TableBody>

				<!-- Data Rows (always visible when has data, even during infinite-scroll load-more) -->
				<TableBody
					v-if="!loading || (infiniteScroll && dataLength > 0)"
					ref="dragContainer"
				>
					<template
						v-for="rowEntry in visibleRows"
						:key="rowEntry.domKey"
					>
						<Transition name="datatable-row">
							<TableRow
								v-if="rowEntry.visible"
								:class="[
									getDataRowClasses(
										rowEntry.rootIndex,
										rowEntry.row,
										isRowSelectable(rowEntry.row),
									),
									treeEnabled && rowEntry.hasChildren ? 'cursor-pointer' : '',
								]"
								:data-depth="rowEntry.depth"
								:data-datatable-draggable="
									rowEntry.depth === 0 &&
									isRowDraggable(rowEntry.row, rowEntry.rootIndex)
								"
								@click="handleRowClick(rowEntry)"
							>
								<TableCell
									v-if="draggable"
									:size="rowSize"
									:class="[
										'text-center',
										getPinnedCellBgClass(isRowSelectable(rowEntry.row)),
									]"
									:style="getPinnedColumnStyle('__draggable__')"
								>
									<SButton
										v-if="rowEntry.depth === 0"
										type="button"
										size="sm"
										variant="tertiary-neutral"
										:disabled="!canDragRow(rowEntry.row, rowEntry.rootIndex)"
										aria-label="Geser baris"
										data-datatable-drag-handle
										:class="
											canDragRow(rowEntry.row, rowEntry.rootIndex)
												? 'cursor-grab active:cursor-grabbing'
												: 'cursor-not-allowed opacity-50'
										"
										@click.stop
									>
										<i class="si-heroicon-outline-grip-vertical" />
									</SButton>
								</TableCell>
								<TableCell
									v-if="selectable"
									:size="rowSize"
									:class="[
										'z-20 text-center w-12 min-w-12 max-w-12',
										getPinnedCellBgClass(isRowSelectable(rowEntry.row)),
									]"
									:style="getPinnedColumnStyle('__selection__')"
								>
									<Checkbox
										:model-value="getRowSelectionState(rowEntry.row).selected"
										:indeterminate="
											getRowSelectionState(rowEntry.row).indeterminate
										"
										:value="true"
										:disabled="isRowSelectionDisabled(rowEntry.row)"
										:data-cy="checkboxDataCy"
										:data-testid="checkboxDataTestid"
										class="mx-auto"
										@click.stop
										@update:model-value="val => onSelectRow(val, rowEntry.row)"
									/>
								</TableCell>
								<!-- Detail Toggle Column -->
								<TableCell
									v-if="hasDetailColumn"
									:size="rowSize"
									data-col="__detail__"
									:class="[
										'z-20 text-center w-12 min-w-12 max-w-12',
										getPinnedCellBgClass(isRowSelectable(rowEntry.row)),
									]"
									:style="getPinnedColumnStyle('__detail__')"
								>
									<SButton
										class="mx-auto"
										type="button"
										size="sm"
										variant="tertiary-primary"
										:aria-label="
											isRowDetailOpen(rowEntry)
												? 'Tutup detail tambahan baris'
												: 'Buka detail tambahan baris'
										"
										:aria-expanded="isRowDetailOpen(rowEntry)"
										@click.stop="toggleDetail(rowEntry.row, rowEntry.path)"
									>
										<template #icon-left>
											<i
												class="si-heroicon-solid-chevron-down transition-transform duration-200 text-main"
												:class="
													isRowDetailOpen(rowEntry) ? 'rotate-180' : 'rotate-0'
												"
											/>
										</template>
									</SButton>
								</TableCell>
								<TableCell
									v-if="showNumbering"
									:size="rowSize"
									:class="[
										'text-center',
										datatableDataCellVariants({ verticalAlign }),
										getPinnedCellBgClass(isRowSelectable(rowEntry.row)),
									]"
									:style="getPinnedColumnStyle('__numbering__')"
								>
									{{
										rowEntry.depth === 0 ? getRowNumber(rowEntry.rootIndex) : ''
									}}
								</TableCell>
								<TableCell
									v-for="(col, colIndex) in getRowColumns(
										rowEntry.row,
										rowEntry.rootIndex,
									)"
									:key="col.compositeFieldId"
									:colspan="col.bodyColspan"
									:rowspan="col.bodyRowspan"
									:size="rowSize"
									:width="col.width"
									:class="[
										getDataCellClasses(
											col,
											null,
											null,
											isRowSelectable(rowEntry.row),
										),
										getPinnedColumnShadowClass(col.compositeFieldId),
									]"
									:style="getPinnedColumnStyle(col.compositeFieldId)"
								>
									<div
											v-if="treeEnabled && colIndex === 0"
										:class="
											datatableDataCellDetailVariants({
												hasChildren: rowEntry.hasChildren,
											})
										"
										:style="getTreeIndentStyle(rowEntry.depth)"
									>
										<SButton
											v-if="showTreeIcon && rowEntry.hasChildren"
											type="button"
											size="sm"
											variant="tertiary-primary"
											:aria-label="
												isTreeOpen(rowEntry)
												? 'Tutup baris anak'
												: 'Buka baris anak'
											"
											:aria-expanded="isTreeOpen(rowEntry)"
											class="-ml-2 mr-1"
											@click.stop="toggleTree(rowEntry.row, rowEntry.path)"
										>
											<template #icon-left>
												<i
													class="si-heroicon-solid-chevron-down transition-transform duration-200 text-main"
													:class="
														isTreeOpen(rowEntry) ? 'rotate-180' : 'rotate-0'
													"
												/>
											</template>
										</SButton>
										<component
											:is="col.cell"
											:row="rowEntry.row"
											:index="rowEntry.rootIndex"
											:depth="rowEntry.depth"
											:parent="rowEntry.parent"
											:expanded="isTreeOpen(rowEntry)"
											:has-children="rowEntry.hasChildren"
											:toggle-tree="
												() => toggleTree(rowEntry.row, rowEntry.path)
											"
										/>
									</div>
									<component
										:is="col.cell"
										v-else
										:row="rowEntry.row"
										:index="rowEntry.rootIndex"
										:depth="rowEntry.depth"
										:parent="rowEntry.parent"
										:expanded="isTreeOpen(rowEntry)"
										:has-children="rowEntry.hasChildren"
										:toggle-tree="
												() => toggleTree(rowEntry.row, rowEntry.path)
										"
									/>
								</TableCell>
							</TableRow>
						</Transition>
						<Transition name="datatable-detail">
							<TableRow
								v-if="rowEntry.visible && isRowDetailOpen(rowEntry)"
								:key="`${rowEntry.domKey}-detail`"
								:data-datatable-detail="rowEntry.domKey"
								:class="detailClass"
							>
								<TableCell
									v-if="totalDataColumn > sortedLeafColumns.length"
									:colspan="totalDataColumn - sortedLeafColumns.length"
									:size="rowSize"
									:hover="false"
									:class="detailRowCellClass"
								/>
								<TableCell
									:data-datatable-detail-content="rowEntry.domKey"
									:colspan="sortedLeafColumns.length"
									:size="rowSize"
									:hover="false"
									:class="[detailRowCellClass, 'p-0']"
								>
									<div class="px-2 py-6">
										<slot
											name="detail"
											:row="rowEntry.row"
											:index="rowEntry.rootIndex"
											:depth="rowEntry.depth"
											:parent="rowEntry.parent"
											:expanded="true"
											:toggle-detail="
												() => toggleDetail(rowEntry.row, rowEntry.path)
											"
										/>
									</div>
								</TableCell>
							</TableRow>
						</Transition>
					</template>
				</TableBody>

				<!-- Infinite Scroll Loading Skeleton (appended after data rows) -->
				<DataTableLoading
					v-if="loading && infiniteScroll && dataLength > 0"
					:total-data="totalDataColumn"
				/>

				<!-- Footer (inside same Table) -->
				<DataTableFooter
					v-if="showFooter && !loading && dataLength > 0"
					:data="filteredData"
					:sorted-leaf-columns="sortedLeafColumns"
					:draggable="draggable"
					:selectable="selectable"
					:has-detail="hasDetailColumn"
					:show-numbering="showNumbering"
					:row-size="rowSize"
					:get-pinned-column-style="getPinnedColumnStyle"
					:get-pinned-column-shadow-class="getPinnedColumnShadowClass"
					:sticky="stickyFooter"
				/>
			</Table>

			<!-- Infinite Scroll Sentinel (inside scroll container so IntersectionObserver root works) -->
			<div
				v-if="infiniteScroll"
				ref="infiniteScrollSentinel"
				class="h-px"
			/>
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
	useSlots,
} from 'vue'

import { useResizeObserver } from '@vueuse/core'
import { useDraggable } from 'vue-draggable-plus'

import {
	datatableDataCellDetailVariants,
	datatableDataCellVariants,
} from './index.js'

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
import { Button as SButton } from '../button'

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
	verticalAlign: {
		type: String,
		default: undefined,
		validator: value => ['top', 'middle', 'bottom'].includes(value),
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
	draggable: {
		type: Boolean,
		default: false,
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
	isRowDraggable: {
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
	treeEnabled: {
		type: Boolean,
		default: false,
	},
	openedTree: {
		type: Array,
		default: () => [],
	},
	openedDetails: {
		type: Array,
	},
	detailKey: {
		type: String,
		default: '',
	},
	childrenKey: {
		type: String,
		default: 'children',
	},
	showTreeIcon: {
		type: Boolean,
		default: true,
	},
	detailClass: {
		type: [String, Array, Object],
		default: 'bg-neutral-100',
	},
})

const emit = defineEmits([
	'update:page',
	'update:perPage',
	'update:modelValue',
	'update:data',
	'update:openedTree',
	'update:openedDetails',
	'sort',
	'tree-open',
	'tree-close',
	'detail-open',
	'detail-close',
])

// ============================
// REACTIVE STATE
// ============================
const scrollContainer = ref(null)
const infiniteScrollSentinel = ref(null)
const dragContainer = ref(null)
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
const isClientSidePaginated = computed(
	() => !props.infiniteScroll && props.paginated === undefined,
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

watch(
	() => props.page,
	value => {
		mPage.value = value
	},
)

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

watch(
	() => props.perPage,
	value => {
		mPerPage.value = value
	},
)

// ============================
// CONSTANTS
// ============================
const MAXIMUM_PER_PAGE = 100
const normalizedData = computed(() => props.data || [])
const totalRows = computed(() => normalizedData.value.length)
const slots = useSlots()
const openedDetailsState = ref([])
const hasDetailColumn = computed(() => Boolean(slots.detail))
const detailRowCellClass = computed(() => [props.detailClass, '!p-0'])
const resolvedOpenedDetails = computed(
	() => props.openedDetails ?? openedDetailsState.value,
)

// Slice props.data to the current page when client-side pagination is active.
// Returns the full array as-is for server-side or infinite-scroll modes.
const filteredData = computed(() => {
	const data = normalizedData.value
	if (!isClientSidePaginated.value || totalRows.value <= MAXIMUM_PER_PAGE)
		return data

	const perPage = Number(computedPerPage.value) || MAXIMUM_PER_PAGE
	const start = (computedPage.value - 1) * perPage
	return data.slice(start, start + perPage)
})

// Number of rows currently rendered — used for empty-state and infinite-scroll checks.
const dataLength = computed(() => filteredData.value.length)
const canDragRows = computed(
	() =>
		props.draggable &&
		filteredData.value.filter((row, index) => isRowDraggable(row, index))
			.length > 1,
)

// Expands child rows from the configured childrenKey. The model stores stable
// detail keys while domKey also includes its tree path to keep nested nodes unique.
const visibleRows = computed(() => {
	const result = []
	function appendRows(
		rows,
		depth = 0,
		parent = null,
		pathPrefix = '',
		rootIndex = 0,
	) {
		if (!Array.isArray(rows)) return
		rows.forEach((row, index) => {
			const path = pathPrefix ? `${pathPrefix}.${index}` : `${index}`
			const children = getRowChildren(row)
			const entry = {
				row,
				depth,
				parent: parent?.row || null,
				path,
				rootIndex: depth === 0 ? index : rootIndex,
				hasChildren: children.length > 0,
				domKey: `${getDetailKey(row, path)}-${path}`,
				visible:
					parent === null ||
					(parent.visible && props.treeEnabled && isTreeOpen(parent)),
			}
			result.push(entry)
			appendRows(children, depth + 1, entry, path, entry.rootIndex)
		})
	}
	appendRows(filteredData.value)
	return result
})

// ============================
// COMPOSABLES
// ============================
const treeOps = useTreeOperations()

const {
	isIndeterminate,
	isSelectAllDisabled,
	isAnySelected,
	selectAll,
	onSelectRow,
	getRowSelectionState,
	isRowSelectionDisabled,
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
	const depth = Math.max(
		...sortedNodes.value.map(c => treeOps.calculateDepth(c)),
		1,
	)
	return treeOps.flattenTreeToRows(sortedNodes.value, depth)
})

// Ordered leaf columns from the visible tree — cached once per sort/visibility change.
// Shared by getRowColumns and DataTableFooter to avoid O(rows × cols) rebuilds per render.
const sortedLeafColumns = computed(() =>
	treeOps.collectLeafColumns(sortedNodes.value),
)

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
const hasDraggable = computed(() => props.draggable)
const hasNumbering = computed(() => props.showNumbering)
const hasDetail = computed(() => hasDetailColumn.value)

const {
	getPinnedColumnStyle,
	getPinnedColumnShadowClass,
	refreshPinnedOffsets,
	scheduleRefresh,
} = useDataTablePinning(sortedLeafColumns, {
	hasSelectable,
	hasDraggable,
	hasNumbering,
	hasDetail,
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
	newVal => {
		if (newVal && isClientSidePaginated.value) {
			computedPerPage.value = MAXIMUM_PER_PAGE
		}
	},
	{ immediate: true },
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
// DETAILED ROWS
// ============================
function getRowChildren(row) {
	const children = row?.[props.childrenKey]
	return Array.isArray(children) ? children : []
}

function getDetailKey(row, path = '') {
	const keyField = props.detailKey || props.rowKey
	const key = keyField && row?.[keyField]
	return key === undefined || key === null ? path : key
}

function isTreeOpen(rowEntry) {
	return props.openedTree.includes(
		getDetailKey(rowEntry.row, rowEntry.path),
	)
}

function toggleTree(row, path = '') {
	const key = getDetailKey(row, path)
	const isOpen = props.openedTree.includes(key)
	const openedTree = isOpen
		? props.openedTree.filter(openedKey => openedKey !== key)
		: [...props.openedTree, key]

	emit('update:openedTree', openedTree)
	emit(isOpen ? 'tree-close' : 'tree-open', row)
}

function openTree(row, path = '') {
	const key = getDetailKey(row, path)
	if (props.openedTree.includes(key)) return
	emit('update:openedTree', [...props.openedTree, key])
	emit('tree-open', row)
}

function closeTree(row, path = '') {
	const key = getDetailKey(row, path)
	if (!props.openedTree.includes(key)) return
	emit(
		'update:openedTree',
		props.openedTree.filter(openedKey => openedKey !== key),
	)
	emit('tree-close', row)
}

function isRowDetailOpen(rowEntry) {
	return resolvedOpenedDetails.value.includes(
		getDetailKey(rowEntry.row, rowEntry.path),
	)
}

function toggleDetail(row, path = '') {
	const key = getDetailKey(row, path)
	const isOpen = resolvedOpenedDetails.value.includes(key)
	const openedDetails = isOpen
		? resolvedOpenedDetails.value.filter(openedKey => openedKey !== key)
		: [...resolvedOpenedDetails.value, key]

	updateOpenedDetails(openedDetails)
	emit(isOpen ? 'detail-close' : 'detail-open', row)
}

function openDetail(row, path = '') {
	const key = getDetailKey(row, path)
	if (resolvedOpenedDetails.value.includes(key)) return
	updateOpenedDetails([...resolvedOpenedDetails.value, key])
	emit('detail-open', row)
}

function closeDetail(row, path = '') {
	const key = getDetailKey(row, path)
	if (!resolvedOpenedDetails.value.includes(key)) return
	updateOpenedDetails(
		resolvedOpenedDetails.value.filter(openedKey => openedKey !== key),
	)
	emit('detail-close', row)
}

function updateOpenedDetails(openedDetails) {
	if (props.openedDetails === undefined) {
		openedDetailsState.value = openedDetails
	}
	emit('update:openedDetails', openedDetails)
}

function getTreeIndentStyle(depth) {
	if (!props.treeEnabled || depth === 0) return {}
	return { marginLeft: `calc(${depth * 2} * 1rem)` }
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
// Total number of visible <td>/<th> columns including system columns.
// Used as the colspan for empty/loading state rows that span the full table width.
const totalDataColumn = computed(() => {
	let result = sortedLeafColumns.value.length
	if (props.draggable) result++
	if (props.selectable) result++
	if (hasDetailColumn.value) result++
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
function handleRowClick(rowEntry) {
	if (props.treeEnabled && rowEntry.hasChildren) {
		toggleTree(rowEntry.row, rowEntry.path)
	}

	if (!props.selectable) return
	if (isRowSelectionDisabled(rowEntry.row)) return
	onSelectRow(!getRowSelectionState(rowEntry.row).selected, rowEntry.row)
}

function reorderRows(oldIndex, newIndex) {
	if (
		!canDragRows.value ||
		oldIndex === newIndex ||
		oldIndex < 0 ||
		newIndex < 0
	)
		return
	const lockedRows = new Set(
		normalizedData.value.filter((row, index) => !isRowDraggable(row, index)),
	)
	const visibleMovableRows = filteredData.value.filter((row, index) =>
		isRowDraggable(row, index),
	)
	const draggedRow = visibleMovableRows[oldIndex]
	const targetRow = visibleMovableRows[newIndex]
	if (!draggedRow || !targetRow) return

	const movableRows = normalizedData.value.filter(row => !lockedRows.has(row))
	const sourceIndex = movableRows.indexOf(draggedRow)
	const targetIndex = movableRows.indexOf(targetRow)
	if (sourceIndex < 0 || targetIndex < 0) return

	movableRows.splice(sourceIndex, 1)
	movableRows.splice(targetIndex, 0, draggedRow)
	let movableIndex = 0
	const dataWithLockedPositions = normalizedData.value.map(row => {
		if (lockedRows.has(row)) return row
		return movableRows[movableIndex++]
	})

	emit('update:data', dataWithLockedPositions)
}

function isRowDraggable(row, index) {
	return props.isRowDraggable(row, index)
}

function canDragRow(row, index) {
	return canDragRows.value && isRowDraggable(row, index)
}

const rowDraggable = useDraggable(null, {
	immediate: false,
	handle: '[data-datatable-drag-handle]',
	draggable: 'tr[data-datatable-draggable="true"]',
	animation: 150,
	onUpdate(event) {
		const oldIndex = event.oldDraggableIndex ?? event.oldIndex ?? -1
		const newIndex = event.newDraggableIndex ?? event.newIndex ?? -1
		reorderRows(oldIndex, newIndex)
	},
})

function setupRowDraggable() {
	rowDraggable.destroy()
	if (!canDragRows.value) return
	nextTick(() => {
		const element = dragContainer.value?.$el
		if (!element) return
		rowDraggable.start(element)
	})
}

// ============================
// SORT CONTROLS
// ============================
// Returns true only for leaf columns that explicitly set sortable=true.
// Group header cells (no field) never show sort controls.
function shouldShowSortControls(col) {
	if (!col.field) return false
	const leafColumn = sortedLeafColumns.value.find(
		leaf => leaf.field === col.field,
	)
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
	{ immediate: true },
)

watch(
	() => filteredData.value,
	() => {
		nextTick(() => scheduleRefresh())
	},
	{ deep: true },
)

watch(
	() => [props.draggable, props.loading, filteredData.value.length],
	() => {
		setupRowDraggable()
	},
)

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
	setupInfiniteScrollObserver()
	scheduleRefresh()
	setupRowDraggable()

	const tableEl = document.getElementById(tableId.value)
	if (tableEl) {
		useResizeObserver(tableEl, () => {
			scheduleRefresh()
		})
	}
})

onUnmounted(() => {
	infiniteScrollObserver?.disconnect()
	rowDraggable.destroy()
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
			entries => {
				if (entries[0].isIntersecting && !props.loading) {
					loadMoreData()
				}
			},
			{
				root: scrollContainer.value || null,
				threshold: 0,
			},
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
	// Detailed rows
	toggleTree,
	openTree,
	closeTree,
	// Detail slots
	toggleDetail,
	openDetail,
	closeDetail,
	checkboxAllDataCy,
	checkboxDataCy,
})
</script>

<style scoped>
@reference "../../config/tailwind.css";

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

.datatable-detail-enter-active,
.datatable-detail-leave-active,
.datatable-row-enter-active,
.datatable-row-leave-active {
	transition:
		opacity 200ms ease,
		transform 200ms ease;
}

.datatable-detail-enter-from,
.datatable-detail-leave-to,
.datatable-row-enter-from,
.datatable-row-leave-to {
	opacity: 0;
	transform: translateY(-0.25rem) scaleY(0.98);
}

@media (prefers-reduced-motion: reduce) {
	.datatable-detail-enter-active,
	.datatable-detail-leave-active,
	.datatable-row-enter-active,
	.datatable-row-leave-active {
		transition: none;
	}
}
</style>
