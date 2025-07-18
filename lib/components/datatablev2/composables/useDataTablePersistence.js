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

  const saveColumnVisibility = (hiddenColumns) => {
    if (!props.persistState) return
    
    try {
      localStorage.setItem(
        `datatable-visibility-${props.id}`, 
        JSON.stringify(hiddenColumns)
      )
    } catch (error) {
      console.warn('Failed to save column visibility state:', error)
    }
  }

  // Migration utility to convert old visible-based format to new hidden-based format
  const migrateColumnVisibilityFormat = (savedData, allColumnFields) => {
    if (!Array.isArray(savedData) || !Array.isArray(allColumnFields)) return []
    
    // If saved data appears to be hidden columns (shorter than total columns), use as-is
    if (savedData.length <= allColumnFields.length / 2) {
      return savedData
    }
    
    // If saved data appears to be visible columns (most columns), convert to hidden
    const hiddenColumns = allColumnFields.filter(field => !savedData.includes(field))
    console.log('Migrating column visibility from visible-based to hidden-based format')
    return hiddenColumns
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
    migrateColumnVisibilityFormat,
    
    // Row size
    loadRowSize,
    saveRowSize
  }
}
