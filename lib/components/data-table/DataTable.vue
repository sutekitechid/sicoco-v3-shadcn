<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	TableEmpty,
} from '@/components/table'
import { Pagination } from '@/components/pagination'

import { FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		columns?: ColumnDef<TData, TValue>[]
		data?: any[]
		paginated?: boolean
		page?: number | string
		perPage?: number | string
	}>(),
	{
		columns: [],
		data: [],
		paginated: false,
		page: 1,
		perPage: 10,
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

const page = ref(0)
const perPage = ref(0)
</script>

<template>
	<div class="border rounded-md">
		<Table>
			<TableHeader>
				<TableRow
					v-for="headerGroup in table.getHeaderGroups()"
					:key="headerGroup.id"
				>
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
		<Pagination
			:page="page"
			:per-page="perPage"
			:total="data.length"
			@update:page=""
		/>
	</div>
</template>
