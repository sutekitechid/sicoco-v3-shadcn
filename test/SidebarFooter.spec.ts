import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import { ref } from 'vue'
import SidebarFooter from '../lib/components/sidebar/SidebarFooter.vue'

describe('SidebarFooter', () => {
	test('renders with name', () => {
		const wrapper = mount(SidebarFooter, {
			props: { name: 'Nassya Putri Riani' },
		})
		expect(wrapper.html()).toContain('Nassya Putri Riani')
	})

	test('renders first letter of name when no avatar', () => {
		const wrapper = mount(SidebarFooter, {
			props: { name: 'Nassya' },
		})
		expect(wrapper.html()).toContain('N')
	})

	test('renders U when no name and no avatar', () => {
		const wrapper = mount(SidebarFooter)
		expect(wrapper.html()).toContain('U')
	})

	test('renders avatar image when provided', () => {
		const wrapper = mount(SidebarFooter, {
			props: { avatar: '/avatar.png', name: 'Nassya' },
		})
		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('/avatar.png')
		expect(img.attributes('alt')).toBe('Avatar')
	})

	test('emits logout event when logout button is clicked', async () => {
		const wrapper = mount(SidebarFooter, {
			props: { name: 'Nassya', showLogout: true },
		})
		const logoutButton = wrapper.find('button')
		await logoutButton.trigger('click')
		expect(wrapper.emitted('logout')).toBeTruthy()
	})

	test('hides logout button when showLogout is false', () => {
		const wrapper = mount(SidebarFooter, {
			props: { name: 'Nassya', showLogout: false },
		})
		expect(wrapper.find('button').exists()).toBe(false)
	})

	test('applies custom class', () => {
		const wrapper = mount(SidebarFooter, {
			props: { class: 'custom-class' },
		})
		expect(wrapper.classes()).toContain('custom-class')
	})

	test('has correct base classes', () => {
		const wrapper = mount(SidebarFooter)
		expect(wrapper.classes()).toContain('flex')
		expect(wrapper.classes()).toContain('items-center')
		expect(wrapper.classes()).toContain('gap-3')
		expect(wrapper.classes()).toContain('border-t')
		expect(wrapper.classes()).toContain('mt-auto')
	})

	test('applies justify-center when collapsed via inject', () => {
		const collapsed = ref(true)
		const wrapper = mount(SidebarFooter, {
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.classes()).toContain('justify-center')
	})

	test('applies px-4 when expanded via inject', () => {
		const collapsed = ref(false)
		const wrapper = mount(SidebarFooter, {
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.classes()).toContain('px-4')
	})

	test('applies px-2 when collapsed via inject', () => {
		const collapsed = ref(true)
		const wrapper = mount(SidebarFooter, {
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.classes()).toContain('px-2')
	})

	test('hides logout button when collapsed via inject', () => {
		const collapsed = ref(true)
		const wrapper = mount(SidebarFooter, {
			props: { name: 'Nassya', showLogout: true },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('button').exists()).toBe(false)
	})
})
