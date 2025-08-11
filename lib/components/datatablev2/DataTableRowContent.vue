<!--
DataTableRowContent Component

This component renders the content of a single data table row, including selection checkbox,
numbering cell, and all data cells. It's designed to be reusable across different 
rendering contexts (Virtual Scroll, Infinite Scroll, regular table body).

Purpose:
- Provides consistent row rendering across different table modes
- Handles selection, numbering, and data cell rendering
- Supports all DataTable features (pinning, styling, colspan/rowspan)
- Reduces code duplication between VirtualScroll and InfiniteScroll components
- Maintains proper event handling and accessibility

Usage:
- Used by VirtualScroll component for virtualized row rendering
- Used by DataTableInfiniteScroll component for infinite scroll rendering
- Can be extended for other table rendering modes
-->

<template>
  <!-- Selection Cell -->
  <div
    v-if="selectable"
    :class="cn(
      'flex items-center justify-center bg-white sticky left-0 z-20 flex-shrink-0 table-cell border-b',
      tableCellVariant({ size: rowSize })
    )"
    :style="{ 
      ...getSpecialVirtualCellWidthStyle('__selection__')
    }"
  >
    <Checkbox
      :model-value="isRowSelected(rowData)"
      :value="true"
      :disabled="!computedIsRowSelectable[rowIndex]"
      :data-cy="checkboxDataCy"
      class="mx-auto"
      @update:model-value="(value) => onSelectRow(value, rowData)"
    />
  </div>

  <!-- Numbering Cell -->
  <div
    v-if="showNumbering"
    :class="cn(
      'flex items-center justify-center font-medium text-muted-foreground flex-shrink-0 table-cell border-b text-center',
      tableCellVariant({ size: rowSize })
    )"
    :style="{ 
      ...getSpecialVirtualCellWidthStyle('__numbering__')
    }"
  >
    {{ getRowNumber(rowIndex) }}
  </div>

  <!-- Data Cells -->
  <template
    v-for="(cell, cellIndex) in getVirtualRowColumns(rowData, rowIndex)"
    :key="`cell-${rowIndex}-${cellIndex}`"
  >
    <div
      :data-field="cell.compositeFieldId || cell.field"
      :class="cn(
        'flex items-center flex-shrink-0 table-cell border-b',
        getDataCellClasses(cell, flattenedHeaderRows[cellIndex], flattenedHeaderRows[cellIndex + 1]),
        tableCellVariant({ size: rowSize })
      )"
      :style="{ 
        ...getPinnedColumnStyles(cell.compositeFieldId),
        ...getVirtualCellWidthStyle(cell, cell.bodyColspan || 1)
      }"
    >
      <component :is="cell.cell" :row="rowData" :index="rowIndex" />
    </div>
  </template>
</template>

<script setup>
import { cn } from '../../utils/tw-merge'
import { tableCellVariant } from '../table'
import { Checkbox } from '../../components/checkbox'

// Props
defineProps({
	// Row data
	rowData: {
		type: Object,
		required: true
	},
	rowIndex: {
		type: Number,
		required: true
	},
	// Display options
	selectable: {
		type: Boolean,
		default: false
	},
	showNumbering: {
		type: Boolean,
		default: true
	},
	// Styling
	rowSize: {
		type: String,
		required: true
	},
	checkboxDataCy: {
		type: String,
		default: ''
	},
	getVirtualRowColumns: {
		type: Function,
		required: true
	},
	getRowNumber: {
		type: Function,
		required: true
	},
	getSpecialVirtualCellWidthStyle: {
		type: Function,
		required: true
	},
	getDataCellClasses: {
		type: Function,
		required: true
	},
	getPinnedColumnStyles: {
		type: Function,
		required: true
	},
	getVirtualCellWidthStyle: {
		type: Function,
		required: true
	},
	// Selection functions
	isRowSelected: {
		type: Function,
		required: true
	},
	selectRows: {
		type: Function,
		required: true
	},
	onSelectRow: {
		type: Function,
		required: true
	},
	// Data arrays
	flattenedHeaderRows: {
		type: Array,
		required: true
	},
	computedIsRowSelectable: {
		type: Array,
		required: true
	}
})
</script>
