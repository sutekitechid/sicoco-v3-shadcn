import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import ImageCropperZoom from '../lib/components/image-cropper/ImageCropperZoom.vue'
import ImageCropperToolbar from '../lib/components/image-cropper/ImageCropperToolbar.vue'
import {
	imageCropperVariants,
	imageCropperAreaVariants,
	imageCropperZoomVariants,
	imageCropperToolbarVariants,
} from '../lib/components/image-cropper'

test('ImageCropperZoom renders with default values', () => {
	const wrapper = mount(ImageCropperZoom)
	expect(wrapper.find('.cursor-pointer').exists()).toBe(true)
	expect(wrapper.find('.si-heroicon-solid-magnifying-glass-minus').exists()).toBe(true)
	expect(wrapper.find('.si-heroicon-solid-magnifying-glass-plus').exists()).toBe(true)
	expect(wrapper.find('button').exists()).toBe(true)
})

test('ImageCropperZoom renders with custom value', () => {
	const wrapper = mount(ImageCropperZoom, {
		props: {
			modelValue: 0.5,
		},
	})
	expect(wrapper.props('modelValue')).toBe(0.5)
})

test('ImageCropperZoom has zoom icons', () => {
	const wrapper = mount(ImageCropperZoom)
	expect(wrapper.find('.si-heroicon-solid-magnifying-glass-minus').exists()).toBe(true)
	expect(wrapper.find('.si-heroicon-solid-magnifying-glass-plus').exists()).toBe(true)
})

test('ImageCropperZoom has rotate button', () => {
	const wrapper = mount(ImageCropperZoom)
	const rotateButton = wrapper.find('button')
	expect(rotateButton.exists()).toBe(true)
	expect(rotateButton.find('i').classes()).toContain('si-heroicon-solid-arrow-path-rounded-square')
})

test('ImageCropperZoom emits rotate event on button click', async () => {
	const wrapper = mount(ImageCropperZoom)
	const rotateButton = wrapper.find('button')
	await rotateButton.trigger('click')
	expect(wrapper.emitted('rotate')).toBeTruthy()
	expect(wrapper.emitted('rotate')!.length).toBe(1)
})

test('ImageCropperToolbar renders all buttons', () => {
	const wrapper = mount(ImageCropperToolbar)
	expect(wrapper.text()).toContain('Reset')
	expect(wrapper.text()).toContain('Batal')
	expect(wrapper.text()).toContain('Terapkan')
})

test('ImageCropperToolbar reset button disabled when disabledReset is true', () => {
	const wrapper = mount(ImageCropperToolbar, {
		props: {
			disabledReset: true,
		},
	})
	const resetButton = wrapper.findAll('button').find((b) => b.text().includes('Reset'))
	expect(resetButton?.attributes('disabled')).toBeDefined()
})

test('ImageCropperToolbar reset button enabled by default', () => {
	const wrapper = mount(ImageCropperToolbar)
	const resetButton = wrapper.findAll('button').find((b) => b.text().includes('Reset'))
	expect(resetButton?.attributes('disabled')).toBeUndefined()
})

test('ImageCropperToolbar emits reset event', async () => {
	const wrapper = mount(ImageCropperToolbar)
	const resetButton = wrapper.findAll('button').find((b) => b.text().includes('Reset'))
	await resetButton?.trigger('click')
	expect(wrapper.emitted('reset')).toBeTruthy()
})

test('ImageCropperToolbar emits cancel event', async () => {
	const wrapper = mount(ImageCropperToolbar)
	const cancelButton = wrapper.findAll('button').find((b) => b.text().includes('Batal'))
	await cancelButton?.trigger('click')
	expect(wrapper.emitted('cancel')).toBeTruthy()
})

test('ImageCropperToolbar emits apply event', async () => {
	const wrapper = mount(ImageCropperToolbar)
	const applyButton = wrapper.findAll('button').find((b) => b.text().includes('Terapkan'))
	await applyButton?.trigger('click')
	expect(wrapper.emitted('apply')).toBeTruthy()
})

test('imageCropperVariants generates correct classes', () => {
	const classes = imageCropperVariants()
	expect(classes).toContain('flex')
	expect(classes).toContain('w-full')
})

test('imageCropperAreaVariants generates correct classes', () => {
	expect(imageCropperAreaVariants({ shape: 'square' })).toContain('rounded-none')
	expect(imageCropperAreaVariants({ shape: 'circle' })).toContain('rounded-full')
})

test('imageCropperZoomVariants generates correct classes', () => {
	const classes = imageCropperZoomVariants()
	expect(classes).toContain('flex')
	expect(classes).toContain('items-center')
})

test('imageCropperToolbarVariants generates correct classes', () => {
	const classes = imageCropperToolbarVariants()
	expect(classes).toContain('flex')
	expect(classes).toContain('justify-between')
	expect(classes).toContain('px-4')
	expect(classes).toContain('py-3')
})
