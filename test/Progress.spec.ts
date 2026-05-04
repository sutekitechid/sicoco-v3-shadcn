import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import Progress from '../lib/components/progress/Progress.vue'

describe('Progress', () => {
	test('renders default progress bar with clamped value and accessibility attributes', async () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 150,
			},
		})

		expect(wrapper.find('[data-cy="progress-indicator"]').attributes('style')).toBe(
			'width: 100%;'
		)

		const progressRoot = wrapper.find('[data-cy="progress-root"]')
		expect(progressRoot.attributes('aria-valuemin')).toBe('0')
		expect(progressRoot.attributes('aria-valuemax')).toBe('100')
		expect(progressRoot.attributes('aria-valuenow')).toBe('100')
		expect(progressRoot.attributes('aria-valuetext')).toBe('100%')

		await wrapper.setProps({ modelValue: 250 })
		expect(wrapper.find('[data-cy="progress-indicator"]').attributes('style')).toBe(
			'width: 100%;'
		)
	})

	test('supports variants', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 40,
				variant: 'danger',
			},
		})

		expect(wrapper.find('[data-cy="progress-root"]').classes()).toContain(
			'bg-neutral-10'
		)
		expect(wrapper.find('[data-cy="progress-indicator"]').classes()).toContain(
			'bg-danger-90'
		)
	})

	test('renders tooltip when showTooltip is true', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 32,
				showTooltip: true
			},
		})

		expect(wrapper.findAll('[data-cy="progress-tooltip-trigger"]').length).toBe(1)
	})

	test('applies rounded class on indicator bar', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 45,
			},
		})

		expect(wrapper.find('[data-cy="progress-indicator"]').classes()).toContain(
			'rounded-full'
		)
	})

	test('applies transition classes to indicator segments', () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 45,
			},
		})

		const indicator = wrapper.find('[data-cy="progress-indicator"]')

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

		const progressRoot = wrapper.find('[data-cy="progress-root"]')
		expect(progressRoot.attributes('aria-valuemin')).toBe('0')
		expect(progressRoot.attributes('aria-valuemax')).toBe('100')
		expect(progressRoot.attributes('aria-valuenow')).toBe('55')
		expect(progressRoot.attributes('aria-valuetext')).toBe('55%')
		expect(progressRoot.attributes('aria-label')).toBe('Upload progress')
	})

	test('clamps negative value to 0', () => {
		const wrapper = mount(Progress, {
			props: { modelValue: -20 },
		})

		expect(wrapper.find('[data-cy="progress-indicator"]').attributes('style')).toBe('width: 0%;')
	})

	test('clamps value above 100 to 100', () => {
		const wrapper = mount(Progress, {
			props: { modelValue: 200 },
		})

		expect(wrapper.find('[data-cy="progress-indicator"]').attributes('style')).toBe('width: 100%;')
	})

	test('rounds decimal value', () => {
		const wrapper = mount(Progress, {
			props: { modelValue: 45.7 },
		})

		const progressRoot = wrapper.find('[data-cy="progress-root"]')
		expect(progressRoot.attributes('aria-valuenow')).toBe('46')
		expect(progressRoot.attributes('aria-valuetext')).toBe('46%')
	})
})
