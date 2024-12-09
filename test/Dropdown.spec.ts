import { mount } from '@vue/test-utils'
import { describe, test, expect, it } from 'vitest'
import { defineComponent, ref, nextTick, h } from 'vue'
import Dropdown from '../lib/components/dropdown/Dropdown.vue'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'
import Checkbox from '../lib/components/checkbox/Checkbox.vue'
import Input from '../lib/components/input/Input.vue'
test('should render class', () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			class: 'test-class',
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.classes()).toContain('test-class')
})

it('should render placeholder correctly on trigger button', () => {
	const placeholderText = 'Select an option'
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: undefined,
			placeholder: placeholderText,
		},
	})

	const triggerButton = wrapper.find('#triggerButtonDropdown')

	expect(triggerButton.text()).toContain(placeholderText)
})

test('should render slot', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
		slots: {
			default: `
      <dropdown-item value="option1">Option 1</dropdown-item>
      <dropdown-item value="option2">Option 2</dropdown-item>`,
		},
		global: {
			stubs: {
				'dropdown-item': DropdownItem,
			},
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.text()).toContain('Option 1')
	expect(wrapper.text()).toContain('Option 2')
})

test('should open and close dropdown when click', async () => {
	const wrapper = mount(Dropdown, {})

	expect(wrapper.vm.open).toBe(false)

	const triggerButton = wrapper.find('#triggerButtonDropdown')
	await triggerButton.trigger('click')

	expect(wrapper.vm.open).toBe(true)

	const dropdownContent = wrapper.find('.block')
	expect(dropdownContent.exists()).toBe(true)
	expect(dropdownContent.isVisible()).toBe(true)
})

test('should emit select event when item is clicked', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
		slots: {
			default: `
      <dropdown-item value="option1">Option 1</dropdown-item>
      <dropdown-item value="option2">Option 2</dropdown-item>`,
		},
		global: {
			stubs: {
				'dropdown-item': DropdownItem,
			},
		},
	})

	const item = wrapper.findComponent({ name: 'dropdown-item' })
	await item.trigger('click')

	expect(wrapper.emitted()).toHaveProperty('select')
	expect(wrapper.emitted('select')[0]).toEqual(['option1'])
})

test('should not open dropdown when disabled', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			disabled: true,
		},
	})

	const triggerButton = wrapper.find('#triggerButtonDropdown')
	await triggerButton.trigger('click')

	expect(wrapper.vm.open).toBe(false)
	expect(wrapper.find('.block').exists()).toBe(false)
})

test('dropdown should be required', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: undefined,
			required: true,
		},
	})
	const triggerButton = wrapper.find('#triggerButtonDropdown')
	await triggerButton.trigger('click')
	expect(wrapper.html()).toContain('Wajib diisi')
})

test('should display search input when searchable true', () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: [],
			searchable: true,
		},
		global: {
			stubs: {
				Input,
			},
		},
	})

	const searchInput = wrapper.findComponent(Input)
	expect(searchInput.exists()).toBe(true)
})

test('should display checkbox when multiple are true', () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: [],
			multiple: true,
		},
		global: {
			stubs: {
				Checkbox,
			},
		},
	})

	const checkbox = wrapper.findComponent(Checkbox)
	console.log('checkbox', checkbox.html())
	expect(checkbox.exists()).toBe(true)
})

test('should emit search event with correct value', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: '',
			searchable: true,
		},
		global: {
			stubs: {
				Input,
			},
		},
	})

	const searchInput = wrapper.findComponent(Input)

	const searchValue = 'testing'
	await searchInput.setValue(searchValue)

	expect(wrapper.emitted('typing')).toBeTruthy()
	expect(wrapper.emitted('typing')[0]).toEqual([searchValue])
})
