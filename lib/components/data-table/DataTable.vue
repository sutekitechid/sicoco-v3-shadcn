<script lang="ts">
import { computed, ref, useSlots } from 'vue'
import { getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import type {
	ColumnSort,
	VisibilityState,
	ColumnPinningState,
	ColumnResizeMode,
	ColumnResizeDirection,
	Column,
} from '@tanstack/vue-table'
import uniqueId from 'lodash/uniqueId'
import { useVModel } from '@vueuse/core'
import { valueUpdater, SORT_ORDER, COLUMN_SIZE, PINNING_TYPE } from '.'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableEmpty,
} from '../../components/table'
import { Pagination } from '../../components/pagination'
import { Checkbox } from '../../components/checkbox'
import DropdownItem from '../dropdown/DropdownItem.vue'
import SlotComponent from '../utils/SlotComponent'
import DataTableColumnVisibilityDropdown from './DataTableColumnVisibilityDropdown.vue'
import DataTableColumnSizeDropdown from './DataTableColumnSizeDropdown.vue'
import DataTableSortIcon from './DataTableSortIcon.vue'
import DataTableColumnPinningDropdown from './DataTableColumnPinningDropdown.vue'
import DataTableResizer from './DataTableResizer.vue'
import DataTableRightClickMenu from './DataTableRightClickMenu.vue'

export default {
	components: {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
		TableEmpty,
		Pagination,
		Checkbox,
		SlotComponent,
		DataTableColumnVisibilityDropdown,
		DataTableColumnSizeDropdown,
		DataTableSortIcon,
		DataTableColumnPinningDropdown,
		DataTableResizer,
		DataTableRightClickMenu,
		DropdownItem,
	},
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		paginated: {
			type: Boolean,
			default: false,
		},
		page: {
			type: Number,
			default: 1,
		},
		perPage: {
			type: [Number, String],
			default: 20,
		},
		selectable: {
			type: Boolean,
			default: false,
		},
		sortable: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Array,
			default: () => [],
		},
		showNumbering: {
			type: Boolean,
			default: true,
		},
	},
	setup(props, { emit }) {
		const slots = useSlots()

		// get headers from header slots
		const columns = computed(() => {
			const defaultSlots = slots.default?.({}) || []
			// @ts-ignore
			return defaultSlots.filter(vnode => vnode.type.name === 'DataTableColumn')
		})

		const columnVisibility = ref<VisibilityState>({})
		const columnPinning = ref<ColumnPinningState>({})
		const columnResizeMode = ref<ColumnResizeMode>('onChange')
		const columnResizeDirection = ref<ColumnResizeDirection>('ltr')

		const isColumnSortable = (column: any) => {
			// check if sortable key is present in props object
			// @ts-ignore
			return (
				column.props.sortable === 'true' ||
				column.props.sortable === true ||
				column.props.sortable === ''
			)
		}

		const initialSortingState = computed(() => {
			const result: ColumnSort[] = []

			for (const column of columns.value) {
				if (isColumnSortable(column) && column.props['default-sort']) {
					result.push({
						id: column.props.field,
						desc: column.props['default-sort'] === SORT_ORDER.DESC,
					})
				}
			}

			return result
		})

		const sorting = ref<ColumnSort[]>(initialSortingState.value)

		const table = useVueTable({
			get data() {
				return []
			},
			get columns() {
				const result: any[] = []

				for (const column of columns.value) {
					result.push({
						id: column.props.field || `column-${uniqueId()}`,
						header: () => column,
						cell: () => column,
					})
				}

				return result
			},
			getCoreRowModel: getCoreRowModel(),
			onColumnVisibilityChange: updaterOrValue =>
				valueUpdater(updaterOrValue, columnVisibility),
			onSortingChange: updaterOrValue => {
				valueUpdater(updaterOrValue, sorting)
				emit('sort', sorting.value)
			},
			onColumnPinningChange: updaterOrValue =>
				valueUpdater(updaterOrValue, columnPinning),
			columnResizeMode: columnResizeMode.value,
			columnResizeDirection: columnResizeDirection.value,
			state: {
				get columnVisibility() {
					return columnVisibility.value
				},
				get sorting() {
					return sorting.value
				},
				get columnPinning() {
					return columnPinning.value
				},
			},
		})

		const visibleColumns = computed(() => table.getVisibleFlatColumns())
		const visibleHeaders = computed(() => {
			return visibleColumns.value.map(column => {
				const header = table.getFlatHeaders().find(h => h.id === column.id)
				return header
			})
		})

		// pagination
		const computedPage = useVModel(props, 'page', emit)
		const computedPerPage = useVModel(props, 'perPage', emit)

		// handle selected rows
		const computedModelValue = useVModel(props, 'modelValue', emit)

		const isAllSelected = computed(() => {
			return (
				props.data.length > 0 &&
				props.data.every(row => computedModelValue.value.includes(row))
			)
		})

		const selectAll = () => {
			if (isAllSelected.value) {
				computedModelValue.value = []
			} else {
				computedModelValue.value = props.data
			}
		}

		const selectRow = (row: any) => {
			if (computedModelValue.value.includes(row)) {
				computedModelValue.value = computedModelValue.value.filter(
					(r: any) => r !== row
				)
			} else {
				computedModelValue.value = [...computedModelValue.value, row]
			}
		}

		const rowSize = ref(COLUMN_SIZE.Medium)

		const getPinningClass = (column: any) => {
			const stickyClass = 'sticky bg-white'
			if (column.getIsPinned() === PINNING_TYPE.LEFT) {
				return `left-10 ${stickyClass}`
			}

			if (column.getIsPinned() === PINNING_TYPE.RIGHT) {
				return `right-0 ${stickyClass}`
			}

			return ''
		}

		const getHeader = (column: Column<any, unknown>) => {
			return typeof column.columnDef?.header === 'function'
				? column.columnDef?.header(undefined)
				: null
		}

		const getColumn = (column: Column<any, unknown>) => {
			return typeof column.columnDef?.cell === 'function'
				? column.columnDef?.cell(undefined)
				: null
		}

		const rightClickMenu = ref(null)
		const selectedColumn = ref(null)
		const showRightClickMenu = (event, column) => {
			event.preventDefault()
			rightClickMenu.value.open(event.clientX, event.clientY)
			selectedColumn.value = column
		}

		const getNumbering = (index: number) => {
			return (props.page - 1) * Number(props.perPage) + index + 1
		}

		return {
			table,
			visibleColumns,
			isColumnSortable,
			computedPage,
			computedPerPage,
			computedModelValue,
			isAllSelected,
			selectAll,
			selectRow,
			rowSize,
			PINNING_TYPE,
			getPinningClass,
			columnResizeMode,
			visibleHeaders,
			getHeader,
			getColumn,
			showRightClickMenu,
			rightClickMenu,
			selectedColumn,
			getNumbering,
		}
	},
}
</script>

<template>
	<div class="rounded-md relative">
		<p class="italic text-left text-xs mb-2">
			Right-click on the column or header to open the table settings
		</p>
		<div class="h-[31.25rem] lg:h-[37.5rem] xl:h-[40rem] overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead
							v-if="selectable"
							class="w-1 sticky left-0 top-0 bg-white z-[999]"
						>
							<Checkbox
								:model-value="isAllSelected"
								:value="true"
								@click="selectAll"
							/>
						</TableHead>
						<TableHead v-if="showNumbering"> No. </TableHead>
						<TableHead
							v-for="(header, index) in visibleHeaders"
							:key="header.id"
							class="text-nowrap sticky top-0 bg-white z-[20] group"
							:class="[
								getPinningClass(header.column),
								{ 'z-[999]': header.column.getIsPinned() },
							]"
							@contextmenu.prevent="showRightClickMenu($event, header.column)"
						>
							<div class="flex gap-2 justify-between items-center">
								<SlotComponent
									:component="getHeader(header.column)"
									:props="{ index }"
									name="header"
									:scoped="true"
									:style="{ width: header.getSize() + 'px' }"
								/>
								<div class="flex">
									<DataTableSortIcon
										v-if="isColumnSortable(getHeader(header.column))"
										:column="header.column"
										@click="header.column.toggleSorting()"
									/>
								</div>
								<DataTableResizer
									:header="header"
									@mousedown="header.getResizeHandler()?.($event)"
									@touchstart="header.getResizeHandler()?.($event)"
								/>
							</div>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<template v-if="data.length">
						<TableRow
							v-for="(row, index) in data"
							:key="index"
							:class="['group', { 'cursor-pointer': selectable }]"
							@click="selectRow(row)"
						>
							<TableCell
								v-if="selectable"
								class="w-1 sticky left-0 bg-white pl-4"
							>
								<Checkbox v-model="computedModelValue" :value="row as any" />
							</TableCell>
							<TableCell v-if="showNumbering" class="text-center">
								{{ getNumbering(index) }}
							</TableCell>
							<TableCell
								v-for="(column, index) in visibleColumns"
								:key="column.id"
								:size="rowSize"
								:class="[
									{
										'!bg-gray-100':
											selectable && computedModelValue.includes(row),
									},
									getPinningClass(column),
									'group-hover:bg-gray-100',
								]"
								class="z-[20]"
								@contextmenu.prevent="showRightClickMenu($event, column)"
							>
								<div class="flex justify-between items-center">
									<SlotComponent
										:component="getColumn(column)"
										:props="{ row, index }"
										:scoped="true"
									/>
								</div>
							</TableCell>
						</TableRow>
					</template>
				</TableBody>
			</Table>
		</div>
		<template v-if="!data.length">
			<TableEmpty :colspan="visibleColumns.length">
				<slot name="empty" />
			</TableEmpty>
		</template>
		<Pagination
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="data.length"
		/>
		<DataTableRightClickMenu ref="rightClickMenu">
			<DropdownItem
				value="hide"
				@click="selectedColumn.toggleVisibility(!selectedColumn.getIsVisible())"
			>
				Hide column
			</DropdownItem>
			<DataTableColumnPinningDropdown
				:column="selectedColumn"
				@select="selectedColumn.pin($event)"
			/>
			<DataTableColumnVisibilityDropdown :columns="table.getAllColumns()" />
			<DataTableColumnSizeDropdown v-model="rowSize" />
		</DataTableRightClickMenu>
	</div>
</template>
