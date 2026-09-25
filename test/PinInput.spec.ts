import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { test, expect } from 'vitest'
import PinInput from '../lib/components/pin-input/PinInput.vue'
import BaseInput from '../lib/components/base-input/BaseInput.vue'
import { pinInputVariants } from '../lib/components/pin-input'

// reka-ui PinInputRoot renders one extra hidden input for native form support
const EXTRA_INPUTS = 1

/** Returns only the visible (non-hidden) pin inputs */
function getVisibleInputs(wrapper: ReturnType<typeof mount>) {
	return wrapper.findAll('input').filter(
		inp => inp.attributes('aria-hidden') !== 'true'
	)
}

test('PinInput renders the correct number of input fields', () => {
	const totalPins = 5
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', '', '', ''],
			totalPins,
		},
	})
	expect(wrapper.findAll('input')).toHaveLength(totalPins + EXTRA_INPUTS)
})

test('PinInput renders fewer inputs when totalPins is 3', () => {
	const totalPins = 3
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', ''],
			totalPins,
		},
	})
	expect(wrapper.findAll('input')).toHaveLength(totalPins + EXTRA_INPUTS)
})

test('PinInput renders with pre-filled values', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['1', '2', '3'],
			totalPins: 3,
		},
	})
	const inputs = getVisibleInputs(wrapper)
	expect(inputs[0].element.value).toBe('1')
	expect(inputs[1].element.value).toBe('2')
	expect(inputs[2].element.value).toBe('3')
})

test('PinInput disables inputs when disabled prop is true', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', ''],
			totalPins: 3,
			disabled: true,
		},
	})
	const visibleInputs = getVisibleInputs(wrapper)
	expect(visibleInputs.length).toBeGreaterThan(0)
	visibleInputs.forEach(input => {
		expect(input.attributes('disabled')).toBe('')
	})
})

test('PinInput renders readonly inputs with the readonly state styles', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['1', '2', '3'],
			totalPins: 3,
			readonly: true,
		},
	})

	getVisibleInputs(wrapper).forEach(input => {
		expect(input.attributes('readonly')).toBe('')
		expect(input.classes()).toContain('bg-disabled')
		expect(input.classes()).toContain('text-main')
	})
})

test('PinInput applies disabled state styles', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', ''],
			totalPins: 3,
			disabled: true,
		},
	})

	getVisibleInputs(wrapper).forEach(input => {
		expect(input.classes()).toContain('bg-disabled')
		expect(input.classes()).toContain('text-placeholder')
	})
})

test('PinInput gives disabled styles precedence over readonly styles', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', '', ''],
			totalPins: 3,
			disabled: true,
			readonly: true,
		},
	})

	getVisibleInputs(wrapper).forEach(input => {
		expect(input.classes()).toContain('text-placeholder')
		expect(input.classes()).not.toContain('text-main')
	})
})

test.each([
	['sm', 'h-10', 'w-10', 'text-title-sm'],
	['md', 'h-10', 'w-10', 'text-title-md'],
	['lg', 'h-12', 'w-12', 'text-title-lg'],
] as const)('PinInput applies the %s size variant', (size, height, width, typography) => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', ''],
			totalPins: 2,
			size,
		},
	})

	getVisibleInputs(wrapper).forEach(input => {
		expect(input.classes()).toContain(height)
		expect(input.classes()).toContain(width)
		expect(input.classes()).toContain(typography)
		expect(input.classes()).toContain('font-medium')
		expect(input.classes()).toContain('caret-text-main')
	})
})

test('PinInput uses medium size by default', () => {
	expect(pinInputVariants()).toContain('h-10')
	expect(pinInputVariants()).toContain('text-title-md')
})

test('PinInput renders with text type by default', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', ''],
			totalPins: 2,
		},
	})
	const visibleInputs = getVisibleInputs(wrapper)
	expect(visibleInputs.length).toBeGreaterThan(0)
	visibleInputs.forEach(input => {
		expect(input.attributes('inputmode')).toBe('text')
	})
})

test('PinInput renders with number type using numeric inputmode', () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['', ''],
			totalPins: 2,
			type: 'number',
		},
	})
	const visibleInputs = getVisibleInputs(wrapper)
	expect(visibleInputs.length).toBeGreaterThan(0)
	visibleInputs.forEach(input => {
		expect(input.attributes('inputmode')).toBe('numeric')
	})
})

test('PinInput focuses a pin input when validation requests it', () => {
	const wrapper = mount(PinInput, {
		attachTo: document.body,
		props: {
			modelValue: ['1', '', ''],
			totalPins: 3,
		},
	})

	const inputs = getVisibleInputs(wrapper)
	wrapper.vm.focus()

	expect(document.activeElement).toBe(inputs[1].element)
	wrapper.unmount()
})

test('PinInput uses one validation wrapper and displays one required message', async () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: [],
			totalPins: 4,
			required: true,
		},
		slots: {
			required: 'PIN wajib diisi.',
		},
	})

	const baseInput = wrapper.findComponent(BaseInput)
	expect(wrapper.findAllComponents(BaseInput)).toHaveLength(1)
	expect((baseInput.vm as { validate: () => boolean }).validate()).toBe(false)
	await nextTick()

	expect(wrapper.findAll('.input__help-message')).toHaveLength(1)
	expect(wrapper.find('.input__help-message').text()).toContain('PIN wajib diisi.')
})

test('PinInput requires every pin, including a numeric zero', async () => {
	const wrapper = mount(PinInput, {
		props: {
			modelValue: ['1'],
			totalPins: 4,
			required: true,
		},
	})
	const baseInput = wrapper.findComponent(BaseInput)

	expect((baseInput.vm as { validate: () => boolean }).validate()).toBe(false)

	await wrapper.setProps({
		modelValue: [0, '1', '2', '3'] as unknown as string[],
	})
	expect((baseInput.vm as { validate: () => boolean }).validate()).toBe(true)
})
