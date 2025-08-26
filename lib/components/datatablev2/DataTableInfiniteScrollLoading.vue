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
	<div class="flex">
		<!-- Selection Cell -->
		<div
			v-if="selectable"
			:class="cn(
				baseClass,
				'sticky left-0 z-20',
				tableCellVariant({ size: rowSize })
			)"
			:style="{ 
				...getSpecialVirtualCellWidthStyle('__selection__')
			}"
		>
			<Skeleton class="h-4 w-full" />
		</div>
		<!-- Numbering Cell -->
		<div
			v-if="showNumbering"
			:class="cn(
				baseClass,
				'!text-center',
				tableCellVariant({ size: rowSize })
			)"
			:style="{ 
				...getSpecialVirtualCellWidthStyle('__numbering__')
			}"
		>
			<Skeleton class="h-4 w-full" />
		</div>
		<!-- Data Cells -->
		<template
			v-for="(cell, cellIndex) in getVirtualRowColumns(rowData, rowIndex)"
			:key="`cell-${rowIndex}-${cellIndex}`"
		>
			<div
				:data-field="cell.compositeFieldId || cell.field"
				:class="cn(
					baseClass,
					getDataCellClasses(cell, flattenedHeaderRows[cellIndex], flattenedHeaderRows[cellIndex + 1]),
					tableCellVariant({ size: rowSize }),
				)"
				:style="{ 
					...getPinnedColumnStyles(cell.compositeFieldId),
					...getVirtualCellWidthStyle(cell, cell.bodyColspan || 1)
				}"
			>
				<Skeleton class="h-4 w-full" />
			</div>
		</template>
	</div>

</template>

<script setup>
import { computed } from 'vue'
import { cn } from '../../utils/tw-merge'
import { tableCellVariant } from '../table'
import { Skeleton } from '../skeleton'

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
	getVirtualRowColumns: {
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
	// Data arrays
	flattenedHeaderRows: {
		type: Array,
		required: true
	},
})

const baseClass = computed(() => {
  return cn(
    'table-cell border-b bg-white',
  )
})
</script>
