import { mount, flushPromises } from '@vue/test-utils'
import { test, expect, vi, describe, it } from 'vitest'
import { defineComponent, ref, nextTick, h } from 'vue'
import DropdownItem from '../lib/components/dropdown/DropdownItem.vue'
import { Checkbox } from '../lib/components/checkbox'

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

	expect(wrapper.classes()).toContain('text-grey-90')
	expect(wrapper.classes()).toContain('bg-grey-10')
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

//TODO: unit test render checkbox if multiple
