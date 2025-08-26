import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { ref } from 'vue'
import DataTable from '../lib/components/datatablev2/DataTable.vue'
import DataTableColumn from '../lib/components/datatablev2/DataTableColumn.vue'

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

	setTimeout(() => {
		// check if the table has the correct number of rows
		expect(wrapper.findAll('.table-row')).toHaveLength(data.length + 2) // +1 for the header row
	}, 1000)
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
	setTimeout(() => {
		expect(wrapper.findAll('th')).toHaveLength(columns.length + 1)
	}, 1000)
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

/** TEST CASE: check if the DataTable component renders the correct dynamic header */
test('renders correct dynamic header', async () => {
	const defaultValue = ref(
		`
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
			`
	)
	const wrapper = mount(DataTable, {
		props: {
			columns,
			data,
		},
		slots: {
			default: defaultValue.value,
		},
		global: {
			components: {
				'data-table-column': DataTableColumn,
			},
		},
	})

	setTimeout(() => {
		defaultValue.value += `
				<data-table-column field="email">
					<template #header>Email</template>
					<template #default="{ row }">
						<span>{{ row.email }}</span>
					</template>
				</data-table-column>
			`

		const headers = wrapper.findAll('th')
		expect(headers[3].text()).toBe('Email')
	}, 1000)

	setTimeout(() => {
		const headers = wrapper.findAll('th')
		expect(headers[0].text()).toBe('No.')
		expect(headers[1].text()).toBe('Name')
		expect(headers[2].text()).toBe('Age')
	}, 1000)
})
