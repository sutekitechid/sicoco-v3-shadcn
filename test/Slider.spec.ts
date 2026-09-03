import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Slider from '../lib/components/slider/Slider.vue'
import {
	sliderVariants,
	sliderTrackVariants,
	sliderRangeVariants,
	sliderThumbVariants,
} from '../lib/components/slider'

test('Slider renders root element', () => {
	const wrapper = mount(Slider)
	expect(wrapper.find('[data-slider-impl]').exists()).toBe(true)
})

test('Slider renders thumb element', () => {
	const wrapper = mount(Slider)
	expect(wrapper.find('[role="slider"]').exists()).toBe(true)
})

test('Slider has correct min/max on thumb', () => {
	const wrapper = mount(Slider, {
		props: {
			min: 0,
			max: 50,
		},
	})
	const thumb = wrapper.find('[role="slider"]')
	expect(thumb.attributes('aria-valuemin')).toBe('0')
	expect(thumb.attributes('aria-valuemax')).toBe('50')
})

test('Slider applies value correctly', () => {
	const wrapper = mount(Slider, {
		props: {
			modelValue: 25,
			min: 0,
			max: 100,
		},
	})
	const range = wrapper.find('[data-orientation="horizontal"]')
	expect(range.exists()).toBe(true)
})

test('Slider renders disabled state', () => {
	const wrapper = mount(Slider, {
		props: {
			disabled: true,
		},
	})
	const root = wrapper.find('[data-slider-impl]')
	expect(root.attributes('aria-disabled')).toBe('true')
})

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
