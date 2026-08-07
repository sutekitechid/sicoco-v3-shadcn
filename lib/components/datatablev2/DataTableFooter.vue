<template>
	<TableFooter>
		<TableRow
			v-for="footerRow in dynamicFooterRows"
			:key="`footer-row-${footerRow.index}`"
		>
			<!-- Footer Selection Cell -->
			<TableCell
				v-if="selectable"
				:size="rowSize"
				class="text-center min-w-[60px] max-w-[60px] bg-white dark:bg-neutral-100 font-medium"
				:style="{ position: 'sticky', left: '0px', ...(sticky ? { bottom: '0px' } : {}), zIndex: 30 }"
			>
				<!-- Empty footer cell for selectable column -->
			</TableCell>

			<!-- Footer Numbering Cell -->
			<TableCell
				v-if="showNumbering"
				:size="rowSize"
				class="text-center min-w-[60px] max-w-[60px] bg-white dark:bg-neutral-100 font-medium"
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
import { computed } from 'vue'
import { cn } from '../../utils/tw-merge'
import { TableCell, TableFooter, TableRow } from '../table'
import { datatableDataCellVariants } from './index.js'
import { resolveSpan } from './composables/index.js'

// ============================
// PROPS
// ============================
const props = defineProps({
	data: {
		type: Array,
		required: true,
	},
	sortedLeafColumns: {
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
	getPinnedColumnShadowClass: {
		type: Function,
		required: true,
	},
})

// ============================
// FOOTER ROW DERIVATION
// ============================
// Scans sortedLeafColumns for footer/footer2/… slots and derives which <tr> rows to render.
// Each distinct footer slot key that has content becomes one footer <tr>.
const dynamicFooterRows = computed(() => {
	const footerRowsMap = new Map()

	props.sortedLeafColumns.forEach(col => {
		if (col.footerSlots) {
			Object.keys(col.footerSlots).forEach(slotName => {
				if (!slotName.startsWith('footer')) return
				let footerIndex = 1
				if (slotName !== 'footer') {
					const match = slotName.match(/footer(\d+)/)
					if (match) footerIndex = Number.parseInt(match[1])
				}
				if (!footerRowsMap.has(footerIndex)) footerRowsMap.set(footerIndex, new Set())
				footerRowsMap.get(footerIndex).add(slotName)
			})
		}
		if (col.footer) {
			if (!footerRowsMap.has(1)) footerRowsMap.set(1, new Set())
			footerRowsMap.get(1).add('footer')
		}
	})

	const footerRows = []
	const sortedIndexes = Array.from(footerRowsMap.keys()).sort((a, b) => a - b)
	sortedIndexes.forEach(footerIndex => {
		const footerKey = footerIndex === 1 ? 'footer' : `footer${footerIndex}`
		const cols = getFooterRowColumns(footerKey)
		const hasContent = cols.some(col => {
			if (col.footerSlots && col.footerSlots[footerKey]) return true
			if (footerKey === 'footer' && col.footer) return true
			return false
		})
		if (hasContent) footerRows.push({ index: footerIndex, footerKey, columns: cols })
	})
	return footerRows
})

// Builds the ordered list of footer cells for a given footer slot key (e.g. 'footer', 'footer2').
// Handles footerColspan merging the same way DataTable’s getRowColumns handles bodyColspan.
function getFooterRowColumns(footerKey) {
	const result = []
	let skipNext = 0
	props.sortedLeafColumns.forEach(col => {
		if (skipNext > 0) { skipNext--; return }
		const footerColspan = resolveSpan(col.footerColspan, footerKey)
		const footerRowspan = resolveSpan(col.footerRowspan, footerKey)
		result.push({ ...col, footerColspan, footerRowspan })
		if (footerColspan > 1) skipNext = footerColspan - 1
	})
	return result
}

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
		props.getPinnedColumnShadowClass(cell.compositeFieldId),
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
