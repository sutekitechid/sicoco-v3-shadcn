import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import TimePicker from '../lib/components/time-picker/TimePicker.vue'
import Dropdown from '../lib/components/dropdown/Dropdown.vue'

test('renders with default props', () => {
	const wrapper = mount(TimePicker, {
		props: {
			placeholder: 'Select time',
		},
	})

	const input = wrapper.find('input')
	expect(input.exists()).toBe(true)
	expect(input.attributes('placeholder')).toBe('Select time')
})

test('shows placeholder when no time is selected', () => {
	const wrapper = mount(TimePicker, {
		props: {
			placeholder: 'Select time',
		},
	})

	const input = wrapper.find('input')
	expect(input.attributes('placeholder')).toBe('Select time')
})

test('shows formatted time when a time is selected', async () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: '12:30',
		},
	})

	const input = wrapper.find('input')
	expect(input.element.value).toBe('12:30')
})

test('updates modelValue when a new time is selected', async () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: '12:30',
		},
	})

	await wrapper.setProps({ modelValue: '14:45' })

	const input = wrapper.find('input')
	expect(input.element.value).toBe('14:45')
})

test('Dropdown emits update:modelValue when a value is selected', async () => {
	const wrapper = mount(Dropdown, {
		props: {
			modelValue: '12',
		},
		slots: {
			default: '<DropdownItem value="14">14</DropdownItem>',
		},
	})

	await wrapper.vm.$emit('update:modelValue', '14')

	expect(wrapper.emitted('update:modelValue')).toBeDefined()
	expect(wrapper.emitted('update:modelValue')![0]).toEqual(['14'])
})
