<script setup lang="ts">
import type { Payment } from './columns'
import { onMounted, ref, watch, computed } from 'vue'
import { columns } from './columns'
import dummyData from './dummy-data'
import DataTable from '@/components/datatablev2/DataTable.vue'
import DataTableColumn from '@/components/datatablev2/DataTableColumn.vue'
import DataTableGroup from '@/components/datatablev2/DataTableGroupColumn.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import { TableHead, TableEmpty } from '@/components/table'

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
	const fetchedData = await getData()
	data.value = [
		...fetchedData,
	]
})

const computedData = computed(() => {
	// This is a placeholder for any computed logic you might want to add
	const newData = Array.from({ length: 10000 }).flatMap(() => data.value)
	return newData.map((item, index) => ({
		...item,
		id: `id-${index}`, // Ensure unique IDs for each row
	}))
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
const cpmkHeaders = ref([
	{
		text: 'CPMK 1 (40%)',
		value: 'cpmk_1',
		subHeaders: [
			{
				text: 'Sub CPMK 1.1',
				value: 'sub_cpmk_1_1',
				subHeaders: [
					{
						text: 'Tugas',
						value: 'tugas',
					},
					{
						text: 'Kuis',
						value: 'kuis',
					},
				],
			},
			{
				text: 'Sub CPMK 1.2',
				value: 'sub_cpmk_1_2',
				subHeaders: [
					{
						text: 'Tugas',
						value: 'tugas',
					},
					{
						text: 'Kuis',
						value: 'kuis',
					},
				],
			},
		],
	},
	{
		text: 'CPMK 2 (60%)',
		value: 'cpmk_2',
		subHeaders: [
			{
				text: 'Sub CPMK 2.1',
				value: 'sub_cpmk_2_1',
				subHeaders: [
					{
						text: 'Tugas',
						value: 'tugas',
					},
					{
						text: 'Kuis',
						value: 'kuis',
					},
				],
			},
			{
				text: 'Sub CPMK 2.2',
				value: 'sub_cpmk_2_2',
				subHeaders: [
					{
						text: 'Tugas',
						value: 'tugas',
					},
					{
						text: 'Kuis',
						value: 'kuis',
					},
				],
			},
		],
	},
])
</script>

<template>
	<div class="container p-4 mx-auto text-black bg-white">
		<button class="mb-4" @click="refreshData">Refresh Data</button>
		<DataTable
			id="example-datatable"
			v-model="selectedRows"
			v-model:page="page"
			v-model:per-page="perPage"
			:data="computedData"
			data-cy="example-datatable"
			:total="computedData.length"
			:is-row-selectable="row => row.id !== 'id-5'"
			:loading="loading"
			paginated
			selectable
			:row-class="getRowClass"
			:sticky-headers="stickyHeaders"
			:headers-text-wrap="headersTextWrap"
			show-footer
			:show-numbering="true"
			:enable-virtual-scroll="true"
			row-size="md"
			@sort="$event => console.log('sort', $event)"
			@change-page="onChangePage"
			@change-per-page="onChangePerPage"
		>

			<DataTableColumn field="id">
				<template #header> ID </template>
				<template #default="{ row }">
					{{ row.id }}
				</template>
				<template #footer>
					ID
				</template>
				<template #footer_nim_2>
					FOOTER NIM 2
				</template>
			</DataTableColumn>
			<DataTableColumn field="nim" :footer-colspan="12">
				<template #header> NIM </template>
				<template #default="{ row }">
					39032010
				</template>
				<template #footer>
					FOOTER NIM
				</template>
				<template #footer_nim_2>
					FOOTER NIM 2
				</template>
			</DataTableColumn>
				<DataTableColumn field="name" :header-text-wrap="headersTextWrap" group="user">
					<template #header> Name </template>
					<template #default="{ row }">
						{{ row.email }}
					</template>
				</DataTableColumn>
			<DataTableGroup v-for="cpmkHeader in cpmkHeaders" :key="cpmkHeader.value" :name="cpmkHeader.value" :order="1">
				<template #header>{{ cpmkHeader.text }}</template>
				<DataTableGroup v-for="subHeader in cpmkHeader.subHeaders" :key="subHeader.value" :name="subHeader.value">
					<template #header>{{ subHeader.text }}</template>
					<DataTableColumn
						v-for="subSubHeader in subHeader.subHeaders"
						:key="subSubHeader.value"
						:field="subSubHeader.value"
						:header-text-wrap="headersTextWrap"
						:group="subHeader.value"
					>
						<template #header>{{ subSubHeader.text }}</template>
						<template #default="{ row }">
							tugas/kuis
						</template>
					</DataTableColumn>
				</DataTableGroup>
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
				:body-colspan="(row) => row.amount >= 1000 ? 2 : 1"
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
				<template #default="{ row, index }"> {{ row.channel }} </template>
				<template #footer>
					Total Channel
				</template>
			</DataTableColumn>
			<DataTableColumn field="Actions" :header-text-wrap="headersTextWrap" :order="4">
				<template #header> Actions </template>
				<template #default="{ row }">
					<Dropdown>
						<DropdownItem>View</DropdownItem>
						<DropdownItem>Edit</DropdownItem>
						<DropdownItem>Delete</DropdownItem>
					</Dropdown>
				</template>
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
