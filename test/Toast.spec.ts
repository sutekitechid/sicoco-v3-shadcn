import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'

import ToastDescription from '../lib/components/toast/ToastDescription.vue'

import {
	getToastIcon,
	getToastPosition,
	toastVariants,
	toastIconVariantEnum,
} from '../lib/components/toast/index'

test('getToastIcon should return si-info', () => {
	expect(getToastIcon('default')).toBe(toastIconVariantEnum.primary)
	expect(getToastIcon('warning')).toBe(toastIconVariantEnum.warning)
	expect(getToastIcon('danger')).toBe(toastIconVariantEnum.danger)
	expect(getToastIcon('success')).toBe(toastIconVariantEnum.success)
	expect(getToastIcon('neutral')).toBe(toastIconVariantEnum.neutral)
})

test('toast neutral variant uses neutral styling', () => {
	const classes = toastVariants({ variant: 'neutral' })

	expect(classes).toContain('bg-white')
	expect(classes).toContain('border-main')
	expect(classes).toContain('text-main')
})

test('toast neutral descriptions use secondary text', () => {
	const wrapper = mount(ToastDescription, {
		global: {
			provide: {
				toastVariant: 'neutral',
			},
		},
	})

	expect(wrapper.classes()).toContain('text-secondary')
})

test('getToastPosition', () => {
	expect(getToastPosition('top-left')).toBe('!top-0 !left-0')
	expect(getToastPosition('top-right')).toBe('!top-0 !right-0')
	expect(getToastPosition('bottom-center')).toBe(
		'!bottom-0 !left-1/2 -translate-x-1/2'
	)
})
