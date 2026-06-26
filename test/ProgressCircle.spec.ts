import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import ProgressCircle from '../lib/components/progress-circle/ProgressCircle.vue'

describe('ProgressCircle', () => {
	test('renders default circle with clamped value and accessibility attributes', async () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 45,
			},
		})

		expect(wrapper.find('[data-cy="progress-circle-value"]').text()).toBe('45%')
		expect(wrapper.find('[data-cy="progress-circle-svg"]').exists()).toBe(true)

		const progressRoot = wrapper.find('[data-cy="progress-circle"]')
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
			'stroke-neutral-100'
		)
		expect(
			wrapper.find('[data-cy="progress-circle-indicator"]').classes()
		).toContain('stroke-danger-400')
	})

	test('applies diameter as width and height style', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				diameter: '8rem',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('8rem')
		expect(sizeContainer?.style.height).toBe('8rem')
	})

	test('accepts px unit as diameter', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				diameter: '160px',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('160px')
		expect(sizeContainer?.style.height).toBe('160px')
	})

	test('normalizes bare number diameter to px', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				diameter: '180',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('180px')
		expect(sizeContainer?.style.height).toBe('180px')
	})

	test('applies diameter as width and half-diameter as height for semi-circle', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				shape: 'semi-circle',
				diameter: '10rem',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('10rem')
		expect(sizeContainer?.style.aspectRatio).toBe('2 / 1')
	})

	test('accepts px unit as diameter in semi-circle', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				shape: 'semi-circle',
				diameter: '200px',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('200px')
		expect(sizeContainer?.style.aspectRatio).toBe('2 / 1')
	})

	test('normalizes bare number diameter to px in semi-circle', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				shape: 'semi-circle',
				diameter: '180',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('180px')
		expect(sizeContainer?.style.aspectRatio).toBe('2 / 1')
	})

	test('preserves percentage diameter in semi-circle', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				shape: 'semi-circle',
				diameter: '75%',
			},
		})

		const sizeContainer = wrapper.find('[data-cy="progress-circle-value-container"]').element.closest('div[style]') as HTMLElement
		expect(sizeContainer?.style.width).toBe('75%')
		expect(sizeContainer?.style.aspectRatio).toBe('2 / 1')
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

	test('clamps negative value to 0', () => {
		const wrapper = mount(ProgressCircle, {
			props: { modelValue: -50 },
		})

		expect(wrapper.find('[data-cy="progress-circle-value"]').text()).toBe('0%')
		expect(wrapper.find('[data-cy="progress-circle"]').attributes('aria-valuenow')).toBe('0')
	})

	test('clamps value above 100 to 100', () => {
		const wrapper = mount(ProgressCircle, {
			props: { modelValue: 999 },
		})

		expect(wrapper.find('[data-cy="progress-circle-value"]').text()).toBe('100%')
		expect(wrapper.find('[data-cy="progress-circle"]').attributes('aria-valuenow')).toBe('100')
	})

	test('rounds decimal value', () => {
		const wrapper = mount(ProgressCircle, {
			props: { modelValue: 72.6 },
		})

		expect(wrapper.find('[data-cy="progress-circle-value"]').text()).toBe('73%')
		expect(wrapper.find('[data-cy="progress-circle"]').attributes('aria-valuenow')).toBe('73')
	})

	test('clamps strokeWidth to minimum safe value before rendering', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				strokeWidth: 0,
			},
		})

		expect(wrapper.find('[data-cy="progress-circle-track"]').attributes('stroke-width')).toBe('1')
		expect(wrapper.find('[data-cy="progress-circle-indicator"]').attributes('stroke-width')).toBe('1')
	})

	test('clamps strokeWidth below viewBox size before rendering', () => {
		const wrapper = mount(ProgressCircle, {
			props: {
				modelValue: 50,
				strokeWidth: 120,
			},
		})

		expect(wrapper.find('[data-cy="progress-circle-track"]').attributes('stroke-width')).toBe('119')
		expect(wrapper.find('[data-cy="progress-circle-indicator"]').attributes('stroke-width')).toBe('119')
	})
})
