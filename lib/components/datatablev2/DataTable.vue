<template>
  <div class="w-full flex flex-col relative gap-4">
    <!-- Horizontal Scroll Wrapper with Indicators -->
    <DataTableScrollWrapper :enable-horizontal-scroll="enableHorizontalScroll">
      <!-- Table -->
      <Table>
        <TableHeader>
          <TableRow v-for="(row, rowIndex) in headerRows" :key="'header-row-' + rowIndex">
            <!-- Numbering Header Column - hanya muncul di baris pertama dengan rowspan penuh -->
            <TableHead 
              v-if="selectable && rowIndex === 0"
              :rowspan="headerRows.length || 1"
              :size="rowSize"
              class="text-center min-w-[60px] max-w-[60px] bg-white sticky left-0 z-30"
            >
              <Checkbox
                v-if="selectable"
                :model-value="computedModelValue && computedModelValue.length > 0"
                :value="true"
                :indeterminate="isIndeterminate"
                class="mx-auto"
                @click="selectAll"
              />
            </TableHead>
            <TableHead 
              v-if="showNumbering && rowIndex === 0"
              :rowspan="headerRows.length || 1"
              :size="rowSize"
              class="text-center w-[3.75rem]"
            >
              No.
            </TableHead>
            <template v-for="(col, colIndex) in row" :key="'header-cell-' + rowIndex + '-' + colIndex">
              <TableHead
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :size="rowSize"
                :data-field="col.field"
                :class="[
                  getPinnedColumnClasses(col.field, 'header'),
                  datatableHeaderVariants({
                    hasSubheader: col.hasSubheader,
                    hasBorderLeft: col.hasBorderLeft,
                    hasBorderRight: col.hasBorderRight
                  }),
                ]"
                :style="getPinnedColumnStyles(col.field)"
              >
                <div :class="[
                  cn('flex justify-between items-center group',
                    datatableHeaderContentVariants({
                      hasSubheader: col.hasSubheader,
                    }),
                  )]
                ">
                  <component :is="col.header" />
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
              </TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, rowIndex) in data"
            :key="'row-' + rowIndex"
            :class="[
              datatableDataRowVariants({ selectable: props.selectable }),
            ]"
            @click="selectRows(row)"
          >
            <TableCell 
              v-if="selectable"
              :size="rowSize"
              class="text-center w-[3.75rem] bg-white font-medium sticky left-0 z-20"
            >
              <Checkbox
                v-if="selectable"
                :model-value="selectedRows[rowIndex]"
                :value="true"
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
            <template v-for="(cell, cellIndex) in visibleColumns" :key="'cell-' + rowIndex + '-' + cellIndex">
              <TableCell
                :colspan="cell.bodyColspan || 1"
                :rowspan="cell.bodyRowspan || 1"
                :size="rowSize"
                :class="[
                  getPinnedColumnClasses(cell.field, 'cell'),
                  datatableDataCellVariants({
                    hasBorderLeft: cell.hasBorderLeft,
                    hasBorderRight: cell.hasBorderRight,
                  }),
                ]"
                :style="getPinnedColumnStyles(cell.field)"
              >
                <component :is="cell.cell" :row="row" />
              </TableCell>
            </template>
          </TableRow>
        </TableBody>
        <!-- Table Footer -->
        <TableFooter v-if="showFooter">
          <TableRow>
            <!-- Footer Selectable Cell -->
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
            <template v-for="(cell, cellIndex) in visibleFooterColumns" :key="'footer-cell-' + cellIndex">
              <TableCell
                :colspan="cell.footerColspan || 1"
                :rowspan="cell.footerRowspan || 1"
                :size="rowSize"
                :class="[
                  getPinnedColumnClasses(cell.field, 'cell'),
                  datatableDataCellVariants({
                    hasBorderLeft: cell.hasBorderLeft,
                    hasBorderRight: cell.hasBorderRight,
                  }),
                  'font-medium bg-muted/50'
                ]"
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
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'
import {
  COLUMN_SIZE,
  datatableDataRowVariants,
  datatableHeaderVariants,
  datatableHeaderContentVariants,
  datatableDataCellVariants
} from '.'

import { Pagination } from '../../components/pagination'

// Composables
import { 
  useDataTablePersistence,
  useColumnVisibility,
  useColumnPinning,
  useTreeOperations,
  useColumnStyling
} from './composables/index.js'

const props = defineProps({ 
  data: Array,
  // Fitur column visibility
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
  showNumbering: {
    type: Boolean,
    default: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  // Footer props
  showFooter: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['column-visibility-change', 'update:page', 'update:perPage', 'update:modelValue'])

// ============================
// VMODEL FOR PAGINATION
// ============================
const computedPage = useVModel(props, 'page', emit)
const computedPerPage = useVModel(props, 'perPage', emit)

function onChangePage(page) {
  emit('change-page', page)
}

function onChangePerPage(perPage) {
  emit('change-per-page', perPage)
}

// ============================
// SELECTABLE PROPERTIES
// ============================
const computedModelValue = useVModel(props, 'modelValue', emit)

const isIndeterminate = computed(() => {
  if (!computedModelValue.value || computedModelValue.value.length === 0) return false
  return computedModelValue.value.length < props.data.length
})

const selectAll = () => {
  if (isIndeterminate.value) {
    // add unselected items to modelValue
    const unselectedItems = props.data.filter(item => !computedModelValue.value.includes(item))
    computedModelValue.value = [...computedModelValue.value, ...unselectedItems]
  } else if (computedModelValue.value.length === props.data.length) {
    // clear selection
    computedModelValue.value = []
  } else {
    computedModelValue.value = props.data
  }
}

const selectRows = (row) => {
  if (!props.selectable) return
  
  const index = computedModelValue.value.indexOf(row)
  if (index > -1) {
    // Deselect row
    const newSelection = [...computedModelValue.value]
    newSelection.splice(index, 1)
    computedModelValue.value = newSelection
  } else {
    // Select row
    computedModelValue.value.push(row)
  }
}

const selectedRows = computed(() => {
  return props.data.map(row => isRowSelected(row))
})

function isRowSelected(row) {
  return computedModelValue.value.findIndex(r => isEqual(r, row)) > -1
}

// ============================
// CORE STATE
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
  setColumnVisibility 
} = useColumnVisibility(emit)

const treeOps = useTreeOperations()
const styling = useColumnStyling()

// ============================
// HELPER FUNCTIONS
// ============================
const generateUniqueFieldId = (field, group = null) => {
  if (group) {
    return `${group}.${field}`
  }
  return field
}

const getRowNumber = (rowIndex) => {
  if (props.paginated) {
    return (computedPage.value - 1) * Number(computedPerPage.value) + rowIndex + 1
  }
  return rowIndex + 1
}

const isGroupHeader = (col) => {
  if (!col.field) return false
  return groups.some(group => group.name === col.field)
}

const isColumnGrouped = (originalFieldId) => {
  return columns.some(column => 
    column.field === originalFieldId && column.group
  )
}

const getGroupColumns = (groupName) => {
  return allLeafColumns.value.filter(col => {
    const originalField = col.displayField || col.field
    const column = columns.find(c => c.field === originalField)
    return column && column.group === groupName
  })
}

// Initialize column pinning with dependencies
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

// ============================
// WATCHERS FOR PERSISTENCE
// ============================
watch(columnVisibility, (newVal) => persistence.saveColumnVisibility(newVal), { deep: true })
watch(rowSize, (newVal) => persistence.saveRowSize(newVal))
watch([pinnedLeft, pinnedRight], () => persistence.savePinnedColumns(pinnedLeft.value, pinnedRight.value), { deep: true })

// ============================
// PROVIDERS FOR CHILD COMPONENTS
// ============================
provide('registerGroup', (group) => groups.push(group))
provide('registerColumn', (col) => {
  // Default enableHiding ke true jika tidak di-set
  columns.push({
    ...col,
    enableHiding: col.enableHiding !== false
  })
})

// ============================
// RESET FUNCTION
// ============================
const resetTable = () => {
  resetColumnVisibility()
  rowSize.value = COLUMN_SIZE.Medium
  pinnedLeft.value = []
  pinnedRight.value = []
}

// ============================
// STYLING FUNCTIONS WITH COMPOSABLE
// ============================
const getPinnedColumnClasses = (fieldId, type = 'cell') => {
  return styling.getPinnedColumnClasses(fieldId, type, isColumnPinnedLeft, isColumnPinnedRight)
}

// Reactive positioning based on actual column data
const columnPositions = ref(new Map())

const getActualColumnWidth = (fieldId) => {
  try {
    // Try to get width from DOM
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

// Calculate column positions based on actual widths
const calculateColumnPositions = () => {
  const positions = new Map()
  const baseOffset = getBaseOffset()
  
  // Calculate left pinned positions
  organizedColumns.value.leftPinned.forEach((col, index) => {
    let leftPosition = baseOffset
    for (let i = 0; i < index; i++) {
      const prevCol = organizedColumns.value.leftPinned[i]
      // Try actual width first, then specified width, then default
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
      // Try actual width first, then specified width, then default
      const actualWidth = getActualColumnWidth(nextCol.field)
      const specifiedWidth = styling.getColumnWidth(nextCol)
      const width = actualWidth || specifiedWidth
      rightPosition += width
    }
    positions.set(col.field, { right: `${rightPosition - 10}px` })
  })
  
  columnPositions.value = positions
}

const getPinnedColumnStyles = (fieldId) => {
  if (!fieldId) return {}
  
  // Get cached position or return empty
  const cachedPosition = columnPositions.value.get(fieldId)
  if (cachedPosition) {
    return cachedPosition
  }
  
  // Fallback to empty if not found
  return {}
}

const getBaseOffset = () => {
  let offset = 0
  if (props.selectable) offset += 60 // 60px for selectable column
  // Numbering column is no longer sticky, so don't include in base offset
  return offset
}

// ============================
// COMPUTED PROPERTIES
// ============================
const allLeafColumns = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const ungroupedColumns = columns
    .filter(c => !c.group && c.field)
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
  
  const allNodes = [...tree, ...ungroupedColumns]
  const leafColumns = treeOps.collectLeafColumns(allNodes)
  
  return treeOps.sortColumns(leafColumns)
})

const organizedColumns = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const leafColumns = treeOps.collectLeafColumns(allNodes)
  
  // Separate columns by pinning status
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
  
  // Sort pinned columns by their order in pinned arrays
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
})

const headerRows = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const sortedNodes = treeOps.sortNodes(allNodes)
  
  if (sortedNodes.length === 0) return []
  
  const depth = Math.max(...sortedNodes.map(c => treeOps.calculateDepth(c)), 1)
  return treeOps.flattenTreeToRows(sortedNodes, depth)
})

const visibleColumns = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const sortedNodes = treeOps.sortNodes(allNodes)
  const leafColumns = treeOps.collectLeafColumns(sortedNodes)
  
  // Handle colspan scenarios
  const filteredColumns = []
  let skipNext = 0
  
  leafColumns.forEach((col) => {
    if (skipNext > 0) {
      skipNext--
      return
    }
    
    filteredColumns.push(col)
    
    if (col.bodyColspan && col.bodyColspan > 1) {
      skipNext = col.bodyColspan - 1
    }
  })
  
  return filteredColumns
})

const visibleFooterColumns = computed(() => {
  const tree = treeOps.buildTree(groups, columns, generateUniqueFieldId)
  const filteredTree = treeOps.filterTreeByVisibility(tree, isColumnVisible)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: generateUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  const sortedNodes = treeOps.sortNodes(allNodes)
  const leafColumns = treeOps.collectLeafColumns(sortedNodes)
  
  // Handle footer colspan scenarios (different from body colspan)
  const filteredColumns = []
  let skipNext = 0
  
  leafColumns.forEach((col) => {
    if (skipNext > 0) {
      skipNext--
      return
    }
    
    filteredColumns.push(col)
    
    if (col.footerColspan && col.footerColspan > 1) {
      skipNext = col.footerColspan - 1
    }
  })
  
  return filteredColumns
})

// ============================
// HELPER FUNCTIONS FOR UI LOGIC
// ============================
const isLeafColumn = (fieldId) => {
  return allLeafColumns.value.some(col => col.field === fieldId)
}

const shouldShowDropdownSettings = (col) => {
  if (col.hasSubheader) return false
  return isLeafColumn(col.field) || isGroupHeader(col)
}

const shouldShowPinControls = (col) => {
  if (!col.field) return false
  
  const leafColumn = allLeafColumns.value.find(leaf => leaf.field === col.field)
  if (leafColumn) {
    return !isColumnGrouped(leafColumn.displayField || leafColumn.field)
  }
  
  return isGroupHeader(col)
}

// ============================
// WATCHERS AND INITIALIZATION
// ============================
watch(allLeafColumns, (newColumns) => {
  if (newColumns.length > 0) {
    initializeColumnVisibility(newColumns)
  }
}, { immediate: true })

// Watch for changes that affect column positioning
watch([organizedColumns, pinnedLeft, pinnedRight, () => props.selectable], () => {
  calculateColumnPositions()
}, { immediate: true, deep: true })

// Watch for data changes that might affect column widths
watch(() => props.data, () => {
  // Recalculate after a short delay to allow DOM to update
  nextTick(() => {
    calculateColumnPositions()
  })
}, { deep: true })

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
  pinnedRight: readonly(pinnedRight)
})

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
  // Load saved states
  const savedVisibility = persistence.loadColumnVisibility()
  if (savedVisibility.length > 0) {
    setColumnVisibility(savedVisibility)
  }
  
  const savedRowSize = persistence.loadRowSize(COLUMN_SIZE.Medium)
  rowSize.value = savedRowSize
  
  const savedPinned = persistence.loadPinnedColumns()
  initializePinnedColumns(savedPinned)
  
  // Initial calculation of column positions
  nextTick(() => {
    calculateColumnPositions()
  })
})
</script>