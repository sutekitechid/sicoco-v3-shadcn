<template>
	<div class="p-4">
		<h2 class="text-xl font-semibold mb-4">DataTable dengan Footer</h2>

		<DataTable
			:data="tableData"
			:show-footer="true"
			:selectable="true"
			:show-numbering="true"
			:enable-virtual-scroll="true"
			scroll-y=""
			multiple-sort
		>
			<!-- Define columns with footer -->
			<DataTableGroup name="personal" :order="1">
				<template #header>
					<span>Personal Info</span>
				</template>
			</DataTableGroup>

			<DataTableColumn
				field="name"
				group="personal"
				:order="1"
				:footer-colspan="2"
				sortable
			>
				<template #header>
					<span>Name</span>
				</template>
				<template #default="{ row }">
					<span>{{ row.name }}</span>
				</template>
				<template #footer="{ data }">
					<span class="font-semibold">Total: {{ data.length }} records</span>
				</template>
			</DataTableColumn>

			<DataTableColumn field="age" group="personal" :order="2">
				<template #header>
					<span>Age</span>
				</template>
				<template #default="{ row }">
					<span>{{ row.age }}</span>
				</template>
				<template #footer="{ data }">
					<span class="font-semibold"
						>Avg: {{ calculateAverage(data, 'age') }}</span
					>
				</template>
			</DataTableColumn>

			<DataTableColumn field="salary" :order="3" sortable>
				<template #header>
					<span>Salary</span>
				</template>
				<template #default="{ row }">
					<span>${{ row.salary.toLocaleString() }}</span>
				</template>
				<template #footer="{ data }">
					<span class="font-semibold"
						>Total: ${{ calculateSum(data, 'salary').toLocaleString() }}</span
					>
				</template>
			</DataTableColumn>

			<DataTableColumn field="department" :order="4" sortable>
				<template #header>
					<span>Department</span>
				</template>
				<template #default="{ row }">
					<span>{{ row.department }}</span>
				</template>
				<template #footer="{ data }">
					<span class="font-semibold"
						>{{ getUniqueCount(data, 'department') }} depts</span
					>
				</template>
			</DataTableColumn>

			<DataTableColumn field="row_index" :order="5" sortable default-sort="desc">
				<template #header>
					<span>Row Index</span>
				</template>
				<template #default="{ row, index }">
					<span>{{ index + 1 }}</span>
				</template>
				<template #footer="{ data }">
					<span class="font-semibold"> Total Rows: {{ data.length }} </span>
				</template>
			</DataTableColumn>
			<template #empty>
				<div class="min-h-screen flex items-center justify-center">
					<span>No data available</span>
				</div>
			</template>
		</DataTable>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '@/components/datatablev2/DataTable.vue'
import DataTableColumn from '@/components/datatablev2/DataTableColumn.vue'
import DataTableGroup from '@/components/datatablev2/DataTableGroupColumn.vue'

const tableData = ref([
	{ name: 'Alice', age: 30, salary: 50000, department: 'HR' },
	{ name: 'Bob', age: 25, salary: 60000, department: 'Engineering' },
	{ name: 'Charlie', age: 35, salary: 70000, department: 'Marketing' },
	{ name: 'David', age: 28, salary: 55000, department: 'HR' },
	{ name: 'Eve', age: 40, salary: 80000, department: 'Engineering' },
	{ name: 'Frank', age: 32, salary: 65000, department: 'Marketing' },
	{ name: 'Grace', age: 29, salary: 72000, department: 'HR' },
	{ name: 'Hank', age: 31, salary: 58000, department: 'Engineering' },
	{ name: 'Ivy', age: 27, salary: 62000, department: 'Marketing' },
	{ name: 'Jack', age: 33, salary: 75000, department: 'HR' },
	{ name: 'Karen', age: 26, salary: 54000, department: 'Engineering' },
	{ name: 'Leo', age: 38, salary: 88000, department: 'Marketing' },
	{ name: 'Mia', age: 24, salary: 51000, department: 'HR' },
	{ name: 'Noah', age: 36, salary: 79000, department: 'Engineering' },
	{ name: 'Olivia', age: 29, salary: 68000, department: 'Marketing' },
	{ name: 'Paul', age: 34, salary: 73000, department: 'HR' },
	{ name: 'Quinn', age: 28, salary: 61000, department: 'Engineering' },
	{ name: 'Rina', age: 37, salary: 82000, department: 'Marketing' },
	{ name: 'Sam', age: 30, salary: 66000, department: 'HR' },
	{ name: 'Tara', age: 27, salary: 59000, department: 'Engineering' },
	{ name: 'Uma', age: 31, salary: 64000, department: 'Marketing' },
	{ name: 'Victor', age: 39, salary: 91000, department: 'Engineering' },
	{ name: 'Wendy', age: 26, salary: 56000, department: 'HR' },
	{ name: 'Xavier', age: 35, salary: 77000, department: 'Marketing' },
	{ name: 'Yara', age: 28, salary: 60000, department: 'Engineering' },
	{ name: 'Zane', age: 33, salary: 71000, department: 'HR' },
	{ name: 'Aiden', age: 30, salary: 69000, department: 'Engineering' },
	{ name: 'Bella', age: 25, salary: 53000, department: 'Marketing' },
	{ name: 'Caleb', age: 41, salary: 95000, department: 'HR' },
	{ name: 'Diana', age: 29, salary: 67000, department: 'Engineering' },
	{ name: 'Ethan', age: 34, salary: 74000, department: 'Marketing' },
	{ name: 'Fiona', age: 27, salary: 58000, department: 'HR' },
	{ name: 'Gavin', age: 32, salary: 72000, department: 'Engineering' },
	{ name: 'Hazel', age: 36, salary: 84000, department: 'Marketing' },
	{ name: 'Isaac', age: 28, salary: 61000, department: 'HR' },
	{ name: 'Jenna', age: 31, salary: 65000, department: 'Engineering' },
	{ name: 'Kylan', age: 37, salary: 86000, department: 'Marketing' },
	{ name: 'Luna', age: 24, salary: 52000, department: 'HR' },
	{ name: 'Mason', age: 40, salary: 93000, department: 'Engineering' },
	{ name: 'Nora', age: 29, salary: 68000, department: 'Marketing' },
])

const empty = ref(null)

const calculateAverage = (data, field) => {
	const sum = data.reduce((acc, item) => acc + item[field], 0)
	return (sum / data.length).toFixed(1)
}

const calculateSum = (data, field) => {
	return data.reduce((acc, item) => acc + item[field], 0)
}

const getUniqueCount = (data, field) => {
	const unique = new Set(data.map(item => item[field]))
	return unique.size
}
</script>
