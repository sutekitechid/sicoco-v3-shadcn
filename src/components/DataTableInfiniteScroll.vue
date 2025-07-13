<template>
	<div>
		table coba infinite scroll {{ tableData.length }} {{ page }} asd
		<DataTable
			v-model:page="page"
			:data="tableData"
			:total="totalData"
			:loading="loading"
			infinite-scroll
		>
			<DataTableColumn field="name">
				<template #header> Name </template>
				<template #default="{ row }">
					<span>{{ row.name }}</span>
				</template>
			</DataTableColumn>
			<DataTableColumn field="id">
				<template #header> ID </template>
				<template #default="{ row }">
					<span>{{ row.id }}</span>
				</template>
			</DataTableColumn>
		</DataTable>
	</div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import DataTable from '@/components/datatablev2/DataTable.vue'
import DataTableColumn from '@/components/datatablev2/DataTableColumn.vue'

console.log('Datatablecolumn', DataTableColumn)

export default {
	components: {
		DataTable,
		DataTableColumn,
	},
	setup() {
		// State
		const tableData = ref([])
		const page = ref(1)
		const totalData = ref(100)
		const loading = ref(false) // Loading state

		// Simulasi API Fetch
		const fetchDataFromAPI = async page => {
			const data = Array.from({ length: 20 }, (_, i) => ({
				id: i + 1 + (page - 1) * 20,
				name: `Item ${i + 1 + (page - 1) * 20}`,
			}))

			// Simulasi delay
			await new Promise(resolve => setTimeout(resolve, 3000))

			return data
		}

		const fetchMoreData = async nextPage => {
			loading.value = true
			const newData = await fetchDataFromAPI(nextPage)
			tableData.value = [...tableData.value, ...newData] // Append new data
			loading.value = false
		}

		watch(page, async (newPage, oldPage) => {
			if (newPage !== oldPage) {
				await fetchMoreData(newPage)
			}
		})

		// Memuat data awal
		onMounted(async () => {
			loading.value = true
			const initialData = await fetchDataFromAPI(page.value)
			tableData.value = initialData
			loading.value = false
		})

		return {
			tableData,
			totalData,
			loading,
			fetchMoreData,
			page,
		}
	},
}
</script>
