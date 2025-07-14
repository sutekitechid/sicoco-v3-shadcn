<template>
  <div>
    <!-- Column Visibility Controls -->
    <div v-if="enableColumnVisibility" class="mb-4 flex gap-2">
      <Dropdown v-model="columnVisibility" multiple>
        <DropdownItem
          v-for="column in allLeafColumns"
          :key="column.field"
          :value="column.field"
          :disabled="!column.enableHiding"
        >
          {{ getColumnDisplayName(column) }}
        </DropdownItem>
      </Dropdown>
      
      <Button variant="ghost" size="sm" @click="showVisibilityPanel = !showVisibilityPanel">
        <SettingsIcon class="h-4 w-4" />
      </Button>
    </div>

    <!-- Visibility Panel (Optional expanded view) -->
    <div v-if="showVisibilityPanel && enableColumnVisibility" class="mb-4 p-4 border rounded-lg bg-muted/50">
      <h3 class="text-sm font-medium mb-3">Column Visibility</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div v-for="column in allLeafColumns" :key="column.field" class="flex items-center space-x-2">
          <Checkbox
            :id="`col-${column.field}`"
            :checked="isColumnVisible(column.field)"
            :disabled="!column.enableHiding"
            @update:checked="(checked) => toggleColumnVisibility(column.field, checked)"
          />
          <Label 
            :for="`col-${column.field}`" 
            class="text-sm cursor-pointer"
            :class="{ 'opacity-50': !column.enableHiding }"
          >
            {{ getColumnDisplayName(column) }}
          </Label>
        </div>
      </div>
    </div>

    <!-- Table -->
    <Table>
      <TableHeader>
        <TableRow v-for="(row, rowIndex) in headerRows" :key="'header-row-' + rowIndex">
          <template v-for="(col, colIndex) in row" :key="'header-cell-' + rowIndex + '-' + colIndex">
            <TableHead
              :colspan="col.colspan"
              :rowspan="col.rowspan"
            >
              <component :is="col.header" />
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
            >
              <component :is="cell.cell" :row="row" />
            </TableCell>
          </template>
        </TableRow>
      </TableBody>
    </Table>
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
import {
  Dropdown,
  DropdownItem,
} from '../dropdown'
import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { Label } from '../label'

const props = defineProps({ 
  data: Array,
  // Fitur column visibility
  enableColumnVisibility: {
    type: Boolean,
    default: true
  },
  tableId: {
    type: String,
    default: 'datatable'
  },
  persistState: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['column-visibility-change'])

const groups = reactive([])
const columns = reactive([])

// State untuk column visibility - ARRAY OF FIELD STRINGS
const columnVisibility = ref([])
const showVisibilityPanel = ref(false)

// Load state dari localStorage/sessionStorage
const loadColumnVisibility = () => {
  if (!props.persistState) return
  
  try {
    const saved = localStorage.getItem(`datatable-visibility-${props.tableId}`)
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
      `datatable-visibility-${props.tableId}`, 
      JSON.stringify(columnVisibility.value)
    )
  } catch (error) {
    console.warn('Failed to save column visibility state:', error)
  }
}

// Watch untuk auto-save
watch(columnVisibility, saveColumnVisibility, { deep: true })

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

const resetColumnVisibility = () => {
  // Reset to empty array (show all columns)
  columnVisibility.value = []
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
        leafColumns.push(node)
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
      children: []
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

const getColumnDisplayName = (column) => {
  // Coba ambil text dari header component atau fallback ke field name
  if (column.headerText) return column.headerText
  if (column.field) return column.field.charAt(0).toUpperCase() + column.field.slice(1)
  return 'Unknown Column'
}

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
      registrationOrder: columns.indexOf(col)
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
      children: []
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
        leafColumns.push(node)
      } else if (node.children && node.children.length > 0) {
        collectLeafColumns(node.children)
      }
    })
  }
})

// ============================
// HELPER FUNCTIONS
// ============================
function filterTreeByVisibility(tree) {
  return tree.map(node => filterNodeByVisibility(node)).filter(Boolean)
}

function filterNodeByVisibility(node) {
  if (!node) return null
  
  if (node.isLeaf && node.field) {
    // Leaf node - check visibility by field name
    return isColumnVisible(node.field) ? node : null
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
      parent.children.push({ 
        ...col, 
        isLeaf: true, 
        registrationOrder: index,
        children: []
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
  resetColumnVisibility,
  isColumnVisible,
  columnVisibility: readonly(columnVisibility),
  allLeafColumns
})

// ============================
// LIFECYCLE
// ============================
onMounted(() => {
  loadColumnVisibility()
  
  console.log('Data Rows:', props.data)
  console.log('Header Rows:', headerRows.value)
  console.log('Visible Columns:', visibleColumns.value)
  console.log('Column Visibility Array (field names):', columnVisibility.value)
})
watch(columnVisibility, (newData) => {
  console.log('Data updated:', newData)
}, { deep: true })
</script>