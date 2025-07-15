import { TABLE_CONSTANTS } from '../constants.js'

/**
 * Composable for handling column styling, especially for pinned columns
 */
export function useColumnStyling() {
  
  // ============================
  // STYLING CLASSES
  // ============================
  const getPinnedColumnClasses = (fieldId, type = 'cell', isColumnPinnedLeft, isColumnPinnedRight) => {
    if (!fieldId) return ''
    
    const classes = []
    const { PINNED_CLASSES } = TABLE_CONSTANTS
    
    if (isColumnPinnedLeft(fieldId)) {
      classes.push(PINNED_CLASSES.BASE, PINNED_CLASSES.LEFT)
      if (type === 'header') {
        classes.push(PINNED_CLASSES.HEADER_BORDER_LEFT)
      }
    } else if (isColumnPinnedRight(fieldId)) {
      classes.push(PINNED_CLASSES.BASE, PINNED_CLASSES.RIGHT)
      if (type === 'header') {
        classes.push(PINNED_CLASSES.HEADER_BORDER_RIGHT)
      }
    }
    
    return classes.join(' ')
  }

  // ============================
  // STYLING POSITIONS
  // ============================
  const getPinnedColumnStyles = (fieldId, organizedColumns, isColumnPinnedLeft, isColumnPinnedRight, baseOffset = 0) => {
    if (!fieldId) return {}
    
    const styles = {}
    
    if (isColumnPinnedLeft(fieldId)) {
      styles.left = calculateLeftPosition(fieldId, organizedColumns.leftPinned, baseOffset)
    } else if (isColumnPinnedRight(fieldId)) {
      styles.right = calculateRightPosition(fieldId, organizedColumns.rightPinned)
    }
    
    return styles
  }

  // ============================
  // POSITION CALCULATIONS
  // ============================
  const calculateLeftPosition = (fieldId, leftPinnedColumns, baseOffset = 0) => {
    const leftIndex = leftPinnedColumns.findIndex(col => col.field === fieldId)
    let leftPosition = baseOffset // Start with base offset for selectable/numbering columns
    
    // Calculate widths of previous pinned columns
    for (let i = 0; i < leftIndex; i++) {
      const col = leftPinnedColumns[i]
      // Use column's specified width or default
      const columnWidth = getColumnWidth(col)
      leftPosition += columnWidth
    }
    
    return `${leftPosition}px`
  }

  const calculateRightPosition = (fieldId, rightPinnedColumns) => {
    const rightIndex = rightPinnedColumns.findIndex(col => col.field === fieldId)
    let rightPosition = 0
    
    // Calculate from the right, so we need to calculate from the end
    for (let i = rightPinnedColumns.length - 1; i > rightIndex; i--) {
      const col = rightPinnedColumns[i]
      // Use column's specified width or default
      const columnWidth = getColumnWidth(col)
      rightPosition += columnWidth
    }
    
    return `${rightPosition}px`
  }

  // Helper function to get column width
  const getColumnWidth = (column) => {
    // Check if column has specified width
    if (column.width) {
      // Handle different width formats
      if (typeof column.width === 'number') {
        return column.width
      } else if (typeof column.width === 'string') {
        // Parse px values
        const pxMatch = column.width.match(/(\d+)px/)
        if (pxMatch) {
          return parseInt(pxMatch[1])
        }
      }
    }
    
    // Use default width
    return TABLE_CONSTANTS.DEFAULT_COLUMN_WIDTH
  }

  return {
    // Constants
    COLUMN_WIDTH: TABLE_CONSTANTS.DEFAULT_COLUMN_WIDTH,
    
    // Styling functions
    getPinnedColumnClasses,
    getPinnedColumnStyles,
    
    // Position calculations
    calculateLeftPosition,
    calculateRightPosition,
    getColumnWidth
  }
}
