import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import PinInput from '../lib/components/pin-input/PinInput.vue'

// reka-ui PinInputRoot renders one extra hidden input for native form support
const EXTRA_INPUTS = 1

/** Returns only the visible (non-hidden) pin inputs */
function getVisibleInputs(wrapper: ReturnType<typeof mount>) {
	return wrapper.findAll('input').filter(
		inp => inp.attributes('aria-hidden') !== 'true'
	)
}

test('PinInput renders the correct number of input fields', () => {
	const totalPins = 5
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', '', '', ''],
			totalPins,
		},
	})
	expect(wrapper.findAll('input')).toHaveLength(totalPins + EXTRA_INPUTS)
})

test('PinInput renders fewer inputs when totalPins is 3', () => {
	const totalPins = 3
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', ''],
			totalPins,
		},
	})
	expect(wrapper.findAll('input')).toHaveLength(totalPins + EXTRA_INPUTS)
})

test('PinInput renders with pre-filled values', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['1', '2', '3'],
			totalPins: 3,
		},
	})
	const inputs = getVisibleInputs(wrapper)
	expect(inputs[0].element.value).toBe('1')
	expect(inputs[1].element.value).toBe('2')
	expect(inputs[2].element.value).toBe('3')
})

test('PinInput disables inputs when disabled prop is true', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', ''],
			totalPins: 3,
			disabled: true,
		},
	})
	const visibleInputs = getVisibleInputs(wrapper)
	expect(visibleInputs.length).toBeGreaterThan(0)
	visibleInputs.forEach(input => {
		expect(input.attributes('disabled')).toBe('')
	})
})

test('PinInput renders with text type by default', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', ''],
			totalPins: 2,
		},
	})
	const visibleInputs = getVisibleInputs(wrapper)
	expect(visibleInputs.length).toBeGreaterThan(0)
	visibleInputs.forEach(input => {
		expect(input.attributes('inputmode')).toBe('text')
	})
})

test('PinInput renders with number type using numeric inputmode', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', ''],
			totalPins: 2,
			type: 'number',
		},
	})
	const visibleInputs = getVisibleInputs(wrapper)
	expect(visibleInputs.length).toBeGreaterThan(0)
	visibleInputs.forEach(input => {
		expect(input.attributes('inputmode')).toBe('numeric')
	})
})
