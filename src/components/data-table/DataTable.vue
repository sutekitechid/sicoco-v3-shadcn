<script setup lang="ts">
import type { Payment } from './columns'
import { onMounted, ref, watch } from 'vue'
import { columns } from './columns'
import dummyData from './dummy-data'
import DataTable from '@/components/datatablev2/DataTable.vue'
import DataTableColumn from '@/components/datatablev2/DataTableColumn.vue'
import DataTableGroup from '@/components/datatablev2/DataTableGroup.vue'
import { TableHead, TableEmpty } from '@/components/table'
import { on } from 'events'

defineProps({
	stickyHeaders: {
		type: Boolean,
		default: true,
	},
	headersTextWrap: {
		type: Boolean,
		default: true,
	},
})

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

const dynamicHeaders = ref([])

setTimeout(() => {
	dynamicHeaders.value = [
		{
			text: 'Dynamic Header 1',
			value: 'dynamic_header_1',
		},
		{
			text: 'Dynamic Header 2',
			value: 'dynamic_header_2',
		},
	]
}, 5000)
</script>

<template>
	<div class="container py-10 mx-auto text-black">
		<button class="mb-4" @click="refreshData">Refresh Data</button>
		<DataTable
			v-model="selectedRows"
			v-model:page="page"
			v-model:per-page="perPage"
			:data="data"
			data-cy="example-datatable"
			:total="40"
			:is-row-selectable="row => row.id !== '728ed52f'"
			:loading="loading"
			paginated
			selectable
			:row-class="getRowClass"
			:sticky-headers="stickyHeaders"
			:headers-text-wrap="headersTextWrap"
			@sort="$event => console.log('sort', $event)"
			@change-page="onChangePage"
			@change-per-page="onChangePerPage"
		>
			<DataTableGroup name="user">
				<template #header>User</template>
				<DataTableGroup name="user-details">
					<template #header>User Details</template>
					<DataTableColumn field="email" sortable :header-text-wrap="headersTextWrap" group="user-details">
						<template #header> Email </template>
						<template #default="{ row }">
							{{ row.email }}
						</template>
					</DataTableColumn>
					<DataTableColumn field="phone" sortable :header-text-wrap="headersTextWrap" group="user-details">
						<template #header> ID </template>
						<template #default="{ row }">
							{{ row.id }}
						</template>
					</DataTableColumn>
				</DataTableGroup>
				<DataTableColumn field="name" :header-text-wrap="headersTextWrap" group="user">
					<template #header> Name </template>
					<template #default="{ row }">
						{{ row.email }}
					</template>
				</DataTableColumn>
			</DataTableGroup>
			<DataTableColumn field="status" :header-text-wrap="headersTextWrap">
				<template #header> Status </template>
				<template #default="{ row }">
					{{ row.status }}
				</template>
			</DataTableColumn>
			<DataTableColumn
				field="amount"
				default-sort="desc"
				:header-text-wrap="headersTextWrap"
				:body-colspan="2"
			>
				<template #header>
					<p class="ml-auto">Amount</p>
				</template>
				<template #default="{ row }">
					<p class="ml-auto">${{ row.amount }}</p>
				</template>
			</DataTableColumn>
			<DataTableColumn
				field="amount-pinned"
				:header-text-wrap="headersTextWrap"
			>
				<template #header> Amount Pinned </template>
				<template #default="{ row }"> ${{ row.amount }} </template>
			</DataTableColumn>
			<DataTableColumn field="Date" :header-text-wrap="headersTextWrap">
				<template #header> Date </template>
				<template #default="{ row }"> {{ row.date }} </template>
			</DataTableColumn>
			<DataTableColumn
				v-for="(header, index) in dynamicHeaders"
				:key="header.value"
				:field="header.value"
				:header-text-wrap="headersTextWrap"
				:order="index + 1"
			>
				<template #header>
					{{ header.text }}
				</template>
				<template #default="{ row }">
					{{ row[header.value] }}
				</template>
			</DataTableColumn>
			<DataTableColumn field="Channel" :header-text-wrap="headersTextWrap" :order="3">
				<template #header> Channel </template>
				<template #default="{ row }"> {{ row.channel }} </template>
			</DataTableColumn>
			<template #empty>
				<TableEmpty class="bg-white" :header-text-wrap="headersTextWrap">
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
