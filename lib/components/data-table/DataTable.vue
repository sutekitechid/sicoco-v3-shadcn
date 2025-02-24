<script lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import type {
	ColumnSort,
	VisibilityState,
	ColumnPinningState,
	Column,
} from '@tanstack/vue-table'
import uniqueId from 'lodash/uniqueId'
import isEqual from 'lodash/isEqual'
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
	TableFooter,
} from '../../components/table'
import { Pagination } from '../../components/pagination'
import { Checkbox } from '../../components/checkbox'
import DropdownItem from '../dropdown/DropdownItem.vue'
import SlotComponent from '../utils/SlotComponent'
import DataTableColumnVisibilityDropdown from './DataTableColumnVisibilityDropdown.vue'
import DataTableColumnSizeDropdown from './DataTableColumnSizeDropdown.vue'
import DataTableSortIcon from './DataTableSortIcon.vue'
import DataTableColumnPinningDropdown from './DataTableColumnPinningDropdown.vue'
import DataTableRightClickMenu from './DataTableRightClickMenu.vue'
import DataTableLoading from './DataTableLoading.vue'

export default {
	components: {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow,
		TableEmpty,
		TableFooter,
		Pagination,
		Checkbox,
		SlotComponent,
		DataTableColumnVisibilityDropdown,
		DataTableColumnSizeDropdown,
		DataTableSortIcon,
		DataTableColumnPinningDropdown,
		DataTableRightClickMenu,
		DropdownItem,
		DataTableLoading,
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
		total: {
			type: Number,
			default: 0,
		},
		isRowSelectable: {
			type: Function,
			default: () => () => true,
		},
		rowClass: {
			type: Function,
			default: () => () => ({}),
		},
		loading: {
			type: Boolean,
			default: false,
		},
		stickyHeaders: {
			type: Boolean,
			default: true,
		},
		headersTextWrap: {
			type: Boolean,
			default: true,
		},
		dataCy: {
			type: String,
			default: ''
		},
		checkboxDataCy: {
			type: String,
			default: 'datatable-check'
		},
		checkboxAllDataCy: {
			type: String,
			default: 'datatable-check-all'
		}
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

				for (const column of columns.value) {
					result.push({
						id: column.props.field || `column-${uniqueId()}`,
						header: () => column,
						cell: () => column,
						...column.props,
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
				valueUpdater(updaterOrValue, columnPinning)
				saveState()
			},
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

		const selectableRows = computed(() => {
			return props.data.map(row => props.isRowSelectable(row))
		})

		const isRowSelected = (row: any) => {
			return computedModelValue.value.findIndex(r => isEqual(r, row)) > -1
		}

		const selectedRows = computed(() => {
			return props.data.map(row => isRowSelected(row))
		})

		const isSelectAllDisabled = computed(() => {
			return selectableRows.value.every(row => !row)
		})

		const isAllSelected = computed(() => {
			if (isSelectAllDisabled.value) {
				return false
			}
			const _selectableRows = props.data.filter(
				(_, index) => selectableRows.value[index]
			)
			return (
				props.data.length > 0 &&
				_selectableRows.every(row => isRowSelected(row))
			)
		})

		const selectAll = () => {
			if (isAllSelected.value) {
				computedModelValue.value = []
			} else {
				// check if row is selectable
				const _selectableRows = props.data.filter(
					(_, index) => selectableRows.value[index]
				)
				computedModelValue.value = _selectableRows
			}
		}

		const selectRow = (row: any) => {
			if (!props.isRowSelectable(row)) {
				return
			}
			if (isRowSelected(row)) {
				computedModelValue.value = computedModelValue.value.filter(
					(r: any) => !isEqual(r, row)
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
				zIndex: 1,
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

		const selectedColumn = ref(null)
		const showRightClickMenu = (column: Column<any, unknown>) => {
			selectedColumn.value = column
		}

		const getNumbering = (index: number) => {
			const page = props.page || 1
			return (page - 1) * Number(props.perPage) + index + 1
		}

		const resetTable = () => {
			columnVisibility.value = {}
			columnPinning.value = {}
			rowSize.value = COLUMN_SIZE.Medium
			saveState()
		}

		const isTableStateEmpty = computed(() => {
			return (
				Object.keys(columnVisibility.value).length === 0 &&
				Object.keys(columnPinning.value).length === 0 &&
				rowSize.value === COLUMN_SIZE.Medium
			)
		})

		const totalDataColumn = computed(() => {
			let result = visibleColumns.value.length

			if (props.selectable) {
				result++
			}

			if (props.showNumbering) {
				result++
			}

			return result
		})

		function onChangePage(page: number) {
			emit('change-page', page)
		}

		function onChangePerPage(perPage: number) {
			emit('change-per-page', perPage)
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
			visibleHeaders,
			getHeader,
			getColumn,
			showRightClickMenu,
			selectedColumn,
			getNumbering,
			pinningStyles,
			resetTable,
			isTableStateEmpty,
			selectableRows,
			selectedRows,
			totalDataColumn,
			isSelectAllDisabled,
			onChangePage,
			onChangePerPage,
		}
	},
}
</script>

<template>
	<div class="rounded-md relative" :id="id" :data-cy="dataCy">
		<div
			v-if="data.length || loading"
			:class="['overflow-auto']"
			:style="{ maxHeight: scrollY }"
		>
			<Table>
				<TableHeader :sticky="stickyHeaders">
					<DataTableRightClickMenu>
						<template #trigger>
							<TableRow ref="tableHeaderRow" class="!animate-none">
								<TableHead
									v-if="selectable"
									:size="rowSize"
									class="w-1 left-0 bg-white"
									style="z-index: 2"
									@contextmenu.stop
								>
									<Checkbox
										:data-cy="checkboxAllDataCy"
										:model-value="isAllSelected"
										:value="true"
										:disabled="isSelectAllDisabled"
										@click="selectAll"
									/>
								</TableHead>
								<TableHead
									v-if="showNumbering"
									:size="rowSize"
									class="bg-white group"
									@contextmenu.stop
								>
									No.
								</TableHead>
								<TableHead
									v-for="(header, index) in visibleHeaders"
									:key="header.id"
									class="bg-white group hover:!bg-gray-100"
									:style="{
										...pinningStyles[header.column.id],
										zIndex: header.column.getIsPinned() ? 2 : 1,
									}"
									:text-wrap="header.column.columnDef['header-text-wrap']"
									:size="rowSize"
									@contextmenu="showRightClickMenu(header.column)"
								>
									<div class="flex gap-2 justify-between items-center">
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
								</TableHead>
							</TableRow>
						</template>
						<DropdownItem
							class="min-w-[10rem]"
							value="hide"
							@click="
								selectedColumn.toggleVisibility(!selectedColumn.getIsVisible())
							"
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
						<DataTableColumnVisibilityDropdown
							:columns="table.getAllColumns()"
						/>
						<DataTableColumnSizeDropdown v-model="rowSize" />
						<DropdownItem
							v-if="!isTableStateEmpty"
							value="reset"
							@click="resetTable"
						>
							Reset table
						</DropdownItem>
					</DataTableRightClickMenu>
				</TableHeader>
				<TableBody class="bg-white">
					<template v-if="loading">
						<DataTableLoading :total-data="totalDataColumn" />
					</template>
					<template v-else-if="data.length">
						<TableRow
							v-for="(row, index) in data"
							:key="index"
							:class="[
								'group',
								{
									...rowClass(row),
									'cursor-pointer': selectable,
									'cursor-not-allowed text-neutral-60': !selectableRows[index],
								},
							]"
							:style="`animation-delay: ${index * 0.02}s;`"
							@click="selectRow(row)"
						>
							<TableCell
								v-if="selectable"
								:size="rowSize"
								class="w-1 left-0"
							>
								<Checkbox
									:data-cy="checkboxDataCy"
									:model-value="selectedRows[index]"
									:value="true"
									:disabled="!selectableRows[index]"
								/>
							</TableCell>
							<TableCell
								v-if="showNumbering"
								:size="rowSize"
								class="text-center"
								:class="[
									{
										'!bg-neutral-10': selectable && selectedRows[index],
									},
									'group-hover:!bg-neutral-10',
								]"
							>
								{{ getNumbering(index) }}
							</TableCell>
							<TableCell
								v-for="column in visibleColumns"
								:key="column.id"
								:size="rowSize"
								:class="[
									{
										'!bg-neutral-10': selectable && selectedRows[index],
									},
									'group-hover:!bg-neutral-10',
								]"
								:style="column.getIsPinned() ? pinningStyles[column.id] : ''"
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
				<TableFooter>
					<tr>
						<slot name="footer"></slot>
					</tr>
				</TableFooter>
			</Table>
		</div>
		<template v-else>
			<slot name="empty" />
		</template>
		<p v-if="data.length" class="italic text-left text-xs my-2">
			Right-click on the header to open the table settings
		</p>
		<Pagination
			v-if="paginated && data.length"
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="total"
			@change-page="onChangePage"
			@change-per-page="onChangePerPage"
		/>
	</div>
</template>
