import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Spinner from '../lib/components/spinner/Spinner.vue'
import { spinnerVariants } from '../lib/components/spinner'

test('Spinner renders with an accessible label', () => {
	const wrapper = mount(Spinner, {
		props: { label: 'Memuat berkas' },
	})

	expect(wrapper.attributes('role')).toBe('status')
	expect(wrapper.text()).toContain('Memuat berkas')
})

test('Spinner uses the Figma medium size by default', () => {
	expect(spinnerVariants()).toContain('h-10')
	expect(spinnerVariants()).toContain('animate-spin')
})
