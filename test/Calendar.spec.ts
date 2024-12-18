import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { Calendar } from '../lib/components/calendar'
import { CalendarDate } from '@internationalized/date'
import { ImportantDate } from '../lib/utils/date-picker-types'
const importantDates: ImportantDate[] = [
	{
		date: new CalendarDate(2023, 5, 15),
		color: '#c30000',
		tooltip: 'Important',
	},
	{
		date: new CalendarDate(2023, 5, 20),
		color: '#ffa800',
		tooltip: 'Another Important',
	},
]

test('renders correctly with props', () => {
	const selectedDate = new CalendarDate(2023, 5, 18)

	const wrapper = mount(Calendar, {
		props: {
			defaultValue: selectedDate,
			importantDates: importantDates,
			class: 'custom-class',
		},
	})

	console.log('wrapper', wrapper.props())

	expect(wrapper.classes()).toContain('custom-class')
	expect(wrapper.props().importantDates).toStrictEqual(importantDates)
	expect(wrapper.props().defaultValue).toStrictEqual(selectedDate)
})

test('emits correct value on cell click', async () => {
	const updateValue = new CalendarDate(2024, 12, 24)
	const wrapper = mount(Calendar, {
		props: {
			importantDates,
			modelValue: new CalendarDate(2024, 12, 25),
		},
	})

	wrapper.vm.$emit('update:modelValue', updateValue)

	const emittedModelValue = wrapper.emitted('update:modelValue')
	expect(emittedModelValue).toBeDefined()
	expect(emittedModelValue![0]).toEqual([updateValue])
})
