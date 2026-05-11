import { computed } from 'vue'
import { useVModel } from '@vueuse/core'

export function useSelectRow(props, emit) {
	// V-Model for selection
	const computedModelValue = useVModel(props, 'modelValue', emit)

	// Computed properties for selection
	const computedIsRowSelectable = computed(() => {
		return props.data.map(row => props.isRowSelectable(row))
	})

	const selectableRows = computed(() => {
		return props.data.filter(row => props.isRowSelectable(row))
	})

	// Helper functions
	function getRowKey(row) {
		if (typeof row === 'object' && row !== null) {
			const rowKeyField = props.rowKey || 'id'
			if (rowKeyField && row[rowKeyField] !== undefined) {
				return row[rowKeyField]
			}
			return null
		}
		return row
	}

	// Row selection check
	function isRowSelected(row) {
		return computedModelValue.value.some(selectedRow => {
			if (selectedRow === row) return true
			const key = getRowKey(row)
			return key !== null && key === getRowKey(selectedRow)
		})
	}

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

		if (isIndeterminate.value) {
			const unselectedItems = selectableRows.value.filter(
				item =>
					!computedModelValue.value.includes(item) && props.isRowSelectable(item)
			)
			computedModelValue.value = [...computedModelValue.value, ...unselectedItems]
		} else if (computedModelValue.value.length === selectableRows.value.length) {
			computedModelValue.value = []
		} else {
			computedModelValue.value = selectableRows.value
		}
	}

	function onSelectRow(value, row) {
		if (!props.selectable) return
		
		if (value) {
			// Add row to selection if not already selected
			if (!isRowSelected(row)) {
				computedModelValue.value = [...computedModelValue.value, row]
			}
		} else {
			// Remove row from selection
			const index = findRowIndexInSelection(row)
			if (index > -1) {
				const newSelection = [...computedModelValue.value]
				newSelection.splice(index, 1)
				computedModelValue.value = newSelection
			}
		}
	}

	// Helper function to find row index in selected rows
	function findRowIndexInSelection(row) {
		return computedModelValue.value.findIndex(selectedRow => {
			if (selectedRow === row) return true
			const key = getRowKey(row)
			return key !== null && key === getRowKey(selectedRow)
		})
	}

	return {
		// V-Model
		computedModelValue,
		
		// Computed properties
		computedIsRowSelectable,
		selectableRows,
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
