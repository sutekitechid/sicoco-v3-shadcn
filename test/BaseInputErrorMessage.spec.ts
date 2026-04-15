import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import BaseInputErrorMessage from '../lib/components/base-input-error-message/BaseInputErrorMessage.vue'

test('BaseInputErrorMessage shows slot content when invalid is true', () => {
	const wrapper = mount(BaseInputErrorMessage, {
		props: { invalid: true },
		slots: { default: 'This field is required' },
	})
	expect(wrapper.text()).toContain('This field is required')
})

test('BaseInputErrorMessage shows dash when invalid is false', () => {
	const wrapper = mount(BaseInputErrorMessage, {
		props: { invalid: false },
		slots: { default: 'This field is required' },
	})
	expect(wrapper.text()).toContain('-')
	expect(wrapper.text()).not.toContain('This field is required')
})

test('BaseInputErrorMessage renders without crashing when no slot content', () => {
	const wrapper = mount(BaseInputErrorMessage, {
		props: { invalid: true },
	})
	expect(wrapper.exists()).toBe(true)
})

test('BaseInputErrorMessage switches from showing dash to error message when invalid changes', async () => {
	const wrapper = mount(BaseInputErrorMessage, {
		props: { invalid: false },
		slots: { default: 'Error message' },
	})
	expect(wrapper.text()).toContain('-')

	await wrapper.setProps({ invalid: true })
	expect(wrapper.text()).toContain('Error message')
})
