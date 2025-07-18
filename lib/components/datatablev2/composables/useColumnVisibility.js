import { ref } from 'vue'

/**
 * Composable for handling column visibility functionality
 * @param {Function} emit - Vue emit function
 */
export function useColumnVisibility(emit) {
  const columnVisibility = ref([])

  // ============================
  // VISIBILITY OPERATIONS
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

  const hideColumn = (fieldId) => {
    console.log('Hiding column:', fieldId)
    toggleColumnVisibility(fieldId, false)
  }

  const resetColumnVisibility = () => {
    columnVisibility.value = []
    emit('column-visibility-change', {
      type: 'reset',
      visibleColumns: []
    })
  }

  // ============================
  // INITIALIZATION
  // ============================
  const initializeColumnVisibility = (allLeafColumns) => {
    // Only initialize if array is empty and we have columns
    // This prevents overriding saved state that might be loaded later
    if (columnVisibility.value.length === 0 && allLeafColumns.length > 0) {
      // Initialize with all field names (show all by default)
      const fieldNames = allLeafColumns
        .filter(col => col.compositeFieldId || col.field) // Ensure field exists
        .map(col => col.compositeFieldId || col.field) // Extract field names as strings

      columnVisibility.value = fieldNames
    }
  }

  const setColumnVisibility = (visibilityArray) => {
    columnVisibility.value = visibilityArray
  }

  return {
    // State
    columnVisibility,
    
    // Operations
    isColumnVisible,
    toggleColumnVisibility,
    hideColumn,
    resetColumnVisibility,
    
    // Initialization
    initializeColumnVisibility,
    setColumnVisibility
  }
}
