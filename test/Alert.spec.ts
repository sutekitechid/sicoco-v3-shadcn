import { mount } from '@vue/test-utils'
import Alert from '../lib/components/alert/Alert.vue'
import { describe, it, expect } from 'vitest'

describe('Alert.vue', () => {
	it('renders the alert with the correct variant class', () => {
		const wrapper = mount(Alert, {
			props: { variant: 'success' },
		})

		expect(wrapper.classes()).toContain('bg-success-50')
	})

	it('displays the slot content', () => {
		const slotContent = 'This is an alert message!'
		const wrapper = mount(Alert, {
			slots: {
				default: slotContent,
			},
		})

		expect(wrapper.text()).toContain(slotContent)
	})

	it('renders the correct icon for the variant', () => {
		const wrapper = mount(Alert, {
			props: { variant: 'warning' },
		})

		const icon = wrapper.find('i')
		expect(icon.classes()).toContain('si-warning-alt')
	})

	it('closes the alert when close button is clicked', async () => {
		const wrapper = mount(Alert)

		expect(wrapper.find('[role="alert"]').exists()).toBe(true)

		await wrapper.find('.si-heroicon-solid-x-mark').trigger('click')

		expect(wrapper.find('[role="alert"]').exists()).toBe(false)
	})

	it('applies custom classes from props', () => {
		const customClass = 'custom-alert-class'
		const wrapper = mount(Alert, {
			props: { class: customClass },
		})

		expect(wrapper.classes()).toContain(customClass)
	})
})
