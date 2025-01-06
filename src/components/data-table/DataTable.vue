<script setup lang="ts">
import type { Payment } from './columns'
import { onMounted, ref } from 'vue'
import { columns } from './columns'
import dummyData from './dummy-data'
import DataTable from '@/components/data-table/DataTable.vue'

const data = ref<Payment[]>([])

async function getData(): Promise<Payment[]> {
	// Fetch data from your API here.
	return dummyData
}

onMounted(async () => {
	data.value = await getData()
})

const page = ref(1)
const perPage = ref(10)
</script>

<template>
	<div class="container py-10 mx-auto text-black">
		<DataTable
			:columns="columns"
			:data="data"
			:page="page"
			:per-page="perPage"
			paginated
		>
			<template #empty> Teu aya dataan </template>
		</DataTable>
	</div>
</template>
