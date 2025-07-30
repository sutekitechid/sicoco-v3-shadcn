/**
 * Composable for detecting hidden columns and their positions
 * in a DataTable component
 */
export function useHiddenColumnDetection(allLeafColumns, isColumnVisible) {
	/**
	 * Check if there's a hidden column immediately to the left of the current column
	 * @param {number} colIndex - Index of the current column in the header row
	 * @param {Array} headerRow - Array of columns in the current header row
	 * @returns {boolean} - True if there's a hidden column on the left
	 */
	function hasHiddenColumnOnLeft(colIndex, headerRow) {
		// Get the current column
		const currentColumn = headerRow[colIndex]
		if (!currentColumn || !currentColumn.field) return false
		
		// Get all leaf columns in their original order
		const allColumns = allLeafColumns.value
		if (allColumns.length === 0) return false
		
		// Find the current column's position in all leaf columns
		const currentFieldId = currentColumn.compositeFieldId || currentColumn.field
		const currentIndexInAll = allColumns.findIndex(col => 
			(col.compositeFieldId || col.field) === currentFieldId
		)
		
		if (currentIndexInAll <= 0) return false
		
		// Check the immediately preceding column
		const leftCol = allColumns[currentIndexInAll - 1]
		const leftFieldId = leftCol.compositeFieldId || leftCol.field
		
		return !isColumnVisible(leftFieldId)
	}

	/**
	 * Check if there's a hidden column immediately to the right of the current column
	 * @param {number} colIndex - Index of the current column in the header row
	 * @param {Array} headerRow - Array of columns in the current header row
	 * @returns {boolean} - True if there's a hidden column on the right
	 */
	function hasHiddenColumnOnRight(colIndex, headerRow) {
		// Get the current column
		const currentColumn = headerRow[colIndex]
		if (!currentColumn || !currentColumn.field) return false
		
		// Get all leaf columns in their original order
		const allColumns = allLeafColumns.value
		if (allColumns.length === 0) return false
		
		// Find the current column's position in all leaf columns
		const currentFieldId = currentColumn.compositeFieldId || currentColumn.field
		const currentIndexInAll = allColumns.findIndex(col => 
			(col.compositeFieldId || col.field) === currentFieldId
		)
		
		if (currentIndexInAll === -1 || currentIndexInAll >= allColumns.length - 1) return false
		
		// Check the immediately following column
		const rightCol = allColumns[currentIndexInAll + 1]
		const rightFieldId = rightCol.compositeFieldId || rightCol.field
		
		return !isColumnVisible(rightFieldId)
	}

	/**
	 * Check if the current column is the rightmost visible column
	 * @param {number} colIndex - Index of the current column in the header row
	 * @param {Array} headerRow - Array of columns in the current header row
	 * @returns {boolean} - True if this is the rightmost visible column
	 */
	function isRightmostVisibleColumn(colIndex, headerRow) {
		// Check if this is the last visible column (rightmost)
		return colIndex === headerRow.length - 1
	}

	return {
		hasHiddenColumnOnLeft,
		hasHiddenColumnOnRight,
		isRightmostVisibleColumn,
	}
}
