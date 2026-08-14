import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import { ref } from 'vue'
import SidebarGroup from '../lib/components/sidebar/SidebarGroup.vue'

describe('SidebarGroup', () => {
	test('renders with label', () => {
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
		})
		expect(wrapper.html()).toContain('Menu Utama')
	})

	test('renders label as uppercase', () => {
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
		})
		expect(wrapper.find('p').classes()).toContain('uppercase')
	})

	test('hides label when collapsed', () => {
		const collapsed = ref(true)
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('p').exists()).toBe(false)
	})

	test('shows label when expanded', () => {
		const collapsed = ref(false)
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('p').exists()).toBe(true)
	})

	test('shows divider when collapsed', () => {
		const collapsed = ref(true)
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('.si-heroicon-solid-ellipsis-horizontal').exists()).toBe(true)
	})

	test('hides divider when expanded', () => {
		const collapsed = ref(false)
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('.si-heroicon-solid-ellipsis-horizontal').exists()).toBe(false)
	})

	test('renders slot content', () => {
		const wrapper = mount(SidebarGroup, {
			props: { label: 'Menu Utama' },
			slots: {
				default: '<div data-testid="child">Menu Item</div>',
			},
		})
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)
	})

	test('applies custom class', () => {
		const wrapper = mount(SidebarGroup, {
			props: { class: 'custom-class' },
		})
		expect(wrapper.classes()).toContain('custom-class')
	})

	test('has correct base classes', () => {
		const wrapper = mount(SidebarGroup)
		expect(wrapper.classes()).toContain('mt-4')
	})

	test('applies items-center when collapsed', () => {
		const collapsed = ref(true)
		const wrapper = mount(SidebarGroup, {
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('.items-center').exists()).toBe(true)
	})

	test('does not apply items-center when expanded', () => {
		const collapsed = ref(false)
		const wrapper = mount(SidebarGroup, {
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
				},
			},
		})
		expect(wrapper.find('.items-center').exists()).toBe(false)
	})
})
