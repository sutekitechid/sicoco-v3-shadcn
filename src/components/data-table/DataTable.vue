<script setup lang="ts">
import type { Payment } from './columns'
import { onMounted, ref, watch } from 'vue'
import { columns } from './columns'
import dummyData from './dummy-data'
import DataTable from '@/components/data-table/DataTable.vue'
import DataTableColumn from '@/components/data-table/DataTableColumn.vue'
import { TableHead, TableEmpty } from '@/components/table'
import { on } from 'events'

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
const perPage = ref(20)
const selectedRows = ref<Payment[]>([])

const loading = ref(true)
const refreshData = async () => {
	// data.value = []
	loading.value = true
	setTimeout(async () => {
		data.value = await getData()
		loading.value = false
	}, 1000)
}

function getRowClass(row: Payment) {
	return {
		'bg-red-100': row.status === 'failed',
		'bg-green-100': row.status === 'success',
	}
}

setTimeout(() => {
	loading.value = false
}, 2000)

function onChangePage(newPage: number) {
	console.log('onChangePage', newPage)
}

function onChangePerPage(newPerPage: number) {
	console.log('onChangePerPage', newPerPage)
}
</script>

<template>
	<div class="container py-10 mx-auto text-black">
		<button @click="refreshData" class="mb-4">Refresh Data</button>
		<DataTable
			:data="data"
			v-model="selectedRows"
			v-model:page="page"
			v-model:per-page="perPage"
			:total="40"
			:is-row-selectable="row => row.id !== '728ed52f'"
			:loading="loading"
			paginated
			selectable
			:row-class="getRowClass"
			@sort="$event => console.log('sort', $event)"
			@change-page="onChangePage"
			@change-per-page="onChangePerPage"
		>
			<DataTableColumn field="id" sortable>
				<template #header="{ index }">
					<div>
						ID
						<span class="text-xs text-gray-400"
							>({{ data.length }})({{ index }})</span
						>
					</div>
				</template>
				<template #default="{ row }">
					<div>
						{{ row.id }}
						<p class="font-semibold">{{ row.email }}</p>
					</div>
				</template>
			</DataTableColumn>
			<DataTableColumn field="name">
				<template #header> Name </template>
				<template #default="{ row }">
					{{ row.email }}
				</template>
			</DataTableColumn>
			<DataTableColumn field="status">
				<template #header> Status </template>
				<template #default="{ row }">
					{{ row.status }}
				</template>
			</DataTableColumn>
			<DataTableColumn field="amount" default-sort="desc">
				<template #header>
					<p class="ml-auto">Amount</p>
				</template>
				<template #default="{ row }">
					<p class="ml-auto">${{ row.amount }}</p>
				</template>
			</DataTableColumn>
			<DataTableColumn field="amount-pinned">
				<template #header> Amount Pinned </template>
				<template #default="{ row }"> ${{ row.amount }} </template>
			</DataTableColumn>
			<DataTableColumn field="Date">
				<template #header> Date </template>
				<template #default="{ row }"> {{ row.date }} </template>
			</DataTableColumn>
			<DataTableColumn field="Channel">
				<template #header> Channel </template>
				<template #default="{ row }"> {{ row.channel }} </template>
			</DataTableColumn>
			<template #empty>
				<TableEmpty class="bg-white">
					<p class="font-semibold text-lg">Tidak ada data Mulyono.</p>
					<p>
						Pencarian “Mulyono” tidak ditemukan pada tabel ini. Silahkan cari
						nama lain atau buat data baru.
					</p>
				</TableEmpty>
			</template>
			<template #footer>
				<TableHead class="bg-white" colspan="2" />
				<TableHead class="bg-white px-3" colspan="3"> Total </TableHead>
				<TableHead class="bg-white text-right px-3"> 0 </TableHead>
				<TableHead class="bg-white" colspan="3" />
			</template>
		</DataTable>
	</div>
</template>
