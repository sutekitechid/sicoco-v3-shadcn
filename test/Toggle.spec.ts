// ToggleSwitch.spec.ts
import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Toggle from '../lib/components/toggle/Toggle.vue'

test('should render correctly with default props', () => {
	const wrapper = mount(Toggle)

	// Now, find the right element and check its classes
	expect(wrapper.exists()).toBe(true)

	// Adjust the selector if the class is applied to a different element
	const divWithClass = wrapper.find('.flex')
	expect(divWithClass.exists()).toBe(true)
})

test('should toggle when clicked and emit events', async () => {
	const wrapper = mount(Toggle, {
		props: {
			modelValue: false,
			trueValue: 'on',
			falseValue: 'off',
		},
	})

	// Initially, it should be unchecked (false value)
	expect(wrapper.props('modelValue')).toBe(false)

	// Click on the switch
	await wrapper.find('button').trigger('click')

	// After click, the switch should emit 'update:modelValue' with the 'on' value
	expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
	expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['on'])
})

test('should not toggle when disabled', async () => {
	const wrapper = mount(Toggle, {
		props: {
			modelValue: false,
			disabled: true,
		},
	})

	// Try to click the switch while disabled
	await wrapper.find('div').trigger('click')

	// The modelValue should not change because the switch is disabled
	expect(wrapper.props('modelValue')).toBe(false)

	// Ensure no 'update:modelValue' event is emitted
	expect(wrapper.emitted()['update:modelValue']).toBeUndefined()
})

test('should apply the custom class', () => {
	const wrapper = mount(Toggle, {
		props: {
			class: 'custom-class',
		},
	})

	// Check if the custom class is applied to the root div
	expect(wrapper.find('button').classes()).toContain('custom-class')
})
