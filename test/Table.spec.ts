import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Table from '../lib/components/table/Table.vue'

/** TEST CASE: check if the Table component renders correctly */
test('renders correctly', async () => {
	const wrapper = mount(Table)

	// check if the table renders correctly
	expect(wrapper.html()).toMatchSnapshot()
})

/** TEST CASE: check if the Table component accepts custom class */
test('accepts class', async () => {
	const wrapper = mount(Table, {
		props: {
			class: 'table-bordered',
		},
	})

	// check if the table has the correct class
	expect(wrapper.find('table').classes()).toContain('table-bordered')
})
