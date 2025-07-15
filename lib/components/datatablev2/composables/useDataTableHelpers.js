/**
 * UI helper functions for DataTable
 */
export function useDataTableHelpers(allLeafColumns, groups, columns, isColumnGrouped) {
  const isLeafColumn = (fieldId) => {
    return allLeafColumns.value.some(col => col.field === fieldId)
  }

  const isGroupHeader = (col) => {
    if (!col.field) return false
    return groups.some(group => group.name === col.field)
  }

  const shouldShowDropdownSettings = (col) => {
    if (col.hasSubheader) return false
    return isLeafColumn(col.field) || isGroupHeader(col)
  }

  const shouldShowPinControls = (col) => {
    if (!col.field) return false
    
    const leafColumn = allLeafColumns.value.find(leaf => leaf.field === col.field)
    if (leafColumn) {
      return !isColumnGrouped(leafColumn.displayField || leafColumn.field)
    }
    
    return isGroupHeader(col)
  }

  return {
    isLeafColumn,
    isGroupHeader,
    shouldShowDropdownSettings,
    shouldShowPinControls
  }
}
