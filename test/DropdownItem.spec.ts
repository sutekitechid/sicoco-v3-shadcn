import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'
import {
	DropdownItemType,
	dropdownItemType,
} from '../lib/components/dropdown/index.ts'

test('should render class', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
			class: 'test-class',
		},
	})

	expect(wrapper.exists()).toBe(true)
	expect(wrapper.classes()).toContain('test-class')
})

test('should render data-dropdown-item attribute correctly object', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: {
				label: 'Search',
				value: 'option1',
				icons: 'si-search',
			},
			disabled: false,
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.attributes('data-dropdown-item')).toBe(
		JSON.stringify({
			label: 'Search',
			value: 'option1',
			icons: 'si-search',
		})
	)
})
test('should render data-dropdown-item attribute correctly string', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
			disabled: false,
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.attributes('data-dropdown-item')).toBe(
		JSON.stringify('option1')
	)
})

test('should apply class disabled when disabled is true', async () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
			disabled: true,
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.classes()).toContain('text-neutral-500')
	expect(wrapper.classes()).toContain('bg-neutral-300')
	expect(wrapper.classes()).toContain('cursor-not-allowed')
})

test('should render content from default slot', () => {
	const wrapper = mount(DropdownItem, {
		props: {
			value: 'option1',
		},
		slots: {
			default: 'Item 1',
		},
	})

	expect(wrapper.exists()).toBe(true)

	expect(wrapper.text()).toContain('Item 1')
})

test('returns MultipleSelect when isMultipleSelect and isSelected are true', () => {
	const result = dropdownItemType(true, true, false)
	expect(result).toBe(DropdownItemType.MultipleSelect)
})

test('returns Selected when only isSelected is true', () => {
	const result = dropdownItemType(false, true, false)
	expect(result).toBe(DropdownItemType.Selected)
})

test('returns Disabled when only isDisabled is true', () => {
	const result = dropdownItemType(false, false, true)
	expect(result).toBe(DropdownItemType.Disabled)
})

test('returns Default when all parameters are false', () => {
	const result = dropdownItemType(false, false, false)
	expect(result).toBe(DropdownItemType.Default)
})

test('prioritizes MultipleSelect over other types', () => {
	const result = dropdownItemType(true, true, true)
	expect(result).toBe(DropdownItemType.MultipleSelect)
})

test('prioritizes Selected over Disabled when isSelected is true', () => {
	const result = dropdownItemType(false, true, true)
	expect(result).toBe(DropdownItemType.Selected)
})

//TODO: unit test render checkbox if multiple
