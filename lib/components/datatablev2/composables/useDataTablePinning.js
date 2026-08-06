import { ref, nextTick } from 'vue'
import { PIN_DIRECTION } from '../index.js'

/**
 * CSS-sticky column pinning for DataTable.
 * Measures actual <th> widths from DOM and returns sticky style objects.
 *
 * @param {import('vue').Ref} leafColumns - Sorted leaf columns (with compositeFieldId + pin)
 * @param {Object} options - { hasSelectable, hasNumbering, tableId, headerRows }
 */
export function useDataTablePinning(leafColumns, options = {}) {
	// { compositeFieldId -> { position, left/right, zIndex } }
	const pinnedOffsets = ref({})

	/**
	 * Rebuilds the pinnedOffsets map by measuring actual DOM widths of header cells.
	 * Must be called after the table is mounted/updated (via scheduleRefresh or nextTick).
	 *
	 * Steps:
	 * 1. Measure the selection column (<th data-col="__selection__">) width, if present.
	 * 2. Measure the numbering column (<th data-col="__numbering__">) width, if present,
	 *    and assign it a sticky left offset equal to the selection column width.
	 * 3. For each left-pinned leaf column (in DOM order), assign a sticky left offset
	 *    equal to the accumulated width of all preceding pinned columns, then advance the accumulator.
	 * 4. For each right-pinned leaf column (in reverse DOM order), assign a sticky right offset
	 *    equal to the accumulated width of all columns to its right, then advance the accumulator.
	 * 5. Extend the map with group header offsets via applyGroupOffsets(), so group <th> cells
	 *    also receive sticky styles when all their leaf descendants share the same pin direction.
	 *
	 * Falls back to col.width (parsed) or 60px when the DOM element is not yet available.
	 */
	function refreshPinnedOffsets() {
		const tableId = options.tableId?.value || options.tableId
		const tableEl = tableId ? document.getElementById(tableId) : document

		const offsets = {}
		const leafCols = leafColumns.value || []

		// Separate left / right pinned
		const leftCols = leafCols.filter(c => c.pin === PIN_DIRECTION.Left)
		const rightCols = leafCols.filter(c => c.pin === PIN_DIRECTION.Right)

		// Measure selection and numbering column widths (if present)
		let selWidth = 0
		let numWidth = 0
		if (options.hasSelectable?.value) {
			const selEl = tableEl?.querySelector('th[data-col="__selection__"]')
			selWidth = selEl ? selEl.getBoundingClientRect().width : 60
		}
		if (options.hasNumbering?.value) {
			const numEl = tableEl?.querySelector('th[data-col="__numbering__"]')
			numWidth = numEl ? numEl.getBoundingClientRect().width : 60
			// Numbering column is always sticky, left = selWidth
			offsets['__numbering__'] = {
				position: 'sticky',
				left: `${selWidth}px`,
				zIndex: 20,
			}
		}

		if (leftCols.length === 0 && rightCols.length === 0) {
			applyGroupOffsets(offsets, leafCols)
			pinnedOffsets.value = offsets
			return
		}

		// Left-pinned: walk from left, accumulate offsets
		let leftOffset = selWidth + numWidth
		for (const col of leftCols) {
			const fieldId = col.compositeFieldId || col.field
			offsets[fieldId] = {
				position: 'sticky',
				left: `${leftOffset}px`,
				zIndex: 20,
			}
			const el = tableEl?.querySelector(`[data-field="${fieldId}"]`)
			const colWidth = el ? el.getBoundingClientRect().width : (col.width ? parseFloat(col.width) : 60)
			leftOffset += colWidth
		}

		// Right-pinned: walk from right, accumulate offsets
		let rightOffset = 0
		for (let i = rightCols.length - 1; i >= 0; i--) {
			const col = rightCols[i]
			const fieldId = col.compositeFieldId || col.field
			const el = tableEl?.querySelector(`[data-field="${fieldId}"]`)
			const colWidth = el ? el.getBoundingClientRect().width : (col.width ? parseFloat(col.width) : 60)
			offsets[fieldId] = {
				position: 'sticky',
				right: `${rightOffset}px`,
				zIndex: 20,
			}
			rightOffset += colWidth
		}

		applyGroupOffsets(offsets, leafCols)
		pinnedOffsets.value = offsets
	}

	/**
	 * After leaf offsets are built, extend the map with group header offsets.
	 * A group header gets sticky styles when ALL its leaf descendants share the same pin direction.
	 * - left-pinned group → left = first leaf's left offset
	 * - right-pinned group → right = last leaf's right offset
	 */
	function applyGroupOffsets(offsets, leafCols) {
		const headerRows = options.headerRows?.value
		if (!headerRows || headerRows.length === 0) return

		// Collect all unique group compositeFieldIds from header rows (cells spanning >1 leaf)
		const groupIds = new Set()
		for (const row of headerRows) {
			for (const cell of row) {
				if (cell.colspan > 1) groupIds.add(cell.compositeFieldId)
			}
		}

		for (const groupId of groupIds) {
			// Find leaf columns whose compositeFieldId starts with this group path
			const prefix = groupId + '.'
			const groupLeaves = leafCols.filter(c =>
				c.compositeFieldId === groupId ||
				c.compositeFieldId?.startsWith(prefix)
			)
			if (groupLeaves.length === 0) continue

			const allLeft = groupLeaves.every(c => c.pin === PIN_DIRECTION.Left)
			const allRight = groupLeaves.every(c => c.pin === PIN_DIRECTION.Right)

			if (allLeft) {
				// Use the leftmost leaf's left offset
				const firstLeafOffset = offsets[groupLeaves[0].compositeFieldId]
				if (firstLeafOffset?.left !== undefined) {
					offsets[groupId] = { position: 'sticky', left: firstLeafOffset.left, zIndex: 20 }
				}
			} else if (allRight) {
				// Use the rightmost leaf's right offset
				const lastLeafOffset = offsets[groupLeaves[groupLeaves.length - 1].compositeFieldId]
				if (lastLeafOffset?.right !== undefined) {
					offsets[groupId] = { position: 'sticky', right: lastLeafOffset.right, zIndex: 20 }
				}
			}
		}
	}

	function getPinnedColumnStyle(compositeFieldId) {
		if (!compositeFieldId) return {}
		return pinnedOffsets.value[compositeFieldId] || {}
	}

	// Only the outermost pinned column gets a shadow, marking the boundary
	// between the pinned area and the horizontally scrollable columns.
	function getPinnedColumnShadowClass(compositeFieldId) {
		if (!compositeFieldId) return ''

		const leafCols = leafColumns.value || []
		const leftCols = leafCols.filter(col => col.pin === PIN_DIRECTION.Left)
		const rightCols = leafCols.filter(col => col.pin === PIN_DIRECTION.Right)
		const leftBoundary = leftCols[leftCols.length - 1]
		const rightBoundary = rightCols[0]

		if (isPinnedBoundary(compositeFieldId, leftBoundary, leafCols, PIN_DIRECTION.Left)) {
			return 'shadow-2 datatable-pinned-shadow-right'
		}
		if (isPinnedBoundary(compositeFieldId, rightBoundary, leafCols, PIN_DIRECTION.Right)) {
			return 'shadow-2 datatable-pinned-shadow-left'
		}
		return ''
	}

	function isPinnedBoundary(compositeFieldId, boundary, leafCols, direction) {
		if (!boundary) return false
		const boundaryId = boundary.compositeFieldId || boundary.field
		if (compositeFieldId === boundaryId) return true

		// Group headers are sticky only when all descendants share the pin direction.
		const groupPrefix = `${compositeFieldId}.`
		const groupCols = leafCols.filter(col =>
			(col.compositeFieldId || col.field)?.startsWith(groupPrefix)
		)
		return groupCols.length > 0 &&
			groupCols.every(col => col.pin === direction) &&
			boundaryId.startsWith(groupPrefix)
	}

	function scheduleRefresh() {
		nextTick(() => refreshPinnedOffsets())
	}

	return {
		getPinnedColumnStyle,
		getPinnedColumnShadowClass,
		refreshPinnedOffsets,
		scheduleRefresh,
	}
}
