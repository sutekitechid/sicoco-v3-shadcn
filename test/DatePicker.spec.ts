import { mount } from '@vue/test-utils'
import { test, expect, vi } from 'vitest'
import { DatePicker, DateFormatEnum } from '../lib/components/date-picker/index'
import { Button } from '../lib/components/button'
import { CalendarDate } from '@internationalized/date'
import Calendar from '../lib/components/calendar/Calendar.vue'
import RangeCalendar from '../lib/components/range-calendar/RangeCalendar.vue'
test('renders with default props', () => {
	const wrapper = mount(DatePicker, {
		props: {
			placeholder: 'Pick a date',
			formatDate: DateFormatEnum.STANDARD,
			class: 'custom-class',
		},
	})

	expect(wrapper.props().placeholder).toBe('Pick a date')
	expect(wrapper.props().formatDate).toBe(DateFormatEnum.STANDARD)
	expect(wrapper.props().dateRange).toBe(false)
	expect(wrapper.classes()).toContain('custom-class')
})

test('shows placeholder when no date is selected', () => {
	const wrapper = mount(DatePicker, {
		propsData: {
			placeholder: 'Pick a date',
			formatDate: DateFormatEnum.STANDARD,
		},
	})

	const button = wrapper.findComponent(Button)
	expect(button.text()).toContain('Pick a date')
})

test('shows formatted date when a single date is selected', async () => {
	const wrapper = mount(DatePicker, {
		props: {
			modelValue: new CalendarDate(2024, 12, 20),
			formatDate: DateFormatEnum.STANDARD,
		},
	})

	const button = wrapper.findComponent(Button)
	expect(button.text()).toContain('20-12-2024')
})

test('shows formatted date range when date range is selected', async () => {
	const wrapper = mount(DatePicker, {
		props: {
			start: new CalendarDate(2024, 12, 20),
			end: new CalendarDate(2024, 12, 22),
			dateRange: true,
			formatDate: DateFormatEnum.WITH_SHORT_MONTH_NAME,
		},
	})

	const button = wrapper.findComponent(Button)
	expect(button.text()).toContain('20 Des 2024 - 22 Des 2024') // assuming formatDate returns formatted date range
})

test('emits update:modelValue when a new date is selected', async () => {
	const newDate = new CalendarDate(2023, 5, 15)
	const wrapper = mount(DatePicker, {
		propsData: {
			formatDate: DateFormatEnum.STANDARD,
		},
	})

	const button = wrapper.findComponent(Button)
	await button.trigger('click')

	const calendar = wrapper.findComponent(Calendar)
	calendar.vm.$emit('update:modelValue', newDate)

	await wrapper.vm.$nextTick()

	const emittedModelValue = wrapper.emitted('update:modelValue')
	expect(emittedModelValue).toBeDefined()
	expect(emittedModelValue![0]).toEqual([newDate])
})

test('emits update:start and update:end when a date range is selected', async () => {
	const startDate = new CalendarDate(2023, 5, 10)
	const endDate = new CalendarDate(2023, 5, 15)

	const wrapper = mount(DatePicker, {
		propsData: {
			start: startDate,
			end: endDate,
			dateRange: true,
			formatDate: DateFormatEnum.STANDARD,
		},
	})

	const button = wrapper.findComponent(Button)
	await button.trigger('click')

	const rangeCalendar = wrapper.findComponent(RangeCalendar)
	rangeCalendar.vm.$emit('update:modelValue', {
		start: startDate,
		end: endDate,
	})

	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:start')).toBeDefined()
	expect(wrapper.emitted('update:end')).toBeDefined()

	expect(wrapper.emitted('update:start')).toHaveLength(1)
	expect(wrapper.emitted('update:end')).toHaveLength(1)

	expect(wrapper.emitted('update:start')![0]).toEqual([startDate])
	expect(wrapper.emitted('update:end')![0]).toEqual([endDate])
})
