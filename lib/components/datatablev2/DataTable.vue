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
                :size="rowSize">
                <div class="flex justify-between items-center">
                  <component :is="col.header" />
                  <DataTableDropdownSettings
                    v-if="col.field"
                    :column-field="col.field"
                    :column-visibility="columnVisibility"
                    :all-leaf-columns="allLeafColumns"
                    :row-size="rowSize"
                    @hide-column="hideColumn"
                    @update:column-visibility="columnVisibility = $event"
                    @update:row-size="rowSize = $event"
                    @reset-table="resetTable"
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
                :size="rowSize">
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

// Watch untuk auto-save
watch(columnVisibility, saveColumnVisibility, { deep: true })
watch(rowSize, saveRowSize)

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
  emit('column-visibility-change', {
    type: 'reset',
    visibleColumns: []
  })
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
const headerRows = computed(() => {
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
  const tree = buildTree()
  const filteredTree = filterTreeByVisibility(tree)
  const filteredUngroupedColumns = columns
    .filter(c => !c.group && c.field && isColumnVisible(c.field))
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      uniqueFieldId: getUniqueFieldId(col.field)
    }))
  
  const allNodes = [...filteredTree, ...filteredUngroupedColumns]
  allNodes.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return a.registrationOrder - b.registrationOrder
  })
  
  const leafColumns = []
  collectLeafColumns(allNodes)
  
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
  
  function collectLeafColumns(nodes) {
    nodes.forEach(node => {
      if (node.isLeaf && node.field) {
        // Use the same unique field ID logic for consistency
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
})

// ============================
// HELPER FUNCTIONS
// ============================

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
  allLeafColumns
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
  
  console.log('Data Rows:', props.data)
  console.log('Header Rows:', headerRows.value)
  console.log('Visible Columns:', visibleColumns.value)
  console.log('Column Visibility Array (field names):', columnVisibility.value)
  console.log('Row Size:', rowSize.value)
})
watch(columnVisibility, (newData) => {
  console.log('Data updated:', newData)
}, { deep: true })
</script>