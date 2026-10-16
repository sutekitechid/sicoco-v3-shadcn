<script setup lang="ts">
import { ref } from 'vue'
import {
	DataTable,
	DataTableColumn,
} from '../../lib/components/datatablev2'

interface Person {
	id: string
	name: string
	email: string
	department: string
}

const tableData = ref<Person[]>([
	{ id: 'person-1', name: 'John Doe', email: 'john@example.com', department: 'Engineering' },
	{ id: 'person-2', name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing' },
	{ id: 'person-3', name: 'Bob Johnson', email: 'bob@example.com', department: 'Finance' },
	{ id: 'person-4', name: 'Alice Brown', email: 'alice@example.com', department: 'Product' },
	{ id: 'person-5', name: 'Charlie Davis', email: 'charlie@example.com', department: 'Operations' },
])

const tableRef = ref<InstanceType<typeof DataTable> | null>(null)
const currentSort = ref<Array<{ id: string; desc: boolean }>>([])
const lastReorder = ref<string>('')

function onDataReordered(data: Person[]) {
	lastReorder.value = `Data diperbarui: ${data.map(row => row.id).join(' -> ')}`
}

function onSortChange(sort: Array<{ id: string; desc: boolean }>) {
	currentSort.value = sort
}

function clearTableSort() {
	tableRef.value?.clearSort()
	currentSort.value = []
}
</script>

<template>
	<div class="mx-auto max-w-5xl space-y-6 p-6">
		<div class="space-y-2">
			<h1 class="text-heading-lg font-semibold text-main">Sorting And Row Ordering</h1>
			<p class="text-body-md text-secondary">
				Gunakan tombol sort di header untuk multi-sort, atau tarik handle pada kolom pertama untuk mengubah urutan root row.
			</p>
		</div>

		<div v-if="currentSort.length > 0" class="rounded-md border border-success-200 bg-success-subtle p-4 text-body-sm text-main">
			<p class="font-medium">Sorting aktif</p>
			<p>{{ currentSort.map(sort => `${sort.id} (${sort.desc ? 'desc' : 'asc'})`).join(', ') }}</p>
			<button type="button" class="mt-2 text-primary-default underline" @click="clearTableSort">Hapus sorting</button>
		</div>

		<div class="rounded-md border border-neutral-400 bg-neutral-50 p-4">
			<p class="text-body-sm text-secondary">
				Manual ordering memperbarui <code>v-model:data</code>. Simpan data baru ke API untuk mempertahankan urutan antar sesi.
			</p>
			<p class="mt-2 text-body-sm font-medium text-main">
				Urutan saat ini: {{ tableData.map(row => row.id).join(' -> ') }}
			</p>
		</div>

		<DataTable
			id="sortable-table"
			ref="tableRef"
			v-model:data="tableData"
			row-key="id"
			show-numbering
			multiple-sort
			draggable
			@sort="onSortChange"
			@update:data="onDataReordered"
		>
			<DataTableColumn field="name" sortable>
				<template #header>Name</template>
				<template #default="{ row }">{{ row.name }}</template>
			</DataTableColumn>

			<DataTableColumn field="email" sortable>
				<template #header>Email</template>
				<template #default="{ row }">{{ row.email }}</template>
			</DataTableColumn>

			<DataTableColumn field="department" sortable>
				<template #header>Department</template>
				<template #default="{ row }">{{ row.department }}</template>
			</DataTableColumn>
		</DataTable>

		<div v-if="lastReorder" class="rounded-md border border-primary-200 bg-primary-subtle p-4 text-body-sm text-main">
			{{ lastReorder }}
		</div>
	</div>
</template>
