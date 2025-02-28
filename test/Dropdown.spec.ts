import { mount } from '@vue/test-utils'
import { test, expect, it } from 'vitest'
import Dropdown from '../lib/components/dropdown/Dropdown.vue'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'
import Checkbox from '../lib/components/checkbox/Checkbox.vue'
import Input from '../lib/components/input/Input.vue'
import {
	selectMultipleOptions,
	selectSingleOption,
	getDropdownContentContainerWidth,
} from '../lib/components/dropdown/index.ts'
// test('should render class', () => {
// 	const wrapper = mount(Dropdown, {
// 		props: {
// 			modelValue: 'option1',
// 			class: 'test-class',
// 		},
// 	})

// 	expect(wrapper.exists()).toBe(true)
// 	expect(wrapper.classes()).toContain('test-class')
// })

it('should render placeholder correctly on trigger button', () => {
	const placeholderText = 'Select an option'
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: undefined,
			placeholder: placeholderText,
		},
	})

	expect(wrapper.html()).toContain(placeholderText)
})

// test('should render slot', async () => {
// 	const wrapper = mount(Dropdown, {
// 		props: {
// 			modelValue: 'option1',
// 		},
// 		slots: {
// 			default: `
//       <dropdown-item value="option1">Option 1</dropdown-item>
//       <dropdown-item value="option2">Option 2</dropdown-item>`,
// 		},
// 		global: {
// 			stubs: {
// 				'dropdown-item': DropdownItem,
// 			},
// 		},
// 	})

// 	expect(wrapper.exists()).toBe(true)
// 	expect(wrapper.text()).toContain('Option 1')
// 	expect(wrapper.text()).toContain('Option 2')
// })

test('should open and close dropdown when click', async () => {
	const wrapper = mount(Dropdown, {})

	expect(wrapper.vm.open).toBe(false)

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
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
      <dropdown-item value="option2">Option 2</dropdown-item>
      <dropdown-item value="option1">Option 1</dropdown-item>`,
		},
		global: {
			components: {
				'dropdown-item': DropdownItem,
			},
		},
	})

	setTimeout(async function () {
		const item = wrapper.findComponent(DropdownItem)
		await item.trigger('click')

		console.log('emitted', wrapper.emitted('select'))

		expect(wrapper.emitted()).toHaveProperty('select')
		expect(wrapper.emitted('select')[0]).toEqual(['option2'])
	}, 100)
})

test('should not open dropdown when disabled', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			disabled: true,
		},
	})

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')

	expect(wrapper.vm.open).toBe(false)
})

test('dropdown should be required', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: undefined,
			required: true,
		},
		slots: {
			required:
				'<template #required="{ validation }"><p v-if="validation.required.$invalid">harus di isi</p> </template>',
		},
	})
	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')
	expect(wrapper.html()).toContain('harus di isi')
})

test('dropdown have custom validators', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			customValidators: { checkValue: value => value === 'option2' },
		},
		slots: {
			errors:
				'<template #errors="{ validation }"><p v-if="validation.checkValue.$invalid">Value bukan option2</p></template>',
		},
	})
	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')
	expect(wrapper.html()).toContain('Value bukan option2')
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

	setTimeout(function () {
		const searchInput = wrapper.findComponent(Input)
		expect(searchInput.exists()).toBe(true)
	}, 100)
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

	setTimeout(function () {
		const checkbox = wrapper.findComponent(Checkbox)
		expect(checkbox.exists()).toBe(true)
	}, 100)
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

	setTimeout(async function () {
		const searchInput = wrapper.findComponent(Input)

		const searchValue = 'testing'
		await searchInput.setValue(searchValue)

		expect(wrapper.emitted('typing')).toBeTruthy()
		expect(wrapper.emitted('typing')[0]).toEqual([searchValue])
	}, 100)
})

test('selectOption: returns current value if multiple selection is not enabled', () => {
	const selectedValue = 'newOption'
	const result = selectSingleOption(selectedValue)
	expect(result).toBe(selectedValue)
})

test('selectOption: adds option if multiple selection is enabled', () => {
	const currentValue = ['value1', 'value2']
	const selectedValue = 'newOption'
	const result = selectMultipleOptions(currentValue, selectedValue)
	expect(result).toEqual(['value1', 'value2', 'newOption'])
})

test('selectOption: removes option if it already exists in multiple selection mode', () => {
	const currentValue = ['value1', 'newOption']
	const selectedValue = 'newOption'
	const result = selectMultipleOptions(currentValue, selectedValue)
	expect(result).toEqual(['value1'])
})

test('selectOption: handles empty current value in multiple selection mode', () => {
	const currentValue: string[] = []
	const selectedValue = 'newOption'
	const result = selectMultipleOptions(currentValue, selectedValue)
	expect(result).toEqual(['newOption'])
})

test('selectOption: handles invalid option types gracefully', () => {
	const selectedValue = null
	const result = selectSingleOption(selectedValue)
	expect(result).toBe(selectedValue)
})

test('getDropdownContentContainerWidth: returns correct CSS min-width style', () => {
	const width = 150
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('min-width: 150px')
})

test('getDropdownContentContainerWidth: handles zero width', () => {
	const width = 0
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('min-width: 0px')
})

test('getDropdownContentContainerWidth: handles negative width gracefully', () => {
	const width = -50
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('min-width: -50px')
})

test('getDropdownContentContainerWidth: handles large width', () => {
	const width = 1000
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('min-width: 1000px')
})
