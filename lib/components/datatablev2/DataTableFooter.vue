<template>
	<TableFooter>
		<TableRow
			v-for="footerRow in rows"
			:key="`footer-row-${footerRow.index}`"
		>
			<!-- Footer Selection Cell -->
			<TableCell
				v-if="selectable"
				:size="rowSize"
				class="text-center min-w-[60px] max-w-[60px] bg-white dark:bg-neutral-10 font-medium"
				:style="{ position: 'sticky', left: '0px', ...(sticky ? { bottom: '0px' } : {}), zIndex: 30 }"
			>
				<!-- Empty footer cell for selectable column -->
			</TableCell>

			<!-- Footer Numbering Cell -->
			<TableCell
				v-if="showNumbering"
				:size="rowSize"
				class="text-center min-w-[60px] max-w-[60px] bg-white dark:bg-neutral-10 font-medium"
				:style="getFooterNumberingStyle()"
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
					:style="getFooterCellStyle(cell)"
				>
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
</template>

<script setup>
import { cn } from '../../utils/tw-merge'
import { TableCell, TableFooter, TableRow } from '../table'
import { datatableDataCellVariants } from './index.js'

// ============================
// PROPS
// ============================
const props = defineProps({
	data: {
		type: Array,
		required: true,
	},
	rows: {
		type: Array,
		default: () => [],
	},
	selectable: {
		type: Boolean,
		default: false,
	},
	showNumbering: {
		type: Boolean,
		default: true,
	},
	rowSize: {
		type: String,
		default: 'md',
	},
	sticky: {
		type: Boolean,
		default: true,
	},
	getPinnedColumnStyle: {
		type: Function,
		required: true,
	},
})

function getFooterNumberingStyle() {
	const base = props.getPinnedColumnStyle('__numbering__')
	return props.sticky
		? { ...base, bottom: '0px', zIndex: 30 }
		: { ...base, zIndex: 30 }
}

function getFooterCellStyle(cell) {
	if (props.sticky) {
		const pinnedStyle = cell.pin ? props.getPinnedColumnStyle(cell.compositeFieldId) : {}
		return {
			...pinnedStyle,
			position: 'sticky',
			bottom: '0px',
			zIndex: cell.pin ? 30 : 20,
		}
	}
	if (cell.pin) {
		return { ...props.getPinnedColumnStyle(cell.compositeFieldId), zIndex: 30 }
	}
	return props.getPinnedColumnStyle(cell.compositeFieldId)
}

function getFooterCellClasses(cell) {
	return cn(
		datatableDataCellVariants({
			hasBorderLeft: cell.hasBorderLeft,
			hasBorderRight: cell.hasBorderRight,
			pinned: !!(cell.pin || props.sticky),
			selectable: true,
		}),
		'font-medium',
	)
}

function getFooterComponent(cell, footerKey) {
	if (cell.footerSlots && cell.footerSlots[footerKey]) {
		return cell.footerSlots[footerKey]
	}
	if (footerKey === 'footer' && cell.footer) {
		return cell.footer
	}
	return null
}
</script>
