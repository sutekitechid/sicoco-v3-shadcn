<template>
	<TableRow v-for="i in 5" :key="i" class="!animate-none">
		<TableCell v-for="j in totalData" :key="j" loading class="p-2" />
	</TableRow>
</template>

<script lang="ts">
import { TableCell, TableRow } from '../../components/table'

export default {
	components: {
		TableCell,
		TableRow,
	},
	props: {
		totalData: {
			type: Number,
			default: 0,
		},
	},
}
</script>
