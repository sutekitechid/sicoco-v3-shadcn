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
                  enableHorizontalScroll ? `min-w-[${minColumnWidth}] whitespace-nowrap` : '',
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
                  enableHorizontalScroll ? `min-w-[${minColumnWidth}] whitespace-nowrap` : '',
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

const groups = reactive([])
const columns = reactive([])
const rowSize = ref(COLUMN_SIZE.Medium)

// State untuk column visibility - ARRAY OF FIELD STRINGS
const columnVisibility = ref([])

// State untuk column pinning/freezing
const pinnedLeft = ref([])  // Array of field IDs pinned to left
const pinnedRight = ref([]) // Array of field IDs pinned to right

// Load state dari localStorage/sessionStorage
const loadColumnVisibility = () => {
  if (!props.persistState) return
  
  try {
    const saved = localStorage.getItem(`datatable-visibility-${props.id}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Ensure it's an array of strings
      columnVisibility.value = Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : []
    }
  } catch (error) {
    console.warn('Failed to load column visibility state:', error)
  }
}

// Save state ke localStorage/sessionStorage
const saveColumnVisibility = () => {
  if (!props.persistState) return
  
  try {
    localStorage.setItem(
      `datatable-visibility-${props.id}`, 
      JSON.stringify(columnVisibility.value)
    )
  } catch (error) {
    console.warn('Failed to save column visibility state:', error)
  }
}

// ============================
// ROW SIZE PERSISTENCE
// ============================
const loadRowSize = () => {
  if (!props.persistState) return
  
  try {
    const saved = localStorage.getItem(`datatable-rowsize-${props.id}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Validate that the saved value is a valid COLUMN_SIZE
      const validSizes = Object.values(COLUMN_SIZE)
      if (validSizes.includes(parsed)) {
        rowSize.value = parsed
      }
    }
  } catch (error) {
    console.warn('Failed to load row size state:', error)
  }
}

const saveRowSize = () => {
  if (!props.persistState) return
  
  try {
    localStorage.setItem(
      `datatable-rowsize-${props.id}`, 
      JSON.stringify(rowSize.value)
    )
  } catch (error) {
    console.warn('Failed to save row size state:', error)
  }
}

// ============================
// COLUMN PINNING PERSISTENCE
// ============================
const loadPinnedColumns = () => {
  if (!props.persistState) return
  
  try {
    const savedLeft = localStorage.getItem(`datatable-pinned-left-${props.id}`)
    const savedRight = localStorage.getItem(`datatable-pinned-right-${props.id}`)
    
    if (savedLeft) {
      const parsedLeft = JSON.parse(savedLeft)
      pinnedLeft.value = Array.isArray(parsedLeft) ? parsedLeft.filter(item => typeof item === 'string') : []
    }
    
    if (savedRight) {
      const parsedRight = JSON.parse(savedRight)
      pinnedRight.value = Array.isArray(parsedRight) ? parsedRight.filter(item => typeof item === 'string') : []
    }
  } catch (error) {
    console.warn('Failed to load pinned columns state:', error)
  }
}

const savePinnedColumns = () => {
  if (!props.persistState) return
  
  try {
    localStorage.setItem(
      `datatable-pinned-left-${props.id}`, 
      JSON.stringify(pinnedLeft.value)
    )
    localStorage.setItem(
      `datatable-pinned-right-${props.id}`, 
      JSON.stringify(pinnedRight.value)
    )
  } catch (error) {
    console.warn('Failed to save pinned columns state:', error)
  }
}

// Watch untuk auto-save
watch(columnVisibility, saveColumnVisibility, { deep: true })
watch(rowSize, saveRowSize)
watch(pinnedLeft, savePinnedColumns, { deep: true })
watch(pinnedRight, savePinnedColumns, { deep: true })

provide('registerGroup', (group) => groups.push(group))
provide('registerColumn', (col) => {
  // Default enableHiding ke true jika tidak di-set
  columns.push({
    ...col,
    enableHiding: col.enableHiding !== false
  })
})

// ============================
// COLUMN VISIBILITY FUNCTIONS - FIXED FOR ARRAY OF STRINGS
// ============================
const isColumnVisible = (fieldId) => {
  // If array is empty, show all columns (default behavior)
  if (columnVisibility.value.length === 0) {
    return true
  }
  // Check if fieldId is in the visibility array
  return columnVisibility.value.includes(fieldId)
}

const toggleColumnVisibility = (fieldId, isVisible) => {
  if (isVisible) {
    // Add field to array if not already present
    if (!columnVisibility.value.includes(fieldId)) {
      columnVisibility.value.push(fieldId)
    }
  } else {
    // Remove field from array
    const index = columnVisibility.value.indexOf(fieldId)
    if (index > -1) {
      columnVisibility.value.splice(index, 1)
    }
  }
  
  emit('column-visibility-change', { 
    fieldId, 
    isVisible, 
    visibleColumns: [...columnVisibility.value] 
  })
}

const resetTable = () => {
  // Reset to empty array (show all columns)
  columnVisibility.value = []
  rowSize.value = COLUMN_SIZE.Medium // Reset row size to default
  pinnedLeft.value = [] // Reset pinned columns
  pinnedRight.value = []
  emit('column-visibility-change', {
    type: 'reset',
    visibleColumns: []
  })
}

// ============================
// COLUMN PINNING FUNCTIONS
// ============================
const pinColumnLeft = (fieldId) => {
  // Check if this is a group header
  if (isGroupHeader({ field: fieldId })) {
    // Pin all columns in this group
    const groupColumns = getGroupColumns(fieldId)
    groupColumns.forEach(col => {
      // Remove from right if exists
      const rightIndex = pinnedRight.value.indexOf(col.field)
      if (rightIndex > -1) {
        pinnedRight.value.splice(rightIndex, 1)
      }
      
      // Add to left if not already there
      if (!pinnedLeft.value.includes(col.field)) {
        pinnedLeft.value.push(col.field)
      }
    })
  } else {
    // Pin single column
    // Remove from right if exists
    const rightIndex = pinnedRight.value.indexOf(fieldId)
    if (rightIndex > -1) {
      pinnedRight.value.splice(rightIndex, 1)
    }
    
    // Add to left if not already there
    if (!pinnedLeft.value.includes(fieldId)) {
      pinnedLeft.value.push(fieldId)
    }
  }
}

const pinColumnRight = (fieldId) => {
  // Check if this is a group header
  if (isGroupHeader({ field: fieldId })) {
    // Pin all columns in this group
    const groupColumns = getGroupColumns(fieldId)
    groupColumns.forEach(col => {
      // Remove from left if exists
      const leftIndex = pinnedLeft.value.indexOf(col.field)
      if (leftIndex > -1) {
        pinnedLeft.value.splice(leftIndex, 1)
      }
      
      // Add to right if not already there
      if (!pinnedRight.value.includes(col.field)) {
        pinnedRight.value.unshift(col.field) // Add to beginning for right-to-left order
      }
    })
  } else {
    // Pin single column
    // Remove from left if exists
    const leftIndex = pinnedLeft.value.indexOf(fieldId)
    if (leftIndex > -1) {
      pinnedLeft.value.splice(leftIndex, 1)
    }
    
    // Add to right if not already there
    if (!pinnedRight.value.includes(fieldId)) {
      pinnedRight.value.unshift(fieldId) // Add to beginning for right-to-left order
    }
  }
}

const unpinColumn = (fieldId) => {
  // Check if this is a group header
  if (isGroupHeader({ field: fieldId })) {
    // Unpin all columns in this group
    const groupColumns = getGroupColumns(fieldId)
    groupColumns.forEach(col => {
      const leftIndex = pinnedLeft.value.indexOf(col.field)
      const rightIndex = pinnedRight.value.indexOf(col.field)
      
      if (leftIndex > -1) {
        pinnedLeft.value.splice(leftIndex, 1)
      }
      
      if (rightIndex > -1) {
        pinnedRight.value.splice(rightIndex, 1)
      }
    })
  } else {
    // Unpin single column
    const leftIndex = pinnedLeft.value.indexOf(fieldId)
    const rightIndex = pinnedRight.value.indexOf(fieldId)
    
    if (leftIndex > -1) {
      pinnedLeft.value.splice(leftIndex, 1)
    }
    
    if (rightIndex > -1) {
      pinnedRight.value.splice(rightIndex, 1)
    }
  }
}

const isColumnPinnedLeft = (fieldId) => {
  // Check if this is a group header
  if (isGroupHeader({ field: fieldId })) {
    // Check if ALL columns in this group are pinned left
    const groupColumns = getGroupColumns(fieldId)
    return groupColumns.length > 0 && groupColumns.every(col => pinnedLeft.value.includes(col.field))
  }
  
  // Check single column
  return pinnedLeft.value.includes(fieldId)
}

const isColumnPinnedRight = (fieldId) => {
  // Check if this is a group header
  if (isGroupHeader({ field: fieldId })) {
    // Check if ALL columns in this group are pinned right
    const groupColumns = getGroupColumns(fieldId)
    return groupColumns.length > 0 && groupColumns.every(col => pinnedRight.value.includes(col.field))
  }
  
  // Check single column
  return pinnedRight.value.includes(fieldId)
}

const isColumnPinned = (fieldId) => {
  return isColumnPinnedLeft(fieldId) || isColumnPinnedRight(fieldId)
}

// ============================
// PINNED COLUMN STYLING HELPERS
// ============================
const getPinnedColumnClasses = (fieldId, type = 'cell') => {
  if (!fieldId) return ''
  
  const classes = []
  
  if (isColumnPinnedLeft(fieldId)) {
    classes.push('sticky left-0 z-20 bg-white dark:bg-neutral-100')
    if (type === 'header') {
      classes.push('border-r border-border')
    }
  } else if (isColumnPinnedRight(fieldId)) {
    classes.push('sticky right-0 z-20 bg-white dark:bg-neutral-100')
    if (type === 'header') {
      classes.push('border-l border-border')
    }
  }
  
  return classes.join(' ')
}

const getPinnedColumnStyles = (fieldId) => {
  if (!fieldId) return {}
  
  const organized = organizedColumns.value
  const styles = {}
  
  if (isColumnPinnedLeft(fieldId)) {
    // Calculate left position
    const leftIndex = organized.leftPinned.findIndex(col => col.field === fieldId)
    let leftPosition = 0
    
    for (let i = 0; i < leftIndex; i++) {
      leftPosition += 120 // Use minColumnWidth, should be dynamic
    }
    
    styles.left = `${leftPosition}px`
  } else if (isColumnPinnedRight(fieldId)) {
    // Calculate right position
    const rightIndex = organized.rightPinned.findIndex(col => col.field === fieldId)
    let rightPosition = 0
    
    for (let i = 0; i < rightIndex; i++) {
      rightPosition += 120 // Use minColumnWidth, should be dynamic
    }
    
    styles.right = `${rightPosition}px`
  }
  
  return styles
}

// Initialize column visibility with all field names when component mounts
const initializeColumnVisibility = () => {
  // Only initialize if array is empty and we have columns
  if (columnVisibility.value.length === 0 && allLeafColumns.value.length > 0) {
    // Initialize with all field names (show all by default)
    columnVisibility.value = allLeafColumns.value
      .filter(col => col.field) // Ensure field exists
      .map(col => col.field) // Extract field names as strings
  }
}

// Get all leaf columns untuk visibility controls
const allLeafColumns = computed(() => {
  const leafColumns = []
  
  function collectLeafColumns(nodes) {
    nodes.forEach(node => {
      if (node.isLeaf && node.field) {
        // Add unique field ID for grouped columns
        const leafColumn = {
          ...node,
          displayField: node.field, // Keep original field for display
          field: node.uniqueFieldId || node.field // Use unique field ID for visibility tracking
        }
        leafColumns.push(leafColumn)
      } else if (node.children && node.children.length > 0) {
        collectLeafColumns(node.children)
      }
    })
  }
  
  const tree = buildTree()
  const ungroupedColumns = columns
    .filter(c => !c.group && c.field) // Ensure field exists
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      uniqueFieldId: getUniqueFieldId(col.field) // Add unique field ID
    }))
  
  const allNodes = [...tree, ...ungroupedColumns]
  collectLeafColumns(allNodes)
  
  return leafColumns.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return (a.registrationOrder || 0) - (b.registrationOrder || 0)
  })
})

// ============================
// MODIFIED COMPUTED PROPERTIES
// ============================

// Organize columns by pinning status
const organizedColumns = computed(() => {
  const tree = buildTree()
  const filteredTree = filterTreeByVisibility(tree)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: getUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  
  // Collect all leaf columns
  const leafColumns = []
  function collectLeafColumns(nodes) {
    nodes.forEach(node => {
      if (node.isLeaf && node.field) {
        const leafColumn = {
          ...node,
          displayField: node.field,
          field: node.uniqueFieldId || node.field
        }
        leafColumns.push(leafColumn)
      } else if (node.children && node.children.length > 0) {
        collectLeafColumns(node.children)
      }
    })
  }
  collectLeafColumns(allNodes)
  
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
  
  // Sort each group
  const sortColumns = (cols) => cols.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return (a.registrationOrder || 0) - (b.registrationOrder || 0)
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
    unpinned: sortColumns(unpinned),
    rightPinned: sortedRightPinned,
    all: [...sortedLeftPinned, ...sortColumns(unpinned), ...sortedRightPinned]
  }
})

const headerRows = computed(() => {
  // For now, use existing logic but we'll need to modify this for pinned columns
  // This is a complex change that affects the tree structure
  const tree = buildTree()
  
  // Filter tree dan ungrouped columns berdasarkan visibility
  const filteredTree = filterTreeByVisibility(tree)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: getUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  allNodes.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return a.registrationOrder - b.registrationOrder
  })
  
  if (allNodes.length === 0) return []
  
  const depth = Math.max(...allNodes.map(c => calculateDepth(c)), 1)
  const result = flattenTreeToRows(allNodes, depth)
  
  return result
})

const visibleColumns = computed(() => {
  // Use the same tree structure as headers for consistent ordering
  const tree = buildTree()
  const filteredTree = filterTreeByVisibility(tree)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col),
      uniqueFieldId: getUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  
  // Sort nodes in the same way as headers (by registration order, not pinning)
  allNodes.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return a.registrationOrder - b.registrationOrder
  })
  
  // Collect leaf columns in their original order
  const leafColumns = []
  function collectLeafColumns(nodes) {
    nodes.forEach(node => {
      if (node.isLeaf && node.field) {
        const leafColumn = {
          ...node,
          displayField: node.field,
          field: node.uniqueFieldId || node.field
        }
        leafColumns.push(leafColumn)
      } else if (node.children && node.children.length > 0) {
        collectLeafColumns(node.children)
      }
    })
  }
  collectLeafColumns(allNodes)
  
  // Return columns in their original order (same as headers)
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
// HELPER FUNCTIONS
// ============================

// Check if a field ID corresponds to a leaf column (not a group header)
const isLeafColumn = (fieldId) => {
  return allLeafColumns.value.some(col => col.field === fieldId)
}

// Check if we should show dropdown settings for this column
const shouldShowDropdownSettings = (col) => {
  if (!col.field) return false
  
  // Show for leaf columns (non-grouped) OR group headers
  return isLeafColumn(col.field) || isGroupHeader(col)
}

// Check if we should show pin controls for this column
const shouldShowPinControls = (col) => {
  if (!col.field) return false
  
  // Show pin controls for:
  // 1. Non-grouped leaf columns (columns without parent/group)
  // 2. Group headers (root/group)
  
  const leafColumn = allLeafColumns.value.find(leaf => leaf.field === col.field)
  if (leafColumn) {
    // This is a leaf column - show pin controls only if it's not grouped
    return !isColumnGrouped(leafColumn.displayField || leafColumn.field)
  }
  
  // This might be a group header - show pin controls
  return isGroupHeader(col)
}

// Check if this is a group header
const isGroupHeader = (col) => {
  if (!col.field) return false
  
  // Check if this field corresponds to a group name
  return groups.some(group => group.name === col.field)
}

// Check if a column is part of a group
const isColumnGrouped = (originalFieldId) => {
  return columns.some(column => 
    column.field === originalFieldId && column.group
  )
}

// Get all columns in a group
const getGroupColumns = (groupName) => {
  return allLeafColumns.value.filter(col => {
    // Check if this column belongs to the specified group
    const originalField = col.displayField || col.field
    const column = columns.find(c => c.field === originalField)
    return column && column.group === groupName
  })
}

// Generate unique field ID with group prefix
const getUniqueFieldId = (field, group = null) => {
  if (group) {
    return `${group}.${field}`
  }
  return field
}

function filterTreeByVisibility(tree) {
  return tree.map(node => filterNodeByVisibility(node)).filter(Boolean)
}

function filterNodeByVisibility(node) {
  if (!node) return null
  
  if (node.isLeaf && node.field) {
    // Leaf node - check visibility by unique field ID
    const fieldId = node.uniqueFieldId || node.field
    return isColumnVisible(fieldId) ? node : null
  }
  
  // Group node - filter children
  const filteredChildren = node.children
    .map(child => filterNodeByVisibility(child))
    .filter(Boolean)
  
  // Jika tidak ada children yang visible, hide group
  if (filteredChildren.length === 0) return null
  
  return {
    ...node,
    children: filteredChildren
  }
}

// ============================
// EXISTING FUNCTIONS (unchanged)
// ============================
function buildTree() {
  const map = new Map()
  
  groups.forEach((group, index) => {
    map.set(group.name, { 
      ...group, 
      children: [], 
      registrationOrder: index,
      isLeaf: false 
    })
  })
  
  columns.forEach((col, index) => {
    if (col.group && map.has(col.group)) {
      const parent = map.get(col.group)
      const uniqueFieldId = getUniqueFieldId(col.field, col.group)
      parent.children.push({ 
        ...col, 
        isLeaf: true, 
        registrationOrder: index,
        children: [],
        uniqueFieldId // Add unique field ID for visibility tracking
      })
    }
  })
  
  map.forEach(group => {
    if (group.children && group.children.length > 0) {
      group.children.sort((a, b) => a.registrationOrder - b.registrationOrder)
    }
  })
  
  const sortedGroups = [...groups].sort((a, b) => groups.indexOf(a) - groups.indexOf(b))
  
  sortedGroups.forEach(group => {
    if (group.parent && map.has(group.parent) && map.has(group.name)) {
      const parent = map.get(group.parent)
      const child = map.get(group.name)
      
      const childRegistrationOrder = groups.indexOf(group)
      parent.children = parent.children.filter(c => c.name !== child.name)
      child.registrationOrder = childRegistrationOrder
      parent.children.push(child)
      parent.children.sort((a, b) => a.registrationOrder - b.registrationOrder)
    }
  })
  
  const rootGroups = Array.from(map.values()).filter(g => !g.parent)
  return rootGroups.sort((a, b) => a.registrationOrder - b.registrationOrder)
}

function calculateDepth(node) {
  if (!node) return 0
  if (!node.children || node.children.length === 0) return 1
  return 1 + Math.max(...node.children.map(c => calculateDepth(c)))
}

function flattenTreeToRows(tree, depth = null) {
  const rows = []

  function walk(nodes, level) {
    rows[level] ??= []
    nodes.forEach(node => {
      const col = {
        header: node.header,
        colspan: countLeafColumns(node),
        rowspan: node.isLeaf ? depth - level : 1,
      }
      if (node.field) {
        col.field = node.uniqueFieldId || node.field // Use unique field ID if available
      }
      rows[level].push(col)
      if (node.children?.length) walk(node.children, level + 1)
    })
  }

  walk(tree, 0)
  return rows
}

function countLeafColumns(node) {
  if (!node) return 0
  if (node.isLeaf || !node.children || node.children.length === 0) return 1
  return node.children.reduce((sum, c) => sum + countLeafColumns(c), 0)
}

// Watch for allLeafColumns changes to initialize visibility
watch(allLeafColumns, (newColumns) => {
  if (newColumns.length > 0) {
    initializeColumnVisibility()
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

function hideColumn(fieldId) {
  console.log('Hiding column:', fieldId)
  toggleColumnVisibility(fieldId, false)
}

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
  loadColumnVisibility()
  loadRowSize() // Load row size from localStorage
  loadPinnedColumns() // Load pinned columns from localStorage
  
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