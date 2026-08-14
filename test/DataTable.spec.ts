import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { h, nextTick } from 'vue'
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

	await nextTick()
	await nextTick()

	expect(wrapper.findAll('tbody tr')).toHaveLength(data.length)
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

	await nextTick()
	await nextTick()

	// We add one column for row numbering.
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

/** TEST CASE: check if the DataTable component renders the registered headers */
test('renders registered headers', async () => {
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

	await nextTick()
	await nextTick()

	const headers = wrapper.findAll('th')
	expect(headers.map(header => header.text())).toEqual(['No.', 'Name', 'Age'])
	expect(wrapper.find('thead').classes()).toContain('text-body-sm')
})

test.each([
	[160, '160px'],
	['12rem', '12rem'],
])('applies column width %s to header and body cells', async (width, expectedWidth) => {
	const wrapper = mount(DataTable, {
		props: {
			data: [{ name: 'John' }],
			showNumbering: false,
		},
		slots: {
			default: () => h(DataTableColumn, { field: 'name', width }, {
				header: () => 'Name',
				default: ({ row }) => row.name,
			}),
		},
	})

	await nextTick()
	await nextTick()

	expect(wrapper.vm.sortedLeafColumns[0].width).toBe(width)
	const headerCell = wrapper.find('th')
	const bodyCell = wrapper.find('tbody td')
	expect(headerCell.exists()).toBe(true)
	expect(bodyCell.exists()).toBe(true)
	expect(headerCell.element.style.width).toBe(expectedWidth)
	expect(bodyCell.element.style.width).toBe(expectedWidth)
})

test('keeps the default text color for non-selectable rows', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data,
			selectable: true,
			isRowSelectable: () => false,
		},
		slots: {
			default: () => h(DataTableColumn, { field: 'name' }, {
				header: () => 'Name',
				default: ({ row }) => row.name,
			}),
		},
	})

	await nextTick()

	const row = wrapper.find('tbody tr')
	expect(row.classes()).toContain('cursor-not-allowed')
	expect(row.classes()).not.toContain('text-neutral-500')
})

/** TEST CASE: regression - auto mode should not slice data when total rows are between 21 and 100 */
test('auto mode renders all rows and hides pagination for 40 rows', async () => {
	const mediumData = Array.from({ length: 40 }, (_, index) => ({
		name: `User ${index + 1}`,
		age: 20 + index,
	}))

	const wrapper = mount(DataTable, {
		props: {
			data: mediumData,
		},
		slots: {
			default: `
				<data-table-column field="name">
					<template #header>Name</template>
					<template #default="{ row }">
						<span>{{ row.name }}</span>
					</template>
				</data-table-column>
				<data-table-column field="age">\
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

	await wrapper.vm.$nextTick()
	await wrapper.vm.$nextTick()

	expect(wrapper.findAll('tbody tr')).toHaveLength(mediumData.length)
	expect(wrapper.text()).toContain('User 40')
	expect(wrapper.find('.pagination-prev').exists()).toBe(false)
})

test('opens nested detailed rows and emits detail events', async () => {
	const nestedData = [
		{
			id: 'parent',
			name: 'Parent',
			children: [
				{ id: 'child', name: 'Child', children: [{ id: 'grandchild', name: 'Grandchild' }] },
			],
		},
	]
	const wrapper = mount(DataTable, {
		props: {
			data: nestedData,
			detailed: true,
			showNumbering: false,
			'children-key': 'children',
			'onUpdate:openedDetailed': value => wrapper.setProps({ openedDetailed: value }),
		},
		slots: {
			default: () => h(DataTableColumn, { field: 'name' }, {
				header: () => 'Name',
				default: ({ row }) => row.name,
			}),
		},
		global: {
			stubs: { RouterLink: true },
		},
	})

	await wrapper.vm.$nextTick()
	expect(wrapper.findAll('tbody tr').filter(row => row.isVisible())).toHaveLength(1)

	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await wrapper.vm.$nextTick()
	expect(wrapper.findAll('tbody tr').filter(row => row.isVisible())).toHaveLength(2)
	expect(wrapper.text()).toContain('Child')
	expect(wrapper.emitted('details-open')).toEqual([[nestedData[0]]])
	expect(wrapper.find('i.si-heroicon-solid-chevron-down').classes()).toContain('rotate-180')

	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await wrapper.vm.$nextTick()
	expect(wrapper.findAll('tbody tr').filter(row => row.isVisible())).toHaveLength(3)
	expect(wrapper.text()).toContain('Grandchild')
})

test('opens and closes detailed rows when the row is clicked', async () => {
	const row = { id: 'parent', name: 'Parent', children: [{ id: 'child', name: 'Child' }] }
	const wrapper = mount(DataTable, {
		props: {
			data: [row],
			detailed: true,
			showNumbering: false,
			'onUpdate:openedDetailed': value => wrapper.setProps({ openedDetailed: value }),
		},
		slots: {
			default: () => h(DataTableColumn, { field: 'name' }, {
				header: () => 'Name',
				default: ({ row: dataRow }) => dataRow.name,
			}),
		},
		global: {
			stubs: { RouterLink: true },
		},
	})

	await wrapper.vm.$nextTick()
	const parentRow = wrapper.find('tbody tr')
	expect(parentRow.classes()).toContain('cursor-pointer')

	await parentRow.trigger('click')
	await wrapper.vm.$nextTick()
	expect(wrapper.text()).toContain('Child')
	expect(wrapper.emitted('details-open')).toEqual([[row]])

	await parentRow.trigger('click')
	await wrapper.vm.$nextTick()
	expect(wrapper.emitted('details-close')).toEqual([[row]])
})

test('closes detailed rows and emits details-close', async () => {
	const row = { id: 'parent', name: 'Parent', children: [{ id: 'child', name: 'Child' }] }
	const wrapper = mount(DataTable, {
		props: {
			data: [row],
			detailed: true,
			showNumbering: false,
			openedDetailed: ['parent'],
		},
		slots: {
			default: () => h(DataTableColumn, { field: 'name' }, {
				header: () => 'Name',
				default: ({ row: dataRow }) => dataRow.name,
			}),
		},
		global: {
			stubs: { RouterLink: true },
		},
	})

	await wrapper.vm.$nextTick()
	await wrapper.find('button[aria-label="Tutup detail baris"]').trigger('click')
	expect(wrapper.emitted('update:openedDetailed')).toEqual([[[]]])
	expect(wrapper.emitted('details-close')).toEqual([[row]])
})
