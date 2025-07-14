import { ref } from 'vue'

/**
 * Composable for handling column pinning functionality
 * @param {Function} isGroupHeader - Function to check if column is group header
 * @param {Function} getGroupColumns - Function to get columns in a group
 */
export function useColumnPinning(isGroupHeader, getGroupColumns) {
  const pinnedLeft = ref([])  // Array of field IDs pinned to left
  const pinnedRight = ref([]) // Array of field IDs pinned to right

  // ============================
  // PINNING OPERATIONS
  // ============================
  const pinColumnLeft = (fieldId) => {
    if (isGroupHeader({ field: fieldId })) {
      // Pin all columns in this group
      const groupColumns = getGroupColumns(fieldId)
      groupColumns.forEach(col => {
        removeFromPinnedRight(col.field)
        addToPinnedLeft(col.field)
      })
    } else {
      // Pin single column
      removeFromPinnedRight(fieldId)
      addToPinnedLeft(fieldId)
    }
  }

  const pinColumnRight = (fieldId) => {
    if (isGroupHeader({ field: fieldId })) {
      // Pin all columns in this group
      const groupColumns = getGroupColumns(fieldId)
      groupColumns.forEach(col => {
        removeFromPinnedLeft(col.field)
        addToPinnedRight(col.field)
      })
    } else {
      // Pin single column
      removeFromPinnedLeft(fieldId)
      addToPinnedRight(fieldId)
    }
  }

  const unpinColumn = (fieldId) => {
    if (isGroupHeader({ field: fieldId })) {
      // Unpin all columns in this group
      const groupColumns = getGroupColumns(fieldId)
      groupColumns.forEach(col => {
        removeFromPinnedLeft(col.field)
        removeFromPinnedRight(col.field)
      })
    } else {
      // Unpin single column
      removeFromPinnedLeft(fieldId)
      removeFromPinnedRight(fieldId)
    }
  }

  // ============================
  // HELPER FUNCTIONS
  // ============================
  const addToPinnedLeft = (fieldId) => {
    if (!pinnedLeft.value.includes(fieldId)) {
      pinnedLeft.value.push(fieldId)
    }
  }

  const addToPinnedRight = (fieldId) => {
    if (!pinnedRight.value.includes(fieldId)) {
      pinnedRight.value.unshift(fieldId) // Add to beginning for right-to-left order
    }
  }

  const removeFromPinnedLeft = (fieldId) => {
    const index = pinnedLeft.value.indexOf(fieldId)
    if (index > -1) {
      pinnedLeft.value.splice(index, 1)
    }
  }

  const removeFromPinnedRight = (fieldId) => {
    const index = pinnedRight.value.indexOf(fieldId)
    if (index > -1) {
      pinnedRight.value.splice(index, 1)
    }
  }

  // ============================
  // STATUS CHECKS
  // ============================
  const isColumnPinnedLeft = (fieldId) => {
    if (isGroupHeader({ field: fieldId })) {
      // Check if ALL columns in this group are pinned left
      const groupColumns = getGroupColumns(fieldId)
      return groupColumns.length > 0 && groupColumns.every(col => pinnedLeft.value.includes(col.field))
    }
    return pinnedLeft.value.includes(fieldId)
  }

  const isColumnPinnedRight = (fieldId) => {
    if (isGroupHeader({ field: fieldId })) {
      // Check if ALL columns in this group are pinned right
      const groupColumns = getGroupColumns(fieldId)
      return groupColumns.length > 0 && groupColumns.every(col => pinnedRight.value.includes(col.field))
    }
    return pinnedRight.value.includes(fieldId)
  }

  const isColumnPinned = (fieldId) => {
    return isColumnPinnedLeft(fieldId) || isColumnPinnedRight(fieldId)
  }

  // ============================
  // INITIALIZATION
  // ============================
  const initializePinnedColumns = (initialData) => {
    if (initialData.left) {
      pinnedLeft.value = [...initialData.left]
    }
    if (initialData.right) {
      pinnedRight.value = [...initialData.right]
    }
  }

  return {
    // State
    pinnedLeft,
    pinnedRight,
    
    // Operations
    pinColumnLeft,
    pinColumnRight,
    unpinColumn,
    
    // Status checks
    isColumnPinnedLeft,
    isColumnPinnedRight,
    isColumnPinned,
    
    // Initialization
    initializePinnedColumns
  }
}
