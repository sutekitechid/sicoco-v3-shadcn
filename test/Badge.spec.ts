import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Badge from '../lib/components/badge/Badge.vue'
import { badgeVariants } from '../lib/components/badge'

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

test('Badge with closeable prop: can be closed when button is clicked', async () => {
	const wrapper = mount(Badge, {
		props: {
			closeable: true,
		},
		slots: {
			default: 'Shadcn Badge',
		},
	})

	const closeButton = wrapper.find('.si-heroicon-solid-x-mark')
	expect(closeButton.exists()).toBe(true)

	expect(wrapper.html()).toContain('Shadcn Badge')

	await closeButton.trigger('click')

	expect(wrapper.html()).not.toContain('Shadcn Badge')
})

test('Badge without closeable prop: cannot be closed', () => {
	const wrapper = mount(Badge, {
		slots: {
			default: 'Shadcn Badge',
		},
	})

	const closeButton = wrapper.find('.close-btn')
	expect(closeButton.exists()).toBe(false)

	expect(wrapper.html()).toContain('Shadcn Badge')
})

test('Badge renders a left icon before its label', () => {
	const wrapper = mount(Badge, {
		slots: {
			default: 'New',
			'icon-left': '<i class="si-heroicon-outline-sparkles" />',
		},
	})

	expect(wrapper.html()).toMatch(/si-heroicon-outline-sparkles.*New/)
})

test('Badge renders an icon-left-only slot as a square badge', () => {
	const wrapper = mount(Badge, {
		slots: {
			'icon-left': '<i class="si-heroicon-outline-check" />',
		},
	})

	expect(wrapper.find('.w-7').exists()).toBe(true)
	expect(wrapper.find('.si-heroicon-outline-check').exists()).toBe(true)
})

test('Badge info variant uses the info subtle background', () => {
	expect(badgeVariants({ variant: 'info' })).toContain('bg-info-subtle')
})
