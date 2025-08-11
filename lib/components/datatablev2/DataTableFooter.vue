<template>
	<DataTableScrollWrapper
		v-if="showFooter && dynamicFooterRows.length > 0"
		ref="footerScrollWrapper"
		:enable-horizontal-scroll="true"
		:max-height="'auto'"
		class="border-t -mt-4"
		@scroll="(event) => $emit('scroll', event.target.scrollLeft)"
	>
		<Table :style="{ minWidth: totalTableWidth }">
			<TableFooter>
				<TableRow 
					v-for="footerRow in dynamicFooterRows" 
					:key="`footer-row-${footerRow.index}`"
				>
					<!-- Footer Selection Cell -->
					<TableCell
						v-if="selectable"
						:size="rowSize"
						class="text-center min-w-[60px] max-w-[60px] bg-white font-medium sticky left-0 z-30"
						:style="{ 
							...getSpecialVirtualCellWidthStyle('__selection__')
						}"
					>
						<!-- Empty footer cell for selectable column -->
					</TableCell>

					<!-- Footer Numbering Cell -->
					<TableCell
						v-if="showNumbering"
						:size="rowSize"
						class="text-center min-w-[60px] max-w-[60px] font-medium border-t"
						:style="{ 
							...getSpecialVirtualCellWidthStyle('__numbering__')
						}"
					>
						<!-- Empty footer cell for numbering column -->
					</TableCell>

					<!-- Footer Data Cells -->
					<template
						v-for="(cell, cellIndex) in footerRow.columns"
						:key="`footer-${footerRow.index}-cell-${cellIndex}`"
					>
						<TableCell
							:colspan="cell.footerColspan || 1"
							:rowspan="cell.footerRowspan || 1"
							:size="rowSize"
							:class="getFooterCellClasses(cell)"
							:style="{ 
								...getPinnedColumnStyles(cell.compositeFieldId),
								...getVirtualCellWidthStyle(cell, cell.footerColspan || 1)
							}"
						>
							<!-- Dynamic footer content resolution -->
							<component 
								:is="getFooterComponent(cell, footerRow.footerKey)" 
								v-if="getFooterComponent(cell, footerRow.footerKey)" 
								:data="data"
								:footer-row="footerRow.index"
							/>
						</TableCell>
					</template>
				</TableRow>
			</TableFooter>
		</Table>
	</DataTableScrollWrapper>
</template>

<script setup>
import { ref } from 'vue'
import {
	Table,
	TableCell,
	TableFooter,
	TableRow,
} from '../table'
import DataTableScrollWrapper from './DataTableScrollWrapper.vue'

// ============================
// PROPS & EMITS
// ============================
defineProps({
	// Data
	data: {
		type: Array,
		required: true
	},
	
	// Footer configuration
	showFooter: {
		type: Boolean,
		default: false
	},
	dynamicFooterRows: {
		type: Array,
		default: () => []
	},
	
	// Column configuration
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
		default: 'md'
	},
	
	// Width and styling functions
	totalTableWidth: {
		type: String,
		required: true
	},
	getSpecialVirtualCellWidthStyle: {
		type: Function,
		required: true
	},
	getVirtualCellWidthStyle: {
		type: Function,
		required: true
	},
	getFooterCellClasses: {
		type: Function,
		required: true
	},
	getPinnedColumnStyles: {
		type: Function,
		required: true
	},
	getFooterComponent: {
		type: Function,
		required: true
	}
})

defineEmits([
	'scroll'
])

// ============================
// REACTIVE STATE
// ============================
const footerScrollWrapper = ref(null)

// ============================
// EXPOSE METHODS
// ============================
defineExpose({
	footerScrollWrapper
})
</script>
