<!--
DataTableDummyBody Component

This component renders a hidden dummy table body row that serves as a measurement reference 
for calculating column widths in the virtual scrolling implementation. 

Purpose:
- Provides accurate width measurements for all columns by rendering actual cell content
- Enables the virtual scroll container to match the exact column widths of the table header
- Maintains visual consistency between header and virtual scroll content
- Supports dynamic width calculation when content or styles change

The dummy row is completely hidden (!h-0, !py-0) but still rendered in the DOM to allow
accurate measurements of cell widths based on their actual content and styling.
-->

<template>
	<TableBody class="overflow-hidden !h-0">
		<tr
			v-if="data && data.length"
			ref="dummyRow"
			:class="getDataRowClasses(0, data[0])"
			class="border-none !h-0 overflow-hidden"
		>
			<!-- Selection Cell -->
			<TableCell
				v-if="selectable"
				:size="rowSize"
				class="text-center w-[3.75rem] bg-white font-medium sticky left-0 z-20 !h-0 !py-0 invisible"
			>
				<Checkbox
					class="mx-auto !h-0"
				/>
			</TableCell>

			<!-- Numbering Cell -->
			<TableCell
				v-if="showNumbering"
				:size="rowSize"
				class="text-center min-w-[60px] max-w-[60px] font-medium !h-0 !py-0"
			>
			</TableCell>

			<!-- Data Cells -->
			<template
				v-for="(cell, cellIndex) in getVirtualRowColumns(data[0], 0)"
				:key="`cell-${0}-${cellIndex}`"
			>
				<TableCell
					:colspan="cell.bodyColspan || 1"
					:rowspan="cell.bodyRowspan || 1"
					:size="rowSize"
					:data-field="cell.compositeFieldId || cell.field"
					:class="getDataCellClasses(cell, flattenedHeaderRows[cellIndex], flattenedHeaderRows[cellIndex + 1])"
					class="!h-0 !py-0 invisible"
					:style="{ 
						...getPinnedColumnStyles(cell.compositeFieldId)
					}"
				>
					<div class="!h-0">
						<component :is="cell.cell" :row="data[0]" :index="0" class="!h-0" />
					</div>
				</TableCell>
			</template>
		</tr>
	</TableBody>
</template>

<script setup>
import { ref } from 'vue'
import { TableBody, TableCell } from '../table'
import { Checkbox } from '../../components/checkbox'

// Props
defineProps({
	data: {
		type: Array,
		required: true
	},
	selectable: {
		type: Boolean,
		default: false
	},
	showNumbering: {
		type: Boolean,
		default: true
	},
	rowSize: {
		type: String,
		required: true
	},
	getDataRowClasses: {
		type: Function,
		required: true
	},
	getVirtualRowColumns: {
		type: Function,
		required: true
	},
	flattenedHeaderRows: {
		type: Array,
		required: true
	},
	getDataCellClasses: {
		type: Function,
		required: true
	},
	getPinnedColumnStyles: {
		type: Function,
		required: true
	}
})

// Template ref for the dummy row
const dummyRow = ref(null)

// Expose the dummy row ref so parent can access it
defineExpose({
	dummyRow
})
</script>
