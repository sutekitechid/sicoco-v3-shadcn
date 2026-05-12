import { computed } from 'vue'
import { useVModel } from '@vueuse/core'

export function useSelectRow(props, emit) {
	// V-Model for selection
	const computedModelValue = useVModel(props, 'modelValue', emit)

	// Computed properties for selection
	const computedIsRowSelectable = computed(() => {
		return props.data?.map(row => props.isRowSelectable(row)) || []
	})

	const selectableRows = computed(() => {
		return props.data?.filter(row => props.isRowSelectable(row)) || []
	})

	// Use WeakMap for object references and Map for primitive keys
	const selectedRowsMap = computed(() => {
		const map = new Map()
		const weakMap = new WeakMap()
		
		computedModelValue.value.forEach((row, index) => {
			if (typeof row === 'object' && row !== null) {
				// For objects, prefer WeakMap with object reference
				// But also maintain Map with key for lookup
				const key = getRowKey(row, index)
				weakMap.set(row, true)
				map.set(key, row)
			} else {
				// For primitives, use Map
				map.set(row, true)
			}
		})
		
		return { map, weakMap }
	})

	const isIndeterminate = computed(() => {
		if (!computedModelValue.value || computedModelValue.value.length === 0)
			return false
		return computedModelValue.value.length < selectableRows.value.length
	})

	const isSelectAllDisabled = computed(() => {
		return selectableRows.value.length === 0
	})

	const isAnySelected = computed(() => {
		if (isSelectAllDisabled.value) {
			return false
		}
		return computedModelValue.value.length > 0
	})

	// Selection functions
	function selectAll() {
		if (!props.selectable) return

		const allSelectableRows = selectableRows.value
		const allSelected =
			allSelectableRows.length > 0 && allSelectableRows.every(row => isRowSelected(row))

		if (allSelected) {
			computedModelValue.value = []
		} else {
			computedModelValue.value = allSelectableRows
		}
	}

	function onSelectRow(value, row) {
		if (!props.selectable) return
		
		if (value && !isRowSelected(row)) {
			// Add row to selection if not already selected
			computedModelValue.value = [...computedModelValue.value, row]
			return
		}

		// Remove row from selection
		const index = findRowIndexInSelection(row)
		if (index > -1) {
			const newSelection = [...computedModelValue.value]
			newSelection.splice(index, 1)
			computedModelValue.value = newSelection
		}
	}

	// Optimized row selection check
	function isRowSelected(row) {
		const { map, weakMap } = selectedRowsMap.value

		if (typeof row !== 'object' || row === null) {
			// For primitives, check directly in Map
			return map.has(row)
		}
		
		// First try direct object reference (fastest)
		if (weakMap.has(row)) {
			return true
		}
		
		// Fallback to key-based lookup
		const key = getRowKey(row, -1) // -1 since we don't have index here
		if (key.startsWith('row-')) {
			// For index-based keys, we need to check by object reference in the map values
			for (const [, selectedRow] of map) {
				if (typeof selectedRow === 'object' && selectedRow === row) {
					return true
				}
			}
			return false
		}
		
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

	// Helper function to find row index in selected rows
	function findRowIndexInSelection(row) {
		for (let i = 0; i < computedModelValue.value.length; i++) {
			const selectedRow = computedModelValue.value[i]

			if (selectedRow === row) {
				return i
			}
			
			// Fallback to key comparison for different object instances with same data
			const rowKey = getRowKey(row, -1)
			const selectedRowKey = getRowKey(selectedRow, -1)
			if (rowKey !== `row--1` && rowKey === selectedRowKey) {
				return i
			}
		}

		return -1
	}

	return {
		// V-Model
		computedModelValue,
		
		// Computed properties
		computedIsRowSelectable,
		selectableRows,
		selectedRowsMap,
		isIndeterminate,
		isSelectAllDisabled,
		isAnySelected,
		
		// Functions
		getRowKey,
		isRowSelected,
		selectAll,
		onSelectRow,
		findRowIndexInSelection,
	}
}
