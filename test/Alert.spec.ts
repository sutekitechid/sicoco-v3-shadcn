import { mount } from '@vue/test-utils'
import Alert from '../lib/components/alert/Alert.vue'
import AlertDescription from '../lib/components/alert/AlertDescription.vue'
import { describe, it, expect } from 'vitest'

describe('Alert.vue', () => {
	it('renders the alert with the correct variant class', () => {
		const wrapper = mount(Alert, {
			props: { variant: 'success' },
		})

		expect(wrapper.classes()).toContain('bg-success-subtle')
	})

	it('renders the neutral variant', () => {
		const wrapper = mount(Alert, {
			props: { variant: 'neutral' },
		})

		expect(wrapper.classes()).toContain('bg-white')
		expect(wrapper.classes()).toContain('border-main')
		expect(wrapper.classes()).toContain('text-main')
	})

	it('renders descriptions with secondary text', () => {
		const wrapper = mount({
			components: { Alert, AlertDescription },
			template: '<Alert variant="neutral"><AlertDescription /></Alert>',
		})

		expect(wrapper.findComponent(AlertDescription).classes()).toContain('text-secondary')
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

	it('renders a custom icon from the icon slot', () => {
		const wrapper = mount(Alert, {
			slots: {
				icon: '<i class="custom-alert-icon" />',
			},
		})

		const icon = wrapper.find('.custom-alert-icon')
		expect(icon.exists()).toBe(true)
		expect(icon.element.parentElement?.classList).toContain('text-success-600')
		expect(wrapper.find('.si-heroicon-solid-check-circle').exists()).toBe(false)
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
