import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import Sidebar from '../lib/components/sidebar/Sidebar.vue'

describe('Sidebar', () => {
	test('renders with default props', () => {
		const wrapper = mount(Sidebar)
		expect(wrapper.find('aside').exists()).toBe(true)
		expect(wrapper.classes()).toContain('w-65')
	})

	test('renders collapsed state', () => {
		const wrapper = mount(Sidebar, {
			props: { collapsed: true },
		})
		expect(wrapper.classes()).toContain('w-24')
	})

	test('renders expanded state', () => {
		const wrapper = mount(Sidebar, {
			props: { collapsed: false },
		})
		expect(wrapper.classes()).toContain('w-65')
	})

	test('has correct width when collapsed changes', async () => {
		const wrapper = mount(Sidebar, {
			props: { collapsed: false },
		})
		expect(wrapper.classes()).toContain('w-65')

		await wrapper.setProps({ collapsed: true })
		expect(wrapper.classes()).toContain('w-24')
	})

	test('provides sidebar-collapsed to children', () => {
		const wrapper = mount(Sidebar, {
			props: { collapsed: true },
			slots: {
				default: '<div data-testid="child">Child content</div>',
			},
		})
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)
	})

	test('applies custom class', () => {
		const wrapper = mount(Sidebar, {
			props: { class: 'custom-class' },
		})
		expect(wrapper.classes()).toContain('custom-class')
	})

	test('has correct base classes', () => {
		const wrapper = mount(Sidebar)
		expect(wrapper.classes()).toContain('flex')
		expect(wrapper.classes()).toContain('flex-col')
		expect(wrapper.classes()).toContain('h-full')
		expect(wrapper.classes()).toContain('bg-white')
		expect(wrapper.classes()).toContain('border-r')
		expect(wrapper.classes()).toContain('transition-all')
		expect(wrapper.classes()).toContain('duration-300')
	})
})
