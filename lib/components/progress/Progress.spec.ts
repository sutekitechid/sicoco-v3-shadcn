import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Progress from './Progress.vue'

describe('Progress', () => {
	test('renders right label by default with clamped value', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 45,
			},
		})

		expect(wrapper.find('[data-testid="progress-right-label"]').text()).toBe('45%')
		expect(
			wrapper.findAll('[data-testid="progress-indicator"] .bg-primary-90').length
		).toBe(45)
	})

	test('clamps value to minimum and maximum bounds', async () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: -15,
			},
		})

		expect(wrapper.find('[data-testid="progress-right-label"]').text()).toBe('0%')
		expect(
			wrapper.findAll('[data-testid="progress-indicator"] .bg-primary-90').length
		).toBe(0)

		await wrapper.setProps({ modelValue: 150 })

		expect(wrapper.find('[data-testid="progress-right-label"]').text()).toBe('100%')
		expect(
			wrapper.findAll('[data-testid="progress-indicator"] .bg-primary-90').length
		).toBe(100)
	})

	test('renders bottom-right label mode', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 72,
				labelPosition: 'bottom-right',
			},
		})

		expect(wrapper.find('[data-testid="progress-right-label"]').exists()).toBe(false)
		expect(wrapper.find('[data-testid="progress-bottom-right-label"]').text()).toBe(
			'72%'
		)
	})

	test('renders tooltip as always visible without trigger in tooltip-top mode', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 32,
				labelPosition: 'tooltip-top',
			},
		})

		const tooltip = wrapper.find('[data-testid="progress-tooltip-always"]')
		expect(tooltip.exists()).toBe(true)
		expect(tooltip.text()).toContain('32%')
		expect(wrapper.find('[data-testid="progress-tooltip-trigger"]').exists()).toBe(
			false
		)
	})

	test('applies rounded classes on indicator edges when value is above zero', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 45,
			},
		})

		expect(
			wrapper.find('[data-testid="progress-indicator"] .rounded-l-full').exists()
		).toBe(true)
		expect(
			wrapper.find('[data-testid="progress-indicator"] .rounded-r-full').exists()
		).toBe(true)
	})

	test('applies accessibility attributes to progress root', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 55,
				ariaLabel: 'Upload progress',
			},
		})

		const progressRoot = wrapper.find('[data-testid="progress-root"]')
		expect(progressRoot.attributes('aria-valuemin')).toBe('0')
		expect(progressRoot.attributes('aria-valuemax')).toBe('100')
		expect(progressRoot.attributes('aria-valuenow')).toBe('55')
		expect(progressRoot.attributes('aria-valuetext')).toBe('55%')
		expect(progressRoot.attributes('aria-label')).toBe('Upload progress')
	})
})
