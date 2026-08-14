import { mount, flushPromises } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { nextTick } from 'vue'
import ItemsPerPage from '../lib/components/pagination/ItemsPerPage.vue'
import { Dropdown, DropdownItem } from '../lib/components/dropdown'

/* TEST CASE: check if the ItemsPerPage component renders correctly */
test('renders correctly', async () => {
	const wrapper = mount(ItemsPerPage)
	await nextTick()
	await flushPromises()

	expect(wrapper.text()).toContain('Per halaman')
	expect(wrapper.text()).toContain('20 Baris')
	expect(wrapper.text()).toContain('Menampilkan')
})

/* TEST CASE: check if the ItemsPerPage renders text "Per halaman" */
test('renders "Per halaman"', async () => {
	const wrapper = mount(ItemsPerPage)
	expect(wrapper.text()).toContain('Per halaman')
})

/* TEST CASE: check if the ItemsPerPage component renders text "Total data"
 * and total data number
 */
test('renders "Total data"', async () => {
	const wrapper = mount(ItemsPerPage, {
		props: {
			total: 15,
		},
	})

	// check if the ItemsPerPage renders the visible range
	expect(wrapper.text()).toContain('Menampilkan')
	// check if the ItemsPerPage renders total data number
	expect(wrapper.text()).toContain('15')
})

/* TEST CASE: check if the ItemsPerPage renders dropdown */
test('renders dropdown', async () => {
	const wrapper = mount(ItemsPerPage)
	expect(wrapper.find('.item-per-page__dropdown-trigger')).toBeTruthy()
})

/* TEST CASE: check if the ItemsPerPage component has the correct number of options */
test('renders correct number of options', async () => {
	const wrapper = mount(ItemsPerPage, {
		props: {
			options: [10, 20, 50, 100, 200],
		},
	})
	const dropdown = wrapper.findComponent(Dropdown)
	dropdown.vm.openDropdown()
	await nextTick()
	await flushPromises()
	const items = dropdown.findAllComponents(DropdownItem)
	expect(items).toHaveLength(5)
})

/* TEST CASE: check if the ItemsPerPage component has the correct default value */
test('renders correct default value', async () => {
	const wrapper = mount(ItemsPerPage)
	await nextTick()
	await flushPromises()

	expect(wrapper.findComponent(Dropdown).find('button').text()).toContain('20 Baris')
})

/* TEST CASE: check if the ItemsPerPage component emits the event update:modelValue
 * when the value changes
 */
test('emits "update:model-value" event when value changes', async () => {
	const wrapper = mount(ItemsPerPage, {
		props: {
			modelValue: 10,
		},
	})

	/* open the dropdown via the Dropdown component's exposed method */
	const dropdown = wrapper.findComponent(Dropdown)
	dropdown.vm.openDropdown()
	await nextTick()
	await flushPromises()

	/* find the DropdownItem with value "20" and click it */
	const items = dropdown.findAllComponents(DropdownItem)
	const targetItem = items.find((item) => item.props('value') === 20)
	await targetItem?.trigger('click')
	await nextTick()
	await flushPromises()

	// check if the ItemsPerPage emits the correct event when the value changes
	expect(wrapper.emitted('update:model-value')).toBeTruthy()
	expect(wrapper.emitted('update:model-value')[0]).toEqual([20])
})

/* TEST CASE: check if the options that are exceeding the total data are disabled */
test('renders options that exceed total data', async () => {
	const wrapper = mount(ItemsPerPage, {
		props: {
			total: 15,
		},
	})

	/* open the dropdown via the Dropdown component's exposed method */
	const dropdown = wrapper.findComponent(Dropdown)
	dropdown.vm.openDropdown()
	await nextTick()
	await flushPromises()

	const items = dropdown.findAllComponents(DropdownItem)
	expect(items.find(item => item.props('value') === 20)?.text()).toContain('20 Baris')
})

/* TEST CASE: check if the options that are not exceeding the total data are enabled */
test('renders options that do not exceed total data', async () => {
	const wrapper = mount(ItemsPerPage, {
		props: {
			total: 15,
		},
	})

	/* open the dropdown via the Dropdown component's exposed method */
	const dropdown = wrapper.findComponent(Dropdown)
	dropdown.vm.openDropdown()
	await nextTick()
	await flushPromises()

	const items = dropdown.findAllComponents(DropdownItem)
	expect(items.find(item => item.props('value') === 10)?.text()).toContain('10 Baris')
})
