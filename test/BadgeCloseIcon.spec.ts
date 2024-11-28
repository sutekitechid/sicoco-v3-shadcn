import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import BadgeCloseIcon from '../lib/components/badge/BadgeCloseIcon.vue' // Adjust with the correct path to your component

// Test 1: Apply correct class based on "type" prop
test('BadgeCloseIcon: applies correct class based on "type" prop', () => {
	const wrapper = mount(BadgeCloseIcon, {
		props: {
			type: 'success', // Using 'success' type to test
		},
	})

	// Verify that the correct class based on 'success' type is applied
	expect(wrapper.classes()).toContain('text-success-60')
})

// Test 2: Apply additional class from "class" prop
test('BadgeCloseIcon: applies additional class from "class" prop', () => {
	const wrapper = mount(BadgeCloseIcon, {
		props: {
			class: 'custom-class', // Adding a custom class
		},
	})

	// Ensure that the custom class is applied
	expect(wrapper.classes()).toContain('custom-class')
})

// Test 3: Apply both class from "type" and "class" props together
test('BadgeCloseIcon: applies correct class based on "type" and "class" props together', () => {
	const wrapper = mount(BadgeCloseIcon, {
		props: {
			type: 'danger', // Using 'danger' type
			class: 'extra-class', // Adding an extra custom class
		},
	})

	// Ensure that the class based on 'danger' type is applied
	expect(wrapper.classes()).toContain('text-danger-60')

	// Ensure that the additional custom class is also applied
	expect(wrapper.classes()).toContain('extra-class')
})
