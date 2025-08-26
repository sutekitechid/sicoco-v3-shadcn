import { ref, computed } from 'vue'

/**
 * Composable for handling column sorting functionality
 * @param {Object} props - Component props
 * @param {Function} emit - Component emit function
 * @param {Object} allLeafColumns - Computed property containing all leaf columns
 */
export function useColumnSorting(props, emit, allLeafColumns) {
  const sortState = ref([]) // Array of sort objects: [{ id: 'field1', desc: false }, { id: 'field2', desc: true }]

  // ============================
  // COMPUTED PROPERTIES
  // ============================
  const sortValue = computed(() => {
    if (!props.multipleSort) {
      // Return array with single item or empty array
      return sortState.value.length > 0 ? [sortState.value[0]] : []
    }
    return sortState.value
  })

  // ============================
  // SORTING OPERATIONS
  // ============================
  const toggleSort = (fieldId) => {
    const existingIndex = sortState.value.findIndex(sort => sort.id === fieldId)
    
    if (existingIndex !== -1) {
      const currentSort = sortState.value[existingIndex]
      
      if (!currentSort.desc) {
        // Change from asc to desc
        sortState.value[existingIndex] = { id: fieldId, desc: true }
      } else {
        // Remove sort (was desc, now no sort)
        sortState.value.splice(existingIndex, 1)
      }
    } else {
      // Add new sort (ascending first)
      const newSort = { id: fieldId, desc: false }
      
      if (props.multipleSort) {
        sortState.value.push(newSort)
      } else {
        // Single sort mode - replace existing sorts
        sortState.value = [newSort]
      }
    }
    
    // Emit the sort change
    emit('sort', sortValue.value)
  }

  const getSortState = (fieldId) => {
    const sort = sortState.value.find(s => s.id === fieldId)
    if (!sort) return null
    return sort.desc ? 'desc' : 'asc'
  }

  const getSortIndex = (fieldId) => {
    const index = sortState.value.findIndex(s => s.id === fieldId)
    return index !== -1 ? index + 1 : null
  }

  const clearSort = () => {
    sortState.value = []
    emit('sort-change', [])
  }

  const setSortState = (newSortState) => {
    sortState.value = Array.isArray(newSortState) ? newSortState : []
    emit('sort-change', sortValue.value)
  }

  // ============================
  // INITIALIZATION
  // ============================
  const initializeSorting = (initialSort = []) => {
    sortState.value = Array.isArray(initialSort) ? initialSort : []
  }

  // Initialize default sorting from column configurations
  const initializeDefaultSorting = () => {
    if (!allLeafColumns?.value) return
    
    const defaultSorts = []
    
    // Collect all columns with defaultSort
    allLeafColumns.value.forEach(col => {
      if (col.defaultSort && col.field && col.sortable) {
        const desc = col.defaultSort.toLowerCase() === 'desc'
        defaultSorts.push({
          id: col.field,
          desc,
          order: col.order || 0 // Use column order for sort priority
        })
      }
    })
    
    // Sort by column order to maintain consistent sort priority
    defaultSorts.sort((a, b) => a.order - b.order)
    
    // Remove order property and set initial sort state
    const initialSorts = defaultSorts.map(sort => ({
      id: sort.id,
      desc: sort.desc
    }))
    
    if (initialSorts.length > 0) {
      if (props.multipleSort) {
        sortState.value = initialSorts
      } else {
        // Single sort mode - only use the first default sort
        sortState.value = [initialSorts[0]]
      }
      
      // Emit initial sort state
      emit('sort', sortValue.value)
    }
  }

  return {
    sortState,
    sortValue,
    toggleSort,
    getSortState,
    getSortIndex,
    clearSort,
    setSortState,
    initializeSorting,
    initializeDefaultSorting
  }
}
