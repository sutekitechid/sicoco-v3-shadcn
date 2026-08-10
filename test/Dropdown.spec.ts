import { flushPromises, mount } from '@vue/test-utils'
import { test, expect, it } from 'vitest'
import Dropdown from '../lib/components/dropdown/Dropdown.vue'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'
import DropdownSelectedItem from '../lib/components/dropdown/DropdownSelectedItem.vue'
import Checkbox from '../lib/components/checkbox/Checkbox.vue'
import Input from '../lib/components/input/Input.vue'
import {
	selectMultipleOptions,
	selectSingleOption,
	getDropdownContentContainerWidth,
} from '../lib/components/dropdown/index.ts'
import DropdownContent from '../lib/components/dropdown/DropdownContent.vue'

test('should render class', () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			class: 'test-class',
		},
	})

	expect(wrapper.exists()).toBe(true)

	const trigger = wrapper.find('button')
	expect(trigger.exists()).toBe(true)
	expect(trigger.classes()).toContain('test-class')
})

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

test('should render slot', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
		slots: {
			default: `
        <DropdownItem value="option1">Option 1</DropdownItem>
        <DropdownItem value="option2">Option 2</DropdownItem>
      `,
		},
		global: {
			components: {
				DropdownItem,
			},
		},
	})

	await flushPromises()

	expect(wrapper.text()).toContain('Option 1')
	expect(wrapper.text()).toContain('Option 2')
})

test('should open and close dropdown when click', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
		slots: {
			default: `
        <DropdownItem value="option1">Option 1</DropdownItem>
        <DropdownItem value="option2">Option 2</DropdownItem>
      `,
		},
		global: {
			components: {
				DropdownItem,
				DropdownContent,
			},
		},
	})

	await flushPromises()

	// Initially dropdown should be closed - DropdownContent should not exist
	let dropdownContent = wrapper.findComponent(DropdownContent)
	expect(dropdownContent.exists()).toBe(false)

	// Hidden div should exist for closed state
	const hiddenDiv = wrapper.find('.hidden')
	expect(hiddenDiv.exists()).toBe(true)

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')
	await flushPromises()
})

test('should emit select event when item is clicked', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
		slots: {
			default: `
				<DropdownItem value="option2">Option 2</DropdownItem>
				<DropdownItem value="option1">Option 1</DropdownItem>`,
		},
		global: {
			components: {
				DropdownItem: DropdownItem,
			},
		},
	})

	setTimeout(async function () {
		const item = wrapper.findComponent(DropdownItem)
		await item.trigger('click')

		console.log('emitted', wrapper.emitted('select'))

		expect(wrapper.emitted()).toHaveProperty('select')
		expect(wrapper.emitted('select')).toBeDefined()
		expect(wrapper.emitted('select')![0]).toEqual(['option2'])
	}, 100)
})

test('should not open dropdown when disabled', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
			disabled: true,
		},
		global: {
			components: {
				DropdownContent,
			},
		},
	})

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')

	// DropdownContent should not exist when disabled and not opened
	const dropdownContent = wrapper.findComponent(DropdownContent)
	expect(dropdownContent.exists()).toBe(false)

	// Hidden div should exist for closed state
	const hiddenDiv = wrapper.find('.hidden')
	expect(hiddenDiv.exists()).toBe(true)
})

test('DropdownContent should not be available when dropdown is closed', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: 'option1',
		},
		slots: {
			default: `
				<DropdownItem value="option1">Option 1</DropdownItem>
				<DropdownItem value="option2">Option 2</DropdownItem>
			`,
		},
		global: {
			components: {
				DropdownItem,
				DropdownContent,
			},
		},
	})

	await flushPromises()

	// Initially, DropdownContent should not exist in DOM (closed state)
	let dropdownContent = wrapper.findComponent(DropdownContent)
	expect(dropdownContent.exists()).toBe(false)

	// But hidden div with slot content should exist
	const hiddenDiv = wrapper.find('.hidden')
	expect(hiddenDiv.exists()).toBe(true)
	expect(hiddenDiv.text()).toContain('Option 1')
	expect(hiddenDiv.text()).toContain('Option 2')

	// Open dropdown
	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')

	// Now DropdownContent should exist
	dropdownContent = wrapper.findComponent(DropdownContent)
	expect(dropdownContent.exists()).toBe(true)

	// And hidden div should no longer exist (v-if/v-else logic)
	const hiddenDivAfterOpen = wrapper.find('.hidden')
	expect(hiddenDivAfterOpen.exists()).toBe(false)
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
	setTimeout(() => {
		expect(wrapper.html()).toContain('harus di isi')
	}, 50)
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
	setTimeout(() => {
		expect(wrapper.html()).toContain('Value bukan option2')
	}, 50)
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
	}, 150)
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
	}, 150)
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
		expect(wrapper.emitted('typing')?.[0]).toEqual([searchValue])
	}, 150)
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

test('getDropdownContentContainerWidth: enforces the minimum dropdown width', () => {
	const width = 150
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('width: 18rem')
})

test('getDropdownContentContainerWidth: handles zero width with the minimum dropdown width', () => {
	const width = 0
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('width: 18rem')
})

test('getDropdownContentContainerWidth: handles negative width with the minimum dropdown width', () => {
	const width = -50
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('width: 18rem')
})

test('getDropdownContentContainerWidth: handles large width', () => {
	const width = 1000
	const result = getDropdownContentContainerWidth(width)
	expect(result).toBe('width: 1000px')
})

test('should show selected count in trigger when multiple', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: ['option1', 'option2'],
			multiple: true,
		},
		slots: {
			default: `
				<DropdownItem value="option1">Option 1</DropdownItem>
				<DropdownItem value="option2">Option 2</DropdownItem>
				<DropdownItem value="option3">Option 3</DropdownItem>
			`,
		},
		global: {
			components: { DropdownItem },
		},
	})

	await flushPromises()

	const trigger = wrapper.find('.dropdown__dropdown-trigger')
	expect(trigger.text()).toContain('items selected')
	expect(trigger.text()).toContain('2')
})

test('should render badges in dropdown content when multiple items selected', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: ['option1', 'option2'],
			multiple: true,
		},
		slots: {
			default: `
				<DropdownItem value="option1">Option 1</DropdownItem>
				<DropdownItem value="option2">Option 2</DropdownItem>
				<DropdownItem value="option3">Option 3</DropdownItem>
			`,
		},
		global: {
			components: { DropdownItem, DropdownSelectedItem },
		},
	})

	await flushPromises()

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')
	await flushPromises()

	const badges = wrapper.findAllComponents(DropdownSelectedItem)
	expect(badges.length).toBe(2)
})

test('should not render badges when no items selected in multiple mode', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: [],
			multiple: true,
		},
		slots: {
			default: `
				<DropdownItem value="option1">Option 1</DropdownItem>
			`,
		},
		global: {
			components: { DropdownItem, DropdownSelectedItem },
		},
	})

	await flushPromises()

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')
	await flushPromises()

	const badges = wrapper.findAllComponents(DropdownSelectedItem)
	expect(badges.length).toBe(0)
})

test('should emit update:modelValue when badge is closed', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: ['option1', 'option2'],
			multiple: true,
		},
		slots: {
			default: `
				<DropdownItem value="option1">Option 1</DropdownItem>
				<DropdownItem value="option2">Option 2</DropdownItem>
			`,
		},
		global: {
			components: { DropdownItem, DropdownSelectedItem },
		},
	})

	await flushPromises()

	const triggerButton = wrapper.find('.dropdown__dropdown-trigger')
	await triggerButton.trigger('click')
	await flushPromises()

	const badge = wrapper.findComponent(DropdownSelectedItem)
	await badge.find('.si-heroicon-solid-x-mark').trigger('click')
	await flushPromises()

	expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	expect(wrapper.emitted('update:modelValue')![0]).toEqual([['option2']])
})
