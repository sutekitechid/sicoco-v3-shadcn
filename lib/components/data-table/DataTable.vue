<script setup lang="ts" generic="TData, TValue">
import { computed, ref } from 'vue'
import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import type { ColumnDef } from '@tanstack/vue-table'
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

const props = withDefaults(
	defineProps<{
		columns?: ColumnDef<TData, TValue>[]
		data?: any[]
		paginated?: boolean
		page?: number
		perPage?: number | string
		selectable?: boolean
		modelValue?: any[]
	}>(),
	{
		columns: () => [],
		data: () => [],
		paginated: false,
		page: 1,
		perPage: 10,
		selectable: false,
	}
)

const table = useVueTable({
	get data() {
		return props.data
	},
	get columns() {
		return props.columns
	},
	getCoreRowModel: getCoreRowModel(),
})

const visibleColumns = computed(() => table.getVisibleFlatColumns())
</script>

<template>
	<div class="rounded-md">
		<Table>
			<TableHeader>
				<TableRow
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id"
				>
					<TableHead v-if="props.selectable" class="w-1">
						<Checkbox />
					</TableHead>
					<TableHead v-for="header in headerGroup.headers" :key="header.id">
						<FlexRender
							v-if="!header.isPlaceholder"
							:render="header.column.columnDef.header"
							:props="header.getContext()"
						/>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows?.length">
					<TableRow
						v-for="row in table.getRowModel().rows"
						:key="row.id"
						:data-state="row.getIsSelected() ? 'selected' : undefined"
					>
						<TableCell v-if="props.selectable" class="w-1">
							<Checkbox />
						</TableCell>
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
							<FlexRender
								:render="cell.column.columnDef.cell"
								:props="cell.getContext()"
							/>
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
