import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import BadgeCloseIcon from '../lib/components/badge/BadgeCloseIcon.vue'
test('BadgeCloseIcon: applies correct class based on "variant" prop', () => {
	const wrapper = mount(BadgeCloseIcon, {
		props: {
			variant: 'success',
		},
	})

	expect(wrapper.classes()).toContain('text-success-200')
})

test('BadgeCloseIcon: applies additional class from "class" prop', () => {
	const wrapper = mount(BadgeCloseIcon, {
		props: {
			class: 'custom-class',
		},
	})

	expect(wrapper.classes()).toContain('custom-class')
})

test('BadgeCloseIcon: applies correct class based on "variant" and "class" props together', () => {
	const wrapper = mount(BadgeCloseIcon, {
		props: {
			variant: 'danger',
			class: 'extra-class',
		},
	})

	expect(wrapper.classes()).toContain('text-danger-200')

	expect(wrapper.classes()).toContain('extra-class')
})
