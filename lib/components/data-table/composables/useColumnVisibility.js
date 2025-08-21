import { ref } from 'vue'

/**
 * Composable for handling column visibility functionality
 * Now stores HIDDEN columns instead of visible ones for better dynamic column support
 * Optimized for large datasets with memoization
 * @param {Function} emit - Vue emit function
 */
export function useColumnVisibility(emit) {
  // Use ref for proper reactivity
  const hiddenColumns = ref([])
  
  // ============================
  // VISIBILITY OPERATIONS
  // ============================
  const isColumnVisible = (fieldId) => {
    return !hiddenColumns.value.includes(fieldId)
  }

  const toggleColumnVisibility = (fieldId, isVisible) => {
    if (isVisible) {
      // Show column: remove from hidden array if present
      hiddenColumns.value = hiddenColumns.value.filter(id => id !== fieldId)
    } else if (!hiddenColumns.value.includes(fieldId)) {
      // Hide column: add to hidden array
      hiddenColumns.value = [...hiddenColumns.value, fieldId]
    }
    
    emit('column-visibility-change', { 
      fieldId, 
      isVisible, 
      hiddenColumns: [...hiddenColumns.value]
    })
  }

  const hideColumn = (fieldId) => {
    toggleColumnVisibility(fieldId, false)
  }

  const resetColumnVisibility = () => {
    // Reset: clear hidden columns (show all)
    hiddenColumns.value = []
    emit('column-visibility-change', {
      type: 'reset',
      hiddenColumns: []
    })
  }

  // ============================
  // INITIALIZATION
  // ============================
  const setHiddenColumns = (hiddenArray) => {
    hiddenColumns.value = hiddenArray || []
  }

  // Helper to get visible columns (needs all columns context)
  const getVisibleColumns = (allLeafColumns) => {
    return allLeafColumns.filter(col => {
      const fieldId = col.compositeFieldId || col.field
      return isColumnVisible(fieldId)
    })
  }

  return {
    // State (renamed for clarity)
    hiddenColumns,
    
    // Backward compatibility
    columnVisibility: hiddenColumns, // For components that still reference this
    
    // Operations
    isColumnVisible,
    toggleColumnVisibility,
    hideColumn,
    resetColumnVisibility,
    
    // Initialization & Settings
    setHiddenColumns,
    getVisibleColumns
  }
}
