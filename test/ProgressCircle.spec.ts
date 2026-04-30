import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ProgressCircle from './ProgressCircle.vue'

describe('ProgressCircle', () => {
	test('renders default circle with clamped value and accessibility attributes', async () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 45,
			},
		})

		expect(wrapper.find('[data-cy="progress-circle-value"]').text()).toBe('45%')
		expect(wrapper.find('[data-cy="progress-circle-svg"]').exists()).toBe(true)

		const progressRoot = wrapper.find('[data-cy="progress-circle-root"]')
		expect(progressRoot.attributes('aria-valuemin')).toBe('0')
		expect(progressRoot.attributes('aria-valuemax')).toBe('100')
		expect(progressRoot.attributes('aria-valuenow')).toBe('45')
		expect(progressRoot.attributes('aria-valuetext')).toBe('45%')

		await wrapper.setProps({ modelValue: 250 })
		expect(wrapper.find('[data-cy="progress-circle-value"]').text()).toBe('100%')
	})

	test('renders semi circle shape', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 60,
				shape: 'semi-circle',
			},
		})

		expect(wrapper.find('[data-cy="progress-semi-circle-svg"]').exists()).toBe(true)
		expect(wrapper.find('[data-cy="progress-circle-svg"]').exists()).toBe(false)
	})

	test('supports variants', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 30,
				variant: 'danger',
			},
		})

		expect(wrapper.find('[data-cy="progress-circle-track"]').classes()).toContain(
			'stroke-neutral-10'
		)
		expect(
			wrapper.find('[data-cy="progress-circle-indicator"]').classes()
		).toContain('stroke-danger-90')
	})

	test('places label outside for small size and inside for medium size', async () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 42,
				label: 'Upload',
				size: 'sm',
			},
		})

		expect(wrapper.find('[data-cy="progress-circle-label-outside"]').exists()).toBe(
			true
		)
		expect(wrapper.find('[data-cy="progress-circle-label-inside"]').exists()).toBe(
			false
		)

		await wrapper.setProps({ size: 'md' })
		expect(wrapper.find('[data-cy="progress-circle-label-outside"]').exists()).toBe(
			false
		)
		expect(wrapper.find('[data-cy="progress-circle-label-inside"]').exists()).toBe(
			true
		)
	})

	test('uses rounded line cap on track and indicator', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 70,
			},
		})

		expect(
			wrapper.find('[data-cy="progress-circle-track"]').attributes('stroke-linecap')
		).toBe('round')
		expect(
			wrapper
				.find('[data-cy="progress-circle-indicator"]')
				.attributes('stroke-linecap')
		).toBe('round')
	})
})
