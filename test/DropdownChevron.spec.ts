import { mount } from '@vue/test-utils'
import { test, expect, it } from 'vitest'
import DropdownChevron from '../lib/components/dropdown/DropdownChevron.vue'

// Helper to get root element (could be div, span, etc)
function getRoot(wrapper) {
	return wrapper.element
}

test('DropdownChevron renders correctly', () => {
	const wrapper = mount(DropdownChevron, {
		props: {
			open: false,
			icon: 'si-chevron-down text-white',
		},
	})
	const icon = wrapper.find('i')
	expect(icon.exists()).toBe(true)
	expect(icon.classes()).toContain('si-chevron-down')
	expect(icon.classes()).toContain('text-white')
})

it('DropdownChevron applies custom class', () => {
	const customClass = 'custom-class'
	const wrapper = mount(DropdownChevron, {
		props: {
			open: false,
			icon: 'si-chevron-down text-white',
			class: customClass,
		},
	})
	expect(getRoot(wrapper).className).toContain(customClass)
})

it('DropdownChevron applies default class when no custom class is provided', () => {
	const wrapper = mount(DropdownChevron, {
		props: {
			open: false,
			icon: 'si-chevron-down text-white',
		},
	})
	const root = getRoot(wrapper)
	expect(root.className).toContain('w-6')
	expect(root.className).toContain('h-6')
	expect(root.className).toContain('flex')
	expect(root.className).toContain('items-center')
	expect(root.className).toContain('justify-center')
	expect(root.className).toContain('transition-transform')
	expect(root.className).toContain('duration-200')
	expect(root.className).toContain('rotate-0')
})

it('DropdownChevron renders icon with correct classes', () => {
	const iconClass = 'si-chevron-down text-white'
	const wrapper = mount(DropdownChevron, {
		props: {
			open: false,
			icon: iconClass,
		},
	})
	const iconElement = wrapper.find('i')
	expect(iconElement.exists()).toBe(true)
	expect(iconElement.classes()).toContain('si-chevron-down')
	expect(iconElement.classes()).toContain('text-white')
})

it('DropdownChevron does not apply rotate-180 class when open is false', () => {
	const wrapper = mount(DropdownChevron, {
		props: {
			open: false,
			icon: 'si-chevron-down text-white',
		},
	})
	const root = getRoot(wrapper)
	expect(root.className).toContain('rotate-0')
	expect(root.className).not.toContain('rotate-180')
})

it('DropdownChevron applies rotate-180 class when open is true', () => {
	const wrapper = mount(DropdownChevron, {
		props: {
			open: true,
			icon: 'si-chevron-down text-white',
		},
	})
	const root = getRoot(wrapper)
	expect(root.className).toContain('rotate-180')
	expect(root.className).not.toContain('rotate-0')
})

it('DropdownChevron sets correct data-cy attribute', () => {
	const wrapperOpen = mount(DropdownChevron, {
		props: { open: true },
	})
	const wrapperClosed = mount(DropdownChevron, {
		props: { open: false },
	})
	expect(getRoot(wrapperOpen).getAttribute('data-cy')).toBe(
		'dropdown-chevron-open'
	)
	expect(getRoot(wrapperClosed).getAttribute('data-cy')).toBe(
		'dropdown-chevron-closed'
	)
})

it('DropdownChevron uses default icon if icon prop is not provided', () => {
	const wrapper = mount(DropdownChevron, {
		props: { open: false },
	})
	const icon = wrapper.find('i')
	expect(icon.exists()).toBe(true)
	expect(icon.classes()).toContain('si-chevron-down')
	expect(icon.classes()).toContain('text-main')
})

it('DropdownChevron applies custom duration class', () => {
	const wrapper = mount(DropdownChevron, {
		props: {
			open: false,
			icon: 'si-chevron-down text-white',
			duration: 300,
		},
	})
	const root = getRoot(wrapper)
	expect(root.className).toContain('duration-300')
	// Pastikan default duration tidak ada
	expect(root.className).not.toContain('duration-200')
})
