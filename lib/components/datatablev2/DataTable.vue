<template>
  <div class="w-full">
    <!-- Horizontal Scroll Wrapper with Indicators -->
    <DataTableScrollWrapper :enable-horizontal-scroll="enableHorizontalScroll">
      <!-- Table -->
      <Table>
        <TableHeader>
          <TableRow v-for="(row, rowIndex) in headerRows" :key="'header-row-' + rowIndex">
            <template v-for="(col, colIndex) in row" :key="'header-cell-' + rowIndex + '-' + colIndex">
              <TableHead
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :size="rowSize"
                :class="[
                  getPinnedColumnClasses(col.field, 'header')
                ]"
                :style="getPinnedColumnStyles(col.field)"
              >
                <div class="flex justify-between items-center">
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
          <TableRow v-for="(row, rowIndex) in data" :key="'row-' + rowIndex">
            <template v-for="(cell, cellIndex) in visibleColumns" :key="'cell-' + rowIndex + '-' + cellIndex">
              <TableCell
                :colspan="cell.bodyColspan || 1"
                :rowspan="cell.bodyRowspan || 1"
                :size="rowSize"
                :class="[
                  getPinnedColumnClasses(cell.field, 'cell')
                ]"
                :style="getPinnedColumnStyles(cell.field)"
              >
                <component :is="cell.cell" :row="row" />
              </TableCell>
            </template>
          </TableRow>
        </TableBody>
      </Table>
    </DataTableScrollWrapper>
  </div>
  <slot />
</template>

<script setup>
import { computed, onMounted, provide, reactive, ref, watch, readonly } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'
import DataTableDropdownSettings from './DataTableDropdownSettings.vue'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'
import { COLUMN_SIZE } from '.'

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
  }
})

const emit = defineEmits(['column-visibility-change'])

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

const getPinnedColumnStyles = (fieldId) => {
  return styling.getPinnedColumnStyles(fieldId, organizedColumns.value, isColumnPinnedLeft, isColumnPinnedRight)
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

// ============================
// HELPER FUNCTIONS FOR UI LOGIC
// ============================
const isLeafColumn = (fieldId) => {
  return allLeafColumns.value.some(col => col.field === fieldId)
}

const shouldShowDropdownSettings = (col) => {
  if (!col.field) return false
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
  
  // Debug logging
  console.log('Data Rows:', props.data)
  console.log('Header Rows:', headerRows.value)
  console.log('Visible Columns:', visibleColumns.value)
  console.log('Column Visibility Array (field names):', columnVisibility.value)
  console.log('Row Size:', rowSize.value)
  console.log('Pinned Left:', pinnedLeft.value)
  console.log('Pinned Right:', pinnedRight.value)
})

watch(columnVisibility, (newData) => {
  console.log('Data updated:', newData)
}, { deep: true })
</script>