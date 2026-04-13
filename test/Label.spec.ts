import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import { Label } from '../lib/components/label'

test('Label renders slot content', () => {
	const wrapper = mount(Label, {
		slots: { default: 'Username' },
	})
	expect(wrapper.text()).toBe('Username')
})

test('Label renders as a label element', () => {
	const wrapper = mount(Label, {
		slots: { default: 'Email' },
	})
	expect(wrapper.find('label').exists()).toBe(true)
})

test('Label applies custom class', () => {
	const wrapper = mount(Label, {
		props: { class: 'custom-label' },
		slots: { default: 'Name' },
	})
	expect(wrapper.classes()).toContain('custom-label')
})

test('Label applies base text-sm class by default', () => {
	const wrapper = mount(Label, {
		slots: { default: 'Label' },
	})
	expect(wrapper.classes()).toContain('text-sm')
})

test('Label renders empty when no slot is provided', () => {
	const wrapper = mount(Label)
	expect(wrapper.find('label').exists()).toBe(true)
	expect(wrapper.text()).toBe('')
})
