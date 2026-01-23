import { ref, nextTick } from 'vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

/**
 * Composable for managing DataTable column widths and virtual table synchronization
 * Handles dummy row width capture and virtual cell width calculations
 */
export function useDataTableColumnWidth(props, filteredData, allLeafColumns, sortedNodes, treeOps, getVirtualRowColumns, dummyRowGetter) {
	// ============================
	// REACTIVE STATE
	// ============================
	const dummyCellWidths = ref(new Map()) // Map<fieldId, width>

	// ============================
	// COMPUTED PROPERTIES
	// ============================

	// ============================
	// WIDTH CAPTURE FUNCTIONS
	// ============================

	// Helper function to capture cell width
	function captureCell(cell, fieldId) {
		const width = window.getComputedStyle(cell).width
		if (width && width !== 'auto') {
			dummyCellWidths.value.set(fieldId, width)
		}
	}

	// Function to capture widths from dummy row cells
	function captureDummyRowWidths() {
		const dummyRow = dummyRowGetter?.()
		if (!dummyRow) return
		
		nextTick(() => {
			// Get the actual DOM element from the Vue component
			const rowElement = dummyRow.$el || dummyRow
			if (!rowElement || typeof rowElement.querySelectorAll !== 'function') {
				console.warn('Dummy row element not found or not a DOM element')
				return
			}
			
			const cells = rowElement.querySelectorAll('td')
			dummyCellWidths.value.clear()
			
			// Capture selection cell width if exists
			if (props.selectable && cells.length > 0) {
				captureCell(cells[0], '__selection__')
			}
			
			// Capture numbering cell width if exists
			const numberingCellIndex = props.selectable ? 1 : 0
			if (props.showNumbering && cells.length > numberingCellIndex) {
				captureCell(cells[numberingCellIndex], '__numbering__')
			}
			
			// Capture data cells widths
			const dataCellStartIndex = (props.selectable ? 1 : 0) + (props.showNumbering ? 1 : 0)
			const dataCells = Array.from(cells).slice(dataCellStartIndex)
			
			dataCells.forEach(captureDataCell)
		})
	}

	// Helper function to capture data cell width with fallback
	function captureDataCell(cell, index) {
		const fieldId = cell.getAttribute('data-field')
		if (fieldId) {
			captureCell(cell, fieldId)
			return
		}
		
		if (filteredData.value && filteredData.value.length > 0) {
			const columns = getVirtualRowColumns(filteredData.value[0], 0)
			if (columns[index]) {
				const fallbackFieldId = columns[index].compositeFieldId || columns[index].field
				captureCell(cell, fallbackFieldId)
			}
		}
	}

	// Setup ResizeObserver for dummy row to auto-capture width changes
	function setupDummyRowObserver() {
		const dummyRow = dummyRowGetter?.()
		if (!dummyRow) return
		
		// Get the actual DOM element from the Vue component
		const rowElement = dummyRow.$el || dummyRow
		if (!rowElement || typeof rowElement.querySelectorAll !== 'function') {
			console.warn('Dummy row element not found or not a DOM element for ResizeObserver')
			return
		}
		
		const debouncedCapture = useDebounceFn(captureDummyRowWidths, 100)
		
		useResizeObserver(rowElement, debouncedCapture)
	}

	// ============================
	// VIRTUAL CELL WIDTH STYLE FUNCTIONS
	// ============================

	// Function to get width style for virtual cells
	function getVirtualCellWidthStyle(cell, colspan = 1) {
		if (colspan === 1) {
			const singleWidth = getSingleCellWidth(cell)
			if (singleWidth) return singleWidth
		} else {
			const colspanWidth = calculateColspanWidth(cell, colspan)
			if (colspanWidth) return colspanWidth
		}
		
		// Fallback to default width
		const defaultWidth = colspan * 120
		return createWidthStyle(`${defaultWidth}px`)
	}


	// Helper function to calculate colspan total width
	function calculateColspanWidth(cell, colspan) {
		const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
		const currentColIndex = leafColumns.findIndex(col => 
			(col.compositeFieldId || col.field) === (cell.compositeFieldId || cell.field)
		)
		
		if (currentColIndex === -1) return null
		
		let totalWidth = 0
		let unit = 'px'
		let hasValidWidths = false
		
		for (let i = 0; i < colspan && (currentColIndex + i) < leafColumns.length; i++) {
			const colFieldId = leafColumns[currentColIndex + i].compositeFieldId || 
							   leafColumns[currentColIndex + i].field
			const colWidth = dummyCellWidths.value.get(colFieldId)
			
			if (colWidth && colWidth !== 'auto') {
				const widthValue = Number.parseFloat(colWidth)
				const widthUnit = colWidth.replace(/[\d.]/g, '') || 'px'
				unit = widthUnit
				totalWidth += widthValue
				hasValidWidths = true
			}
		}
		
		if (hasValidWidths) {
			const totalWidthStr = `${totalWidth}${unit}`
			return createWidthStyle(totalWidthStr)
		}
		return null
	}

	// Function to get width style for special virtual cells (selection, numbering)
	function getSpecialVirtualCellWidthStyle(type) {
		const width = dummyCellWidths.value.get(type)
		
		if (width && width !== 'auto') {
			return createWidthStyle(width)
		}
		
		// Fallback to fixed width
		return createWidthStyle('60px')
	}

	// Helper function to create width style object
	function createWidthStyle(width) {
		return {
			width: width,
			minWidth: width,
			maxWidth: width,
			flexShrink: 0
		}
	}

	// Helper function to get single cell width
	function getSingleCellWidth(cell) {
		const fieldId = cell.compositeFieldId || cell.field
		const width = dummyCellWidths.value.get(fieldId)
		
		if (width && width !== 'auto') {
			return createWidthStyle(width)
		}
		return null
	}

	// ============================
	// RETURN COMPOSABLE API
	// ============================
	return {
		// Reactive state
		dummyCellWidths,
		
		// Functions
		captureDummyRowWidths,
		setupDummyRowObserver,
		getVirtualCellWidthStyle,
		getSpecialVirtualCellWidthStyle,
	}
}