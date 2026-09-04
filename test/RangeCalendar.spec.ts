import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { RangeCalendar } from '../lib/components/range-calendar'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { ImportantDate } from '../lib/utils/date-picker-types'
import { DateRange } from 'reka-ui'
import Monthpicker from '../lib/components/monthpicker/Monthpicker.vue'
import MonthpickerComponent from '../lib/components/monthpicker/MonthpickerComponent.vue'
import RangeCalendarHeading from '../lib/components/range-calendar/RangeCalendarHeading.vue'
import Yearpicker from '../lib/components/yearpicker/Yearpicker.vue'
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

test('renders one calendar and one heading when numberOfMonths is one', () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
			numberOfMonths: 1,
		},
	})

	expect(wrapper.findAllComponents(RangeCalendarHeading)).toHaveLength(1)
	expect(wrapper.findAll('table')).toHaveLength(1)
})

test('renders range cell connector without a vertical offset', () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
		},
	})

	const cell = wrapper.find('td')
	expect(cell.exists()).toBe(true)
	expect(cell.classes()).toContain('before:inset-y-0')
	expect(cell.classes()).not.toContain('before:-mt-px')
})

test('rounds range cells only at selection boundaries', () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
		},
	})

	const cell = wrapper.find('td')
	expect(cell.classes()).not.toContain('first:has-data-selected:rounded-l')
	expect(cell.classes()).not.toContain('last:has-data-selected:rounded-r')
	expect(cell.classes()).toContain(
		'[&:has([data-selected][data-selection-start])]:rounded-l'
	)
	expect(cell.classes()).toContain(
		'[&:has([data-selected][data-selection-end])]:rounded-r'
	)
	expect(cell.classes()).toContain(
		'[&:has([data-selected][data-selection-end])]:before:hidden'
	)
})

test('shows both month pickers when either range heading is clicked', async () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
		},
	})

	const headings = wrapper.findAllComponents(RangeCalendarHeading)
	expect(headings).toHaveLength(2)
	await headings[0].trigger('click')

	expect(wrapper.findAllComponents(Monthpicker)).toHaveLength(2)
})

test('closes both month pickers after selecting a month', async () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
		},
	})

	await wrapper.findAllComponents(RangeCalendarHeading)[1].trigger('click')
	const monthPickers = wrapper.findAllComponents(Monthpicker)
	monthPickers[0].vm.$emit('month-change')
	await wrapper.vm.$nextTick()

	expect(wrapper.findAllComponents(Monthpicker)).toHaveLength(0)
})

test('shows both year pickers when a month picker opens year selection', async () => {
	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: selectedRangeDate,
		},
	})

	await wrapper.findAllComponents(RangeCalendarHeading)[0].trigger('click')
	wrapper.findAllComponents(MonthpickerComponent)[0].vm.$emit('year-click', new Event('click'))
	await wrapper.vm.$nextTick()

	expect(wrapper.findAllComponents(Yearpicker)).toHaveLength(2)

	wrapper.findAllComponents(Yearpicker)[0].vm.$emit('select-year', selectedRangeDate.start)
	await wrapper.vm.$nextTick()

	expect(wrapper.findAllComponents(MonthpickerComponent)).toHaveLength(2)
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
