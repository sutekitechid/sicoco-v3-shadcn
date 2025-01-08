<script setup lang="ts">
import type { Payment } from './columns'
import { onMounted, ref } from 'vue'
import { columns } from './columns'
import dummyData from './dummy-data'
import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumn from '@/components/data-table/DataTableColumn.vue'
import { TableHead } from '@/components/table'

const data = ref<Payment[]>([])

async function getData(): Promise<Payment[]> {
	// Fetch data from your API here.
	return dummyData
}

onMounted(async () => {
	data.value = await getData()
	// data.value = []
})

const page = ref(1)
const perPage = ref(10)
</script>

<template>
	<div class="container py-10 mx-auto text-black bg-white">
		<DataTable
			:data="data"
			:page="page"
			:per-page="perPage"
			paginated
			selectable
		>
			<DataTableColumn field="id" sortable>
				<template #header="{ index }">
					ID
					<span class="text-xs text-gray-400"
						>({{ data.length }})({{ index }})</span
					>
				</template>
			</DataTableColumn>
			<DataTableColumn field="name">
				<template #header> Name </template>
			</DataTableColumn>
			<DataTableColumn field="status">
				<template #header> Status </template>
			</DataTableColumn>
			<DataTableColumn field="amount">
				<template #header> Amount </template>
			</DataTableColumn>
			<template #body="{ props }">
				<TableCell v-for="cell in props" :key="cell.id">
					<!-- {{ cell.getContext() }} -->
					<!-- {{ cell.column.columnDef.	 }} -->
				</TableCell>
			</template>
			<template #empty>
				<p class="font-semibold text-lg">Tidak ada data Mulyono.</p>
				<p>
					Pencarian “Mulyono” tidak ditemukan pada tabel ini. Silahkan cari nama
					lain atau buat data baru.
				</p>
			</template>
		</DataTable>
	</div>
</template>
