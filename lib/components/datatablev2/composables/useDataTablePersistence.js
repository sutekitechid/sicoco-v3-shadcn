// Composable for DataTable persistence functionality

/**
 * Composable for handling DataTable state persistence
 * @param {Object} props - Component props
 * @param {string} props.id - Table identifier
 * @param {boolean} props.persistState - Whether to persist state
 */
export function useDataTablePersistence(props) {
  // ============================
  // COLUMN VISIBILITY PERSISTENCE
  // ============================
  const loadColumnVisibility = () => {
    if (!props.persistState) return null
    
    try {
      const saved = localStorage.getItem(`datatable-visibility-${props.id}`)
      if (saved !== null) {
        const parsed = JSON.parse(saved)
        return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : null
      }
    } catch (error) {
      console.warn('Failed to load column visibility state:', error)
    }
    return null
  }

  const saveColumnVisibility = (columnVisibility) => {
    if (!props.persistState) return
    
    try {
      localStorage.setItem(
        `datatable-visibility-${props.id}`, 
        JSON.stringify(columnVisibility)
      )
    } catch (error) {
      console.warn('Failed to save column visibility state:', error)
    }
  }

  // ============================
  // ROW SIZE PERSISTENCE
  // ============================
  const loadRowSize = (defaultSize) => {
    if (!props.persistState) return defaultSize
    
    try {
      const saved = localStorage.getItem(`datatable-rowsize-${props.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Return parsed value if it's valid, otherwise default
        return parsed || defaultSize
      }
    } catch (error) {
      console.warn('Failed to load row size state:', error)
    }
    return defaultSize
  }

  const saveRowSize = (rowSize) => {
    if (!props.persistState) return
    
    try {
      localStorage.setItem(
        `datatable-rowsize-${props.id}`, 
        JSON.stringify(rowSize)
      )
    } catch (error) {
      console.warn('Failed to save row size state:', error)
    }
  }

  return {
    // Column visibility
    loadColumnVisibility,
    saveColumnVisibility,
    
    // Row size
    loadRowSize,
    saveRowSize
  }
}
