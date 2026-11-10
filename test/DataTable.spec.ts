import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../lib/components/datatablev2/DataTable.vue'
import DataTableColumn from '../lib/components/datatablev2/DataTableColumn.vue'
import Checkbox from '../lib/components/checkbox/Checkbox.vue'

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
])(
	'applies column width %s to header and body cells',
	async (width, expectedWidth) => {
		const wrapper = mount(DataTable, {
			props: {
				data: [{ name: 'John' }],
				showNumbering: false,
			},
			slots: {
				default: () =>
					h(
						DataTableColumn,
						{ field: 'name', width },
						{
							header: () => 'Name',
							default: ({ row }) => row.name,
						},
					),
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
	},
)

test.each([
	['top', 'align-top'],
	['middle', 'align-middle'],
	['bottom', 'align-bottom'],
])(
	'applies vertical alignment %s to body cells',
	async (verticalAlign, expectedClass) => {
		const wrapper = mount(DataTable, {
			props: {
				data: [{ name: 'John' }],
				showNumbering: false,
			},
			slots: {
				default: () =>
					h(
						DataTableColumn,
						{ field: 'name', verticalAlign },
						{
							header: () => 'Name',
							default: ({ row }) => row.name,
						},
					),
			},
		})

		await nextTick()
		await nextTick()

		expect(wrapper.find('tbody td').classes()).toContain(expectedClass)
		expect(wrapper.find('th').classes()).toContain('align-middle')
	},
)

test('applies global vertical alignment to all body cells', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data,
			verticalAlign: 'top',
		},
		slots: {
			default: () => [
				h(
					DataTableColumn,
					{ field: 'name', verticalAlign: 'bottom' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
				h(
					DataTableColumn,
					{ field: 'age' },
					{
						header: () => 'Age',
						default: ({ row }) => row.age,
					},
				),
			],
		},
	})

	await nextTick()
	await nextTick()

	expect(wrapper.find('tbody td:nth-child(2)').classes()).toContain(
		'align-bottom',
	)
	expect(wrapper.find('tbody td:nth-child(3)').classes()).toContain('align-top')
	expect(wrapper.find('tbody td:first-child').classes()).toContain('align-top')
	expect(
		wrapper.find('thead th[data-col="__numbering__"]').classes(),
	).toContain('align-middle')
})

test('vertically centers body cells by default', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data: [{ name: 'John' }],
			showNumbering: false,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()
	await nextTick()

	expect(wrapper.find('tbody td').classes()).toContain('align-middle')
})

test('keeps the default text color for non-selectable rows', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data,
			selectable: true,
			isRowSelectable: () => false,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()

	const row = wrapper.find('tbody tr')
	expect(row.classes()).toContain('cursor-not-allowed')
	expect(row.classes()).not.toContain('text-neutral-500')
})

test('renders vue-draggable-plus handles before numbering', async () => {
	const draggableData = [
		{ id: 'first', name: 'First' },
		{ id: 'second', name: 'Second' },
	]
	const wrapper = mount(DataTable, {
		props: {
			data: draggableData,
			draggable: true,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()
	await nextTick()

	const headers = wrapper.findAll('th')
	expect(headers[0].attributes('data-col')).toBe('__draggable__')
	expect(headers[1].text()).toBe('No.')

	const handles = wrapper.findAll('[data-datatable-drag-handle]')
	expect(handles).toHaveLength(draggableData.length)
	expect(handles[0].find('i').classes()).toContain(
		'si-heroicon-outline-grip-vertical',
	)
	expect(handles[0].attributes('draggable')).toBeUndefined()
	expect(handles[0].attributes('disabled')).toBeUndefined()
})

test('disables the drag handle when only one row is available', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data: [{ id: 'only-row', name: 'Only row' }],
			draggable: true,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()
	expect(
		wrapper.find('[data-datatable-drag-handle]').attributes('disabled'),
	).toBeDefined()
})

test('disables dragging for rows rejected by isRowDraggable', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data: [
				{ id: 'locked', name: 'Locked', locked: true },
				{ id: 'movable', name: 'Movable', locked: false },
				{ id: 'movable-two', name: 'Movable Two', locked: false },
			],
			draggable: true,
			isRowDraggable: row => !row.locked,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()
	await nextTick()

	const rows = wrapper.findAll('tbody tr')
	const handles = wrapper.findAll('[data-datatable-drag-handle]')
	expect(rows[0].attributes('data-datatable-draggable')).toBe('false')
	expect(handles[0].attributes('disabled')).toBeDefined()
	expect(rows[1].attributes('data-datatable-draggable')).toBe('true')
	expect(handles[1].attributes('disabled')).toBeUndefined()
})

test('keeps locked rows at their original position when reordering', async () => {
	const draggableData = [
		{ id: 'first', name: 'First', locked: false },
		{ id: 'second', name: 'Second', locked: false },
		{ id: 'locked', name: 'Locked', locked: true },
		{ id: 'fourth', name: 'Fourth', locked: false },
		{ id: 'fifth', name: 'Fifth', locked: false },
	]
	const wrapper = mount(DataTable, {
		props: {
			data: draggableData,
			draggable: true,
			isRowDraggable: row => !row.locked,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()
	await nextTick()

	wrapper.vm.$.setupState.reorderRows(3, 0)

	const reorderedData = wrapper
		.emitted('update:data')
		?.at(-1)?.[0] as typeof draggableData
	expect(reorderedData.map(row => row.id)).toEqual([
		'fifth',
		'first',
		'locked',
		'second',
		'fourth',
	])
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

test('synchronizes the selected page when the parent resets page', async () => {
	const wrapper = mount(DataTable, {
		props: {
			data: [{ name: 'John Doe' }],
			paginated: true,
			page: 1,
			perPage: 10,
			total: 30,
			showNumbering: false,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
		global: {
			stubs: { RouterLink: true },
		},
	})

	await wrapper.find('.pagination-next').trigger('click')
	expect(wrapper.emitted('update:page')).toEqual([[2]])
	expect(wrapper.find('[data-selected="true"][data-type="page"]').text()).toBe(
		'2',
	)

	await wrapper.setProps({ page: 2 })
	await wrapper.setProps({ page: 1 })

	expect(wrapper.find('[data-selected="true"][data-type="page"]').text()).toBe(
		'1',
	)
})

test('renders a separate detail row from the detail slot', async () => {
	const row = { id: 'one', name: 'One' }
	const wrapper = mount(DataTable, {
		props: {
			data: [row],
			selectable: true,
			draggable: true,
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row: dataRow }) => dataRow.name,
					},
				),
			detail: ({ row: dataRow }) =>
				h('div', { class: 'row-detail' }, `Details for ${dataRow.name}`),
		},
	})

	await nextTick()
	await nextTick()

	expect(wrapper.findAll('tbody tr')).toHaveLength(1)
	expect(wrapper.find('thead th[data-col="__detail__"]').exists()).toBe(true)
	expect(wrapper.find('tbody td[data-col="__detail__"]').classes()).toContain(
		'bg-white',
	)
	await wrapper
		.find('button[aria-label="Buka detail tambahan baris"]')
		.trigger('click')
	await nextTick()

	expect(wrapper.findAll('tbody tr')).toHaveLength(2)
	expect(wrapper.find('[data-datatable-detail]').text()).toBe('Details for One')
	expect(wrapper.find('[data-datatable-detail]').classes()).toContain(
		'bg-neutral-100',
	)
	const detailCells = wrapper.find('[data-datatable-detail]').findAll('td')
	expect(detailCells).toHaveLength(2)
	expect(
		detailCells[0].attributes('colspan'),
	).toBe('4')
	expect(
		wrapper.find('[data-datatable-detail-content]').attributes('colspan'),
	).toBe('1')
	expect(
		wrapper.find('[data-datatable-detail-content] > div').classes(),
	).toContain('py-6')
	for (const cell of wrapper.find('[data-datatable-detail]').findAll('td')) {
		expect(cell.classes()).toContain('bg-neutral-100')
		expect(cell.classes()).toContain('!p-0')
		expect(cell.classes()).not.toContain('group-hover:bg-disabled')
	}
	expect(wrapper.emitted('detail-open')).toEqual([[row]])
	expect(wrapper.emitted('update:openedDetails')).toEqual([[['one']]])

	await wrapper.setProps({ detailClass: 'bg-primary-subtle' })
	expect(wrapper.find('[data-datatable-detail]').classes()).toContain(
		'bg-primary-subtle',
	)
	expect(wrapper.find('[data-datatable-detail]').classes()).not.toContain(
		'bg-neutral-100',
	)
	expect(wrapper.find('[data-datatable-detail-content]').classes()).toContain(
		'bg-primary-subtle',
	)
})

test('keeps tree and slot detail expansion independent', async () => {
	const row = {
		id: 'parent',
		name: 'Parent',
		children: [{ id: 'child', name: 'Child' }],
	}
	const wrapper = mount(DataTable, {
		props: {
			data: [row],
			detailed: true,
			showNumbering: false,
			'onUpdate:openedDetailed': value =>
				wrapper.setProps({ openedDetailed: value }),
			'onUpdate:openedDetails': value =>
				wrapper.setProps({ openedDetails: value }),
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row: dataRow }) => dataRow.name,
					},
				),
			detail: ({ row: dataRow }) =>
				h('div', { class: 'row-detail' }, `Details for ${dataRow.name}`),
		},
	})

	await nextTick()
	await nextTick()

	const buttons = wrapper.findAll('button')
	expect(buttons).toHaveLength(2)
	await buttons
		.find(
			button =>
				button.attributes('aria-label') === 'Buka detail tambahan baris',
		)
		.trigger('click')
	await nextTick()

	expect(wrapper.findAll('tbody tr')).toHaveLength(2)
	expect(wrapper.text()).not.toContain('Child')

	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await nextTick()

	expect(wrapper.findAll('tbody tr')).toHaveLength(3)
	expect(wrapper.text()).toContain('Child')
	expect(wrapper.find('[data-datatable-detail]').exists()).toBe(true)
})

test('opens nested detailed rows and emits detail events', async () => {
	const nestedData = [
		{
			id: 'parent',
			name: 'Parent',
			children: [
				{
					id: 'child',
					name: 'Child',
					children: [{ id: 'grandchild', name: 'Grandchild' }],
				},
			],
		},
	]
	const wrapper = mount(DataTable, {
		props: {
			data: nestedData,
			detailed: true,
			showNumbering: false,
			'children-key': 'children',
			'onUpdate:openedDetailed': value =>
				wrapper.setProps({ openedDetailed: value }),
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
		global: {
			stubs: { RouterLink: true },
		},
	})

	await wrapper.vm.$nextTick()
	expect(
		wrapper.findAll('tbody tr').filter(row => row.isVisible()),
	).toHaveLength(1)

	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await wrapper.vm.$nextTick()
	expect(
		wrapper.findAll('tbody tr').filter(row => row.isVisible()),
	).toHaveLength(2)
	expect(wrapper.text()).toContain('Child')
	expect(wrapper.emitted('details-open')).toEqual([[nestedData[0]]])
	expect(wrapper.find('i.si-heroicon-solid-chevron-down').classes()).toContain(
		'rotate-180',
	)

	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await wrapper.vm.$nextTick()
	expect(
		wrapper.findAll('tbody tr').filter(row => row.isVisible()),
	).toHaveLength(3)
	expect(wrapper.text()).toContain('Grandchild')
})

test('cascades nested row selection and marks parents indeterminate', async () => {
	const nestedData = [
		{
			id: 'parent',
			name: 'Parent',
			children: [
				{
					id: 'child-one',
					name: 'Child One',
					children: [{ id: 'parent', name: 'Grandchild' }],
				},
				{ id: 'child-two', name: 'Child Two' },
			],
		},
	]
	const wrapper = mount(DataTable, {
		props: {
			data: nestedData,
			detailed: true,
			selectable: true,
			showNumbering: false,
			'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value }),
			'onUpdate:openedDetailed': value =>
				wrapper.setProps({ openedDetailed: value }),
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row }) => row.name,
					},
				),
		},
	})

	await nextTick()
	await nextTick()
	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await nextTick()

	const checkboxes = wrapper.findAllComponents(Checkbox)
	await checkboxes[1].vm.$emit('update:modelValue', true)
	await nextTick()

	expect(
		wrapper.emitted('update:modelValue')?.[0][0].map(row => row.name),
	).toEqual(['Parent', 'Child One', 'Grandchild', 'Child Two'])
	await wrapper.setProps({
		modelValue: nestedData[0].children.flatMap(child => [
			child,
			...(child.children || []),
		]),
	})
	await nextTick()

	expect(wrapper.findAllComponents(Checkbox)[0].props('modelValue')).toBe(true)
	expect(wrapper.findAllComponents(Checkbox)[0].props('indeterminate')).toBe(
		false,
	)

	await wrapper.find('button[aria-label="Buka detail baris"]').trigger('click')
	await nextTick()

	await wrapper
		.findAllComponents(Checkbox)[3]
		.vm.$emit('update:modelValue', false)
	await nextTick()

	expect(
		wrapper.emitted('update:modelValue')?.[1][0].map(row => row.name),
	).toEqual(['Child Two'])
	expect(wrapper.findAllComponents(Checkbox)[1].props('indeterminate')).toBe(
		true,
	)

	await wrapper
		.findAllComponents(Checkbox)[4]
		.vm.$emit('update:modelValue', false)
	await nextTick()

	expect(wrapper.findAllComponents(Checkbox)[1].props('modelValue')).toBe(false)
	expect(wrapper.findAllComponents(Checkbox)[1].props('indeterminate')).toBe(
		false,
	)
	expect(wrapper.emitted('update:modelValue')?.[2][0]).toEqual([])
})

test('opens and closes detailed rows when the row is clicked', async () => {
	const row = {
		id: 'parent',
		name: 'Parent',
		children: [{ id: 'child', name: 'Child' }],
	}
	const wrapper = mount(DataTable, {
		props: {
			data: [row],
			detailed: true,
			showNumbering: false,
			'onUpdate:openedDetailed': value =>
				wrapper.setProps({ openedDetailed: value }),
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row: dataRow }) => dataRow.name,
					},
				),
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
	const row = {
		id: 'parent',
		name: 'Parent',
		children: [{ id: 'child', name: 'Child' }],
	}
	const wrapper = mount(DataTable, {
		props: {
			data: [row],
			detailed: true,
			showNumbering: false,
			openedDetailed: ['parent'],
		},
		slots: {
			default: () =>
				h(
					DataTableColumn,
					{ field: 'name' },
					{
						header: () => 'Name',
						default: ({ row: dataRow }) => dataRow.name,
					},
				),
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
