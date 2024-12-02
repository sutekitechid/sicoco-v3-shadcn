import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Badge from '../lib/components/badge/Badge.vue'

// Test 1: Badge renders with the given text
test('Badge renders with the given text', () => {
	const text = 'Custom Badge Text'
	const wrapper = mount(Badge, {
		slots: {
			default: text,
		},
	})

	// Verify that the badge contains the correct text
	expect(wrapper.html()).toContain(text)
})

// Test 2: Badge with "closeable" prop can be closed when the close button is clicked
test('Badge with closeable prop: can be closed when button is clicked', async () => {
	const wrapper = mount(Badge, {
		props: {
			closeable: true, // Enabling the "closeable" prop
		},
		slots: {
			default: 'Shadcn Badge',
		},
	})

	// Verify that the close button is present
	const closeButton = wrapper.find('.si-x')
	expect(closeButton.exists()).toBe(true)

	// Verify that the badge is visible initially
	expect(wrapper.html()).toContain('Shadcn Badge')

	// Simulate a click on the close button
	await closeButton.trigger('click')

	// Verify that the badge is removed after the close button is clicked
	expect(wrapper.html()).not.toContain('Shadcn Badge')
})

// Test 3: Badge without "closeable" prop cannot be closed
test('Badge without closeable prop: cannot be closed', () => {
	const wrapper = mount(Badge, {
		slots: {
			default: 'Shadcn Badge',
		},
	})

	// Verify that the close button is not present
	const closeButton = wrapper.find('.close-btn')
	expect(closeButton.exists()).toBe(false)

	// Verify that the badge is still visible
	expect(wrapper.html()).toContain('Shadcn Badge')
})
