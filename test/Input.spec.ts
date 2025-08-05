import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { generateRandomName } from '../lib/components/base-input/index'
import Input from '../lib/components/input/Input.vue'
import {
	parseCurrencyToNumber,
	meetsExactLength,
	convertMorpWidthToCss,
	getInputPaddingRight,
	truncateFractionDigits,
	isValidFractionalDigits,
} from '../lib/components/input'

test('generateRandomName', () => {
	const name = generateRandomName()
	expect(name).toContain('input__')
})

test('should display input', () => {
	const wrapper = mount(Input)
	expect(wrapper.find('input').exists()).toBe(true)
})

test('should display placeholder', () => {
	const wrapper = mount(Input, {
		props: {
			placeholder: 'Shadcn Input',
		},
	})
	expect(wrapper.find('input').attributes('placeholder')).toBe('Shadcn Input')
})

test('should receive string value', async () => {
	const wrapper = mount(Input)
	await wrapper.find('input').setValue('Shadcn Input')
	expect(wrapper.find('input').element.value).toBe('Shadcn Input')
})

test('should receive number value', async () => {
	const wrapper = mount(Input, {
		props: {
			type: 'number',
		},
	})
	await wrapper.find('input').setValue(1000)
	expect(wrapper.find('input').element.value).toBe('1000')
})

test('should receive currency value', async () => {
	const wrapper = mount(Input, {
		props: {
			modelValue: 1000,
			type: 'currency',
		},
	})
	expect(wrapper.find('input').element.value).toBe('1.000')
})

test('should receive password value', async () => {
	const wrapper = mount(Input, {
		props: {
			type: 'password',
		},
	})
	await wrapper.find('input').setValue('Shadcn Input')
	expect(wrapper.find('input').element.value).toBe('Shadcn Input')
})

test('should receive email value', async () => {
	const wrapper = mount(Input, {
		props: {
			type: 'email',
		},
	})
	await wrapper.find('input').setValue('example@example.com')
	expect(wrapper.find('input').element.value).toBe('example@example.com')
})

test('should validate min value', async () => {
	const expected = 'Minimal 10'
	const wrapper = mount(Input, {
		props: {
			modelValue: 5,
			min: 10,
			type: 'number',
		},
		slots: {
			minValue: expected,
		},
	})
	await wrapper.find('input').trigger('blur')
	expect(wrapper.find('.input__help-message').text()).toContain(expected)
})

test('should validate max value', async () => {
	const expected = 'Maksimal 100'
	const wrapper = mount(Input, {
		props: {
			modelValue: 1500,
			max: 100,
			type: 'currency',
		},
		slots: {
			maxValue: expected,
		},
	})
	// find class .input__help-message and check if it contains 'max'
	setTimeout(() => {
		expect(wrapper.find('.input__help-message').text()).toContain(expected)
	}, 50)
})

test('should validate required value', async () => {
	const expected = 'Wajib diisi'
	const wrapper = mount(Input, {
		props: {
			required: true,
		},
		slots: {
			required: expected,
		},
	})
	await wrapper.find('input').trigger('blur')
	expect(wrapper.find('.input__help-message').text()).toContain(expected)
})

test('should validate exact length', async () => {
	const expected = 'Harus 5 karakter'
	const wrapper = mount(Input, {
		props: {
			exactLength: 5,
			modelValue: '123456',
		},
		slots: {
			exactLength: expected,
		},
	})
	// find class .input__help-message and check if it contains 'length'
	setTimeout(() => {
		expect(wrapper.find('.input__help-message').text()).toContain(expected)
	}, 50)
})

test('should validate email', async () => {
	const expected = 'Email tidak valid'
	const wrapper = mount(Input, {
		props: {
			type: 'email',
			modelValue: 'example',
		},
		slots: {
			email: expected,
		},
	})
	await wrapper.find('input').setValue('example')
	await wrapper.find('input').trigger('blur')
	expect(wrapper.find('.input__help-message').text()).toContain(expected)
})

test('should validate url', async () => {
	const expected = 'Masukkan URL yang valid. Contoh: https://example.com'
	const wrapper = mount(Input, {
		props: {
			type: 'url',
			modelValue: 'example',
		},
		slots: {
			url: expected,
		},
	})
	await wrapper.find('input').setValue('example')
	await wrapper.find('input').trigger('blur')
	expect(wrapper.find('.input__help-message').text()).toContain(expected)
})

test('should disable input', async () => {
	const wrapper = mount(Input, {
		props: {
			disabled: true,
		},
	})
	// is input disabled
	expect(wrapper.find('input').attributes('disabled')).toBe('')
})

test('parseCurrencyToNumber', () => {
	expect(parseCurrencyToNumber('1.000,00')).toBe(1000)
})

test('meetsExactLength', () => {
	expect(meetsExactLength('12345', 5)).toBe(true)
	expect(meetsExactLength('12345', 6)).toBe(false)
})

test('convertMorpWidthToCss', () => {
	expect(convertMorpWidthToCss(10)).toBe('calc(0.5rem + 10px)')
	expect(convertMorpWidthToCss(100)).toBe('calc(0.5rem + 100px)')
})

test('getInputPaddingRight', () => {
	expect(getInputPaddingRight(10, false, true)).toBe('calc(0.5rem + 10px)')
	expect(getInputPaddingRight(10, true, true)).toBe(
		'calc(calc(0.5rem + 10px) + 1.5rem)'
	)
})

test('Should show custom validator message', async () => {
	const wrapper = mount(Input, {
		props: {
			modelValue: '123456',
			customValidators: {
				helloWorld: (value: string | number) => value === 'hello world',
			},
		},
		slots: {
			errors:
				'<template #errors="{ validation }"><span v-if="validation.helloWorld?.$invalid">Masukkan kata hello world</span></template>',
		},
	})
	await wrapper.find('input').trigger('blur')
	expect(wrapper.find('.input__help-message').text()).toContain(
		'Masukkan kata hello world'
	)
})

test('Should show password when eye icon clicked', async () => {
	const wrapper = mount(Input, {
		props: {
			type: 'password',
			modelValue: 'password',
		},
	})

	expect(wrapper.find('input').attributes('type')).toBe('password')
	await wrapper.find('.si-eye').trigger('click')
	expect(wrapper.find('input').attributes('type')).toBe('text')
})

test('Should return the correct value when calling truncateFractionDigits', () => {
	expect(truncateFractionDigits('123.456789', 2)).toBe('123.45')
	expect(truncateFractionDigits('123.456789', 0)).toBe('123')
	expect(truncateFractionDigits('123.456789', 5)).toBe('123.45678')
})

test('Should return the correct value when calling isValidFractionalDigits', () => {
	expect(isValidFractionalDigits('123.456789', 2)).toBe(false)
	expect(isValidFractionalDigits('123.45', 2)).toBe(true)
	expect(isValidFractionalDigits('123.4', 2)).toBe(true)
	expect(isValidFractionalDigits('123', 2)).toBe(true)
	expect(isValidFractionalDigits('123.', 2)).toBe(true)
})
