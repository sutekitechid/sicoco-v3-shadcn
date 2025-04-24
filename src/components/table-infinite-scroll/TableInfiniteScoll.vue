<template>
	<DataTable
		:data="tableData"
		:loading="loading"
		@load-more="fetchMoreData"
		scroll-y="100px"
	/>
</template>

<script>
import DataTable from '@/components/data-table/DataTable.vue'

export default {
	components: { DataTable },
	data() {
		return {
			tableData: [],
			loading: false,
		}
	},
	methods: {
		fetchMoreData() {
			if (this.loading) return
			this.loading = true
			setTimeout(() => {
				const newData = Array.from({ length: 10 }, (_, i) => ({
					id: this.tableData.length + i + 1,
					name: `Row ${this.tableData.length + i + 1}`,
				}))
				this.tableData.push(...newData)
				this.loading = false
			}, 1000)
		},
	},
	mounted() {
		this.fetchMoreData()
	},
}
</script>
