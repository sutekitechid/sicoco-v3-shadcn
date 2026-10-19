import { computed, toRaw } from 'vue'
import { useVModel } from '@vueuse/core'

export function useSelectRow(props, emit) {
	// V-Model for selection
	const computedModelValue = useVModel(props, 'modelValue', emit)

	// Computed properties for selection
	const computedIsRowSelectable = computed(() => {
		return getAllRows().map(row => props.isRowSelectable(row))
	})

	const selectableRows = computed(() => {
		return getAllRows().filter(row => props.isRowSelectable(row))
	})

	const selectableLeafRows = computed(() => getSelectableLeafRows())

	// Use WeakMap for object references and Map for primitive keys
	const selectedRowsMap = computed(() => {
		const map = new Map()
		const weakMap = new WeakMap()
		
		computedModelValue.value.forEach((row, index) => {
			if (typeof row === 'object' && row !== null) {
				// For objects, prefer WeakMap with object reference
				// But also maintain Map with key for lookup
				const key = getRowKey(row, index)
				weakMap.set(toRaw(row), true)
				map.set(key, row)
			} else {
				// For primitives, use Map
				map.set(row, true)
			}
		})
		
		return { map, weakMap }
	})

	const isIndeterminate = computed(() => {
		const rows = selectableLeafRows.value
		if (rows.length === 0) return false
		const selectedCount = rows.filter(row => isRowSelected(row)).length
		return selectedCount > 0 && selectedCount < rows.length
	})

	const isSelectAllDisabled = computed(() => {
		return selectableLeafRows.value.length === 0
	})

	const isAnySelected = computed(() => {
		return selectableLeafRows.value.some(row => isRowSelected(row))
	})

	// Selection functions
	function selectAll() {
		if (!props.selectable) return

		const allSelectableRows = selectableRows.value
		const allSelectableLeafRows = selectableLeafRows.value
		const allSelected =
			allSelectableLeafRows.length > 0 && allSelectableLeafRows.every(row => isRowSelected(row))

		if (allSelected) {
			computedModelValue.value = []
		} else {
			computedModelValue.value = allSelectableRows
		}
	}

	function onSelectRow(value, row) {
		if (!props.selectable) return

		const branchRows = getSelectableBranchRows(row)
		if (branchRows.length === 0) return

		if (value) {
			const selectedRows = [...computedModelValue.value]
			branchRows.forEach(branchRow => {
				if (!isRowSelected(branchRow)) selectedRows.push(branchRow)
			})
			computedModelValue.value = selectedRows
			return
		}

		const rowsToRemove = [...branchRows, ...getAncestorRows(row)]
		computedModelValue.value = computedModelValue.value.filter(selectedRow =>
			!rowsToRemove.some(rowToRemove => isSameRow(selectedRow, rowToRemove))
		)
	}

	function getRowSelectionState(row) {
		const branchRows = getSelectableBranchRows(row)
		const childRows = branchRows.filter(branchRow => !isSameRow(branchRow, row))
		if (childRows.length === 0) {
			return {
				selected: isRowSelected(row),
				indeterminate: false,
			}
		}

		const selectedChildCount = childRows.filter(childRow => isRowSelected(childRow)).length
		return {
			selected: selectedChildCount === childRows.length,
			indeterminate: selectedChildCount > 0 && selectedChildCount < childRows.length,
		}
	}

	function isRowSelectionDisabled(row) {
		return getSelectableBranchRows(row).length === 0
	}

	// Optimized row selection check
	function isRowSelected(row) {
		const { map, weakMap } = selectedRowsMap.value

		if (typeof row !== 'object' || row === null) {
			// For primitives, check directly in Map
			return map.has(row)
		}
		
		// First try direct object reference (fastest)
		if (weakMap.has(toRaw(row))) {
			return true
		}
		
		// Fallback to key-based lookup
		const key = getRowKey(row, -1) // -1 since we don't have index here
		if (!isRowKeyUnique(row)) return false
		return map.has(key)
	}

	// Helper functions
	function getRowKey(row, index) {
		if (typeof row !== 'object' || row === null) {
			// For primitives, use the value itself as key
			return row
		}

		// Try to use specified key field first
		const rowKeyField = props.rowKey || 'id'
		if (rowKeyField && row[rowKeyField] !== undefined) {
			return row[rowKeyField]
		}
		// Fallback to index-based key for objects without primary key
		return `row-${index}`
	}

	function getAllRows() {
		const rows = []
		function appendRows(sourceRows) {
			if (!Array.isArray(sourceRows)) return
			sourceRows.forEach(row => {
				rows.push(row)
				if (props.detailed) appendRows(getRowChildren(row))
			})
		}

		appendRows(props.data)
		return rows
	}

	function getSelectableBranchRows(row) {
		const rows = []
		function appendRows(currentRow) {
			if (props.isRowSelectable(currentRow)) rows.push(currentRow)
			if (!props.detailed) return
			getRowChildren(currentRow).forEach(appendRows)
		}

		appendRows(row)
		return rows
	}

	function getSelectableLeafRows() {
		const rows = []
		function appendRows(sourceRows) {
			if (!Array.isArray(sourceRows)) return false
			let hasSelectableChild = false
			sourceRows.forEach(row => {
				const children = props.detailed ? getRowChildren(row) : []
				const hasSelectableDescendant = appendRows(children)
				if (!hasSelectableDescendant && props.isRowSelectable(row)) rows.push(row)
				if (hasSelectableDescendant || props.isRowSelectable(row)) hasSelectableChild = true
			})
			return hasSelectableChild
		}

		appendRows(props.data)
		return rows
	}

	function getRowChildren(row) {
		const children = row?.[props.childrenKey]
		return Array.isArray(children) ? children : []
	}

	function getAncestorRows(targetRow) {
		const ancestors = []
		function findAncestors(rows, currentAncestors = []) {
			if (!Array.isArray(rows)) return false
			for (const row of rows) {
				if (isSameRow(row, targetRow)) {
					ancestors.push(...currentAncestors)
					return true
				}
				if (findAncestors(getRowChildren(row), [...currentAncestors, row])) return true
			}
			return false
		}

		findAncestors(props.data)
		return ancestors
	}

	function isSameRow(firstRow, secondRow) {
		if (firstRow === secondRow || toRaw(firstRow) === toRaw(secondRow)) return true
		if (typeof firstRow !== 'object' || firstRow === null) return false
		if (typeof secondRow !== 'object' || secondRow === null) return false
		if (!isRowKeyUnique(firstRow) || !isRowKeyUnique(secondRow)) return false
		const firstKey = getRowKey(firstRow, -1)
		const secondKey = getRowKey(secondRow, -1)
		return firstKey === secondKey
	}

	function isRowKeyUnique(row) {
		const key = getRowKey(row, -1)
		if (key === 'row--1') return false
		return getAllRows().filter(candidate => getRowKey(candidate, -1) === key).length === 1
	}

	// Helper function to find row index in selected rows
	function findRowIndexInSelection(row) {
		for (let i = 0; i < computedModelValue.value.length; i++) {
			const selectedRow = computedModelValue.value[i]

			if (selectedRow === row) {
				return i
			}
			
			if (isSameRow(selectedRow, row)) return i
		}

		return -1
	}

	return {
		// V-Model
		computedModelValue,
		
		// Computed properties
		computedIsRowSelectable,
		selectableRows,
		selectableLeafRows,
		selectedRowsMap,
		isIndeterminate,
		isSelectAllDisabled,
		isAnySelected,
		getRowSelectionState,
		isRowSelectionDisabled,
		
		// Functions
		getRowKey,
		isRowSelected,
		selectAll,
		onSelectRow,
		findRowIndexInSelection,
	}
}
