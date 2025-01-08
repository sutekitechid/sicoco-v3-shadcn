<script lang="ts">
import { computed, ref } from 'vue'
import { getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'
import { h, useSlots } from 'vue'
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
import uniqueId from 'lodash/uniqueId'

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
	setup(props) {
		const slots = useSlots()

		// get headers from header slots
		const columns = computed(() => {
			const defaultSlots = slots.default?.({}) || []
			console.log('defaultSlots', defaultSlots)
			// @ts-ignore
			return defaultSlots.filter(vnode => vnode.type.name === 'DataTableColumn')
		})

		const table = useVueTable({
			get data() {
				return props.data
			},
			get columns() {
				// will be replaced with the actual columns
				const result: ColumnDef<unknown, any>[] = []

				for (const column of columns.value) {
					const header = (column.children as any)?.header?.({}) || []
					result.push({
						id: `column-${uniqueId()}`,
						header: () => column,
					})
				}

				return result
			},
			getCoreRowModel: getCoreRowModel(),
		})

		console.log('columns', columns.value)
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
		return {
			table,
			visibleColumns,
			isColumnSortable,
		}
	},
}
</script>

<template>
	<div class="rounded-md">
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
		<Pagination :page="page" :per-page="perPage" :total="100" @update:page="" />
	</div>
</template>
