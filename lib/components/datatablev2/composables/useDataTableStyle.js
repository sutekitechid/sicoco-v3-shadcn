import { computed } from 'vue'
import { cn } from '../../../utils/tw-merge'
import {
	datatableHeaderVariants,
	datatableHeaderContentVariants,
	datatableDataCellVariants,
	datatableDataRowVariants
} from '../index.js'

export function useDataTableStyle(props, computedIsRowSelectable, getRowHeight) {
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
		if (!props.data || virtualRowIndex >= props.data.length) {
			console.warn('Invalid virtual row:', virtualRowIndex, 'of', props.data?.length)
			return null
		}
		return props.data[virtualRowIndex]
	}

	// Computed property untuk menghitung tinggi optimal tabel
	const maxTableHeight = computed(() => {
		if (!props.data || props.data.length === 0) {
			return '200px' // minimum height untuk empty state
		}
		
		// Hitung total content height berdasarkan jumlah rows dan row height
		let estimatedRowHeight = 48 // default row height
		try {
			estimatedRowHeight = getRowHeight(0) || 48
		} catch {
			// Fallback jika getRowHeight tidak tersedia
			estimatedRowHeight = 48
		}
		
		const totalContentHeight = props.data.length * estimatedRowHeight
		
		// Parse scrollY value (bisa dalam format seperti '40rem', '500px', dll)
		let maxHeightInPx = 640 // default fallback (40rem ≈ 640px)
		
		if (props.scrollY && props.scrollY.includes('rem')) {
			const remValue = parseFloat(props.scrollY)
			maxHeightInPx = remValue * 16 // 1rem = 16px
		} else if (props.scrollY && props.scrollY.includes('px')) {
			maxHeightInPx = parseFloat(props.scrollY)
		} else if (props.scrollY && props.scrollY.includes('vh')) {
			const vhValue = parseFloat(props.scrollY)
			maxHeightInPx = (vhValue / 100) * window.innerHeight
		}
		
		// Gunakan tinggi yang lebih kecil antara content height dan max height
		const optimalHeight = Math.min(totalContentHeight, maxHeightInPx)
		
		// Pastikan ada minimum height
		return Math.max(optimalHeight + 20, 100) + 'px'
	})

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
		
		// Computed properties
		maxTableHeight,
		
		// Cache management
		clearRowClassCaches,
		
		// Cache refs for watching
		rowClassCache,
		dataCellClassCache
	}
}
