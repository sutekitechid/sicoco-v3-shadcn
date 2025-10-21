import { cn } from '../../../utils/tw-merge'
import {
	datatableHeaderVariants,
	datatableHeaderContentVariants,
	datatableDataCellVariants,
	datatableDataRowVariants
} from '../index.js'

export function useDataTableStyle(props, filteredData, computedIsRowSelectable) {
	// Cache for performance optimization
	const rowClassCache = new Map()
	const dataCellClassCache = new Map()

	// Clear cache when data changes
	function clearRowClassCaches() {
		rowClassCache.clear()
		dataCellClassCache.clear()
	}

		// Row class cache for performance
	function getDataRowClasses(rowIndex, row) {
		const rowKey = getRowKey(row, rowIndex)
		const cacheKey = `${rowIndex}-${rowKey}-${props.selectable}`
		
		if (rowClassCache.has(cacheKey)) {
			return rowClassCache.get(cacheKey)
		}
		
		const classes = []
		
		if (props.rowClass) {
			if (typeof props.rowClass === 'function') {
				classes.push(props.rowClass(row, rowIndex))
			} else {
				classes.push(props.rowClass)
			}
		}
		
		if (props.selectable) {
			classes.push('cursor-pointer')
		}

		classes.push(datatableDataRowVariants({
			selectable: computedIsRowSelectable.value[rowIndex],
		}))

		const result = classes.join(' ')
		rowClassCache.set(cacheKey, result)
		return result
	}

	// Header cell classes
	function getHeaderCellClasses(col) {
		return cn(
			datatableHeaderVariants({
				hasSubheader: col.hasSubheader,
				hasBorderLeft: col.hasBorderLeft,
				hasBorderRight: col.hasBorderRight,
				isSticky: props.stickyHeaders,
			}),
		)
	}

	// Header content classes
	function getHeaderContentClasses(col) {
		return cn(
			'flex justify-between w-full items-center group',
			datatableHeaderContentVariants({
				hasSubheader: col.hasSubheader,
			})
		)
	}

	// Data cell classes with caching
	function getDataCellClasses(cell, headerRow = null, nextHeaderRow = null) {
		if (dataCellClassCache.has(cell.compositeFieldId)) {
			return dataCellClassCache.get(cell.compositeFieldId)
		}
		
		let hasBorderRight = false
		if (headerRow && headerRow.hasBorderRight) {
			if (nextHeaderRow && !nextHeaderRow.group && !nextHeaderRow.hasSubheader) {
				hasBorderRight = true
			}
		}
		
		const className = cn(
			datatableDataCellVariants({
				hasBorderLeft: cell.hasBorderLeft,
				hasBorderRight,
			}),
		)
		
		dataCellClassCache.set(cell.compositeFieldId, className)
		return className
	}

	// Virtual row classes
	function getVirtualRowClass(row) {
		return cn(
			'group transition-colors w-full left-0 items-stretch min-w-max table-row',
			getDataRowClasses(row.index, getVirtualRowData(row.index)),
			props.selectable && 'cursor-pointer',
		)
	}

	// Helper function to get row key for caching
	function getRowKey(row, index) {
		if (typeof row === 'object' && row !== null) {
			// Try to use specified key field first
			const rowKeyField = props.rowKey || 'id'
			if (rowKeyField && row[rowKeyField] !== undefined) {
				return row[rowKeyField]
			}
			// Fallback to index-based key for objects without primary key
			return `row-${index}`
		}
		// For primitive values, use the value itself
		return row
	}

	// Get virtual row data safely
	function getVirtualRowData(virtualRowIndex) {
		if (!filteredData.value || virtualRowIndex >= filteredData.value.length) {
			console.warn('Invalid virtual row:', virtualRowIndex, 'of', filteredData.value?.length)
			return null
		}
		return filteredData.value[virtualRowIndex]
	}

	return {
		// Styling functions
		getDataRowClasses,
		getHeaderCellClasses,
		getHeaderContentClasses,
		getDataCellClasses,
		getVirtualRowClass,
		
		// Helper functions
		getRowKey,
		getVirtualRowData,
		
		// Cache management
		clearRowClassCaches,
		
		// Cache refs for watching
		rowClassCache,
		dataCellClassCache
	}
}
