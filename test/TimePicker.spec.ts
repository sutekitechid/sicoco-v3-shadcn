import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import TimePicker from '../lib/components/time-picker/TimePicker.vue'
import { CalendarDateTime } from '@internationalized/date'

test('renders with default props', () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: new CalendarDateTime(2024, 12, 25, 0, 0),
		},
	})

	const input = wrapper.find('input')
	expect(input.exists()).toBe(true)
	expect(input.attributes('placeholder')).toBe('Select time')
})

test('shows placeholder when no time is selected', () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: new CalendarDateTime(2024, 12, 25, 0, 0),
			placeholder: 'Select time',
		},
	})

	const input = wrapper.find('input')
	expect(input.attributes('placeholder')).toBe('Select time')
})

test('shows formatted time when a time is selected', async () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: new CalendarDateTime(2024, 12, 25, 12, 30),
		},
	})

	const input = wrapper.find('input')
	expect(input.element.value).toBe('12:30')
})

test('updates modelValue when a new time is selected', async () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: new CalendarDateTime(2024, 12, 25, 12, 30),
		},
	})

	await wrapper.setProps({
		modelValue: new CalendarDateTime(2024, 12, 25, 14, 45),
	})

	const input = wrapper.find('input')
	expect(input.element.value).toBe('14:45')
})

test('emits update:modelValue when a new time is selected', async () => {
	const wrapper = mount(TimePicker, {
		props: {
			modelValue: new CalendarDateTime(2024, 12, 25, 12, 30),
		},
	})

	await wrapper.vm.$emit(
		'update:modelValue',
		new CalendarDateTime(2024, 12, 25, 14, 30)
	)

	await wrapper.vm.$emit(
		'update:modelValue',
		new CalendarDateTime(2024, 12, 25, 14, 45)
	)

	expect(wrapper.emitted('update:modelValue')).toBeDefined()
	const emittedValues = wrapper.emitted('update:modelValue')!

	const emittedValue = emittedValues[
		emittedValues.length - 1
	][0] as CalendarDateTime
	expect(emittedValue.hour).toBe(14)
	expect(emittedValue.minute).toBe(45)
	expect(emittedValue.toString()).toBe('2024-12-25T14:45:00')
})
