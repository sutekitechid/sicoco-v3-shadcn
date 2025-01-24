<template>
	<div class="p-2 cursor-pointer hover:bg-neutral-20 rounded">
		<i :class="getSortIcon(column.getIsSorted())"></i>
	</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { type Column } from '@tanstack/vue-table'
import { SORT_ORDER } from '.'

const props = defineProps<{
	column: Column<unknown, any>
}>()

const getSortIcon = (sort: string | boolean) => {
	if (!sort) return 'si-sort'
	return sort === SORT_ORDER.DESC ? 'si-sort-ascending' : 'si-sort-descending'
}
</script>
