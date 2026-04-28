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
			wrapper.find('[data-testid="progress-indicator"]').attributes('style')
		).toContain('width: 45%')
	})

	test('clamps value to minimum and maximum bounds', async () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: -15,
			},
		})

		expect(wrapper.find('[data-testid="progress-right-label"]').text()).toBe('0%')
		expect(
			wrapper.find('[data-testid="progress-indicator"]').attributes('style')
		).toContain('width: 0%')

		await wrapper.setProps({ modelValue: 150 })

		expect(wrapper.find('[data-testid="progress-right-label"]').text()).toBe('100%')
		expect(
			wrapper.find('[data-testid="progress-indicator"]').attributes('style')
		).toContain('width: 100%')
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

	test('supports custom track and indicator colors', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 40,
				trackColor: 'bg-warning-20',
				indicatorColor: 'bg-success-90',
			},
		})

		expect(wrapper.find('[data-testid="progress-root"]').classes()).toContain(
			'bg-warning-20'
		)
		expect(wrapper.find('[data-testid="progress-indicator"]').classes()).toContain(
			'bg-success-90'
		)
	})

	test('renders always-open tooltip marker in tooltip-top mode', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 32,
				labelPosition: 'tooltip-top',
			},
		})

		expect(wrapper.findAll('[data-testid="progress-tooltip-trigger"]').length).toBe(1)
	})

	test('applies rounded class on indicator bar', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 45,
			},
		})

		expect(wrapper.find('[data-testid="progress-indicator"]').classes()).toContain(
			'rounded-full'
		)
	})

	test('applies transition classes to indicator segments', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 45,
			},
		})

		const indicator = wrapper.find('[data-testid="progress-indicator"]')

		expect(indicator.classes()).toContain('transition-[width]')
		expect(indicator.classes()).toContain('duration-[400ms]')
		expect(indicator.classes()).toContain('ease-in-out')
		expect(indicator.classes()).toContain('motion-reduce:duration-100')
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
