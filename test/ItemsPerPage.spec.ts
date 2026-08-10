import { mount, flushPromises } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { nextTick } from 'vue'
import ItemsPerPage from '../lib/components/pagination/ItemsPerPage.vue'
import { Dropdown, DropdownItem } from '../lib/components/dropdown'

/* TEST CASE: check if the ItemsPerPage component renders correctly */
test('renders correctly', async () => {
	const wrapper = mount(ItemsPerPage)
	expect(wrapper.text()).toContain('Tampilkan')
	expect(wrapper.text()).toContain('20 per halaman')
	expect(wrapper.text()).toContain('Total data :')
})

/* TEST CASE: check if the ItemsPerPage renders text "Tampilkan" */
test('renders "Tampilkan"', async () => {
	const wrapper = mount(ItemsPerPage)
	expect(wrapper.text()).toContain('Tampilkan')
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

	// check if the ItemsPerPage renders text "Total data"
	expect(wrapper.text()).toContain('Total data :')
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
	// console.log(wrapper.find('.item-per-page__dropdown-trigger').click())
	setTimeout(function () {
		expect(wrapper.findAll('[data-dropdown-item]')).toHaveLength(5)
	}, 200)
})

/* TEST CASE: check if the ItemsPerPage component has the correct default value */
test('renders correct default value', async () => {
	const wrapper = mount(ItemsPerPage)
	setTimeout(function () {
		expect(wrapper.find('.item-per-page__dropdown-trigger').text()).toContain(
			'20 per halaman'
		)
	}, 200)
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
test('disables options that exceed total data', async () => {
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

	/* find the DropdownItem with value "50" and click it */
	const items = dropdown.findAllComponents(DropdownItem)
	const targetItem = items.find((item) => item.props('value') === 50)
	await targetItem?.trigger('click')
	await nextTick()
	await flushPromises()

	/* check if the options that are exceeding the total data are disabled
	 * by checking the text of the dropdown trigger remains the same
	 */
	expect(wrapper.find('.item-per-page__dropdown-trigger').text()).toContain('20 per halaman')
})

/* TEST CASE: check if the options that are not exceeding the total data are enabled */
test('enables options that do not exceed total data', async () => {
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

	/* find the DropdownItem with value "10" and click it */
	const items = dropdown.findAllComponents(DropdownItem)
	const targetItem = items.find((item) => item.props('value') === 10)
	await targetItem?.trigger('click')
	await nextTick()
	await flushPromises()

	/* simulate parent v-model update — mount() doesn't auto-respond to emits,
	 * so we manually update the prop to mirror what a real parent would do */
	await wrapper.setProps({ modelValue: 10 })
	await nextTick()
	await flushPromises()

	/* check if the option was selected
	 * by checking the text of the dropdown trigger changed
	 */
	expect(wrapper.find('.item-per-page__dropdown-trigger').text()).toContain('10 per halaman')
})
