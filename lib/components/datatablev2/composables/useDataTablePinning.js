import { ref, nextTick } from 'vue'

/**
 * CSS-sticky column pinning for DataTable.
 * Measures actual <th> widths from DOM and returns sticky style objects.
 *
 * @param {import('vue').Ref} allLeafColumns - All leaf columns (with compositeFieldId + pin)
 * @param {Object} options - { hasSelectable, hasNumbering, tableId }
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

		pinnedOffsets.value = offsets
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
