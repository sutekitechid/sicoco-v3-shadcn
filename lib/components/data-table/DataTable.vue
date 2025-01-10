<script lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
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
		id: {
			type: String,
			default: '',
		},
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
		scrollY: {
			type: String,
			default: '40rem',
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

		const computedId = computed(() => props.id || `data-table__`)
		const datatableStates = JSON.parse(
			sessionStorage.getItem(computedId.value) || '{}'
		)

		const columnVisibility = ref<VisibilityState>(
			datatableStates.columnVisibility || {}
		)
		const columnPinning = ref<ColumnPinningState>(
			datatableStates.columnPinning || {}
		)
		const columnResizeMode = ref<ColumnResizeMode>('onChange')
		const columnResizeDirection = ref<ColumnResizeDirection>('ltr')

		// get all th tags from the header slots
		const tableHeaderRow = ref(null)
		const headerTagWidths = computed(() => {
			const result: number[] = []
			const headerTags = tableHeaderRow.value?.$el?.querySelectorAll('th')
			headerTags?.forEach((tag: any) => {
				result.push(tag.scrollWidth)
			})
			if (props.selectable) {
				result.shift()
			}
			if (props.showNumbering) {
				result.shift()
			}
			return result
		})

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

		// save all states to session storage
		const saveState = () => {
			const state = {
				columnVisibility: columnVisibility.value,
				columnPinning: columnPinning.value,
				columnResizeMode: columnResizeMode.value,
				columnResizeDirection: columnResizeDirection.value,
				rowSize: rowSize.value,
			}
			sessionStorage.setItem(computedId.value, JSON.stringify(state))
		}

		const table = useVueTable({
			get data() {
				return []
			},
			get columns() {
				const result: any[] = []

				for (let i = 0; i < columns.value.length; i++) {
					const column = columns.value[i]
					result.push({
						id: column.props.field || `column-${uniqueId()}`,
						header: () => column,
						cell: () => column,
						size: headerTagWidths.value[i],
					})
				}

				return result
			},
			getCoreRowModel: getCoreRowModel(),
			onColumnVisibilityChange: updaterOrValue => {
				valueUpdater(updaterOrValue, columnVisibility)
				saveState()
			},
			onSortingChange: updaterOrValue => {
				valueUpdater(updaterOrValue, sorting)
				emit('sort', sorting.value)
			},
			onColumnPinningChange: updaterOrValue => {
				valueUpdater(updaterOrValue, columnPinning), saveState()
			},
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

		const rowSize = ref(datatableStates.rowSize || COLUMN_SIZE.Medium)
		watch(rowSize, () => {
			saveState()
		})

		const pinnedColumns = computed(() => {
			return visibleColumns.value.filter(column => column.getIsPinned())
		})

		const getColumnEdgeSpacing = (column: Column<any, unknown>) => {
			// get column edege spacing based on the header width
			// get all pinned columns
			let result =
				column.getIsPinned() === PINNING_TYPE.LEFT && props.selectable ? 35 : 0
			const selectedPinnedColumns = pinnedColumns.value.filter(item => {
				return item.getIsPinned() === column.getIsPinned() && item.getIsPinned()
			})
			for (const pinnedColumn of selectedPinnedColumns) {
				if (pinnedColumn.id === column.id) {
					break
				}
				result += pinnedColumn.getSize()
			}
			return result
		}

		const getPinningStyle = (column: any) => {
			const result = {
				position: 'sticky',
				backgroundColor: 'white',
			}
			const columnEdgeSpacing = getColumnEdgeSpacing(column)
			if (column.getIsPinned() === PINNING_TYPE.LEFT) {
				return {
					left: `${columnEdgeSpacing}px`,
					...result,
				}
			}

			if (column.getIsPinned() === PINNING_TYPE.RIGHT) {
				return {
					right: `${columnEdgeSpacing}px`,
					...result,
				}
			}

			return ''
		}

		const pinningStyles = computed(() => {
			const result: any = {}
			for (const column of pinnedColumns.value) {
				result[column.id] = getPinningStyle(column)
			}
			return result
		})

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
			columnResizeMode,
			visibleHeaders,
			getHeader,
			getColumn,
			showRightClickMenu,
			rightClickMenu,
			selectedColumn,
			getNumbering,
			tableHeaderRow,
			pinningStyles,
		}
	},
}
</script>

<template>
	<div class="rounded-md relative">
		<div
			:class="[
				'overflow-auto',
				{
					'h-[31.25rem] lg:h-[37.5rem] xl:h-[40rem]': data.length,
				},
			]"
		>
			<Table>
				<TableHeader>
					<TableRow ref="tableHeaderRow">
						<TableHead
							v-if="selectable"
							:size="rowSize"
							class="w-1 sticky left-0 top-0 bg-white z-[999]"
						>
							<Checkbox
								:model-value="isAllSelected"
								:value="true"
								@click="selectAll"
							/>
						</TableHead>
						<TableHead
							v-if="showNumbering"
							:size="rowSize"
							class="text-nowrap sticky top-0 bg-white z-[20] group"
						>
							No.
						</TableHead>
						<TableHead
							v-for="(header, index) in visibleHeaders"
							:key="header.id"
							class="text-nowrap sticky top-0 bg-white z-[20] group"
							:class="[{ 'z-[999]': header.column.getIsPinned() }]"
							:style="pinningStyles[header.column.id]"
							:size="rowSize"
							@contextmenu.prevent="showRightClickMenu($event, header.column)"
						>
							<div
								class="flex gap-2 justify-between items-center"
								:style="{ width: header.getSize() - 30 + 'px' }"
							>
								<SlotComponent
									:component="getHeader(header.column)"
									:props="{ index }"
									name="header"
									:scoped="true"
								/>
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
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody class="bg-white">
					<template v-if="data.length">
						<TableRow
							v-for="(row, index) in data"
							:key="index"
							:class="['group', { 'cursor-pointer': selectable }]"
							@click="selectRow(row)"
						>
							<TableCell
								v-if="selectable"
								:size="rowSize"
								class="w-1 sticky left-0 bg-white"
							>
								<Checkbox v-model="computedModelValue" :value="row as any" />
							</TableCell>
							<TableCell
								v-if="showNumbering"
								:size="rowSize"
								class="text-center"
							>
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
									'group-hover:!bg-gray-100',
								]"
								class="z-[20]"
								:style="column.getIsPinned() ? pinningStyles[column.id] : ''"
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
		<p class="italic text-left text-xs my-2">
			Right-click on the column or header to open the table settings
		</p>
		<Pagination
			v-if="paginated"
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="data.length"
		/>
		<DataTableRightClickMenu ref="rightClickMenu">
			<DropdownItem
				class="min-w-[10rem]"
				value="hide"
				@click="selectedColumn.toggleVisibility(!selectedColumn.getIsVisible())"
			>
				Hide column
			</DropdownItem>
			<DataTableColumnPinningDropdown
				:column="selectedColumn"
				@select="selectedColumn.pin($event)"
			/>
			<DropdownItem
				v-if="selectedColumn?.getIsPinned()"
				value="Unpin"
				@click="selectedColumn.pin(false)"
			>
				Unpin column
			</DropdownItem>
			<DataTableColumnVisibilityDropdown :columns="table.getAllColumns()" />
			<DataTableColumnSizeDropdown v-model="rowSize" />
		</DataTableRightClickMenu>
	</div>
</template>
