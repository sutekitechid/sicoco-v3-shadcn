import { mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import BaseInput from '../lib/components/base-input/BaseInput.vue'

test('does not warn about optional form injections outside FormInput', () => {
	const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
	try {
		const wrapper = mount(BaseInput, {
			props: { modelValue: '', validationRules: { modelValue: {} } },
		})
		wrapper.unmount()
		expect(warn.mock.calls.flat().join(' ')).not.toMatch(/injection .* not found/)
	} finally {
		warn.mockRestore()
	}
})
