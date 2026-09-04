import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import Slider from '../lib/components/slider/Slider.vue'
import {
	sliderVariants,
	sliderTrackVariants,
	sliderRangeVariants,
	sliderThumbVariants,
} from '../lib/components/slider'

describe('Slider', () => {
	test('renders root element with default props', () => {
		const wrapper = mount(Slider)
		expect(wrapper.find('[data-slider-impl]').exists()).toBe(true)
	})

	test('renders thumb element', () => {
		const wrapper = mount(Slider)
		expect(wrapper.find('[role="slider"]').exists()).toBe(true)
	})

	test('has correct min/max on thumb', () => {
		const wrapper = mount(Slider, {
			props: { min: 0, max: 50 },
		})
		const thumb = wrapper.find('[role="slider"]')
		expect(thumb.attributes('aria-valuemin')).toBe('0')
		expect(thumb.attributes('aria-valuemax')).toBe('50')
	})

	test('applies value correctly', () => {
		const wrapper = mount(Slider, {
			props: { modelValue: 25, min: 0, max: 100 },
		})
		const thumb = wrapper.find('[role="slider"]')
		expect(thumb.exists()).toBe(true)
		expect(thumb.attributes('aria-valuemin')).toBe('0')
		expect(thumb.attributes('aria-valuemax')).toBe('100')
	})

	test('renders disabled state', () => {
		const wrapper = mount(Slider, {
			props: { disabled: true },
		})
		const root = wrapper.find('[data-slider-impl]')
		expect(root.attributes('aria-disabled')).toBe('true')
	})

	test('renders horizontal orientation by default', () => {
		const wrapper = mount(Slider)
		const root = wrapper.find('[data-slider-impl]')
		expect(root.attributes('data-orientation')).toBe('horizontal')
	})

	test('renders vertical orientation', () => {
		const wrapper = mount(Slider, {
			props: { orientation: 'vertical' },
		})
		const root = wrapper.find('[data-slider-impl]')
		expect(root.attributes('data-orientation')).toBe('vertical')
	})

	test('emits update:modelValue on value change', async () => {
		const wrapper = mount(Slider, {
			props: { modelValue: 50 },
		})
		const thumb = wrapper.find('[role="slider"]')
		await thumb.trigger('keydown', { key: 'ArrowRight' })
		expect(wrapper.emitted('update:modelValue')).toBeTruthy()
	})

	test('does not emit when disabled', async () => {
		const wrapper = mount(Slider, {
			props: { modelValue: 50, disabled: true },
		})
		const thumb = wrapper.find('[role="slider"]')
		await thumb.trigger('keydown', { key: 'ArrowRight' })
		expect(wrapper.emitted('update:modelValue')).toBeUndefined()
	})

	test('handles array value (range slider)', () => {
		const wrapper = mount(Slider, {
			props: { modelValue: [20, 80] },
		})
		const root = wrapper.find('[data-slider-impl]')
		expect(root.exists()).toBe(true)
		expect(Array.isArray(wrapper.props('modelValue'))).toBe(true)
		expect(wrapper.props('modelValue')).toEqual([20, 80])
	})

	test('applies custom class', () => {
		const wrapper = mount(Slider, {
			props: { class: 'custom-class' },
		})
		expect(wrapper.find('[data-slider-impl]').classes()).toContain('custom-class')
	})

	test('sets default value when no modelValue provided', () => {
		const wrapper = mount(Slider, {
			props: { defaultValue: 75 },
		})
		const thumb = wrapper.find('[role="slider"]')
		expect(thumb.exists()).toBe(true)
	})

	test('handles min/max with step correctly', () => {
		const wrapper = mount(Slider, {
			props: { modelValue: 10, min: 0, max: 20, step: 5 },
		})
		const thumb = wrapper.find('[role="slider"]')
		expect(thumb.exists()).toBe(true)
		expect(thumb.attributes('aria-valuemin')).toBe('0')
		expect(thumb.attributes('aria-valuemax')).toBe('20')
	})
})

describe('Slider Variants', () => {
	test('sliderVariants generates correct classes', () => {
		const classes = sliderVariants()
		expect(classes).toContain('relative')
		expect(classes).toContain('flex')
		expect(classes).toContain('w-full')
	})

	test('sliderTrackVariants generates correct classes', () => {
		const classes = sliderTrackVariants()
		expect(classes).toContain('relative')
		expect(classes).toContain('grow')
		expect(classes).toContain('rounded-full')
	})

	test('sliderRangeVariants generates correct classes', () => {
		const classes = sliderRangeVariants()
		expect(classes).toContain('absolute')
		expect(classes).toContain('bg-primary-default')
	})

	test('sliderThumbVariants generates correct classes', () => {
		const classes = sliderThumbVariants()
		expect(classes).toContain('block')
		expect(classes).toContain('rounded-full')
		expect(classes).toContain('border')
	})
})
