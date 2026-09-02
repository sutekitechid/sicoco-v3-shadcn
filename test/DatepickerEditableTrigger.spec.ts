import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { DatepickerEditableTrigger } from '../lib/components/date-picker/index'
import { CalendarDate } from '@internationalized/date'

const dataCy = 'datepicker-editable'

function mountEditable(props: Record<string, unknown> = {}) {
	return mount(DatepickerEditableTrigger, {
		props: {
			dataCy,
			...props,
		},
		attachTo: document.body,
	})
}

function getInput(wrapper: ReturnType<typeof mountEditable>, name: string) {
	return wrapper.find(`[data-cy="${dataCy}-${name}"]`)
}

function getDayInput(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'day')
}
function getMonthInput(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'month')
}
function getYearInput(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'year')
}
function getEndDayInput(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'end-day')
}
function getEndMonthInput(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'end-month')
}
function getEndYearInput(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'end-year')
}
function getCalendarIcon(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'calendar-icon')
}
function getClearButton(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'clear-button')
}
function getDisplay(wrapper: ReturnType<typeof mountEditable>) {
	return getInput(wrapper, 'display')
}

async function enterEditMode(wrapper: ReturnType<typeof mountEditable>) {
	const display = getDisplay(wrapper)
	if (display.exists()) {
		await display.trigger('click')
		await wrapper.vm.$nextTick()
	}
}

async function typeInto(
	input: ReturnType<typeof getDayInput>,
	value: string
) {
	await input.setValue(value)
	await input.trigger('input')
}

/* -------------------------------------------------------------------------- */
/*                              Render & structure                            */
/* -------------------------------------------------------------------------- */

test('initially renders in display mode', () => {
	const wrapper = mountEditable()
	expect(getDisplay(wrapper).exists()).toBe(true)
	expect(getDayInput(wrapper).exists()).toBe(false)
})

test('shows placeholder when empty', () => {
	const wrapper = mountEditable()
	const display = getDisplay(wrapper)
	expect(display.text()).toBe('DD/MM/YYYY')
})

test('shows formatted date when modelValue is provided', () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 8, 15),
	})
	const display = getDisplay(wrapper)
	expect(display.text()).toContain('15')
})

test('renders 3 segmented inputs after entering edit mode', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	expect(getDayInput(wrapper).exists()).toBe(true)
	expect(getMonthInput(wrapper).exists()).toBe(true)
	expect(getYearInput(wrapper).exists()).toBe(true)
	expect(getDayInput(wrapper).attributes('maxlength')).toBe('2')
	expect(getMonthInput(wrapper).attributes('maxlength')).toBe('2')
	expect(getYearInput(wrapper).attributes('maxlength')).toBe('4')
})

test('renders calendar icon in prefix (visible in display mode)', () => {
	const wrapper = mountEditable()
	const icon = getCalendarIcon(wrapper)
	expect(icon.exists()).toBe(true)
})

test('renders X clear button in suffix when hasValue', () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 8, 15),
	})
	const clear = getClearButton(wrapper)
	expect(clear.exists()).toBe(true)
})

test('hides clear button when empty', () => {
	const wrapper = mountEditable()
	expect(getClearButton(wrapper).exists()).toBe(false)
})

/* -------------------------------------------------------------------------- */
/*                            Sync from modelValue                            */
/* -------------------------------------------------------------------------- */

test('initialises display from modelValue', () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 12, 20),
	})
	const display = getDisplay(wrapper)
	expect(display.text()).toContain('20')
})

test('syncs display text when modelValue changes externally', async () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 1, 1),
	})
	await wrapper.setProps({ modelValue: new CalendarDate(2030, 5, 9) })
	const display = getDisplay(wrapper)
	expect(display.text()).toContain('09')
})

/* -------------------------------------------------------------------------- */
/*                              Edit mode entry                               */
/* -------------------------------------------------------------------------- */

test('clicking display text enters edit mode', async () => {
	const wrapper = mountEditable()
	await getDisplay(wrapper).trigger('click')
	await wrapper.vm.$nextTick()
	expect(getDisplay(wrapper).exists()).toBe(false)
	expect(getDayInput(wrapper).exists()).toBe(true)
})

test('entering edit mode focuses day when no segment is focused', async () => {
	const wrapper = mountEditable()
	await getDisplay(wrapper).trigger('click')
	await wrapper.vm.$nextTick()
	await new Promise((resolve) => setTimeout(resolve, 0))
	expect(document.activeElement).toBe(getDayInput(wrapper).element)
})

test('entering edit mode focuses the rightmost filled segment', async () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 8, 15),
	})
	await getDisplay(wrapper).trigger('click')
	await wrapper.vm.$nextTick()
	await new Promise((resolve) => setTimeout(resolve, 0))
	expect(document.activeElement).toBe(getYearInput(wrapper).element)
})

test('focus API focuses the rightmost filled segment in edit mode', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '15')
	await typeInto(getMonthInput(wrapper), '08')

	await (wrapper.vm as unknown as { focus: () => void }).focus()
	await wrapper.vm.$nextTick()

	expect(document.activeElement).toBe(getMonthInput(wrapper).element)
})

test('entering edit mode preserves existing segment focus', async () => {
	const wrapper = mountEditable()
	await getDisplay(wrapper).trigger('click')
	await wrapper.vm.$nextTick()

	// User moved focus to the year input
	;(getYearInput(wrapper).element as HTMLInputElement).focus()
	await wrapper.vm.$nextTick()

	// Re-entering edit mode should not steal focus back to day
	await (wrapper.vm as unknown as { enterEditMode: () => void }).enterEditMode()
	await wrapper.vm.$nextTick()

	expect(document.activeElement).toBe(getYearInput(wrapper).element)
})

/* -------------------------------------------------------------------------- */
/*                              Emit behavior                                 */
/* -------------------------------------------------------------------------- */

test('emits update:modelValue when all segments are valid', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '15')
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '2024')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeDefined()
	const last = emitted![emitted!.length - 1][0] as CalendarDate
	expect(last).toBeInstanceOf(CalendarDate)
	expect(last.year).toBe(2024)
	expect(last.month).toBe(8)
	expect(last.day).toBe(15)
})

test('does not emit when segments are incomplete', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '1')
	await wrapper.vm.$nextTick()
	expect(wrapper.emitted('update:modelValue')).toBeUndefined()
})

test('does not auto-pad during typing (Fix #1)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '1')
	await wrapper.vm.$nextTick()
	// After typing "1", value should still be "1" (not "01")
	expect((getDayInput(wrapper).element as HTMLInputElement).value).toBe('1')
})

test('does not auto-advance when only 1 digit is typed (Fix #1)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '1')
	await wrapper.vm.$nextTick()
	// After typing "1" (length 1), focus should NOT have moved to month
	// We verify by checking that month input is still empty
	expect((getMonthInput(wrapper).element as HTMLInputElement).value).toBe('')
	expect((getYearInput(wrapper).element as HTMLInputElement).value).toBe('')
})

test('auto-advances when 2 digits are typed in day (no emit yet because month empty)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '15')
	await wrapper.vm.$nextTick()
	// After typing "15" day, no emit yet because other segments empty
	expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	// Day value should be 15
	expect((getDayInput(wrapper).element as HTMLInputElement).value).toBe('15')
	// Focus should have moved to the month input
	expect(document.activeElement).toBe(getMonthInput(wrapper).element)
})

test('does not emit on invalid date (32/13/2024)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '32')
	await typeInto(getMonthInput(wrapper), '13')
	await typeInto(getYearInput(wrapper), '2024')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	if (emitted) {
		const last = emitted[emitted.length - 1][0]
		expect(last === null || last === undefined).toBe(true)
	}
})

test('honours yearsRange when provided', async () => {
	const wrapper = mountEditable({ yearsRange: [2000, 2030] })
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '15')
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '1999')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	if (emitted) {
		const last = emitted[emitted.length - 1][0]
		expect(last === null || last === undefined).toBe(true)
	}
})

/* -------------------------------------------------------------------------- */
/*                                Clear button                                */
/* -------------------------------------------------------------------------- */

test('click clear button resets all segments and emits null', async () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 8, 15),
	})
	expect(getClearButton(wrapper).exists()).toBe(true)
	await getClearButton(wrapper).trigger('click')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeDefined()
	expect(emitted![emitted!.length - 1][0]).toBeNull()
	// Simulate parent clearing the prop via v-model
	await wrapper.setProps({ modelValue: null })
	await wrapper.vm.$nextTick()
	// Back to display mode with placeholder
	expect(getDisplay(wrapper).exists()).toBe(true)
	expect(getDisplay(wrapper).text()).toBe('DD/MM/YYYY')
})

/* -------------------------------------------------------------------------- */
/*                              Disabled state                                */
/* -------------------------------------------------------------------------- */

test('disabled trigger stays in display mode and disables calendar icon', () => {
	const wrapper = mountEditable({ disabled: true })
	expect(getDisplay(wrapper).exists()).toBe(true)
	expect(getCalendarIcon(wrapper).attributes('disabled')).toBeDefined()
})

/* -------------------------------------------------------------------------- */
/*                            Input handling                                  */
/* -------------------------------------------------------------------------- */

test('rejects non-numeric characters', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), 'ab12cd')
	await wrapper.vm.$nextTick()
	expect((getDayInput(wrapper).element as HTMLInputElement).value).toBe('12')
})

test('handles paste of full date without slashes', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)
	await dayInput.trigger('paste', {
		clipboardData: { getData: () => '15082024' },
	})
	await wrapper.vm.$nextTick()

	expect((getDayInput(wrapper).element as HTMLInputElement).value).toBe('15')
	expect((getMonthInput(wrapper).element as HTMLInputElement).value).toBe('08')
	expect((getYearInput(wrapper).element as HTMLInputElement).value).toBe('2024')

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeDefined()
})

test('handles paste of slashed date', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)
	await dayInput.trigger('paste', {
		clipboardData: { getData: () => '15/08/2024' },
	})
	await wrapper.vm.$nextTick()

	expect((getDayInput(wrapper).element as HTMLInputElement).value).toBe('15')
	expect((getMonthInput(wrapper).element as HTMLInputElement).value).toBe('08')
	expect((getYearInput(wrapper).element as HTMLInputElement).value).toBe('2024')
})

/* -------------------------------------------------------------------------- */
/*                      Display mode (Fix #3)                                  */
/* -------------------------------------------------------------------------- */

test('shows formatted text after blur with valid date (Fix #3)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)

	// Focus the input first to set it as active element
	;(dayInput.element as HTMLInputElement).focus()
	await dayInput.setValue('15')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '2024')
	// Blur the year input to trigger handleBlur
	const yearInput = getYearInput(wrapper)
	;(yearInput.element as HTMLInputElement).focus()
	await yearInput.setValue('2024')
	await yearInput.trigger('input')
	await yearInput.trigger('blur')
	await wrapper.vm.$nextTick()

	// In single mode + valid + blur → display mode
	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(true)
	expect(display.text()).toContain('15')
	// 3 inputs should be hidden
	expect(getDayInput(wrapper).exists()).toBe(false)
})

test('does not enter display mode when blur with invalid date', async () => {
	const wrapper = mountEditable({ dirty: true, invalid: true })
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)

	;(dayInput.element as HTMLInputElement).focus()
	await dayInput.setValue('32')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()

	// Invalid date → stay in edit mode
	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(false)
	expect(getDayInput(wrapper).exists()).toBe(true)
})

/* -------------------------------------------------------------------------- */
/*                      Validation integration events                         */
/* -------------------------------------------------------------------------- */

test('emits blur when focus leaves the trigger', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)

	await dayInput.setValue('32')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('blur')).toBeDefined()
})

test('does not emit blur when auto-advancing between segments', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)
	const monthInput = getMonthInput(wrapper)

	// In a real browser the blur event carries the next focused element as
	// relatedTarget. VTU's trigger('blur') does not set it, so we dispatch a
	// FocusEvent manually with relatedTarget pointing to another segment.
	await dayInput.setValue('15')
	await dayInput.trigger('input')
	dayInput.element.dispatchEvent(
		new FocusEvent('blur', { relatedTarget: monthInput.element, bubbles: true })
	)
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('blur')).toBeUndefined()
})

test('emits complete when all segments of group 1 are filled', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	await typeInto(getDayInput(wrapper), '15')
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '2024')
	await wrapper.vm.$nextTick()

	const completeEvents = wrapper.emitted('complete')
	expect(completeEvents).toBeDefined()
	expect(completeEvents!.length).toBeGreaterThanOrEqual(1)
})

test('applies danger styling when dirty and invalid props are true', async () => {
	const wrapper = mountEditable({ dirty: true, invalid: true })
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)
	const container = dayInput.element.parentElement
	const className = container?.className ?? ''
	const hasDanger =
		className.includes('border-danger-default') || className.includes('input__has-error')
	expect(hasDanger).toBe(true)
})

test('emits reset when clear button is clicked', async () => {
	const wrapper = mountEditable({
		modelValue: new CalendarDate(2024, 8, 15),
	})
	await getClearButton(wrapper).trigger('click')
	await wrapper.vm.$nextTick()

	expect(wrapper.emitted('reset')).toBeDefined()
})

/* -------------------------------------------------------------------------- */
/*                            Range mode (Fix #5)                              */
/* -------------------------------------------------------------------------- */

test('range mode shows placeholder when empty', () => {
	const wrapper = mountEditable({ mode: 'range' })
	const display = getDisplay(wrapper)
	expect(display.text()).toBe('DD/MM/YYYY — DD/MM/YYYY')
})

test('range mode shows formatted dates when values are provided', () => {
	const wrapper = mountEditable({
		mode: 'range',
		start: new CalendarDate(2024, 8, 10),
		end: new CalendarDate(2024, 8, 20),
	})
	const display = getDisplay(wrapper)
	expect(display.text()).toContain('10')
	expect(display.text()).toContain('20')
})

test('range mode renders 6 segmented inputs in 1 trigger after entering edit mode (Fix #5)', async () => {
	const wrapper = mountEditable({
		mode: 'range',
		start: new CalendarDate(2024, 8, 10),
		end: new CalendarDate(2024, 8, 20),
	})
	await enterEditMode(wrapper)

	expect(getDayInput(wrapper).exists()).toBe(true)
	expect(getMonthInput(wrapper).exists()).toBe(true)
	expect(getYearInput(wrapper).exists()).toBe(true)
	expect(getEndDayInput(wrapper).exists()).toBe(true)
	expect(getEndMonthInput(wrapper).exists()).toBe(true)
	expect(getEndYearInput(wrapper).exists()).toBe(true)
})

test('range mode emits update:start and update:end when typing complete dates', async () => {
	const wrapper = mountEditable({
		mode: 'range',
		start: null,
		end: null,
	})
	await enterEditMode(wrapper)

	await typeInto(getDayInput(wrapper), '10')
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '2024')
	await wrapper.vm.$nextTick()

	const startEmitted = wrapper.emitted('update:start')
	expect(startEmitted).toBeDefined()
	const startDate = startEmitted![startEmitted!.length - 1][0] as CalendarDate
	expect(startDate).toBeInstanceOf(CalendarDate)
	expect(startDate.year).toBe(2024)
	expect(startDate.month).toBe(8)
	expect(startDate.day).toBe(10)
})

test('range mode clears both start and end on clear button click', async () => {
	const wrapper = mountEditable({
		mode: 'range',
		start: new CalendarDate(2024, 8, 10),
		end: new CalendarDate(2024, 8, 20),
	})

	expect(getClearButton(wrapper).exists()).toBe(true)
	await getClearButton(wrapper).trigger('click')
	await wrapper.vm.$nextTick()

	const startEmitted = wrapper.emitted('update:start')
	const endEmitted = wrapper.emitted('update:end')
	expect(startEmitted).toBeDefined()
	expect(startEmitted![startEmitted!.length - 1][0]).toBeNull()
	expect(endEmitted).toBeDefined()
	expect(endEmitted![endEmitted!.length - 1][0]).toBeNull()
	// Simulate parent clearing the props via v-model
	await wrapper.setProps({ start: null, end: null })
	await wrapper.vm.$nextTick()
	// Back to placeholder display
	expect(getDisplay(wrapper).text()).toBe('DD/MM/YYYY — DD/MM/YYYY')
})

test('range mode auto-advances from YYYY1 to DD2', async () => {
	const wrapper = mountEditable({ mode: 'range' })
	await enterEditMode(wrapper)

	await typeInto(getDayInput(wrapper), '10')
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '2024')
	await wrapper.vm.$nextTick()

	// After year1, end-day should be auto-focused
	expect(document.activeElement).toBe(getEndDayInput(wrapper).element)
	expect((getDayInput(wrapper).element as HTMLInputElement).value).toBe('10')
	expect((getMonthInput(wrapper).element as HTMLInputElement).value).toBe('08')
	expect((getYearInput(wrapper).element as HTMLInputElement).value).toBe('2024')

	// Typing into end-day should emit update:end once all 3 of group 2 are filled
	await typeInto(getEndDayInput(wrapper), '20')
	await typeInto(getEndMonthInput(wrapper), '08')
	await typeInto(getEndYearInput(wrapper), '2024')
	await wrapper.vm.$nextTick()

	const endEmitted = wrapper.emitted('update:end')
	expect(endEmitted).toBeDefined()
	const endDate = endEmitted![endEmitted!.length - 1][0] as CalendarDate
	expect(endDate).toBeInstanceOf(CalendarDate)
	expect(endDate.day).toBe(20)
})

/* -------------------------------------------------------------------------- */
/*  Calendar icon & clear button always visible (Fix #1 + #2)                 */
/* -------------------------------------------------------------------------- */

test('calendar icon remains visible after blur with valid date (Fix #1)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)

	;(dayInput.element as HTMLInputElement).focus()
	await dayInput.setValue('15')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()
	await typeInto(getMonthInput(wrapper), '08')
	await typeInto(getYearInput(wrapper), '2024')
	const yearInput = getYearInput(wrapper)
	;(yearInput.element as HTMLInputElement).focus()
	await yearInput.setValue('2024')
	await yearInput.trigger('input')
	await yearInput.trigger('blur')
	await wrapper.vm.$nextTick()

	// After blur with valid date, we are in display mode but icon should still
	// be visible so the user can open the calendar again.
	const display = getDisplay(wrapper)
	expect(display.exists()).toBe(true)
	expect(getCalendarIcon(wrapper).exists()).toBe(true)
})

test('clear button remains visible in display mode when hasValue (Fix #2)', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)
	const monthInput = getMonthInput(wrapper)
	const yearInput = getYearInput(wrapper)

	// Type all 3 segments then trigger blur on year to enter display mode
	;(dayInput.element as HTMLInputElement).focus()
	await dayInput.setValue('15')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()
	await typeInto(monthInput, '08')
	await typeInto(yearInput, '2024')
	;(yearInput.element as HTMLInputElement).focus()
	await yearInput.setValue('2024')
	await yearInput.trigger('input')
	await yearInput.trigger('blur')
	await wrapper.vm.$nextTick()

	// Now in display mode
	expect(getDisplay(wrapper).exists()).toBe(true)
	// Clear button should still be visible
	expect(getClearButton(wrapper).exists()).toBe(true)
})

test('click calendar icon in display mode does not throw', async () => {
	const wrapper = mountEditable({ modelValue: new CalendarDate(2024, 8, 15) })
	const icon = getCalendarIcon(wrapper)
	expect(icon.exists()).toBe(true)
	// Clicking should not throw — parent Dropdown will handle opening
	await icon.trigger('click')
	await wrapper.vm.$nextTick()
})

test('clear button in display mode still clears the value', async () => {
	const wrapper = mountEditable({ modelValue: new CalendarDate(2024, 8, 15) })

	expect(getDisplay(wrapper).exists()).toBe(true)
	await getClearButton(wrapper).trigger('click')
	await wrapper.vm.$nextTick()

	const emitted = wrapper.emitted('update:modelValue')
	expect(emitted).toBeDefined()
	expect(emitted![emitted!.length - 1][0]).toBeNull()
	// Simulate parent clearing the prop via v-model
	await wrapper.setProps({ modelValue: null })
	await wrapper.vm.$nextTick()
	// Display mode restored with placeholder
	expect(getDisplay(wrapper).exists()).toBe(true)
	expect(getDisplay(wrapper).text()).toBe('DD/MM/YYYY')
})

/* -------------------------------------------------------------------------- */
/*  Validation integration events (parent BaseInput handles validation)       */
/* -------------------------------------------------------------------------- */

test('does not show danger styling by default without dirty+invalid props', async () => {
	const wrapper = mountEditable()
	await enterEditMode(wrapper)
	const dayInput = getDayInput(wrapper)

	await dayInput.setValue('32')
	await dayInput.trigger('input')
	await dayInput.trigger('blur')
	await wrapper.vm.$nextTick()

	const container = dayInput.element.parentElement
	const className = container?.className ?? ''
	const hasDanger =
		className.includes('border-danger-default') || className.includes('input__has-error')
	expect(hasDanger).toBe(false)
})
