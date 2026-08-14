import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { nextTick } from 'vue'
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

		const progressRoot = wrapper.find('[data-cy="progress"]')
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

		expect(wrapper.find('[data-cy="progress"]').classes()).toContain(
			'bg-neutral-100'
		)
		expect(wrapper.find('[data-cy="progress-indicator"]').classes()).toContain(
			'bg-danger-main'
		)
	})

	test('applies custom size style and updates when size changes', async () => {
		const wrapper = mount(Progress, {
			props: {
				modelValue: 40,
				size: '1.25rem',
			},
		})

		const progressRoot = wrapper.find('[data-cy="progress"]')
		expect((progressRoot.element as HTMLElement).style.height).toBe('1.25rem')

		await wrapper.setProps({ size: '12px' })
		expect((progressRoot.element as HTMLElement).style.height).toBe('12px')
	})

	test('renders tooltip portal content when showTooltip is true', async () => {
		const wrapper = mount(Progress, {
			attachTo: document.body,
			props: {
				modelValue: 32,
				showTooltip: true,
				dataCy: 'progress-tooltip-test',
			},
		})

		expect(wrapper.find('[data-cy="progress-tooltip-test-tooltip-trigger"]').exists()).toBe(true)
		await nextTick()

		const tooltipContent = document.body.querySelector('[data-cy="progress-tooltip-test-tooltip"]')
		expect(tooltipContent).not.toBeNull()
		expect(tooltipContent?.textContent).toContain('32%')

		wrapper.unmount()
	})

	test('updates tooltip content when progress value changes', async () => {
		const wrapper = mount(Progress, {
			attachTo: document.body,
			props: {
				modelValue: 12,
				showTooltip: true,
				dataCy: 'progress-tooltip-update-test',
			},
		})

		await wrapper.setProps({ modelValue: 45.7 })
		await nextTick()

		const tooltipContent = document.body.querySelector('[data-cy="progress-tooltip-update-test-tooltip"]')
		expect(tooltipContent).not.toBeNull()
		expect(tooltipContent?.textContent).toContain('46%')

		wrapper.unmount()
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
		expect(indicator.classes()).toContain('duration-400')
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

		const progressRoot = wrapper.find('[data-cy="progress"]')
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

		const progressRoot = wrapper.find('[data-cy="progress"]')
		expect(progressRoot.attributes('aria-valuenow')).toBe('46')
		expect(progressRoot.attributes('aria-valuetext')).toBe('46%')
	})
})
