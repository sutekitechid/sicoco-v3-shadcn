import { ref, computed, nextTick } from 'vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

/**
 * Composable for managing DataTable column widths and virtual table synchronization
 * Handles dummy row width capture and virtual cell width calculations
 */
export function useDataTableColumnWidth(props, allLeafColumns, sortedNodes, treeOps, getVirtualRowColumns) {
	// ============================
	// REACTIVE STATE
	// ============================
	const dummyRow = ref(null)
	const dummyCellWidths = ref(new Map()) // Map<fieldId, width>

	// ============================
	// COMPUTED PROPERTIES
	// ============================

	// Computed property for total table width
	const totalTableWidth = computed(() => {
		let totalWidth = 0
		
		// Add selection column width if enabled
		if (props.selectable) {
			const selectionWidth = dummyCellWidths.value.get('__selection__')
			if (selectionWidth && selectionWidth !== 'auto') {
				totalWidth += parseFloat(selectionWidth)
			} else {
				totalWidth += 60 // default selection column width
			}
		}
		
		// Add numbering column width if enabled
		if (props.showNumbering) {
			const numberingWidth = dummyCellWidths.value.get('__numbering__')
			if (numberingWidth && numberingWidth !== 'auto') {
				totalWidth += parseFloat(numberingWidth)
			} else {
				totalWidth += 60 // default numbering column width
			}
		}
		
		// Add all data columns widths
		allLeafColumns.value.forEach(col => {
			const fieldId = col.compositeFieldId || col.field
			const width = dummyCellWidths.value.get(fieldId)
			if (width && width !== 'auto') {
				totalWidth += parseFloat(width)
			} else {
				totalWidth += 150 // default column width
			}
		})
		
		return `${totalWidth}px`
	})

	// ============================
	// WIDTH CAPTURE FUNCTIONS
	// ============================

	// Function to capture widths from dummy row cells
	function captureDummyRowWidths() {
		if (!dummyRow.value) return
		
		nextTick(() => {
			// Get the actual DOM element from the Vue component
			const rowElement = dummyRow.value.$el || dummyRow.value
			if (!rowElement || typeof rowElement.querySelectorAll !== 'function') {
				console.warn('Dummy row element not found or not a DOM element')
				return
			}
			
			const cells = rowElement.querySelectorAll('td')
			dummyCellWidths.value.clear()
			
			// Capture selection cell width if exists
			if (props.selectable && cells.length > 0) {
				const selectionCell = cells[0]
				const width = window.getComputedStyle(selectionCell).width
				if (width && width !== 'auto') {
					dummyCellWidths.value.set('__selection__', width)
				}
			}
			
			// Capture numbering cell width if exists
			const numberingCellIndex = props.selectable ? 1 : 0
			if (props.showNumbering && cells.length > numberingCellIndex) {
				const numberingCell = cells[numberingCellIndex]
				const width = window.getComputedStyle(numberingCell).width
				if (width && width !== 'auto') {
					dummyCellWidths.value.set('__numbering__', width)
				}
			}
			
			// Capture data cells widths
			const dataCellStartIndex = (props.selectable ? 1 : 0) + (props.showNumbering ? 1 : 0)
			const dataCells = Array.from(cells).slice(dataCellStartIndex)
			
			dataCells.forEach((cell, index) => {
				const fieldId = cell.getAttribute('data-field')
				if (fieldId) {
					const width = window.getComputedStyle(cell).width
					if (width && width !== 'auto') {
						dummyCellWidths.value.set(fieldId, width)
					}
				} else {
					// Fallback: use column index if no data-field
					if (props.data && props.data.length > 0) {
						const columns = getVirtualRowColumns(props.data[0], 0)
						if (columns[index]) {
							const fieldId = columns[index].compositeFieldId || columns[index].field
							const width = window.getComputedStyle(cell).width
							if (width && width !== 'auto') {
								dummyCellWidths.value.set(fieldId, width)
							}
						}
					}
				}
			})
		})
	}

	// Setup ResizeObserver for dummy row to auto-capture width changes
	function setupDummyRowObserver() {
		if (!dummyRow.value) return
		
		// Get the actual DOM element from the Vue component
		const rowElement = dummyRow.value.$el || dummyRow.value
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
			// Single cell - get width directly
			const fieldId = cell.compositeFieldId || cell.field
			const width = dummyCellWidths.value.get(fieldId)
			
			if (width && width !== 'auto') {
				return {
					width: width,
					minWidth: width,
					maxWidth: width,
					flexShrink: 0
				}
			}
		} else {
			// Multiple cells (colspan) - calculate combined width
			const leafColumns = treeOps.collectLeafColumns(sortedNodes.value)
			const currentColIndex = leafColumns.findIndex(col => 
				(col.compositeFieldId || col.field) === (cell.compositeFieldId || cell.field)
			)
			
			if (currentColIndex !== -1) {
				let totalWidth = 0
				let unit = 'px'
				let hasValidWidths = false
				
				for (let i = 0; i < colspan && (currentColIndex + i) < leafColumns.length; i++) {
					const colFieldId = leafColumns[currentColIndex + i].compositeFieldId || 
									   leafColumns[currentColIndex + i].field
					const colWidth = dummyCellWidths.value.get(colFieldId)
					
					if (colWidth && colWidth !== 'auto') {
						const widthValue = parseFloat(colWidth)
						const widthUnit = colWidth.replace(/[\d.]/g, '') || 'px'
						unit = widthUnit
						totalWidth += widthValue
						hasValidWidths = true
					}
				}
				
				if (hasValidWidths) {
					const totalWidthStr = `${totalWidth}${unit}`
					return {
						width: totalWidthStr,
						minWidth: totalWidthStr,
						maxWidth: totalWidthStr,
						flexShrink: 0
					}
				}
			}
		}
		
		// Fallback to default width
		const defaultWidth = colspan * 120
		return {
			width: `${defaultWidth}px`,
			minWidth: `${defaultWidth}px`,
			maxWidth: `${defaultWidth}px`,
			flexShrink: 0
		}
	}

	// Function to get width style for special virtual cells (selection, numbering)
	function getSpecialVirtualCellWidthStyle(type) {
		const width = dummyCellWidths.value.get(type)
		
		if (width && width !== 'auto') {
			return {
				width: width,
				minWidth: width,
				maxWidth: width,
				flexShrink: 0
			}
		}
		
		// Fallback to fixed width
		return {
			width: '60px',
			minWidth: '60px',
			maxWidth: '60px',
			flexShrink: 0
		}
	}

	// ============================
	// RETURN COMPOSABLE API
	// ============================
	return {
		// Reactive state
		dummyRow,
		dummyCellWidths,
		
		// Computed properties
		totalTableWidth,
		
		// Functions
		captureDummyRowWidths,
		setupDummyRowObserver,
		getVirtualCellWidthStyle,
		getSpecialVirtualCellWidthStyle,
	}
}