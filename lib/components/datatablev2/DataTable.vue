<template>
  <Table>
    <TableHeader>
      <TableRow v-for="(row, rowIndex) in headerRows" :key="'header-row-' + rowIndex">
        <template v-for="(col, colIndex) in row" :key="'header-cell-' + rowIndex + '-' + colIndex">
          <TableHead :colspan="col.colspan" :rowspan="col.rowspan">
            <component :is="col.header" />
          </TableHead>
        </template>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(row, rowIndex) in data" :key="'row-' + rowIndex">
        <template v-for="(cell, cellIndex) in visibleColumns" :key="'cell-' + rowIndex + '-' + cellIndex">
          <TableCell :colspan="cell.bodyColspan || 1" :rowspan="cell.bodyRowspan || 1">
            <component :is="cell.cell" :row="row" />
          </TableCell>
        </template>
      </TableRow>
    </TableBody>
  </Table>
  <slot />
</template>

<script setup>
import { computed, onMounted, provide, reactive } from 'vue'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../table'

const props = defineProps({ data: Array })

const groups = reactive([])
const columns = reactive([])

provide('registerGroup', (group) => groups.push(group))
provide('registerColumn', (col) => columns.push(col))

const headerRows = computed(() => {
  const tree = buildTree()
  
  // Gabungkan dengan ungrouped columns dalam urutan yang benar
  const ungroupedColumns = columns
    .filter(c => !c.group)
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: [],
      registrationOrder: columns.indexOf(col)
    }))
  
  // Gabungkan dan sort berdasarkan urutan registrasi
  const allNodes = [...tree, ...ungroupedColumns]
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
  // Dapatkan semua kolom dalam urutan yang benar
  const tree = buildTree()
  const ungroupedColumns = columns
    .filter(c => !c.group)
    .sort((a, b) => a.registrationOrder - b.registrationOrder)
    .map((col) => ({
      ...col,
      isLeaf: true,
      children: []
    }))
  
  const allNodes = [...tree, ...ungroupedColumns]
  allNodes.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return a.registrationOrder - b.registrationOrder
  })
  
  // Flatten untuk mendapatkan semua leaf columns
  const leafColumns = []
  
  collectLeafColumns(allNodes)
  
  // Filter kolom berdasarkan bodyColspan
  const filteredColumns = []
  let skipNext = 0
  
  leafColumns.forEach((col) => {
    if (skipNext > 0) {
      skipNext--
      return // Skip kolom ini karena ter-cover oleh colspan sebelumnya
    }
    
    filteredColumns.push(col)
    
    // Jika kolom ini memiliki bodyColspan > 1, skip kolom berikutnya
    if (col.bodyColspan && col.bodyColspan > 1) {
      skipNext = col.bodyColspan - 1
    }
  })
  
  console.log('Visible Columns Debug:', {
    leafColumns: leafColumns.map(c => ({ field: c.field, bodyColspan: c.bodyColspan })),
    filteredColumns: filteredColumns.map(c => ({ field: c.field, bodyColspan: c.bodyColspan })),
    totalColumns: filteredColumns.length
  })
  
  return filteredColumns
  
  // Helper function untuk collectLeafColumns
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

function buildTree() {
  const map = new Map()
  
  // Buat map untuk semua groups dengan mempertahankan urutan registrasi
  groups.forEach((group, index) => {
    map.set(group.name, { 
      ...group, 
      children: [], 
      registrationOrder: index, // Urutan registrasi asli
      isLeaf: false 
    })
  })
  
  // Tambahkan columns ke parent groups berdasarkan urutan registrasi
  columns.forEach((col, index) => {
    if (col.group && map.has(col.group)) {
      const parent = map.get(col.group)
      parent.children.push({ 
        ...col, 
        isLeaf: true, 
        registrationOrder: index, // Urutan registrasi asli
        children: []
      })
    }
  })
  
  // Sort children dalam setiap group berdasarkan urutan registrasi
  map.forEach(group => {
    if (group.children && group.children.length > 0) {
      group.children.sort((a, b) => a.registrationOrder - b.registrationOrder)
    }
  })
  
  // Buat hierarchy untuk nested groups - sort berdasarkan registrasi
  const sortedGroups = [...groups].sort((a, b) => groups.indexOf(a) - groups.indexOf(b))
  
  sortedGroups.forEach(group => {
    if (group.parent && map.has(group.parent) && map.has(group.name)) {
      const parent = map.get(group.parent)
      const child = map.get(group.name)
      
      // Tentukan posisi berdasarkan urutan registrasi
      const childRegistrationOrder = groups.indexOf(group)
      
      // Hapus jika sudah ada untuk menghindari duplikat
      parent.children = parent.children.filter(c => c.name !== child.name)
      
      // Insert pada posisi yang tepat berdasarkan registrasi order
      child.registrationOrder = childRegistrationOrder
      parent.children.push(child)
      parent.children.sort((a, b) => a.registrationOrder - b.registrationOrder)
    }
  })
  
  // Return root groups dalam urutan registrasi
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

onMounted(() => {
  console.log('Data Rows:', props.data)
  console.log('Header Rows:', headerRows.value)
  console.log('Visible Columns:', visibleColumns.value)
})
</script>