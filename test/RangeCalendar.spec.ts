import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { RangeCalendar } from '../lib/components/range-calendar'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { ImportantDate } from '../lib/utils/date-picker-types'
import { DateRange } from 'reka-ui'
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

const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const selectedRangeDate = {
	start,
	end,
} as DateRange

test('renders correctly with props', () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
			importantDates: importantDates,
			class: 'custom-class',
		},
	})

	expect(wrapper.classes()).toContain('custom-class')
	expect(wrapper.props().importantDates).toStrictEqual(importantDates)
	expect(wrapper.props().defaultValue).toStrictEqual(selectedRangeDate)
})

test('emits correct value on cell click', async () => {
	const updateValue = new CalendarDate(2024, 12, 24)
	const wrapper = mount(RangeCalendar, {
		props: {
			importantDates,
			defaultValue: selectedRangeDate,
		},
	})

	wrapper.vm.$emit('update:modelValue', updateValue)

	const emittedModelValue = wrapper.emitted('update:modelValue')
	expect(emittedModelValue).toBeDefined()
	expect(emittedModelValue![0]).toEqual([updateValue])
})
