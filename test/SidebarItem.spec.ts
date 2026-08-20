import { mount } from '@vue/test-utils'
import { test, expect, describe, vi } from 'vitest'
import { ref } from 'vue'
import SidebarItem from '../lib/components/sidebar/SidebarItem.vue'

describe('SidebarItem', () => {
	test('renders with label', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
		})
		expect(wrapper.html()).toContain('Beranda')
	})

	test('renders with icon', () => {
		const wrapper = mount(SidebarItem, {
			props: { icon: 'si-home', label: 'Beranda' },
		})
		expect(wrapper.find('.si-home').exists()).toBe(true)
	})

	test('renders div when no children slot is provided', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
		})
		expect(wrapper.find('div.cursor-pointer').exists()).toBe(true)
	})

	test('renders button when children slot is provided', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})
		expect(wrapper.find('button').exists()).toBe(true)
	})

	test('applies active variant when active prop is true', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Test', active: true },
		})
		const item = wrapper.find('div.cursor-pointer')
		expect(item.classes()).toContain('bg-secondary-default')
	})

	test('applies default variant when active prop is false', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Test', active: false },
		})
		const item = wrapper.find('div.cursor-pointer')
		expect(item.classes()).toContain('text-secondary')
	})

	test('applies active variant when hasActiveChild is true', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Parent', hasActiveChild: true },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})
		const button = wrapper.find('button')
		expect(button.classes()).toContain('bg-secondary-default')
	})

	test('emits click event when item is clicked', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
		})
		await wrapper.find('div.cursor-pointer').trigger('click')
		expect(wrapper.emitted('click')).toHaveLength(1)
	})

	test('toggles dropdown on button click', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})

		expect(wrapper.find('[data-testid="child"]').exists()).toBe(false)

		await wrapper.find('button').trigger('click')
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)

		await wrapper.find('button').trigger('click')
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(false)
	})

	test('defaultOpen prop opens dropdown initially', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan', defaultOpen: true },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)
	})

	test('isOpen prop controls dropdown externally', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan', isOpen: true },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)

		await wrapper.setProps({ isOpen: false })
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(false)
	})

	test('renders chevron icon for dropdown', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})
		expect(wrapper.find('.si-chevron-down').exists()).toBe(true)
	})

	test('chevron rotates when dropdown is open', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
		})

		const chevron = wrapper.find('.si-chevron-down')
		expect(chevron.classes()).not.toContain('rotate-180')

		await wrapper.find('button').trigger('click')
		expect(chevron.classes()).toContain('rotate-180')
	})

	test('does not render label when collapsed', () => {
		const collapsed = ref(true)
		const setCollapsed = vi.fn()
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
					'sidebar-set-collapsed': setCollapsed,
				},
			},
		})
		expect(wrapper.find('span.truncate').exists()).toBe(false)
	})

	test('applies collapsed size variant when collapsed', () => {
		const collapsed = ref(true)
		const setCollapsed = vi.fn()
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
					'sidebar-set-collapsed': setCollapsed,
				},
			},
		})
		expect(wrapper.html()).toContain('w-12')
		expect(wrapper.html()).toContain('h-12')
	})

	test('applies default size variant when expanded', () => {
		const collapsed = ref(false)
		const setCollapsed = vi.fn()
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
					'sidebar-set-collapsed': setCollapsed,
				},
			},
		})
		const item = wrapper.find('div.cursor-pointer')
		expect(item.classes()).toContain('w-full')
		expect(item.classes()).toContain('h-12')
	})

	test('applies custom class', () => {
		const collapsed = ref(false)
		const setCollapsed = vi.fn()
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda', class: 'custom-class' },
			global: {
				provide: {
					'sidebar-collapsed': collapsed,
					'sidebar-set-collapsed': setCollapsed,
				},
			},
		})
		const item = wrapper.find('div.cursor-pointer')
		expect(item.classes()).toContain('custom-class')
	})
})
