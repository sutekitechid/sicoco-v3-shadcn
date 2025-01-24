import { mount } from '@vue/test-utils'
import { test, expect } from 'vitest'
import Sidemenu from '../lib/components/sidemenu/Sidemenu.vue'
import { ref } from 'vue'

const items = [
	{ value: 'home', label: 'Home', to: '/home' },
	{ value: 'about', label: 'About', to: '/about' },
	{ value: 'contact', label: 'Contact', to: '/contact' },
]

test('renders the correct number of items', () => {
	const wrapper = mount(Sidemenu, {
		props: { items },
	})

	const listItems = wrapper.findAll('section')
	expect(listItems.length).toBe(items.length)
})

test('applies custom class passed via props at parent element', () => {
	const customClass = 'custom-class'
	const wrapper = mount(Sidemenu, {
		props: { items, class: customClass },
	})

	const sidenavElement = wrapper.find('aside')
	expect(sidenavElement.classes()).toContain(customClass)
})
