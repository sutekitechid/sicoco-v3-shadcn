<template>
	<div class="w-full flex flex-col relative gap-4">
		<!-- Horizontal Scroll Wrapper with Indicators -->
		<DataTableScrollWrapper
      ref="dataTableScrollWrapper"
			:enable-horizontal-scroll="enableHorizontalScroll"
			:max-height="scrollY"
			:sticky-header="stickyHeaders"
      @scroll="handleScroll"
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
											:is-pinned-left="isPinnedLeft(col.field)"
											:is-pinned-right="isPinnedRight(col.field)"
											:is-pinned="isPinned(col.field)"
                      :show-hide-column="!col.hasSubheader"
											@hide-column="hideColumn(col.compositeFieldId || col.field)"
											@update:column-visibility="columnVisibility = $event"
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
					<template v-if="loading">
						<DataTableLoading :total-data="totalDataColumn" />
					</template>

					<!-- Data Rows -->
					<template v-if="data && data.length">
						<TableRow
							v-for="(row, rowIndex) in data"
							:key="`row-${rowIndex}`"
							:class="getDataRowClasses(rowIndex)"
							@click="selectRows(row)"
						>
							<!-- Selection Cell -->
							<TableCell
								v-if="selectable"
								:size="rowSize"
								class="text-center w-[3.75rem] bg-white font-medium sticky left-0 z-20"
							>
								<Checkbox
									:model-value="selectedRows[rowIndex]"
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
									<component :is="cell.cell" :row="row" />
								</TableCell>
							</template>
						</TableRow>
					</template>

          <!-- Loading State Infinite Scroll -->
          <template
            v-if="data.length > 0 && data.length !== total && infiniteScroll"
          >
            <TableCell
              v-for="i in totalDataColumn"
              :key="i"
              loading
              class="p-2"
            />
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
  provide,
  reactive,
  ref,
  watch,
  readonly,
} from 'vue'
import { useDebounceFn, useVModel } from '@vueuse/core'
import isEqual from 'lodash/isEqual'
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

// Constants and Variants
import {
  COLUMN_SIZE,
  datatableDataRowVariants,
  datatableHeaderVariants,
  datatableHeaderContentVariants,
  datatableDataCellVariants,
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
  // Selection
  selectable: {
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
// COMPOSABLES INITIALIZATION
// ============================
const persistence = useDataTablePersistence(props)
const {
  columnVisibility,
  isColumnVisible,
  toggleColumnVisibility,
  hideColumn,
  resetColumnVisibility,
  initializeColumnVisibility,
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

const selectedRows = computed(() => {
	return props.data.map(row => isRowSelected(row))
})

// return true if all selectable rows meet the selection criteria
const computedIsRowSelectable = computed(() => {
	return props.data.map(row => props.isRowSelectable(row))
})

const selectableRows = computed(() => {
	return props.data.filter(row => props.isRowSelectable(row))
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

// ============================
// COMPUTED PROPERTIES - Sorted tree that contains all columns and groups
// ============================
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
function isRowSelected(row) {
	return computedModelValue.value.findIndex(r => isEqual(r, row)) > -1
}

// TODO: Handle selection logic for groups if needed
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

	const index = computedModelValue.value.indexOf(row)
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
function onChangePage(page) {
	emit('change-page', page)
}

function onChangePerPage(perPage) {
	emit('change-per-page', perPage)
}

function getRowNumber(rowIndex) {
	if (props.paginated) {
		return (
			(computedPage.value - 1) * Number(computedPerPage.value) + rowIndex + 1
		)
	}
	return rowIndex + 1
}

// ============================
// COLUMN HELPER FUNCTIONS
// ============================
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
			if (isColumnVisible(targetColumn.compositeFieldId || targetColumn.field)) {
				adjustedColspan++
			}
		}
	}

	return adjustedColspan
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
// STYLING FUNCTIONS
// ============================
function getHeaderCellClasses(col) {
	return [
		datatableHeaderVariants({
			hasSubheader: col.hasSubheader,
			hasBorderLeft: col.hasBorderLeft,
			hasBorderRight: col.hasBorderRight,
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

function getDataRowClasses(index) {
	return [datatableDataRowVariants({ selectable: selectableRows[index] })]
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

// ============================
// PINNING UTILITY FUNCTIONS
// ============================
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
	pinnedLeft.value = []
	pinnedRight.value = []
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
				const allColumnFields = newColumns.map(col => col.compositeFieldId || col.field)
				const hiddenColumns = persistence.migrateColumnVisibilityFormat(savedVisibility, allColumnFields)
				setHiddenColumns(hiddenColumns)
			} else {
				initializeColumnVisibility(newColumns)
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

const handleScroll = useDebounceFn(() => {
  if (!props.infiniteScroll) return
  if (dataTableScrollWrapper.value) {
    handleInfiniteScroll(
      dataTableScrollWrapper.value.scrollContainer,
      loadMoreData
    )
  }
}, DEBOUNCE_DURATION)

function loadMoreData() {
  if (props.loading || !hasMoreData.value) return

  computedPage.value++
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
})
</script>
