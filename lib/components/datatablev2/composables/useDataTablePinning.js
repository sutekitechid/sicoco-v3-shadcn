import { ref, nextTick } from 'vue'

/**
 * CSS-sticky column pinning for DataTable.
 * Measures actual <th> widths from DOM and returns sticky style objects.
 *
 * @param {import('vue').Ref} allLeafColumns - All leaf columns (with compositeFieldId + pin)
 * @param {Object} options - { hasSelectable, hasNumbering, tableId, headerRows }
 */
export function useDataTablePinning(allLeafColumns, options = {}) {
	// { compositeFieldId -> { position, left/right, zIndex } }
	const pinnedOffsets = ref({})

	function refreshPinnedOffsets() {
		const tableId = options.tableId?.value || options.tableId
		const tableEl = tableId ? document.getElementById(tableId) : document

		const offsets = {}
		const leafCols = allLeafColumns.value || []

		// Separate left / right pinned
		const leftCols = leafCols.filter(c => c.pin === 'left')
		const rightCols = leafCols.filter(c => c.pin === 'right')

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

			const allLeft = groupLeaves.every(c => c.pin === 'left')
			const allRight = groupLeaves.every(c => c.pin === 'right')

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

	function scheduleRefresh() {
		nextTick(() => refreshPinnedOffsets())
	}

	return {
		getPinnedColumnStyle,
		refreshPinnedOffsets,
		scheduleRefresh,
	}
}
