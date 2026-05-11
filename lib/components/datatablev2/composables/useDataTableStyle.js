import { cn } from '../../../utils/tw-merge'
import {
	datatableHeaderVariants,
	datatableHeaderSectionVariants,
	datatableHeaderContentVariants,
	datatableDataCellVariants,
	datatableDataRowVariants
} from '../index.js'

export function useDataTableStyle(props) {
	// Cache for performance optimization
	const rowClassCache = new Map()
	const dataCellClassCache = new Map()

	// Clear cache when data changes
	function clearRowClassCaches() {
		rowClassCache.clear()
		dataCellClassCache.clear()
	}

		// Row class cache for performance
	function getDataRowClasses(rowIndex, row, isSelectable = true) {
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
			selectable: isSelectable,
		}))

		const result = classes.join(' ')
		rowClassCache.set(cacheKey, result)
		return result
	}

	// Header section (thead) classes
	function getHeaderSectionClasses() {
		return datatableHeaderSectionVariants({ sticky: props.stickyHeaders })
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
	function getDataCellClasses(cell, headerRow = null, nextHeaderRow = null, isSelectable = true) {
		const cellHasBorderRight = cell.hasBorderRight || false
		const cacheKey = cell.pin
			? `${cell.compositeFieldId}-${isSelectable}-${cellHasBorderRight}`
			: `${cell.compositeFieldId}-${cellHasBorderRight}`

		if (dataCellClassCache.has(cacheKey)) {
			return dataCellClassCache.get(cacheKey)
		}

		let hasBorderRight = cellHasBorderRight
		if (!hasBorderRight && headerRow && headerRow.hasBorderRight) {
			if (nextHeaderRow && !nextHeaderRow.group && !nextHeaderRow.hasSubheader) {
				hasBorderRight = true
			}
		}
		
		const className = cn(
			datatableDataCellVariants({
				hasBorderLeft: cell.hasBorderLeft,
				hasBorderRight,
				pinned: !!cell.pin,
				selectable: isSelectable,
			}),
		)
		
		dataCellClassCache.set(cacheKey, className)
		return className
	}

	// Returns only the bg class for a pinned cell (selection/numbering columns)
	function getPinnedCellBgClass(isSelectable) {
		return datatableDataCellVariants({ pinned: true, selectable: isSelectable })
	}

	// Helper function to get row key for caching
	function getRowKey(row, index) {
		if (typeof row === 'object' && row !== null) {
			const rowKeyField = props.rowKey || 'id'
			if (rowKeyField && row[rowKeyField] !== undefined) {
				return row[rowKeyField]
			}
			return `row-${index}`
		}
		return row
	}

	return {
		getDataRowClasses,
		getHeaderSectionClasses,
		getHeaderCellClasses,
		getHeaderContentClasses,
		getDataCellClasses,
		getPinnedCellBgClass,
		clearRowClassCaches,
	}
}
