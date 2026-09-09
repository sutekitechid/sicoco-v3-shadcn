import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { RangeCalendar } from '../lib/components/range-calendar'
import DatePicker from '../lib/components/date-picker/DatePicker.vue'
import DatepickerEditableTrigger from '../lib/components/date-picker/DatepickerEditableTrigger.vue'
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

test('clicking a new date after range is selected resets the range', async () => {
	const initialStart = new CalendarDate(2025, 1, 10)
	const initialEnd = new CalendarDate(2025, 1, 20)
	const newDate = new CalendarDate(2025, 1, 25)

	const wrapper = mount(RangeCalendar, {
		props: {
			defaultValue: { start: initialStart, end: initialEnd },
			numberOfMonths: 1,
		},
	})

	await wrapper.vm.$nextTick()

	const cellTrigger = wrapper.find(`[data-value="${newDate.toString()}"]`)
	expect(cellTrigger.exists()).toBe(true)

	await cellTrigger.trigger('click')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeTruthy()

	const lastEmitted = emitted![emitted!.length - 1][0] as DateRange
	expect(lastEmitted.start).toBeDefined()
	expect(lastEmitted.start!.day).toBe(25)
	expect(lastEmitted.start!.month).toBe(1)
	expect(lastEmitted.start!.year).toBe(2025)
	expect(lastEmitted.end).toBeUndefined()
})

test('clicking a new date after a complete range starts a new range via DatePicker', async () => {
	const initialStart = new CalendarDate(2025, 1, 10)
	const initialEnd = new CalendarDate(2025, 1, 20)

	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			start: initialStart,
			end: initialEnd,
			dataCy: 'datepicker-reset-test',
		},
	})

	await wrapper.find('[data-cy="datepicker-reset-test-calendar-icon"]').trigger('click')
	await wrapper.vm.$nextTick()

	const rangeCalendar = wrapper.findComponent(RangeCalendar)
	expect(rangeCalendar.exists()).toBe(true)

	// Clicking a new date while a complete range exists must start a new
	// (pending) range with the clicked date as its start.
	const newStartDate = new CalendarDate(2025, 1, 25)
	const newStartTrigger = wrapper.find(`[data-value="${newStartDate.toString()}"]`)
	expect(newStartTrigger.exists()).toBe(true)
	await newStartTrigger.trigger('focusin')
	await newStartTrigger.trigger('click')
	await wrapper.vm.$nextTick()

	const calendarModel = rangeCalendar.props('modelValue') as DateRange
	expect(calendarModel.start!.day).toBe(25)
	expect(calendarModel.end).toBeUndefined()

	expect(newStartTrigger.attributes('data-selected')).toBeDefined()
	expect(wrapper.find(`[data-value="${initialStart.toString()}"]`).attributes('data-selected')).toBeUndefined()
	expect(wrapper.find(`[data-value="${initialEnd.toString()}"]`).attributes('data-selected')).toBeUndefined()

	const emitted = rangeCalendar.emitted('update:modelValue') ?? []
	const extendedOldRange = emitted.some((payload: unknown[]) => {
		const value = payload[0] as DateRange | undefined
		return value?.start?.day === 10 && value?.end?.day === 25
	})
	expect(extendedOldRange).toBe(false)

	// The second click completes the new range and Apply becomes available.
	const newEndDate = new CalendarDate(2025, 1, 28)
	const newEndTrigger = wrapper.find(`[data-value="${newEndDate.toString()}"]`)
	await newEndTrigger.trigger('focusin')
	await newEndTrigger.trigger('click')
	await wrapper.vm.$nextTick()

	const applyButton = wrapper.findAll('button').find((button) => button.text() === 'Terapkan')
	expect(applyButton).toBeDefined()
	expect(applyButton!.attributes('disabled')).toBeUndefined()
	await applyButton!.trigger('click')

	const startEmittedList = wrapper.emitted('update:start')!
	const endEmittedList = wrapper.emitted('update:end')!
	const startEmitted = startEmittedList[startEmittedList.length - 1][0] as CalendarDate
	const endEmitted = endEmittedList[endEmittedList.length - 1][0] as CalendarDate
	expect(startEmitted.day).toBe(25)
	expect(endEmitted.day).toBe(28)
})

test('typing a new start date while a complete range exists clears the end', async () => {
	const initialStart = new CalendarDate(2025, 1, 10)
	const initialEnd = new CalendarDate(2025, 1, 20)
	const newStart = new CalendarDate(2025, 3, 15)

	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			start: initialStart,
			end: initialEnd,
			dataCy: 'datepicker-typed-start-test',
		},
	})

	const editableTrigger = wrapper.findComponent(DatepickerEditableTrigger)
	expect(editableTrigger.exists()).toBe(true)
	editableTrigger.vm.$emit('update:start', newStart)
	await wrapper.vm.$nextTick()

	const rangeCalendar = wrapper.findComponent(RangeCalendar)
	const calendarModel = rangeCalendar.props('modelValue') as DateRange
	expect(calendarModel.start!.day).toBe(15)
	expect(calendarModel.start!.month).toBe(3)
	expect(calendarModel.end).toBeNull()

	// The Apply button stays disabled until the new range is completed.
	const applyButton = wrapper.findAll('button').find((button) => button.text() === 'Terapkan')
	expect(applyButton).toBeDefined()
	expect(applyButton!.attributes('disabled')).toBeDefined()

	// Completing the new range via the end field adjusts the end in place.
	const newEnd = new CalendarDate(2025, 3, 20)
	editableTrigger.vm.$emit('update:end', newEnd)
	await wrapper.vm.$nextTick()

	const completedModel = rangeCalendar.props('modelValue') as DateRange
	expect(completedModel.start!.day).toBe(15)
	expect(completedModel.end!.day).toBe(20)
})

test('typing a new end date while a complete range exists adjusts the end', async () => {
	const initialStart = new CalendarDate(2025, 1, 10)
	const initialEnd = new CalendarDate(2025, 1, 20)
	const newEnd = new CalendarDate(2025, 2, 1)

	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			start: initialStart,
			end: initialEnd,
			dataCy: 'datepicker-typed-end-test',
		},
	})

	const editableTrigger = wrapper.findComponent(DatepickerEditableTrigger)
	editableTrigger.vm.$emit('update:end', newEnd)
	await wrapper.vm.$nextTick()

	const rangeCalendar = wrapper.findComponent(RangeCalendar)
	const calendarModel = rangeCalendar.props('modelValue') as DateRange
	expect(calendarModel.start!.day).toBe(10)
	expect(calendarModel.end!.day).toBe(1)
	expect(calendarModel.end!.month).toBe(2)
})
