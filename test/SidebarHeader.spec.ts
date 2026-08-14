import { mount } from '@vue/test-utils'
import { test, expect, describe } from 'vitest'
import SidebarHeader from '../lib/components/sidebar/SidebarHeader.vue'

describe('SidebarHeader', () => {
	test('renders with title', () => {
		const wrapper = mount(SidebarHeader, {
			props: { title: 'SIMUTU' },
		})
		expect(wrapper.html()).toContain('SIMUTU')
	})

	test('renders with subtitle', () => {
		const wrapper = mount(SidebarHeader, {
			props: { title: 'SIMUTU', subtitle: 'Universitas' },
		})
		expect(wrapper.html()).toContain('Universitas')
	})

	test('renders first letter of title when no logo', () => {
		const wrapper = mount(SidebarHeader, {
			props: { title: 'SIMUTU' },
		})
		expect(wrapper.html()).toContain('S')
	})

	test('renders UN when no title and no logo', () => {
		const wrapper = mount(SidebarHeader)
		expect(wrapper.html()).toContain('UN')
	})

	test('renders logo image when provided', () => {
		const wrapper = mount(SidebarHeader, {
			props: { logo: '/logo.png', title: 'SIMUTU' },
		})
		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('/logo.png')
	})

	test('hides title and subtitle when collapsed', () => {
		const wrapper = mount(SidebarHeader, {
			props: { title: 'SIMUTU', subtitle: 'Universitas', collapsed: true },
		})
		expect(wrapper.html()).not.toContain('SIMUTU')
		expect(wrapper.html()).not.toContain('Universitas')
	})

	test('shows title and subtitle when expanded', () => {
		const wrapper = mount(SidebarHeader, {
			props: { title: 'SIMUTU', subtitle: 'Universitas', collapsed: false },
		})
		expect(wrapper.html()).toContain('SIMUTU')
		expect(wrapper.html()).toContain('Universitas')
	})

	test('emits toggle event when toggle button is clicked', async () => {
		const wrapper = mount(SidebarHeader, {
			props: { title: 'SIMUTU' },
		})
		const toggleButton = wrapper.find('button')
		await toggleButton.trigger('click')
		expect(wrapper.emitted('toggle')).toBeTruthy()
	})

	test('shows search input when expanded and showSearch is true', () => {
		const wrapper = mount(SidebarHeader, {
			props: { showSearch: true, collapsed: false },
		})
		expect(wrapper.find('input').exists()).toBe(true)
	})

	test('hides search input when collapsed', () => {
		const wrapper = mount(SidebarHeader, {
			props: { showSearch: true, collapsed: true },
		})
		expect(wrapper.find('input').exists()).toBe(false)
	})

	test('shows search icon button when collapsed and showSearch is true', () => {
		const wrapper = mount(SidebarHeader, {
			props: { showSearch: true, collapsed: true },
		})
		expect(wrapper.find('.si-search').exists()).toBe(true)
	})

	test('emits search event when input changes', async () => {
		const wrapper = mount(SidebarHeader, {
			props: { showSearch: true, collapsed: false },
		})
		const input = wrapper.find('input')
		await input.setValue('test query')
		expect(wrapper.emitted('search')).toBeTruthy()
		expect(wrapper.emitted('search')![0]).toEqual(['test query'])
	})

	test('uses custom search placeholder', () => {
		const wrapper = mount(SidebarHeader, {
			props: { showSearch: true, collapsed: false, searchPlaceholder: 'Search...' },
		})
		const input = wrapper.find('input')
		expect(input.attributes('placeholder')).toBe('Search...')
	})

	test('uses default search placeholder', () => {
		const wrapper = mount(SidebarHeader, {
			props: { showSearch: true, collapsed: false },
		})
		const input = wrapper.find('input')
		expect(input.attributes('placeholder')).toBe('Cari')
	})

	test('applies custom class', () => {
		const wrapper = mount(SidebarHeader, {
			props: { class: 'custom-class' },
		})
		expect(wrapper.classes()).toContain('custom-class')
	})

	test('has correct base classes', () => {
		const wrapper = mount(SidebarHeader)
		expect(wrapper.classes()).toContain('flex')
		expect(wrapper.classes()).toContain('flex-col')
		expect(wrapper.classes()).toContain('border-b')
		expect(wrapper.classes()).toContain('relative')
	})

	test('applies justify-center when collapsed', () => {
		const wrapper = mount(SidebarHeader, {
			props: { collapsed: true },
		})
		expect(wrapper.find('.justify-center').exists()).toBe(true)
	})

	test('renders chevron-left icon when expanded', () => {
		const wrapper = mount(SidebarHeader, {
			props: { collapsed: false },
		})
		expect(wrapper.find('.si-heroicon-solid-chevron-left').exists()).toBe(true)
	})

	test('renders chevron-right icon when collapsed', () => {
		const wrapper = mount(SidebarHeader, {
			props: { collapsed: true },
		})
		expect(wrapper.find('.si-heroicon-solid-chevron-right').exists()).toBe(true)
	})
})
