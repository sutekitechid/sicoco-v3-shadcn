import { ref } from 'vue'

/**
 * Composable for handling column visibility functionality
 * Now stores HIDDEN columns instead of visible ones for better dynamic column support
 * @param {Function} emit - Vue emit function
 */
export function useColumnVisibility(emit) {
  // Store hidden columns instead of visible ones
  const hiddenColumns = ref([])

  // ============================
  // VISIBILITY OPERATIONS
  // ============================
  const isColumnVisible = (fieldId) => {
    // Column is visible if it's NOT in the hidden array
    return !hiddenColumns.value.includes(fieldId)
  }

  const toggleColumnVisibility = (fieldId, isVisible) => {
    if (isVisible) {
      // Show column: remove from hidden array if present
      const index = hiddenColumns.value.indexOf(fieldId)
      if (index > -1) {
        hiddenColumns.value.splice(index, 1)
      }
    } else {
      // Hide column: add to hidden array if not already present
      if (!hiddenColumns.value.includes(fieldId)) {
        hiddenColumns.value.push(fieldId)
      }
    }
    
    emit('column-visibility-change', { 
      fieldId, 
      isVisible, 
      hiddenColumns: [...hiddenColumns.value]
    })
  }

  const hideColumn = (fieldId) => {
    console.log('Hiding column:', fieldId)
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
  const initializeColumnVisibility = (allLeafColumns) => {
    // No need to initialize anything since we store hidden columns
    // All columns are visible by default (empty hidden array)
    // This method is kept for API compatibility but does nothing
    console.log('Column visibility initialized with', allLeafColumns.length, 'columns (all visible by default)')
  }

  const setHiddenColumns = (hiddenArray) => {
    hiddenColumns.value = hiddenArray || []
  }

  // Backward compatibility - converts visible array to hidden array
  const setColumnVisibility = () => {
    console.warn('setColumnVisibility is deprecated. Use setHiddenColumns instead.')
    // Since we don't have context of all columns here, we can't convert properly
    // This method should be phased out
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
    initializeColumnVisibility,
    setHiddenColumns,
    setColumnVisibility, // Deprecated
    getVisibleColumns
  }
}
