import { mount } from '@vue/test-utils'
import { test, expect, describe, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import SidebarItem from '../lib/components/sidebar/SidebarItem.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
		{ path: '/test', component: { template: '<div>Test</div>' } },
		{ path: '/test/nested', component: { template: '<div>Nested</div>' } },
	],
})

describe('SidebarItem', () => {
	beforeEach(async () => {
		await router.push('/')
		await router.isReady()
	})

	test('renders with label', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda' },
			global: { plugins: [router] },
		})
		expect(wrapper.html()).toContain('Beranda')
	})

	test('renders with icon', () => {
		const wrapper = mount(SidebarItem, {
			props: { icon: 'si-home', label: 'Beranda' },
			global: { plugins: [router] },
		})
		expect(wrapper.find('.si-home').exists()).toBe(true)
	})

	test('renders router-link when to prop is provided', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda', to: '/' },
			global: { plugins: [router] },
		})
		expect(wrapper.find('a').exists()).toBe(true)
	})

	test('renders button when to prop is not provided', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			global: { plugins: [router] },
		})
		expect(wrapper.find('button').exists()).toBe(true)
	})

	test('applies active variant when route matches', async () => {
		await router.push('/test')
		const wrapper = mount(SidebarItem, {
			props: { label: 'Test', to: '/test' },
			global: { plugins: [router] },
		})
		const link = wrapper.find('a')
		expect(link.classes()).toContain('bg-secondary-default')
	})

	test('applies default variant when route does not match', async () => {
		await router.push('/')
		const wrapper = mount(SidebarItem, {
			props: { label: 'Test', to: '/test' },
			global: { plugins: [router] },
		})
		const link = wrapper.find('a')
		expect(link.classes()).toContain('text-secondary')
	})

	test('applies active variant when hasActiveChild is true', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Parent', hasActiveChild: true },
			global: { plugins: [router] },
		})
		const button = wrapper.find('button')
		expect(button.classes()).toContain('bg-secondary-default')
	})

	test('toggles dropdown on button click', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
			global: { plugins: [router] },
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
			global: { plugins: [router] },
		})
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)
	})

	test('isOpen prop controls dropdown externally', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan', isOpen: true },
			slots: {
				default: '<div data-testid="child">Sub Menu</div>',
			},
			global: { plugins: [router] },
		})
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(true)

		await wrapper.setProps({ isOpen: false })
		expect(wrapper.find('[data-testid="child"]').exists()).toBe(false)
	})

	test('renders chevron icon for dropdown', () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			global: { plugins: [router] },
		})
		expect(wrapper.find('.si-chevron-down').exists()).toBe(true)
	})

	test('chevron rotates when dropdown is open', async () => {
		const wrapper = mount(SidebarItem, {
			props: { label: 'Persiapan' },
			global: { plugins: [router] },
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
			props: { label: 'Beranda', to: '/' },
			global: {
				plugins: [router],
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
			props: { label: 'Beranda', to: '/' },
			global: {
				plugins: [router],
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
			props: { label: 'Beranda', to: '/' },
			global: {
				plugins: [router],
				provide: {
					'sidebar-collapsed': collapsed,
					'sidebar-set-collapsed': setCollapsed,
				},
			},
		})
		const link = wrapper.find('a')
		expect(link.classes()).toContain('w-full')
		expect(link.classes()).toContain('h-12')
	})

	test('applies custom class', () => {
		const collapsed = ref(false)
		const setCollapsed = vi.fn()
		const wrapper = mount(SidebarItem, {
			props: { label: 'Beranda', to: '/', class: 'custom-class' },
			global: {
				plugins: [router],
				provide: {
					'sidebar-collapsed': collapsed,
					'sidebar-set-collapsed': setCollapsed,
				},
			},
		})
		const link = wrapper.find('a')
		expect(link.classes()).toContain('custom-class')
	})
})
