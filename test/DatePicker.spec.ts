import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { DatePicker, DateFormatEnum } from '../lib/components/date-picker/index'
import DatepickerEditableTrigger from '../lib/components/date-picker/DatepickerEditableTrigger.vue'
import { CalendarDate } from '@internationalized/date'
import Calendar from '../lib/components/calendar/Calendar.vue'
import RangeCalendar from '../lib/components/range-calendar/RangeCalendar.vue'
import Drawer from '../lib/components/drawer/Drawer.vue'
import DatePickerDesktopContainer from '../lib/components/date-picker/DatePickerDesktopContainer.vue'
import DatePickerMobileContainer from '../lib/components/date-picker/DatePickerMobileContainer.vue'

const dataCy = 'datepicker-test'

type Wrapper = ReturnType<typeof mount<typeof DatePicker>>

async function enterEditMode(wrapper: Wrapper) {
	const display = wrapper.find(`[data-cy="${dataCy}-display"]`)
	if (display.exists()) {
		await display.trigger('click')
		await wrapper.vm.$nextTick()
	}
}

async function typeInto(input: ReturnType<Wrapper['find']>, value: string) {
	await input.setValue(value)
	await input.trigger('input')
}

function getDayInput(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-day"]`)
}
function getMonthInput(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-month"]`)
}
function getYearInput(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-year"]`)
}
function getEndDayInput(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-end-day"]`)
}
function getEndMonthInput(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-end-month"]`)
}
function getEndYearInput(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-end-year"]`)
}
function getDisplay(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-display"]`)
}
function getCalendarIcon(wrapper: Wrapper) {
	return wrapper.find(`[data-cy="${dataCy}-calendar-icon"]`)
}
function getTriggerContainer(wrapper: Wrapper) {
	return getDayInput(wrapper).element.parentElement
}

function dispatchTouchEvent(element: Element, type: 'touchstart' | 'touchend', x: number, y: number) {
	const event = new Event(type)
	Object.defineProperty(event, type === 'touchstart' ? 'touches' : 'changedTouches', {
		value: [{ clientX: x, clientY: y }],
	})
	element.dispatchEvent(event)
}

async function swipeCalendar(wrapper: Wrapper, calendar: ReturnType<Wrapper['findComponent']>, startX: number, endX: number, startY = 0, endY = 0) {
	dispatchTouchEvent(calendar.element, 'touchstart', startX, startY)
	dispatchTouchEvent(calendar.element, 'touchend', endX, endY)
	await wrapper.vm.$nextTick()
}

function getActionButton(wrapper: Wrapper, label: string) {
	return wrapper.findAll('button').find(button => button.text() === label)
}

test('renders with default props', () => {
	const wrapper = mount(DatePicker, {
		props: {
			placeholder: 'Pick a date',
			formatDate: DateFormatEnum.STANDARD,
			class: 'custom-class',
			dataCy,
		},
	})

	expect(wrapper.props().placeholder).toBe('Pick a date')
	expect(wrapper.props().formatDate).toBe(DateFormatEnum.STANDARD)
	expect(wrapper.props().dateRange).toBe(false)
	expect(wrapper.findComponent(DatePickerDesktopContainer).exists()).toBe(true)

	// Initial state is display mode with placeholder
	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(true)
	expect(display.text()).toBe('DD/MM/YYYY')
})

test('shows placeholder display when no date is selected', () => {
	const wrapper = mount(DatePicker, {
		props: {
			placeholder: 'Pick a date',
			formatDate: DateFormatEnum.STANDARD,
			dataCy,
		},
	})

	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(true)
	expect(display.text()).toBe('DD/MM/YYYY')
})

test('shows formatted date display when a single date is selected', () => {
	const wrapper = mount(DatePicker, {
		props: {
			modelValue: new CalendarDate(2024, 12, 20),
			formatDate: DateFormatEnum.STANDARD,
			dataCy,
		},
	})

	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(true)
	expect(display.text()).toContain('20')
})

test('clicking display enters edit mode', async () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy },
		attachTo: document.body,
	})

	await getDisplay(wrapper).trigger('click')
	await wrapper.vm.$nextTick()

	expect(getDisplay(wrapper).exists()).toBe(false)
	expect(getDayInput(wrapper).exists()).toBe(true)
	expect(getMonthInput(wrapper).exists()).toBe(true)
	expect(getYearInput(wrapper).exists()).toBe(true)
})

test('clicking a filled display focuses its rightmost segment', async () => {
	const wrapper = mount(DatePicker, {
		props: {
			dataCy,
			modelValue: new CalendarDate(2024, 8, 15),
		},
		attachTo: document.body,
	})

	await getDisplay(wrapper).trigger('click')
	await wrapper.vm.$nextTick()
	await new Promise((resolve) => setTimeout(resolve, 0))

	expect(document.activeElement).toBe(getYearInput(wrapper).element)
})

test('shows 6 segmented inputs in range mode after entering edit mode (Fix #5: 1 trigger, not 2)', async () => {
	const wrapper = mount(DatePicker, {
		props: {
			start: new CalendarDate(2024, 12, 20),
			end: new CalendarDate(2024, 12, 22),
			dateRange: true,
			formatDate: DateFormatEnum.WITH_SHORT_MONTH_NAME,
			dataCy,
		},
	})

	// Initial state is display mode
	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(true)
	expect(display.text()).toContain('20')
	expect(display.text()).toContain('22')

	await enterEditMode(wrapper)

	// Range mode now renders ONE trigger with 6 segmented inputs
	const day = getDayInput(wrapper)
	const month = getMonthInput(wrapper)
	const year = getYearInput(wrapper)
	const endDay = getEndDayInput(wrapper)
	const endMonth = getEndMonthInput(wrapper)
	const endYear = getEndYearInput(wrapper)
	expect(day.exists()).toBe(true)
	expect(month.exists()).toBe(true)
	expect(year.exists()).toBe(true)
	expect(endDay.exists()).toBe(true)
	expect(endMonth.exists()).toBe(true)
	expect(endYear.exists()).toBe(true)
	// Values
	expect((day.element as HTMLInputElement).value).toBe('20')
	expect((endDay.element as HTMLInputElement).value).toBe('22')
})

test('emits update:modelValue when typing in the trigger inputs', async () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy },
	})
	await enterEditMode(wrapper)

	const dayInput = getDayInput(wrapper)
	const monthInput = getMonthInput(wrapper)
	const yearInput = getYearInput(wrapper)

	await dayInput.setValue('15')
	await dayInput.trigger('input')
	await monthInput.setValue('08')
	await monthInput.trigger('input')
	await yearInput.setValue('2024')
	await yearInput.trigger('input')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeDefined()
	const last = emitted![emitted!.length - 1][0] as CalendarDate
	expect(last).toBeInstanceOf(CalendarDate)
	expect(last.year).toBe(2024)
	expect(last.month).toBe(8)
	expect(last.day).toBe(15)
})

test('emits update:modelValue when Calendar is interacted', async () => {
	const newDate = new CalendarDate(2023, 5, 15)
	const wrapper = mount(DatePicker, {
		props: { dataCy },
	})

	// Open the dropdown via the calendar icon on the editable trigger.
	const calendarIcon = getCalendarIcon(wrapper)
	expect(calendarIcon.exists()).toBe(true)
	await calendarIcon.trigger('click')
	await wrapper.vm.$nextTick()

	const calendar = wrapper.findComponent(Calendar)
	expect(calendar.exists()).toBe(true)
	calendar.vm.$emit('update:modelValue', newDate)

	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeDefined()
	expect(emitted![emitted!.length - 1]).toEqual([newDate])
})

test('emits typed range only after Terapkan is clicked', async () => {
	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			dataCy,
		},
	})
	await enterEditMode(wrapper)

	const dayInput = getDayInput(wrapper)
	const monthInput = getMonthInput(wrapper)
	const yearInput = getYearInput(wrapper)
	const endDayInput = getEndDayInput(wrapper)
	const endMonthInput = getEndMonthInput(wrapper)
	const endYearInput = getEndYearInput(wrapper)

	await dayInput.setValue('10')
	await dayInput.trigger('input')
	await monthInput.setValue('05')
	await monthInput.trigger('input')
	await yearInput.setValue('2023')
	await yearInput.trigger('input')
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:start')).toBeUndefined()

	await endDayInput.setValue('15')
	await endDayInput.trigger('input')
	await endMonthInput.setValue('05')
	await endMonthInput.trigger('input')
	await endYearInput.setValue('2023')
	await endYearInput.trigger('input')
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:end')).toBeUndefined()
	const applyButton = getActionButton(wrapper, 'Terapkan')
	expect(applyButton).toBeDefined()
	await applyButton?.trigger('click')

	const startDate = wrapper.emitted('update:start')![0][0] as CalendarDate
	const endDate = wrapper.emitted('update:end')![0][0] as CalendarDate
	expect(startDate.day).toBe(10)
	expect(endDate.day).toBe(15)
}, 15_000)

test('enables Terapkan only after the range calendar selection is complete', async () => {
	const startDate = new CalendarDate(2023, 5, 10)
	const endDate = new CalendarDate(2023, 5, 15)

	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			dataCy,
		},
	})

	const calendarIcon = getCalendarIcon(wrapper)
	expect(calendarIcon.exists()).toBe(true)
	await calendarIcon.trigger('click')
	await wrapper.vm.$nextTick()

	const rangeCalendar = wrapper.findComponent(RangeCalendar)
	expect(rangeCalendar.exists()).toBe(true)
	rangeCalendar.vm.$emit('update:modelValue', {
		start: startDate,
		end: endDate,
	})

	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:start')).toBeUndefined()
	expect(wrapper.emitted('update:end')).toBeUndefined()
	const applyButton = getActionButton(wrapper, 'Terapkan')
	expect(applyButton?.attributes('disabled')).toBeUndefined()
	await applyButton?.trigger('click')
	expect(wrapper.emitted('update:start')![0]).toEqual([startDate])
	expect(wrapper.emitted('update:end')![0]).toEqual([endDate])
})

test('range calendar remembers start selection while picking end (Fix #6)', async () => {
	const startDate = new CalendarDate(2023, 5, 10)
	const endDate = new CalendarDate(2023, 5, 15)

	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			dataCy,
		},
	})

	const calendarIcon = getCalendarIcon(wrapper)
	await calendarIcon.trigger('click')
	await wrapper.vm.$nextTick()

	const rangeCalendar = wrapper.findComponent(RangeCalendar)
	expect(rangeCalendar.exists()).toBe(true)

	// First click selects only the start date; parent should not be updated yet.
	rangeCalendar.vm.$emit('update:modelValue', {
		start: startDate,
		end: null,
	})
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:start')).toBeUndefined()
	expect(wrapper.emitted('update:end')).toBeUndefined()

	// Completing the selection enables apply but still does not emit to the parent.
	rangeCalendar.vm.$emit('update:modelValue', {
		start: startDate,
		end: endDate,
	})
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('update:start')).toBeUndefined()
	expect(wrapper.emitted('update:end')).toBeUndefined()
	await getActionButton(wrapper, 'Terapkan')?.trigger('click')
	expect(wrapper.emitted('update:start')![0]).toEqual([startDate])
	expect(wrapper.emitted('update:end')![0]).toEqual([endDate])
}, 15_000)

test('DatepickerEditableTrigger is used as the trigger (single mode)', () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy },
	})

	const trigger = wrapper.findComponent(DatepickerEditableTrigger)
	expect(trigger.exists()).toBe(true)
})

test('DatepickerEditableTrigger is used as the trigger in range mode (single instance)', () => {
	const wrapper = mount(DatePicker, {
		props: {
			dateRange: true,
			dataCy,
		},
	})

	const triggers = wrapper.findAllComponents(DatepickerEditableTrigger)
	expect(triggers.length).toBe(1) // single trigger with 6 inputs inside
})

test('uses a non-editable drawer with one month for mobile ranges', async () => {
	const originalInnerWidth = window.innerWidth
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
	let wrapper: Wrapper | undefined

	try {
		wrapper = mount(DatePicker, {
			attachTo: document.body,
			props: { dateRange: true, dataCy },
		})
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(Drawer).exists()).toBe(true)
		expect(wrapper.findComponent(DatePickerMobileContainer).exists()).toBe(true)
		expect(getDayInput(wrapper).exists()).toBe(false)
		await getDisplay(wrapper).trigger('click')
		await wrapper.vm.$nextTick()

		const rangeCalendar = wrapper.findComponent(RangeCalendar)
		expect(rangeCalendar.props('numberOfMonths')).toBe(1)
		expect(document.querySelector(`[data-cy="${dataCy}-drawer-display"]`)).not.toBeNull()
		expect(rangeCalendar.find('table').classes()).toContain('w-full')
		expect(rangeCalendar.find('table').classes()).toContain('table-fixed')
		expect(document.body.textContent).toContain('Reset')
		expect(document.body.textContent).toContain('Batal')
		expect(document.body.textContent).toContain('Terapkan')

		const buttons = Array.from(document.querySelectorAll('button'))
		const closeIndex = buttons.findIndex(button => button.getAttribute('aria-label') === 'Close drawer')
		const resetIndex = buttons.findIndex(button => button.textContent?.trim() === 'Reset')
		expect(closeIndex).toBeGreaterThanOrEqual(0)
		expect(resetIndex).toBeGreaterThan(closeIndex)
	} finally {
		wrapper?.unmount()
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth })
	}
})

test('swiping a mobile calendar changes the displayed month', async () => {
	const originalInnerWidth = window.innerWidth
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
	let wrapper: Wrapper | undefined

	try {
		wrapper = mount(DatePicker, {
			attachTo: document.body,
			props: { dataCy, modelValue: new CalendarDate(2024, 6, 15) },
		})
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await getDisplay(wrapper).trigger('click')
		await wrapper.vm.$nextTick()

		const calendar = wrapper.findComponent(Calendar)
		await swipeCalendar(wrapper, calendar, 100, 0)
		expect((calendar.props('placeholder') as CalendarDate).month).toBe(7)

		await swipeCalendar(wrapper, calendar, 0, 100)
		expect((calendar.props('placeholder') as CalendarDate).month).toBe(6)
	} finally {
		wrapper?.unmount()
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth })
	}
})

test('ignores short and vertical swipes on a mobile calendar', async () => {
	const originalInnerWidth = window.innerWidth
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
	let wrapper: Wrapper | undefined

	try {
		wrapper = mount(DatePicker, {
			attachTo: document.body,
			props: { dataCy, modelValue: new CalendarDate(2024, 6, 15) },
		})
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await getDisplay(wrapper).trigger('click')
		await wrapper.vm.$nextTick()

		const calendar = wrapper.findComponent(Calendar)
		await swipeCalendar(wrapper, calendar, 100, 70)
		await swipeCalendar(wrapper, calendar, 100, 0, 0, 150)
		expect(calendar.props('placeholder')).toBeUndefined()
	} finally {
		wrapper?.unmount()
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth })
	}
})

test('swiping a mobile range calendar changes the displayed month', async () => {
	const originalInnerWidth = window.innerWidth
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
	let wrapper: Wrapper | undefined

	try {
		wrapper = mount(DatePicker, {
			attachTo: document.body,
			props: { dataCy, dateRange: true, start: new CalendarDate(2024, 6, 15) },
		})
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await getDisplay(wrapper).trigger('click')
		await wrapper.vm.$nextTick()

		const calendar = wrapper.findComponent(RangeCalendar)
		await swipeCalendar(wrapper, calendar, 100, 0)
		expect((calendar.props('placeholder') as CalendarDate).month).toBe(7)
	} finally {
		wrapper?.unmount()
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth })
	}
})

test('does not render an internal trigger for a mobile single date picker', async () => {
	const originalInnerWidth = window.innerWidth
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
	let wrapper: Wrapper | undefined

	try {
		wrapper = mount(DatePicker, {
			attachTo: document.body,
			props: { dataCy },
		})
		await wrapper.vm.$nextTick()
		await getDisplay(wrapper).trigger('click')
		await wrapper.vm.$nextTick()

		expect(document.querySelector(`[data-cy="${dataCy}-drawer-display"]`)).toBeNull()
		expect(document.body.textContent).toContain('Reset')
	} finally {
		wrapper?.unmount()
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth })
	}
})

/* -------------------------------------------------------------------------- */
/*                        Validation via BaseInput                             */
/* -------------------------------------------------------------------------- */

test('required DatePicker shows danger styling after blur with empty value', async () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy, required: true },
		attachTo: document.body,
	})
	await enterEditMode(wrapper)

	const dayInput = getDayInput(wrapper)
	await dayInput.trigger('focus')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()

	const className = getTriggerContainer(wrapper)?.className ?? ''
	const hasDanger =
		className.includes('border-danger-default') || className.includes('input__has-error')
	expect(hasDanger).toBe(true)
})

test('invalid date shows danger styling after blur', async () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy },
		attachTo: document.body,
	})
	await enterEditMode(wrapper)

	const dayInput = getDayInput(wrapper)
	await dayInput.setValue('32')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()

	const className = getTriggerContainer(wrapper)?.className ?? ''
	const hasDanger =
		className.includes('border-danger-default') || className.includes('input__has-error')
	expect(hasDanger).toBe(true)
})

test('shows default invalid-date error message when date is invalid', async () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy },
		attachTo: document.body,
	})
	await enterEditMode(wrapper)

	const dayInput = getDayInput(wrapper)
	const monthInput = getMonthInput(wrapper)
	const yearInput = getYearInput(wrapper)

	await typeInto(dayInput, '32')
	await typeInto(monthInput, '13')
	await typeInto(yearInput, '2024')
	await yearInput.trigger('blur')
	await wrapper.vm.$nextTick()

	const errorMessage = wrapper.find('.input__help-message')
	expect(errorMessage.exists()).toBe(true)
	expect(errorMessage.text()).toContain('Tanggal tidak valid')
})

test('does not show danger styling while typing before blur', async () => {
	const wrapper = mount(DatePicker, {
		props: { dataCy, required: true },
		attachTo: document.body,
	})
	await enterEditMode(wrapper)

	const dayInput = getDayInput(wrapper)
	await dayInput.setValue('32')
	await dayInput.trigger('input')
	await wrapper.vm.$nextTick()

	const className = getTriggerContainer(wrapper)?.className ?? ''
	const hasDanger =
		className.includes('border-danger-default') || className.includes('input__has-error')
	expect(hasDanger).toBe(false)
})

test('custom validators are respected', async () => {
	const wrapper = mount(DatePicker, {
		props: {
			dataCy,
			required: true,
			customValidators: {
				notSunday: (value: CalendarDate | null) => {
					if (!value) return true
					return value.toDate('UTC').getDay() !== 0
				},
			},
		},
		attachTo: document.body,
	})
	await enterEditMode(wrapper)

	// 11 Aug 2024 is a Sunday
	const dayInput = getDayInput(wrapper)
	const monthInput = getMonthInput(wrapper)
	const yearInput = getYearInput(wrapper)
	await typeInto(dayInput, '11')
	await typeInto(monthInput, '08')
	await typeInto(yearInput, '2024')
	await yearInput.trigger('blur')
	await wrapper.vm.$nextTick()

	const className = getTriggerContainer(wrapper)?.className ?? ''
	const hasDanger =
		className.includes('border-danger-default') || className.includes('input__has-error')
	expect(hasDanger).toBe(true)
})

test('selecting from Calendar switches trigger to display mode', async () => {
	const newDate = new CalendarDate(2023, 5, 15)
	const wrapper = mount(DatePicker, {
		props: { dataCy },
		attachTo: document.body,
	})

	const calendarIcon = getCalendarIcon(wrapper)
	await calendarIcon.trigger('click')
	await wrapper.vm.$nextTick()

	const calendar = wrapper.findComponent(Calendar)
	calendar.vm.$emit('update:modelValue', newDate)
	await wrapper.vm.$nextTick()

	// In real usage the parent updates the prop via v-model. In tests we
	// simulate that explicitly.
	await wrapper.setProps({ modelValue: newDate })
	await wrapper.vm.$nextTick()

	expect(getDisplay(wrapper).exists()).toBe(true)
	expect(getDisplay(wrapper).text()).toContain('15')
})
