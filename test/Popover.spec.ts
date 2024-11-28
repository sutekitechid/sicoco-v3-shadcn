import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Popover from '../lib/components/popover/Popover.vue'

describe('Popover.vue', () => {
	it('renders the Popover component correctly', () => {
		const wrapper = mount(Popover)

		// Check if the Popover component is rendered
		expect(wrapper.exists()).toBe(true)

		// Check if the slot content is rendered inside Popover
		expect(wrapper.html()).toContain('<slot></slot>')
	})

	it('forwards attributes to Popover', () => {
		const wrapper = mount(Popover, {
			attrs: {
				'data-test': 'popover', // Example of forwarded attribute
			},
		})

		// Check if the forwarded attribute exists on the component
		expect(wrapper.attributes('data-test')).toBe('popover-root')
	})
})
