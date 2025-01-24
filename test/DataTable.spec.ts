import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import DataTable from '../lib/components/data-table/DataTable.vue'
import DataTableColumn from '../lib/components/data-table/DataTableColumn.vue'

const columns = [
	{
		field: 'name',
		header: 'Name',
	},
	{
		field: 'age',
		header: 'Age',
	},
]

const data = [
	{ name: 'John Doe', age: 30 },
	{ name: 'Jane Doe', age: 25 },
]

/** TEST CASE: check if the DataTable component renders correctly */
test('renders correctly', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data,
		},
		slots: {
			default: `
				<data-table-column field="name">
					<template #header>Name</template>
					<template #default="{ row }">
						<span>{{ row.name }}</span>
					</template>
				</data-table-column>
				<data-table-column field="age">
					<template #header>Age</template>
					<template #default="{ row }">
						<span>{{ row.age }}</span>
					</template>
				</data-table-column>
			`,
		},
		global: {
			components: {
				'data-table-column': DataTableColumn,
			},
		},
	})

	// check if the table renders correctly
	expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the DataTable component renders the correct number of rows */
test('renders correct number of rows', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data,
		},
		slots: {
			default: `
				<data-table-column field="name">
					<template #header>Name</template>
					<template #default="{ row }">
						<span>{{ row.name }}</span>
					</template>
				</data-table-column>
				<data-table-column field="age">
					<template #header>Age</template>
					<template #default="{ row }">
						<span>{{ row.age }}</span>
					</template>
				</data-table-column>
			`,
		},
		global: {
			components: {
				'data-table-column': DataTableColumn,
			},
		},
	})

	// check if the table has the correct number of rows
	expect(wrapper.findAll('tr')).toHaveLength(data.length + 1) // +1 for the header row
})

/** TEST CASE: check if the DataTable component renders the correct number of columns */
test('renders correct number of columns', async () => {
	const wrapper = mount(DataTable, {
		props: {
			columns,
			data,
		},
		slots: {
			default: `
				<data-table-column field="name">
					<template #header>Name</template>
					<template #default="{ row }">
						<span>{{ row.name }}</span>
					</template>
				</data-table-column>
				<data-table-column field="age">
					<template #header>Age</template>
					<template #default="{ row }">
						<span>{{ row.age }}</span>
					</template>
				</data-table-column>
			`,
		},
		global: {
			components: {
				'data-table-column': DataTableColumn,
			},
		},
	})

	// check if the table has the correct number of columns
	// we add 1 to the length of columns because we have an extra column for the number column
	expect(wrapper.findAll('th')).toHaveLength(columns.length + 1)
})

/** TEST CASE: check if the DataTable component renders "No results" when data is empty */
test('renders "No results" when data is empty', async () => {
	const message = 'No results'
	const wrapper = mount(DataTable, {
		props: {
			data: [],
		},
		slots: {
			empty: message,
		},
	})

	// check if the table renders "No results" message
	expect(wrapper.html()).toContain(message)
})
