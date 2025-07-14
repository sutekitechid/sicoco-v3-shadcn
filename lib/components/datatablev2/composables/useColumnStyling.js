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
  const getPinnedColumnStyles = (fieldId, organizedColumns, isColumnPinnedLeft, isColumnPinnedRight) => {
    if (!fieldId) return {}
    
    const styles = {}
    
    if (isColumnPinnedLeft(fieldId)) {
      styles.left = calculateLeftPosition(fieldId, organizedColumns.leftPinned)
    } else if (isColumnPinnedRight(fieldId)) {
      styles.right = calculateRightPosition(fieldId, organizedColumns.rightPinned)
    }
    
    return styles
  }

  // ============================
  // POSITION CALCULATIONS
  // ============================
  const calculateLeftPosition = (fieldId, leftPinnedColumns) => {
    const leftIndex = leftPinnedColumns.findIndex(col => col.field === fieldId)
    let leftPosition = 0
    
    for (let i = 0; i < leftIndex; i++) {
      leftPosition += TABLE_CONSTANTS.DEFAULT_COLUMN_WIDTH
    }
    
    return `${leftPosition}px`
  }

  const calculateRightPosition = (fieldId, rightPinnedColumns) => {
    const rightIndex = rightPinnedColumns.findIndex(col => col.field === fieldId)
    let rightPosition = 0
    
    for (let i = 0; i < rightIndex; i++) {
      rightPosition += TABLE_CONSTANTS.DEFAULT_COLUMN_WIDTH
    }
    
    return `${rightPosition}px`
  }

  return {
    // Constants
    COLUMN_WIDTH: TABLE_CONSTANTS.DEFAULT_COLUMN_WIDTH,
    
    // Styling functions
    getPinnedColumnClasses,
    getPinnedColumnStyles,
    
    // Position calculations
    calculateLeftPosition,
    calculateRightPosition
  }
}
