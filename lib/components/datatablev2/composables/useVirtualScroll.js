import { ref, computed, watch } from 'vue'

/**
 * Composable for managing DataTable virtual scrolling functionality
 * Handles virtual scroll state, row height calculations, and column management for virtual rows
 */
export function useVirtualScroll(props, sortedNodes, treeOps, rowSize) {
	// ============================
	// REACTIVE STATE
	// ============================
	
	// Rowspan tracking state - tracks which columns should be skipped in each row
	const rowspanTracker = ref(new Map()) // Map<rowIndex, Set<columnIndex>>
	
	// Actual row height based on row size
	const actualRowHeight = ref(getRowheightBasedOnRowSize(rowSize.value))

	// ============================
	// COMPUTED PROPERTIES
	// ============================

	// Check if virtual scrolling should be enabled (based on scrollY and threshold)
	const shouldUseVirtualScroll = computed(() => {
		if (!props.enableVirtualScroll) return false
		// Disable virtual scroll if infinite scroll is enabled
		if (props.infiniteScroll) return false
		
		const hasScrollY = !!props.scrollY
		const hasData = props.data && props.data.length > 0
		return hasScrollY && hasData
	})

	// ============================
	// FUNCTIONS
	// ============================

	// Calculate row height based on table cell size (fallback)
	function getRowheightBasedOnRowSize(size) {
		// Base height includes border, text line height, and padding
		const baseHeight = 20 // Approximate text line height + border
		
		// Padding values based on table cell variants
		const paddingMap = {
			'sm': 8,  // p-2 = 0.5rem = 8px
			'md': 14, // p-3.5 = 0.875rem = 14px  
			'lg': 16, // p-4 = 1rem = 16px
		}
		
		const padding = paddingMap[size] || paddingMap['md']
		return baseHeight + (padding * 2) // top + bottom padding
	}

	// Function khusus untuk virtual row columns yang menangani colspan dengan width adjustment
	function getVirtualRowColumns(row, rowIndex) {
		const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
		const filteredColumns = []
		let skipNext = 0
		let actualColumnIndex = 0

		// Get columns that should be skipped in this row due to previous rowspans
		const skipColumns = rowspanTracker.value.get(rowIndex) || new Set()

		leafColumns.forEach((col) => {
			// Skip if this column should be skipped due to colspan in current row
			if (skipNext > 0) {
				skipNext--
				actualColumnIndex++
				return
			}

			// Skip if this column should be skipped due to rowspan from previous rows
			if (skipColumns.has(actualColumnIndex)) {
				actualColumnIndex++
				return
			}

			const colspan = resolveColspan(col, 'body', row, rowIndex)
			const rowspan = resolveRowspan(col, 'body', row, rowIndex)

			// Don't adjust colspan for virtual rows - use original value
			const finalColspan = colspan || 1

			const adjustedColumn = {
				...col,
				bodyColspan: finalColspan,
				bodyRowspan: rowspan,
			}

			filteredColumns.push(adjustedColumn)

			// Handle colspan - skip next columns in this row  
			if (finalColspan > 1) {
				skipNext = finalColspan - 1
			}

			// Handle rowspan - mark columns to skip in subsequent rows
			if (rowspan > 1) {
				for (let futureRow = rowIndex + 1; futureRow < rowIndex + rowspan; futureRow++) {
					if (!rowspanTracker.value.has(futureRow)) {
						rowspanTracker.value.set(futureRow, new Set())
					}
					
					// Mark columns to skip (including colspan effect)
					for (let colOffset = 0; colOffset < finalColspan; colOffset++) {
						rowspanTracker.value.get(futureRow).add(actualColumnIndex + colOffset)
					}
				}
			}

			actualColumnIndex += finalColspan
		})

		return filteredColumns
	}

	// Get dynamic row height for virtualizer
	function getRowHeight(index) {
		// Use minimum height based on row size configuration
		const baseHeight = Math.max(actualRowHeight.value || 40, 40) // Minimum 40px
		
		// Check if row has complex content that might need more height
		if (props.data && props.data[index]) {
			const row = props.data[index]
			const columns = getVirtualRowColumns(row, index)
			
			// Calculate estimated height based on content
			let maxEstimatedHeight = baseHeight
			
			for (const col of columns) {
				// Check for rowspan that might affect height
				if (col.bodyRowspan > 1) {
					maxEstimatedHeight = Math.max(maxEstimatedHeight, baseHeight * col.bodyRowspan)
				}
				
				// Check for text content length
				const cellValue = row[col.field]
				if (cellValue && typeof cellValue === 'string') {
					// Simple estimation based on text length
					if (cellValue.length > 50) {
						// Estimate lines (assuming ~40 chars per line at normal width)
						const estimatedLines = Math.ceil(cellValue.length / 40)
						const estimatedHeight = baseHeight + ((estimatedLines - 1) * 20)
						maxEstimatedHeight = Math.max(maxEstimatedHeight, estimatedHeight)
					}
				}
			}
			
			// Cap at reasonable maximum to prevent extreme values
			return Math.min(maxEstimatedHeight, baseHeight * 4)
		}
		
		return baseHeight
	}

	// Helper functions for colspan and rowspan resolution
	function resolveColspan(col, type, row = null, rowIndex = null) {
		let colspan
		if (type.startsWith('footer')) {
			colspan = col.footerColspan
		} else {
			colspan = col.bodyColspan
		}

		if (typeof colspan === 'function') {
			if (row === null || typeof row !== 'object' || typeof rowIndex !== 'number') {
				return 1
			}
			return colspan(row, rowIndex)
		}
		
		// Return 1 if colspan is undefined, null, or 0
		return colspan > 0 ? colspan : 1
	}

	function resolveRowspan(col, type, row = null, rowIndex = null) {
		let rowspan
		if (type.startsWith('footer')) {
			rowspan = col.footerRowspan
		} else {
			rowspan = col.bodyRowspan
		}

		if (typeof rowspan === 'function') {
			if (row === null || typeof row !== 'object' || typeof rowIndex !== 'number') {
				return 1
			}
			return rowspan(row, rowIndex)
		}
		return rowspan || 1
	}

	// Clear rowspan tracker when needed
	function clearRowspanTracker() {
		rowspanTracker.value.clear()
	}

	// ============================
	// WATCHERS
	// ============================

	// Clear rowspan tracker when data changes
	watch(() => props.data, clearRowspanTracker, { deep: true })

	// Update actualRowHeight when rowSize changes
	watch(rowSize, (newSize) => {
		actualRowHeight.value = getRowheightBasedOnRowSize(newSize)
	})

	// ============================
	// RETURN COMPOSABLE API
	// ============================
	return {
		// Reactive state
		rowspanTracker,
		actualRowHeight,
		
		// Computed properties
		shouldUseVirtualScroll,
		
		// Functions
		getVirtualRowColumns,
		getRowHeight,
		getRowheightBasedOnRowSize,
		clearRowspanTracker,
		resolveColspan,
		resolveRowspan,
	}
}
