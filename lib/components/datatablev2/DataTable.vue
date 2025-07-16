<template>
  <div class="w-full flex flex-col relative gap-4">
    <!-- Horizontal Scroll Wrapper with Indicators -->
    <DataTableScrollWrapper 
      :enable-horizontal-scroll="enableHorizontalScroll"
      :max-height="scrollY"
      :sticky-header="stickyHeaders"
    >
      <!-- Table -->
      <Table>
        <!-- Table Header -->
        <TableHeader :sticky="stickyHeaders">
          <TableRow v-for="(row, rowIndex) in headerRows" :key="`header-row-${rowIndex}`">
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
            <template v-for="(col, colIndex) in row" :key="`header-cell-${rowIndex}-${colIndex}`">
              <TableHead
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :size="rowSize"
                :data-field="col.field"
                :class="getHeaderCellClasses(col)"
                :style="getPinnedColumnStyles(col.field)"
              >
                <div :class="getHeaderContentClasses(col)">
                  <component :is="col.header" />
                  <div class="flex items-center">
                    <!-- Sort Button -->
                    <DataTableSortButton
                      v-if="shouldShowSortControls(col)"
                      :sort-state="getSortState(col.field)"
                      :sort-index="getSortIndex(col.field)"
                      :show-sort-controls="true"
                      @toggle-sort="toggleSort(col.field)"
                    />
                    <!-- Settings Dropdown -->
                    <DataTableDropdownSettings
                      v-if="shouldShowDropdownSettings(col)"
                      :column-field="col.field"
                      :column-visibility="columnVisibility"
                      :all-leaf-columns="allLeafColumns"
                      :row-size="rowSize"
                      :is-column-pinned-left="isColumnPinnedLeft(col.field)"
                      :is-column-pinned-right="isColumnPinnedRight(col.field)"
                      :is-column-pinned="isColumnPinned(col.field)"
                      :show-pin-controls="shouldShowPinControls(col)"
                      :is-group-header="isGroupHeader(col)"
                      @hide-column="hideColumn"
                      @update:column-visibility="columnVisibility = $event"
                      @update:row-size="rowSize = $event"
                      @reset-table="resetTable"
                      @pin-left="pinColumnLeft"
                      @pin-right="pinColumnRight"
                      @unpin="unpinColumn"
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
              <template v-for="(cell, cellIndex) in visibleColumns" :key="`cell-${rowIndex}-${cellIndex}`">
                <TableCell
                  :colspan="cell.bodyColspan || 1"
                  :rowspan="cell.bodyRowspan || 1"
                  :size="rowSize"
                  :class="getDataCellClasses(cell)"
                  :style="getPinnedColumnStyles(cell.field)"
                >
                  <component :is="cell.cell" :row="row" />
                </TableCell>
              </template>
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
            <template v-for="(cell, cellIndex) in visibleFooterColumns" :key="`footer-cell-${cellIndex}`">
              <TableCell
                :colspan="cell.footerColspan || 1"
                :rowspan="cell.footerRowspan || 1"
                :size="rowSize"
                :class="getFooterCellClasses(cell)"
                :style="getPinnedColumnStyles(cell.field)"
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
import { computed, onMounted, provide, reactive, ref, watch, readonly, nextTick } from 'vue'
import { useVModel } from '@vueuse/core'
import isEqual from 'lodash/isEqual'
import { cn } from '../../utils/tw-merge'

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
  datatableDataCellVariants
} from '.'

// Composables
import { 
  useDataTablePersistence,
  useColumnVisibility,
  useColumnPinning,
  useTreeOperations,
  useColumnStyling,
  useColumnSorting
} from './composables/index.js'

// ============================
// PROPS & EMITS
// ============================
const props = defineProps({ 
  data: Array,
  // Column visibility
  enableColumnVisibility: {
    type: Boolean,
    default: true
  },
  id: {
    type: String,
    default: 'datatable'
  },
  persistState: {
    type: Boolean,
    default: true
  },
  // Horizontal scroll settings
  enableHorizontalScroll: {
    type: Boolean,
    default: true
  },
  minColumnWidth: {
    type: String,
    default: '120px'
  },
  tableMinWidth: {
    type: String,
    default: 'full'
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
})

const emit = defineEmits([
  'column-visibility-change', 
  'update:page', 
  'update:perPage', 
  'update:modelValue', 
  'sort'
])

// ============================
// REACTIVE STATE
// ============================
const groups = reactive([])
const columns = reactive([])
const rowSize = ref(COLUMN_SIZE.Medium)
const columnPositions = ref(new Map())

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
  setColumnVisibility 
} = useColumnVisibility(emit)

const treeOps = useTreeOperations()
const styling = useColumnStyling()

const {
  pinnedLeft,
  pinnedRight,
  pinColumnLeft,
  pinColumnRight,
  unpinColumn,
  isColumnPinnedLeft,
  isColumnPinnedRight,
  isColumnPinned,
  initializePinnedColumns
} = useColumnPinning(isGroupHeader, getGroupColumns)

const {
  sortValue,
  toggleSort,
  getSortState,
  getSortIndex,
  clearSort,
  setSortState
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
  if (!computedModelValue.value || computedModelValue.value.length === 0) return false
  return computedModelValue.value.length < selectableRows.value.length
})

const isSelectAllDisabled = computed(() => {
  return selectableRows.value.length === 0
})

// TODO: Handle case where there are any selected rows
const isAnySelected = computed(() => {
  if (isSelectAllDisabled.value) {
    return false
  }
  return computedModelValue.value.length > 0
})

// ============================
// COMPUTED PROPERTIES - COLUMNS
// ============================
const allLeafColumns = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const ungroupedColumns = getUngroupedColumns()
  const allNodes = [...tree, ...ungroupedColumns]
  const leafColumns = treeOps.collectLeafColumns(allNodes)
  return treeOps.sortColumns(leafColumns)
})

const organizedColumns = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = getFilteredUngroupedColumns()
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const leafColumns = treeOps.collectLeafColumns(allNodes)
  
  return organizeColumnsByPinning(leafColumns)
})

const headerRows = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = getFilteredUngroupedColumns()
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const sortedNodes = treeOps.sortNodes(allNodes)
  
  if (sortedNodes.length === 0) return []
  
  const depth = Math.max(...sortedNodes.map(c => treeOps.calculateDepth(c)), 1)
  return treeOps.flattenTreeToRows(sortedNodes, depth)
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
provide('registerGroup', (group) => groups.push(group))
provide('registerColumn', (col) => {
  columns.push({
    ...col,
    enableHiding: col.enableHiding !== false
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
    const unselectedItems = props.data.filter(
      (item) => !computedModelValue.value.includes(item) && props.isRowSelectable(item)
    )
    computedModelValue.value = [...computedModelValue.value, ...unselectedItems]
  } else if (
    computedModelValue.value.length === props.data.filter(props.isRowSelectable).length
  ) {
    computedModelValue.value = []
  } else {
    computedModelValue.value = props.data.filter(props.isRowSelectable)
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
    return (computedPage.value - 1) * Number(computedPerPage.value) + rowIndex + 1
  }
  return rowIndex + 1
}

// ============================
// COLUMN HELPER FUNCTIONS
// ============================
function generateUniqueFieldId(field, group = null) {
  if (group) {
    return `${group}.${field}`
  }
  return field
}

function getUngroupedColumns() {
  return columns
    .filter(c => !c.group && c.field)
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
}

function getFilteredUngroupedColumns() {
  return columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
}

function organizeColumnsByPinning(leafColumns) {
  const leftPinned = []
  const rightPinned = []
  const unpinned = []
  
  leafColumns.forEach(col => {
    const fieldId = col.field
    if (isColumnPinnedLeft(fieldId)) {
      leftPinned.push(col)
    } else if (isColumnPinnedRight(fieldId)) {
      rightPinned.push(col)
    } else {
      unpinned.push(col)
    }
  })
  
  const sortedLeftPinned = pinnedLeft.value
    .map(fieldId => leftPinned.find(col => col.field === fieldId))
    .filter(Boolean)
  
  const sortedRightPinned = pinnedRight.value
    .map(fieldId => rightPinned.find(col => col.field === fieldId))
    .filter(Boolean)
  
  return {
    leftPinned: sortedLeftPinned,
    unpinned: treeOps.sortColumns(unpinned),
    rightPinned: sortedRightPinned,
    all: [...sortedLeftPinned, ...treeOps.sortColumns(unpinned), ...sortedRightPinned]
  }
}

function getVisibleColumnsWithColspan(type) {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = getFilteredUngroupedColumns()
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const sortedNodes = treeOps.sortNodes(allNodes)
  const leafColumns = treeOps.collectLeafColumns(sortedNodes)
  const allLeafColumnsForSpan = allLeafColumns.value
  
  const filteredColumns = []
  let skipNext = 0
  
  leafColumns.forEach((col) => {
    if (skipNext > 0) {
      skipNext--
      return
    }
    
    const originalIndex = allLeafColumnsForSpan.findIndex(originalCol => 
      originalCol.field === col.field
    )
    
    const adjustedColspan = calculateAdjustedColspan(
      type === 'footer' ? col.footerColspan : col.bodyColspan, 
      allLeafColumnsForSpan, 
      originalIndex
    )
    
    const adjustedColumn = {
      ...col,
      [type === 'footer' ? 'footerColspan' : 'bodyColspan']: adjustedColspan
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
      if (isColumnVisible(targetColumn.field)) {
        adjustedColspan++
      }
    }
  }

  return adjustedColspan
}

// ============================
// GROUP & COLUMN IDENTIFICATION
// ============================
function isGroupHeader(col) {
  if (!col.field) return false
  return groups.some(group => group.name === col.field)
}

function isColumnGrouped(originalFieldId) {
  return columns.some(column => 
    column.field === originalFieldId && column.group
  )
}

function getGroupColumns(groupName) {
  return allLeafColumns.value.filter(col => {
    const originalField = col.displayField || col.field
    const column = columns.find(c => c.field === originalField)
    return column && column.group === groupName
  })
}

function isLeafColumn(fieldId) {
  return allLeafColumns.value.some(col => col.field === fieldId)
}

// ============================
// UI CONTROL VISIBILITY FUNCTIONS
// ============================
function shouldShowDropdownSettings(col) {
  if (col.hasSubheader) return false
  return isLeafColumn(col.field) || isGroupHeader(col)
}

function shouldShowPinControls(col) {
  const leafColumn = allLeafColumns.value.find(leaf => leaf.field === col.field)
  if (leafColumn) {
    return !isColumnGrouped(leafColumn.displayField || leafColumn.field)
  }
  return isGroupHeader(col)
}

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
    getPinnedColumnClasses(col.field, 'header'),
    datatableHeaderVariants({
      hasSubheader: col.hasSubheader,
      hasBorderLeft: col.hasBorderLeft,
      hasBorderRight: col.hasBorderRight
    }),
  ]
}

function getHeaderContentClasses(col) {
  return [
    cn('flex justify-between items-center group',
      datatableHeaderContentVariants({
        hasSubheader: col.hasSubheader,
      }),
    )
  ]
}

function getDataRowClasses(index) {
  return [
    datatableDataRowVariants({ selectable: selectableRows[index] }),
  ]
}

function getDataCellClasses(cell) {
  return [
    getPinnedColumnClasses(cell.field, 'cell'),
    datatableDataCellVariants({
      hasBorderLeft: cell.hasBorderLeft,
      hasBorderRight: cell.hasBorderRight,
    }),
  ]
}

function getFooterCellClasses(cell) {
  return [
    getPinnedColumnClasses(cell.field, 'cell'),
    datatableDataCellVariants({
      hasBorderLeft: cell.hasBorderLeft,
      hasBorderRight: cell.hasBorderRight,
    }),
    'font-medium bg-muted/50'
  ]
}

function getPinnedColumnClasses(fieldId, type = 'cell') {
  return styling.getPinnedColumnClasses(fieldId, type, isColumnPinnedLeft, isColumnPinnedRight)
}

// ============================
// COLUMN POSITIONING FUNCTIONS
// ============================
function getActualColumnWidth(fieldId) {
  try {
    const headerCell = document.querySelector(`[data-field="${fieldId}"]`)
    if (headerCell) {
      const rect = headerCell.getBoundingClientRect()
      return rect.width
    }
  } catch {
    // Ignore DOM errors
  }
  return null
}

function calculateColumnPositions() {
  const positions = new Map()
  const baseOffset = getBaseOffset()
  
  // Calculate left pinned positions
  organizedColumns.value.leftPinned.forEach((col, index) => {
    let leftPosition = baseOffset
    for (let i = 0; i < index; i++) {
      const prevCol = organizedColumns.value.leftPinned[i]
      const actualWidth = getActualColumnWidth(prevCol.field)
      const specifiedWidth = styling.getColumnWidth(prevCol)
      const width = actualWidth || specifiedWidth
      leftPosition += width
    }
    positions.set(col.field, { left: `${leftPosition - 10}px` })
  })
  
  // Calculate right pinned positions
  organizedColumns.value.rightPinned.forEach((col, index) => {
    let rightPosition = 0
    for (let i = organizedColumns.value.rightPinned.length - 1; i > index; i--) {
      const nextCol = organizedColumns.value.rightPinned[i]
      const actualWidth = getActualColumnWidth(nextCol.field)
      const specifiedWidth = styling.getColumnWidth(nextCol)
      const width = actualWidth || specifiedWidth
      rightPosition += width
    }
    positions.set(col.field, { right: `${rightPosition - 10}px` })
  })
  
  columnPositions.value = positions
}

function getPinnedColumnStyles(fieldId) {
  if (!fieldId) return {}
  const cachedPosition = columnPositions.value.get(fieldId)
  if (cachedPosition) {
    return cachedPosition
  }
  return {}
}

function getBaseOffset() {
  let offset = 0
  if (props.selectable) offset += 60
  return offset
}

// ============================
// RESET FUNCTION
// ============================
function resetTable() {
  resetColumnVisibility()
  rowSize.value = COLUMN_SIZE.Medium
  pinnedLeft.value = []
  pinnedRight.value = []
}

// ============================
// WATCHERS
// ============================
watch(columnVisibility, (newVal) => persistence.saveColumnVisibility(newVal), { deep: true })
watch(rowSize, (newVal) => persistence.saveRowSize(newVal))
watch([pinnedLeft, pinnedRight], () => persistence.savePinnedColumns(pinnedLeft.value, pinnedRight.value), { deep: true })

watch(allLeafColumns, (newColumns) => {
  if (newColumns.length > 0) {
    const savedVisibility = persistence.loadColumnVisibility()
    if (savedVisibility !== null) {
      setColumnVisibility(savedVisibility)
    } else {
      initializeColumnVisibility(newColumns)
    }
  }
}, { immediate: true })

watch([organizedColumns, pinnedLeft, pinnedRight, () => props.selectable], () => {
  calculateColumnPositions()
}, { immediate: true, deep: true })

watch(() => props.data, () => {
  nextTick(() => {
    calculateColumnPositions()
  })
}, { deep: true })

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
  const savedRowSize = persistence.loadRowSize(COLUMN_SIZE.Medium)
  rowSize.value = savedRowSize
  
  const savedPinned = persistence.loadPinnedColumns()
  initializePinnedColumns(savedPinned)
  
  nextTick(() => {
    calculateColumnPositions()
  })
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
  // Pinning methods
  pinColumnLeft,
  pinColumnRight,
  unpinColumn,
  isColumnPinnedLeft,
  isColumnPinnedRight,
  isColumnPinned,
  pinnedLeft: readonly(pinnedLeft),
  pinnedRight: readonly(pinnedRight),
  // Sorting methods
  toggleSort,
  getSortState,
  getSortIndex,
  clearSort,
  setSortState,
  sortValue: readonly(sortValue)
})
</script>