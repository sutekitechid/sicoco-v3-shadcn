<script lang="ts">
import { computed, ref, Ref, useSlots } from 'vue'
import {
	getCoreRowModel,
	useVueTable,
	VisibilityState,
} from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'
import uniqueId from 'lodash/uniqueId'
import { useVModel } from '@vueuse/core'
import { valueUpdater } from '.'
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
import SlotComponent from '../utils/SlotComponent'
import DataTableColumnVisibilityChanger from './DataTableColumnVisibilityChanger.vue'

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
		DataTableColumnVisibilityChanger,
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

		const table = useVueTable({
			get data() {
				return []
			},
			get columns() {
				// will be replaced with the actual columns
				const result: ColumnDef<unknown, any>[] = []

				for (const column of columns.value) {
					result.push({
						id: column.props.field || uniqueId(),
						header: () => column,
						cell: () => column,
					})
				}

				return result
			},
			getCoreRowModel: getCoreRowModel(),
			onColumnVisibilityChange: updaterOrValue =>
				valueUpdater(updaterOrValue, columnVisibility),
			state: {
				get columnVisibility() {
					return columnVisibility.value
				},
			},
		})

		const visibleColumns = computed(() => table.getVisibleFlatColumns())

		const isColumnSortable = (column: ColumnDef<unknown, any>) => {
			// check if sortable key is present in props object
			// @ts-ignore
			return (
				column.props.sortable === 'true' ||
				column.props.sortable === true ||
				column.props.sortable === ''
			)
		}

		// pagination
		const computedPage = useVModel(props, 'page', emit)
		const computedPerPage = useVModel(props, 'perPage', emit)

		return {
			table,
			visibleColumns,
			isColumnSortable,
			computedPage,
			computedPerPage,
		}
	},
}
</script>

<template>
	<div class="rounded-md">
		<div class="flex justify-between items-center mb-4 w-full">
			<slot name="toolbar" />
			<DataTableColumnVisibilityChanger
				:columns="table.getAllColumns()"
				class="ml-auto"
			/>
		</div>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead v-if="selectable" class="w-1">
						<Checkbox />
					</TableHead>
					<TableHead v-for="(column, index) in visibleColumns" :key="column.id">
						<div class="flex justify-between items-center">
							<SlotComponent
								:component="column.columnDef.header()"
								:props="{ index }"
								name="header"
								:scoped="true"
							/>
							<i
								v-if="isColumnSortable(column.columnDef.header())"
								class="si-sort-ascending"
							></i>
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="data.length">
					<TableRow v-for="(row, index) in data" :key="index">
						<TableCell v-if="selectable" class="w-1">
							<Checkbox />
						</TableCell>
						<TableCell
							v-for="(column, index) in visibleColumns"
							:key="column.id"
						>
							<div class="flex justify-between items-center">
								<SlotComponent
									:component="column.columnDef?.cell()"
									:props="{ row, index }"
									:scoped="true"
								/>
							</div>
						</TableCell>
					</TableRow>
				</template>
				<template v-else>
					<TableEmpty :colspan="visibleColumns.length">
						<slot name="empty" />
					</TableEmpty>
				</template>
			</TableBody>
		</Table>
		<Pagination
			v-model:page="computedPage"
			v-model:per-page="computedPerPage"
			:total="data.length"
		/>
	</div>
</template>
